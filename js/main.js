(function () {
  "use strict";
  var S = window.SITE;
  var euro = function (n) { return "€ " + n.toLocaleString("nl-BE"); };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function waLink(text) {
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text);
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  // Algemene gegevens
  $$("[data-levertijd]").forEach(function (el) { el.textContent = S.levertijdWerkdagen; });
  $$("[data-werkgebied]").forEach(function (el) { el.textContent = S.werkgebied; });
  $("#year").textContent = new Date().getFullYear();
  if (S.telefoon) $("#footTel").innerHTML = '<a href="tel:' + S.telefoon.replace(/\s/g, "") + '">' + esc(S.telefoon) + "</a>";
  if (S.email) $("#footMail").innerHTML = '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a>";
  $("#opAanvraag").textContent = S.opAanvraag;

  // Alle WhatsApp-knoppen met een vaste tekst
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"));
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Prijskaarten
  var cards = $("#cards");
  cards.innerHTML = S.pakketten.map(function (p) {
    return '<article class="card' + (p.populair ? " pop" : "") + '">' +
      (p.populair ? '<span class="badge">Meest gekozen</span>' : "") +
      '<span class="card-ico" aria-hidden="true"><svg class="ico"><use href="#i-home"/></svg></span>' +
      "<h3>" + esc(p.naam) + "</h3>" +
      '<p class="card-sub">Tot <b>' + p.m2 + ' m²</b><br>Tot <b>' + p.zekeringen + " zekeringen</b></p>" +
      '<div class="price"><b><sup>€</sup>' + p.prijs.toLocaleString("nl-BE") + '</b><small>Inclusief btw en verplaatsing</small></div>' +
      '<details class="incl"><summary>Wat zit er allemaal in? <span aria-hidden="true">↓</span></summary><ul class="checks">' +
        S.inbegrepen.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></details>" +
      '<a class="btn btn-teal" href="#boeken" data-pick="' + p.id + '">Maak afspraak <span aria-hidden="true">↗</span></a>' +
      "</article>";
  }).join("");
  cards.addEventListener("click", function (e) {
    var a = e.target.closest("[data-pick]");
    if (!a) return;
    var r = $('#pkgChoices input[value="' + a.dataset.pick + '"]');
    if (r) { r.checked = true; updateTotal(); }
  });

  // Boekingsformulier
  var form = $("#bookForm");
  var keuzes = S.pakketten.map(function (p) {
    return { id: p.id, naam: p.naam, sub: "tot " + p.m2 + " m² · tot " + p.zekeringen + " zekeringen", pkg: p };
  }).concat([
    { id: "groter", naam: "Groter / anders", sub: "prijs op maat" },
    { id: "twijfel", naam: "Ik twijfel", sub: "ik stuur een foto van mijn verdeelkast" },
  ]);
  var standaard = (S.pakketten.filter(function (p) { return p.populair; })[0] || S.pakketten[0]).id;
  $("#pkgChoices").innerHTML = keuzes.map(function (k) {
    return '<label class="chip big"><input type="radio" name="pakket" value="' + k.id + '"' + (k.id === standaard ? " checked" : "") + ">" +
      "<span><b>" + esc(k.naam) + (k.pkg ? " <em>" + euro(k.pkg.prijs) + "</em>" : "") + "</b><small>" + esc(k.sub) + "</small></span></label>";
  }).join("");

  function state() {
    var fd = new FormData(form);
    var k = keuzes.filter(function (x) { return x.id === fd.get("pakket"); })[0];
    return { fd: fd, keuze: k, total: k && k.pkg ? k.pkg.prijs : null };
  }
  function updateTotal() {
    var st = state();
    $("#totalPrice").textContent = st.total === null ? "Op maat" : euro(st.total);
    $("#totalNote").textContent = st.total === null
      ? (st.keuze && st.keuze.id === "twijfel" ? "we bepalen het samen via een foto" : "prijs op aanvraag")
      : "incl. btw & verplaatsing";
  }
  form.addEventListener("change", updateTotal);
  updateTotal();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var st = state(), fd = st.fd;
    var naam = (fd.get("naam") || "").trim(), gem = (fd.get("gemeente") || "").trim();
    var err = $("#formErr");
    if (!naam || !gem) {
      err.textContent = "Vul je naam en gemeente in, dan kunnen we je meteen verder helpen.";
      (naam ? form.gemeente : form.naam).focus();
      return;
    }
    err.textContent = "";
    var lines = [
      "Hallo! Ik wil graag een afspraak boeken via goedgekeurdschema.be.",
      "",
      "👤 Naam: " + naam,
      "📍 Gemeente: " + gem,
      "🏠 Type: " + (st.keuze ? st.keuze.naam + " (" + st.keuze.sub + ")" : "-"),
    ];
    lines.push("🎯 Waarvoor: " + fd.get("reden"));
    lines.push("🗓️ Voorkeur: " + fd.get("moment"));
    var opm = (fd.get("opmerking") || "").trim();
    if (opm) lines.push("💬 Opmerking: " + opm);
    lines.push("", st.total === null ? "Graag een prijs op maat." : "💶 Prijs volgens de website: " + euro(st.total) + " (incl. btw)");
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  });

  // Mobiel: FAB verbergen boven de hero-knoppen
  var fab = $(".fab"), hero = $(".hero-cta");
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (en) { fab.classList.toggle("hide", en[0].isIntersecting); }).observe(hero);
  }
})();
