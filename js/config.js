/*
 * ─────────────────────────────────────────────────────────────
 *  INSTELLINGEN — pas hier je gegevens en prijzen aan.
 *  Na een wijziging op GitHub bouwt de site zichzelf opnieuw op
 *  (zie .github/workflows/build.yml). Lokaal: python3 tools/build.py
 * ─────────────────────────────────────────────────────────────
 */
window.SITE = {
  naam: "Goedgekeurd Schema",

  // WhatsApp-nummer in internationaal formaat, zonder +, spaties of 0 vooraan.
  // Voorbeeld: 0470 12 34 56  →  "32470123456"
  whatsapp: "32470000000",

  // Zichtbaar telefoonnummer en e-mail (mag leeg blijven: "")
  telefoon: "",
  email: "info@goedgekeurdschema.be",

  // Wettelijk verplicht op een Belgische bedrijfswebsite:
  // officiële naam, adres en ondernemingsnummer (KBO / btw).
  bedrijfsnaam: "",            // bv. "Jan Peeters" of "Goedgekeurd Schema BV"
  ondernemingsnummer: "",      // bv. "BE 0123.456.789"
  adres: { straat: "", postcode: "", gemeente: "" },

  // Levertijd en werkgebied
  levertijdWerkdagen: 10,
  werkgebied: "heel België",

  // Pakketten: eendraadschema + situatieschema. Prijzen in euro, incl. btw en verplaatsing.
  pakketten: [
    { id: "app",   naam: "Appartement",            m2: 110, zekeringen: 12, prijs: 265 },
    { id: "won",   naam: "Woning / duplex",        m2: 110, zekeringen: 12, prijs: 310 },
    { id: "w250",  naam: "Woning tot 250 m²", m2: 250, zekeringen: 25, prijs: 450 },
    { id: "w450",  naam: "Woning tot 450 m²", m2: 450, zekeringen: 40, prijs: 680 },
  ],

  // Wat zit er in elk pakket?
  inbegrepen: [
    "Bezoek en opmeting ter plaatse",
    "Eendraadschema volgens het AREI",
    "Situatieschema van alle verdiepingen",
    "Legende met gebruikte symbolen",
    "Digitaal (PDF) in je mailbox",
    "Verplaatsing in heel België",
  ],

  // Groter of anders → op aanvraag
  opAanvraag: "Groter dan 450 m², meer dan 40 zekeringen, een handelszaak of een appartementsgebouw? Stuur ons een berichtje voor een prijs op maat.",
};
