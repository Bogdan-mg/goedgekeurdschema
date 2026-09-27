/*
 * ─────────────────────────────────────────────────────────────
 *  INSTELLINGEN — pas hier je gegevens en prijzen aan.
 *  Alles op de website (prijskaarten, boekingsformulier, WhatsApp-knoppen)
 *  wordt automatisch uit dit bestand opgebouwd.
 * ─────────────────────────────────────────────────────────────
 */
window.SITE = {
  // WhatsApp-nummer in internationaal formaat, zonder +, spaties of 0 vooraan.
  // Voorbeeld: 0470 12 34 56  →  "32470123456"
  whatsapp: "32470000000",

  // Zichtbaar telefoonnummer en e-mail (mag leeg blijven: "")
  telefoon: "",
  email: "info@goedgekeurdschema.be",

  // Levertijd en werkgebied
  levertijdWerkdagen: 10,
  werkgebied: "heel België",

  // Pakketten: eendraadschema + situatieschema. Prijzen in euro, incl. btw en verplaatsing.
  // "populair: true" krijgt het label "Meest gekozen".
  pakketten: [
    { id: "app",   naam: "Appartement",        m2: 110, zekeringen: 12, prijs: 265 },
    { id: "won",   naam: "Woning / duplex",    m2: 110, zekeringen: 12, prijs: 310 },
    { id: "w250",  naam: "Woning tot 250\u00a0m²",  m2: 250, zekeringen: 25, prijs: 450 },
    { id: "w450",  naam: "Woning tot 450\u00a0m²",  m2: 450, zekeringen: 40, prijs: 680 },
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
