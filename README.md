# oda-connector

A hosted MCP connector that lets Claude (web, desktop and mobile) search Oda, fill the
cart from order history and recipes, and read delivery slots. It runs as one Railway
service and is added to Claude as a custom connector. Built for a weekly family shop:
capture things during the week, pick dinners on Friday, cart fills itself, she checks
out in the Oda app.

It is a fork of [gbbirkisson/mcp-oda](https://github.com/gbbirkisson/mcp-oda), which
did the work of understanding Oda's private endpoints. This fork keeps that client
(`src/oda-client.ts`) and replaces the local CLI/stdio server with a hosted
streamable-HTTP server that logs in from environment variables.

**There is no checkout, slot booking or payment in this code, on purpose.** Claude
fills the cart; a person pays.

## What Claude can do

| Tool | What it does |
|---|---|
| `products_search` | Search the catalogue (Norwegian terms). Returns ids, prices, availability. |
| `cart_get_contents` | The cart as it stands. |
| `cart_add_many` | Add a whole list of `{product_id, quantity}` in one call. The main tool for a weekly fill. |
| `product_add_to_cart` / `cart_remove_item` / `cart_set_quantity` | One product at a time. |
| `cart_clear` | Empty the cart. Requires the literal confirmation `CLEAR CART`. |
| `cart_get_recommendations` | Oda's own "people also add" for the current cart. |
| `purchases_get_frequent` | Most-bought products across recent orders. Finds the staples. |
| `orders_get_recent` | Recent orders with line items. Shows what was bought together, i.e. the dinners. |
| `saved_lists_get_all` / `saved_lists_get_details` / `saved_list_add_to_cart` | Read saved Oda lists; add one to the cart with confirmation. |
| `recipes_search` / `recipes_get_details` / `recipe_add_to_cart` / `recipe_remove_from_cart` | Oda's recipes, with ingredients-to-cart for N portions. |
| `delivery_get_slots` | Upcoming slots and deadlines. Read-only. |
| `check_login` | Session status, for troubleshooting. |

Removed from upstream: saved-list editing, the CLI, the `dump` discovery command.

## Settings (Railway → service → Variables)

| Setting | Required | Meaning |
|---|---|---|
| `MCP_BASE_PATH` | yes | The secret part of the connector address, e.g. `/mcp-<32 hex chars>`. Letters, digits, `-`, `_`; at least 24 characters. Too short and the endpoint refuses to serve. |
| `ODA_EMAIL` | yes | The Oda account's email. |
| `ODA_PASSWORD` | yes | The Oda account's password. Lives only here. |
| `DATA_DIR` | no | Where session cookies are kept. Default `./data` (ephemeral; the service logs in again after a redeploy). |

## Sign-in

Same secret-link method as the other Railway connectors: the service only answers at
`https://<railway-domain><MCP_BASE_PATH>`. Every other address returns "Not Found".
No OAuth. Treat the full address like a password. To rotate it, set a new
`MCP_BASE_PATH` and re-add the connector in Claude.

Oda login happens at boot and again automatically whenever Oda rejects the session.
`GET /healthz` (public) shows `oda_login: ok` once it has worked, and the last error
if not. Nothing on that page identifies the account or the path.

## Deploying

Railway, from this repo (Railpack detects Node 22, `npm ci`, `npm run build`, then
`node dist/index.js`; `railway.json` sets the health check). Set the three variables,
generate a domain, check `/healthz`. In Claude: Settings → Connectors → add custom
connector with the full address.

## For the household

`docs/` (Norwegian):

- `OPPSETT-HENRIK.md` – one-time setup checklist
- `PROSJEKT-INSTRUKSJONER.md` – the Claude Project instructions
- `OPPSTART.md` – the first-run prompt that builds the staples and dinner lists from order history
- `SLIK-BRUKER-DU-DET.md` – how to use it, for the person doing the shopping

## Development

```
npm ci
npm run build
npm test        # offline tests of the Oda page/API parsing
npm run lint
```

To run locally: `MCP_BASE_PATH=/mcp-<long random> ODA_EMAIL=… ODA_PASSWORD=… PORT=8080 node dist/index.js`

## Keeping up with Oda

Oda changes its site now and then. When search or cart calls start failing with
"page structure may have changed", pull the latest `src/oda-client.ts` from upstream
(`git fetch upstream` / compare on GitHub) and redeploy. Everything else in this fork is
independent of upstream.

`UPSTREAM-CHANGELOG.md` is the upstream project's history up to the fork point.
