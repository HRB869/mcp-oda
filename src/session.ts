/**
 * One Oda session for the whole service.
 *
 * The hosted server has no interactive login, so the Oda account comes from
 * the environment (ODA_EMAIL / ODA_PASSWORD, set in Railway). Cookies are kept
 * in memory and on the ephemeral disk; when Oda rejects a call as
 * unauthenticated the session logs in again once and retries the call.
 */

import fs from "fs";
import path from "path";
import { OdaClient } from "./oda-client.js";

export interface SessionStatus {
  logged_in: boolean;
  user: string | null;
  last_login_at: string | null;
  last_error: string | null;
}

export class OdaSession {
  readonly client: OdaClient;
  private status: SessionStatus = {
    logged_in: false,
    user: null,
    last_login_at: null,
    last_error: null,
  };
  private loginInFlight: Promise<boolean> | null = null;

  constructor(
    private readonly email: string,
    private readonly password: string,
    dataDir: string,
  ) {
    fs.mkdirSync(dataDir, { recursive: true });
    this.client = new OdaClient(path.join(dataDir, "cookies.json"));
  }

  getStatus(): SessionStatus {
    return { ...this.status };
  }

  /** Log in if needed. Returns true when the session is usable afterwards. */
  async ensureLoggedIn(force = false): Promise<boolean> {
    if (!force) {
      try {
        const user = await this.client.checkUser();
        if (user) {
          this.status = { ...this.status, logged_in: true, user, last_error: null };
          return true;
        }
      } catch (e) {
        this.status.last_error = e instanceof Error ? e.message : String(e);
      }
    }
    return this.login();
  }

  private login(): Promise<boolean> {
    // Several tool calls can hit an expired session at once; share one login.
    if (!this.loginInFlight) {
      this.loginInFlight = (async () => {
        try {
          const ok = await this.client.login(this.email, this.password);
          if (!ok) {
            this.status = {
              ...this.status,
              logged_in: false,
              user: null,
              last_error: "Oda rejected the email/password",
            };
            return false;
          }
          const user = await this.client.checkUser().catch(() => null);
          this.status = {
            logged_in: true,
            user,
            last_login_at: new Date().toISOString(),
            last_error: null,
          };
          console.error(`oda: logged in${user ? ` as ${user}` : ""}`);
          return true;
        } catch (e) {
          this.status = {
            ...this.status,
            logged_in: false,
            last_error: e instanceof Error ? e.message : String(e),
          };
          return false;
        } finally {
          this.loginInFlight = null;
        }
      })();
    }
    return this.loginInFlight;
  }

  /**
   * Run one client call; on an auth failure, log in again and retry once.
   * Anything else is thrown through unchanged.
   */
  async withAuth<T>(fn: (client: OdaClient) => Promise<T>): Promise<T> {
    try {
      return await fn(this.client);
    } catch (e) {
      if (!isAuthError(e)) throw e;
      console.error("oda: session rejected, logging in again");
      const ok = await this.login();
      if (!ok) {
        throw new Error(
          `Oda login failed: ${this.status.last_error ?? "unknown reason"}. Check ODA_EMAIL / ODA_PASSWORD in Railway.`,
        );
      }
      return fn(this.client);
    }
  }
}

function isAuthError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /HTTP (401|403)/.test(msg);
}
