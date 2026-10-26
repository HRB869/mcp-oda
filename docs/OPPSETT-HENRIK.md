# Oppsett (Henrik)

Alt som må gjøres én gang. Rekkefølgen er bevisst: koblingen må virke før prosjektet gir mening.

## 1. Railway (gjort av Claude i chatten)

Tjenesten `oda-connector` i Railway, bygget fra denne forken (`HRB869/mcp-oda`). Variabler:

| Variabel | Hva |
|---|---|
| `MCP_BASE_PATH` | Hemmelig sti, `/mcp-<32 hex>`. Satt av Claude. Hele adressen er passordet. |
| `ODA_EMAIL` | Hennes Oda-e-post. **Du limer inn.** |
| `ODA_PASSWORD` | Hennes Oda-passord. **Du limer inn.** |

Sjekk: `https://<domene>/healthz` skal svare `{"ok": true, "oda_login": "ok", ...}`.

## 2. Hennes Claude-konto

- Hun trenger Claude Pro (mobilappen må kunne bruke prosjekter og koblinger).
- **Settings → Connectors → Add custom connector**: navn `Oda`, adresse `https://<domene><MCP_BASE_PATH>`. Ingen OAuth.
- Lag prosjektet **«Ukeshandling»**. Lim inn `ukeshandling/INSTRUKSJONER.md` under Instructions. Last opp `grunnpakke.md`, `middager.md` og `huskeliste.md` som prosjektfiler.
- Slå på Oda-koblingen i prosjektet (koblinger må slås på per samtale første gang; sjekk at den husker det).

## 3. Første samtale

Ny samtale i «Ukeshandling»: «ukeshandel». Gå gjennom en handel sammen med henne før hun gjør det alene. Gi henne `SLIK-FUNGERER-DET.md`.

## Vedlikehold

- Oda-passord endret → oppdater `ODA_PASSWORD` i Railway. Tjenesten starter på nytt selv.
- Oda endrer API-et → oppdater forken fra `kolonialno/oda-mcp` (Sync fork på GitHub), Railway bygger på nytt.
- Nytt repertoar → rediger `middager.md` i prosjektet.
