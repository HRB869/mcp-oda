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
- Lag prosjektet **«Handling»**. Lim inn `PROSJEKT-INSTRUKSJONER.md` under Instructions.
- Slå på Oda-koblingen i prosjektet (koblinger må slås på per samtale første gang; sjekk at den husker det).
- Gi Claude-appen tilgang til Påminnelser når den spør.

## 3. Påminnelser

På hennes iPhone: lag lista **«Handleliste»** i Påminnelser og del den med de i familien som skal kunne legge til. Siri-frasen «legg til X på handlelista» treffer den.

## 4. Første samtale

Ny samtale i «Handling», lim inn `OPPSTART.md`. Resultatet er to filer; last dem opp i prosjektet som `faste-varer.md` og `middager.md`. Så er det klart.

## Vedlikehold

- Oda-passord endret → oppdater `ODA_PASSWORD` i Railway. Tjenesten starter på nytt selv.
- Oda endrer API-et → oppdater forken fra `kolonialno/oda-mcp` (Sync fork på GitHub), Railway bygger på nytt.
- Nytt repertoar → rediger `middager.md` i prosjektet.
