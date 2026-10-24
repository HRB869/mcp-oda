# Oppstart: første samtale i prosjektet

Kjøres én gang, av Henrik eller henne, i en ny samtale i «Handling»-prosjektet med Oda-koblingen slått på. Lim inn hele meldingen under. Resultatet er to lister som limes inn som prosjektfiler: `faste-varer.md` og `middager.md`.

---

Dette er første gang. Før vi handler noe, skal du bygge de to listene prosjektet trenger, ut fra det familien faktisk har kjøpt.

Hent bestillingshistorikken fra Oda: `purchases_get_frequent` (limit 50, max_orders 30) for hyppighet, og `orders_get_recent` (max_orders 20) for å se hva som ble kjøpt sammen. Lag så:

**1. `faste-varer.md`** – varer som er med i minst to av tre bestillinger. For hver: produktnavnet slik det heter på Oda, typisk antall per uke, og produkt-ID. Grupper etter kategori (meieri, frukt og grønt, brød, pålegg, tørrvarer, husholdning). Vær streng: dette er det som skal i kurven hver uke uten at noen spør.

**2. `middager.md`** – familiens middagsrepertoar. Se etter ingredienser som opptrer sammen i samme bestilling (taco-sett, kjøttdeig og pastasaus, laks og poteter) og sett navn på middagene. Sikt på 15–25 middager. For hver: navn, hovedråvare, ingredienser med mengder for fem, og Oda-produkt-ID der du er sikker. Merk de du er usikker på med «?» så hun kan rette.

Presenter begge listene kort i chatten først (bare navnene), og spør hva som skal ut eller inn. Når hun har svart, gi de to filene ferdig formatert i hver sin kodeblokk, klare til å limes inn i prosjektet.
