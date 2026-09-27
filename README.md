# goedgekeurdschema.be

Statische website (HTML/CSS/JS, geen build nodig) voor het opmaken van
eendraadschema's en situatieschema's, met boeken via WhatsApp.

## Aanpassen

Alle gegevens staan in **`js/config.js`**:

- `whatsapp` — je WhatsApp-nummer, bv. `32470123456` (zonder +, spaties of 0 vooraan)
- `telefoon`, `email`
- `pakketten` — naam, m², aantal zekeringen en prijs per pakket
- `inbegrepen` — wat in elk pakket zit

## Online zetten met GitHub Pages

1. Repository → *Settings* → *Pages* → *Deploy from a branch* → kies de branch, map `/ (root)`.
2. Het bestand `CNAME` bevat al `goedgekeurdschema.be`.
3. Bij je domeinregistrar:
   - `A`-records voor `goedgekeurdschema.be` naar `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME`-record `www` naar `<gebruikersnaam>.github.io`
4. Vink daarna *Enforce HTTPS* aan.

Lokaal bekijken: open `index.html` in je browser.
