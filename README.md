# Jakub Šperka Photography

Jednoduchý statický web pre prezentáciu futbalových fotogalérií uložených v Ente.

## Funkcie

- zoznam fotografovaných zápasov,
- kombinované filtrovanie podľa **sezóny, tímu a súťaže/ligy**,
- detail zápasu,
- Ente galéria cez `iframe`,
- stránka **O mne**,
- kontaktné údaje a odkazy na sociálne siete,
- zoznam používanej fototechniky,
- samostatné obrazové polia pre fotografie techniky,
- responzívny tmavý dizajn,
- pomocný Python skript na pridávanie zápasov.

## Lokálne spustenie

Pretože JavaScript načítava `data/matches.json` cez `fetch()`, stránku neotváraj iba dvojklikom na `index.html`.

V koreňovom adresári projektu spusti:

```bash
python -m http.server 8000
```

Potom otvor:

```text
http://localhost:8000
```

## Pridanie zápasu

Spusti:

```bash
python add_match.py
```

alebo uprav ručne:

```text
data/matches.json
```

Tímový filter sa vytvára automaticky zo všetkých hodnôt `home` a `away`.
Filter súťaže sa vytvára z poľa `competition`.

## Cover fotografie zápasov

Cover obrázky ukladaj do:

```text
images/covers/
```

Odporúčanie:

- JPEG alebo WebP,
- šírka približne 1400–1800 px,
- pomer strán približne 16:9,
- rozumná kompresia kvôli rýchlemu načítaniu webu.

## Fotografie techniky

Pripravené cesty:

```text
images/gear/sony-a6300.jpg
images/gear/sony-70-200-gm2.jpg
images/gear/sony-135-gm.jpg
images/gear/sony-50-f18.jpg
images/gear/sony-18-200.jpg
images/gear/tripod.jpg
```

Ak obrázok chýba, stránka automaticky zobrazí placeholder.

Profilová fotografia:

```text
images/profile/jakub-sperka.jpg
```

## Kontakty a sociálne siete

V súbore:

```text
about.html
```

nahraď:

```text
DOPLŇ_E-MAIL
DOPLŇ_TELEFÓN
```

a placeholder odkazy `href="#"` za reálne URL sociálnych sietí.

Pri e-maile môžeš použiť napríklad:

```html
<a href="mailto:meno@domena.sk">meno@domena.sk</a>
```

Pri telefóne:

```html
<a href="tel:+421900000000">+421 900 000 000</a>
```

## GitHub Pages

Projekt je čistý statický web a nevyžaduje build proces.


## Hero fotografia cez celú šírku

Aktuálna verzia používa **jednu dominantnú futbalovú fotografiu** ako full-width hero banner na úvodnej stránke:

```text
images/site/hero-football.jpg
```

Tento obrázok je použitý v CSS v triede `.hero-banner-image`.
Ak ho chceš neskôr vymeniť, stačí prepísať súbor rovnakým názvom alebo upraviť cestu v `css/style.css`.


## Profil a kontakty

Profilová fotografia:

```text
images/profile/jakub-sperka.jpg
```

Aktuálne kontakty a Instagram sú zapracované priamo v `about.html`.
Facebook a ďalšie sociálne siete sa v tejto verzii nezobrazujú.

Na stránke O mne je tiež sekcia s informáciou o voľnom použití fotografií
a možnosti kontaktovať autora ohľadom fotografovania zápasu.


## Priamy odkaz na Ente album

Na detaile každého zápasu sa automaticky zobrazuje tlačidlo:

```text
Otvoriť album v Ente ↗
```

Nie je potrebné pridávať ďalšiu URL do `matches.json`.
JavaScript automaticky prevedie:

```text
https://embed.ente.com/?t=...#...
```

na:

```text
https://albums.ente.com/?t=...#...
```

Ak bude niektorý album používať inú verejnú URL, možno k zápasu voliteľne pridať:

```json
"ente_public": "https://..."
```

Táto hodnota má prednosť pred automaticky vytvoreným odkazom.
