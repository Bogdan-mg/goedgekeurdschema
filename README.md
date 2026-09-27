# goedgekeurdschema.be

Statische website voor het opmaken van eendraadschema's en situatieschema's,
met boeken via WhatsApp.

## Pagina's

| Bestand | Doel / zoektermen |
|---|---|
| `index.html` | Homepage: prijzen, werkwijze, boeken |
| `eendraadschema.html` | "eendraadschema laten opmaken", prijs, uitleg |
| `situatieschema.html` | "situatieschema laten tekenen", verschil met eendraadschema |
| `keuring-afgekeurd.html` | "elektrische keuring afgekeurd", termijnen, herkeuring |
| `keuring-verkoop-woning.html` | "elektrische keuring bij verkoop" |
| `privacy.html` | Privacybeleid (AVG/GDPR) |
| `404.html` | Pagina niet gevonden |

## Aanpassen

**Gegevens en prijzen** staan in `js/config.js`: WhatsApp-nummer, telefoon, e-mail,
bedrijfsnaam, adres, ondernemingsnummer, pakketten en prijzen.

**Teksten** staan in `src/pages/*.html`; de gedeelde kop en voettekst in `src/layout.html`.

De `.html`-bestanden in de hoofdmap worden daaruit **gebouwd**. Pas die niet rechtstreeks aan.

- Op GitHub gebeurt dat automatisch: pas je `js/config.js` of iets in `src/` aan,
  dan bouwt de workflow *Website bouwen* (`.github/workflows/build.yml`) de site opnieuw.
- Lokaal: `python3 tools/build.py` (vereist Python 3 en Node).

## Online zetten (GitHub Pages)

1. *Settings* → *Pages* → *Deploy from a branch* → kies de branch, map `/ (root)`.
2. `CNAME` bevat al `goedgekeurdschema.be`.
3. DNS bij je domeinregistrar:
   - 4 `A`-records voor `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME`-record `www` → `<gebruikersnaam>.github.io`
4. Vink *Enforce HTTPS* aan zodra het domein werkt.

## Gevonden worden op Google

Op de site zelf is alles voorzien: titels en beschrijvingen per pagina,
gestructureerde gegevens (schema.org: bedrijf, diensten, prijzen, FAQ, kruimelpad),
`sitemap.xml`, `robots.txt`, deelafbeelding (`img/og.png`), snelle laadtijd zonder
externe scripts of cookies.

Wat je zelf nog moet doen (dit heeft de grootste impact):

1. **Google Search Console** — <https://search.google.com/search-console>
   - Voeg een *domeineigendom* toe voor `goedgekeurdschema.be` en bevestig via het TXT-record bij je registrar.
   - Menu *Sitemaps* → dien `sitemap.xml` in.
2. **Google Bedrijfsprofiel** — <https://business.google.com>
   - Maak een profiel aan als *servicegebied-bedrijf* (je adres hoeft niet zichtbaar te zijn),
     met als servicegebied Antwerpen en de omliggende gemeenten.
   - Categorie bv. "Elektricien" of "Adviesbureau elektrotechniek", werkgebied, openingsuren,
     link naar de website en je WhatsApp-nummer.
   - Vraag elke tevreden klant om een **Google-review**. Reviews zijn de belangrijkste factor om
     lokaal bovenaan te staan.
3. **Bing Webmaster Tools** — <https://www.bing.com/webmasters> (kan je Search Console-gegevens importeren).
4. **Vermeldingen**: zet je bedrijf met dezelfde naam, website en telefoon op o.a. Gouden Gids,
   Facebook en eventueel platformen voor vakmannen. Vraag makelaars en notarissen met wie je werkt
   om naar je site te linken.
5. **Wettelijke info**: vul `bedrijfsnaam`, `adres` en `ondernemingsnummer` in `js/config.js` in —
   dat is verplicht op een Belgische bedrijfswebsite en versterkt ook het vertrouwen bij Google.
