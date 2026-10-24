#!/usr/bin/env node
/**
 * Hosted entry point (Railway).
 *
 * Sign-in to this service is the secret link: the MCP endpoint lives only at
 * MCP_BASE_PATH (e.g. /mcp-<32 hex>), the same method as the other Railway
 * connectors. Every other path answers 404; /healthz is public and shows
 * status only. No OAuth. Treat the full address like a password.
 *
 * Environment:
 *   MCP_BASE_PATH  secret path, at least 24 random characters after the slash
 *   ODA_EMAIL      the Oda account's email
 *   ODA_PASSWORD   the Oda account's password
 *   PORT           set by Railway
 *   DATA_DIR       optional, where session cookies are kept (default ./data)
 */

import http from "node:http";
import path from "node:path";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createRequire } from "node:module";
import { OdaSession } from "./session.js";
import { createMcpServer } from "./server.js";

const { version } = createRequire(import.meta.url)("../package.json");

function problemWithConfig(): string | null {
  const p = process.env.MCP_BASE_PATH ?? "";
  if (!p.startsWith("/")) return "MCP_BASE_PATH must start with /";
  if (p.length < 25) return "MCP_BASE_PATH too short (need 24+ characters after the slash)";
  if (!/^\/[A-Za-z0-9_-]+$/.test(p)) return "MCP_BASE_PATH may only contain letters, digits, - and _";
  if (!process.env.ODA_EMAIL) return "ODA_EMAIL is not set";
  if (!process.env.ODA_PASSWORD) return "ODA_PASSWORD is not set";
  return null;
}

const problem = problemWithConfig();
const basePath = process.env.MCP_BASE_PATH ?? "";
const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");

const session = problem
  ? null
  : new OdaSession(process.env.ODA_EMAIL!, process.env.ODA_PASSWORD!, dataDir);

if (problem) {
  console.error(`MCP endpoint closed: ${problem}`);
} else {
  // Warm the session at boot so the first tool call is fast and /healthz is
  // honest. A failure here is not fatal: tool calls retry the login.
  session!.ensureLoggedIn().then((ok) => {
    if (!ok) console.error(`oda: initial login failed: ${session!.getStatus().last_error}`);
  });
}

function sendJson(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const httpServer = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");

  if (url.pathname === "/healthz") {
    // Public: status and counts only, never the path or the account.
    const s = session?.getStatus();
    sendJson(res, 200, {
      ok: !problem,
      version,
      mcp_endpoint: problem ? `closed: ${problem}` : "open",
      oda_login: !session ? "n/a" : s!.logged_in ? "ok" : "not logged in",
      oda_last_error: s?.last_error ?? null,
    });
    return;
  }

  if (problem || url.pathname !== basePath) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }

  // Stateless: a fresh server + transport per request. Tool registration is
  // cheap and the Oda session underneath is shared.
  const mcp = createMcpServer(session!);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => {
    void transport.close();
    void mcp.close();
  });
  try {
    await mcp.connect(transport);
    await transport.handleRequest(req, res);
  } catch (e) {
    console.error("request failed:", e instanceof Error ? e.message : e);
    if (!res.headersSent) sendJson(res, 500, { error: "internal error" });
  }
});

const port = Number(process.env.PORT ?? 8080);
httpServer.listen(port, "0.0.0.0", () => {
  console.error(`oda connector v${version} listening on ${port}${problem ? " (endpoint closed)" : ""}`);
});
