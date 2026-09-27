(function () {
  "use strict";
  var S = window.SITE;
  var euro = function (n) { return "€ " + n.toLocaleString("nl-BE"); };
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function waLink(text) {
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text);
  }

  // Alle WhatsApp-knoppen met een vaste tekst
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"));
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Menu op gsm
  var menuBtn = $(".menu-btn"), topbar = $(".topbar");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = topbar.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
    });
    $$("#nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        topbar.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Boekingsformulier (enkel op de homepage)
  var form = $("#bookForm");
  if (form) {
    var keuzes = S.pakketten.map(function (p) {
      return { id: p.id, naam: p.naam, sub: "tot " + p.m2 + " m² · tot " + p.zekeringen + " zekeringen", prijs: p.prijs };
    }).concat([
      { id: "groter", naam: "Groter / anders", sub: "prijs op maat" },
      { id: "twijfel", naam: "Ik twijfel", sub: "ik stuur een foto van mijn verdeelkast" },
    ]);

    var state = function () {
      var fd = new FormData(form);
      var k = keuzes.filter(function (x) { return x.id === fd.get("pakket"); })[0];
      return { fd: fd, keuze: k, total: k && k.prijs ? k.prijs : null };
    };
    var updateTotal = function () {
      var st = state();
      $("#totalPrice").textContent = st.total === null ? "Op maat" : euro(st.total);
      $("#totalNote").textContent = st.total === null
        ? (st.keuze && st.keuze.id === "twijfel" ? "we bepalen het samen via een foto" : "prijs op aanvraag")
        : "incl. btw & verplaatsing";
    };
    form.addEventListener("change", updateTotal);
    updateTotal();

    // "Maak afspraak" op een prijskaart kiest dat pakket in het formulier
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-pick]");
      if (!a) return;
      var r = $('#pkgChoices input[value="' + a.dataset.pick + '"]');
      if (r) { r.checked = true; updateTotal(); }
    });

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
        "🎯 Waarvoor: " + fd.get("reden"),
        "🗓️ Voorkeur: " + fd.get("moment"),
      ];
      var opm = (fd.get("opmerking") || "").trim();
      if (opm) lines.push("💬 Opmerking: " + opm);
      lines.push("", st.total === null ? "Graag een prijs op maat." : "💶 Prijs volgens de website: " + euro(st.total) + " (incl. btw)");
      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  // Zwevende knop verbergen zolang de grote knoppen bovenaan zichtbaar zijn
  var fab = $(".fab"), hero = $(".hero-cta");
  if (fab && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { fab.classList.toggle("hide", en[0].isIntersecting); }).observe(hero);
  }
})();
