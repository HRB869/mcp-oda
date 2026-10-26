# Middager

Familie på fem: to voksne, barn på 5, 3 og 1. Alle mengder er for **5 porsjoner** (de voksne spiser for én, barna til sammen for to-tre; 4-porsjonspakker holder ofte, med rester til lunsj om det er 5).

To deler: **A** er det de allerede lager (fra bestillingene), **B** er nye forslag fra Odas oppskrifter. Begge brukes til lørdagsforslagene.

Format for produktlinjer: `produkt-ID | vare | antall`. Der det står `oppskrift NNNN` kan hele retten legges i kurven med `recipe_add_to_cart(id, portions=5)`; fjern etterpå linjer de har fra før (salt, pepper, olje, soyasaus osv.) med `cart_set_quantity(id, 0)`.

---

## A. Det de lager i dag (fra 30 bestillinger)

### Kjøttdeig

**1. Taco** — ca. hver 3. uke. Enkel, alle spiser.
```
67937 | Grilstad Kjøttdeig storfe 600 g         | 1
31293 | Santa Maria Taco Spice Mix              | 1
37882 | Santa Maria Tortilla Original Medium    | 1
40708 | Apetina Cheddar og mozzarella revet     | 1
68220 | Cherrytomater 250 g                      | 1
23548 | Avokado stor                             | 1
25383 | Q Crème Fraîche 300 g                    | 1
```
(Agurk og paprika kommer fra grunnpakka.)

**2. Pasta bolognese**
```
67937 | Grilstad Kjøttdeig storfe 600 g         | 1
9860  | Mutti Knuste tomater 400 g              | 2
37094 | Mutti Tomatpuré                          | 1
9368  | Stangselleri                             | 1
63604 | Parmigiano Reggiano sticks               | 1
38365 | Barilla Fusilli 500 g                    | 1
```
(Løk og gulrot fra grunnpakka.) Oda-alternativ: oppskrift 2894 «Enkel bolognese».

**3. Kjøttkaker i brun saus** — fast innslag. Oftest ferdige Gilde-kaker.
```
3655  | Gilde Kjøttkaker 16 stk 800 g           | 1
759   | Toro Brun saus uten løk                 | 1
51401 | Knoll Langpanne poteter 1 kg            | 1
```
(Brokkoli/gulrot fra grunnpakka.)

**4. Kjøttboller med pasta og hvitløksbrød**
```
64919 | Gilde Kjøttboller italiensk/parmesan    | 2
14545 | Barilla Pastasaus basilikum             | 1
38365 | Barilla Fusilli 500 g                    | 1
57841 | Bread of the World Hvitløksbrød         | 1
```
Oda-alternativ: oppskrift 2283 «Alt-i-ett pasta med kjøttboller».

**5. Pasta med karbonadedeig og rød saus** (enklere bolognese)
```
63589 | Karbonadedeig storfe 5 % 400 g          | 1
14545 | Barilla Pastasaus basilikum             | 1
38365 | Barilla Fusilli 500 g                    | 1
```

### Kylling

**6. Thai gul curry / wok**
```
69581 | Eng Fugl Kyllingfilet 600 g              | 1
29334 | Blue Dragon Yellow Curry Paste          | 1
8578  | Kokosmelk 400 ml                         | 2
27707 | Wokmiks 300 g                            | 1
27019 | Lime 2 stk                               | 1
15163 | Fersk koriander                          | 1
9272  | Ingefær                                   | 1
```
Pluss ris eller risnudler (23376 Santa Maria Rice Noodles).

**7. Tikka masala**
```
69581 | Eng Fugl Kyllingfilet 600 g              | 1
32923 | Masalamagic Tikka Masala saus            | 1
```
Pluss ris og naan/pita (28496 Hatting Grove pitabrød).

**8. Satay-wok** (Blue Dragon Satay Wok 40751 + kyllingfilet + wokmiks + nudler)

**9. Kylling korma, ferdig** (Gilde Bra Mat til Familien 67377 + ris) — nødløsning.

### Fisk

**10. Laks med poteter og brokkoli** — hver 2.–3. uke
```
27246 | Norsk Sjømat Laksefilet uten skinn 500 g | 1
51400 | Knoll Småpoteter 650 g                   | 1
```
(Brokkoli, sitron fra grunnpakka. Varianter kjøpt: 29145, 29144, 69529, 24685.)

**11. Fiskekaker**
```
64288 | Lofoten Hjertefiskekaker 550 g          | 1
27780 | Gulrot i bunt                            | 1
```
Pluss poteter. Variant: 30930 Lofoten Hjemmelagde.

**12. Fiskepinner** (barna) — 4132 Prima 30 stk eller 8906 Findus MSC. Pluss poteter/pommes (8284) og erter.

**13. Lakseburger**
```
66793 | Gode Hav Rå lakseburger 260 g           | 2
32111 | Døgnvill Burgerbrød                      | 1
32103 | Døgnvill Chipotle Mayo                   | 1
65091 | Coleslaw 190 g                           | 1
```

**14. Torsk ryggfilet med søtpotet** (16185 Findus Gourmet ryggfileter + søtpotet fra grunnpakka)

### Pizza og pølse

**15. Hjemmelaget pizza** — jevnlig
```
63698 | Villa Paradiso pizzabunner 2 stk        | 1
68924 | R Pizzasaus tomat/basilikum             | 1
68711 | Peppes Pizza Kjøttboller topping        | 1
161   | Tine Revet ost 300 g                    | 1
```
Varianter kjøpt: pinsa-bunner (63717, 65437), pepperoni-topping (28071). Frossen reserve: Dr. Oetker Ristorante 2pk (4300) eller Grandiosa.

**16. Pølsemiddag** — grillpølse (67632) eller kjøttpølse skinnfri (3667) eller wiener (67174) + pølsebrød (67037/8342) eller potetmos.

### Uklart, spør henne
- Kyllingkraft + sellerirot + persille i 6 av 8 uker: suppe? saus? (Mulig: kremet grønnsaksuppe, eller fond til bolognese.)
- Kikerter (8466) ×3 og falafel (27832): en vegetarrett de lager?
- Hvetemel + bakepulver jevnlig: baker de pannekaker/vafler til middag?

---

## B. 15 nye forslag (Oda-oppskrifter, barnevennlige, under 30 min)

Valgt for å ligne det de allerede liker: samme råvarer, nye retter. Oppskrift-ID gir «legg alt i kurven».

**Kjøttdeig / kjøttboller**
1. **Rask form med kjøttboller og potetmos** — oppskrift 4041, 20 min. Potetmos, Gilde kjøttboller (samme som de kjøper), tomatsaus, ost i ovnen.
2. **Tacoform** — oppskrift 2371, 20 min. Taco i ildfast form, mindre søl enn vanlig taco.
3. **Enchiladas med kjøttdeig** — oppskrift 2428, 25 min.
4. **Kremet kjøttdeigpasta** — oppskrift 5033, 25 min.
5. **Rask tomatsuppe med italienske kjøttboller** — oppskrift 3614, 15 min. Bruker kjøttbollene de kjøper og tomatene de har.
6. **Tacosuppe** — oppskrift 2584, 10 min.

**Kylling**
7. **Superenkel kylling, brokkoli og ris** — oppskrift 2026, 20 min. Oda merker den barnevennlig; bruker Eng Fugl-fileten (69581) og brokkoli fra grunnpakka.
8. **Sesamkylling med ris og brokkolini** — oppskrift 3010, 20 min.
9. **Kylling med bretagnesaus og ris** — oppskrift 2683, 25 min.
10. **Wok med kylling, nudler og grønnsaker** — oppskrift 2574, 20 min.
11. **Kremet grønnsaksgryte med kylling og bacon** — oppskrift 5049, 25 min. (Kan være svaret på kyllingkraft-mysteriet.)

**Fisk**
12. **Kremet pasta med torsk og erter** — oppskrift 2295, 20 min.
13. **Laks med kremet sitronpasta** — oppskrift 5036, 20 min.
14. **Gnocchiform med laks og brokkoli** — oppskrift 2789, 25 min.
15. **Fiskekaker og pasta** — oppskrift 2442, 15 min. Ny vri på en de alt lager.

**Reserve (hvis noen av de over ryker)**
- Pølsegryte med fullkornsmakaroni — oppskrift 3633, 10 min
- Pølsewrap — oppskrift 2670, 15 min
- Pitapizza med salami og mozzarella — oppskrift 2338, 20 min
- Alt-i-ett form med laks — oppskrift 2489, 40 min
- Svenske kjøttboller i fløtesaus — oppskrift 2498, 20 min

---

## Logg

Claude fører en kort logg over valgte middager nederst her (i minnet inntil fila oppdateres):

```
uke 43 (25. okt): —
```
