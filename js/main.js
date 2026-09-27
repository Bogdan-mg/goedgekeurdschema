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

    var err = $("#formErr");
    var showErr = function (html, field) {
      err.innerHTML = html;
      if (field) field.focus();
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.value) || "wa";
      var st = state(), fd = st.fd;
      var v = function (k) { return (fd.get(k) || "").toString().trim(); };
      var naam = v("naam"), gem = v("gemeente"), mail = v("email"), tel = v("telefoon"), opm = v("opmerking");
      if (!naam || !gem) {
        return showErr("Vul je naam en gemeente in, dan kunnen we je meteen verder helpen.", naam ? form.gemeente : form.naam);
      }
      if (via === "mail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        return showErr("Vul je e-mailadres in, zodat we je kunnen antwoorden.", form.email);
      }
      err.textContent = "";

      var type = st.keuze ? st.keuze.naam + " (" + st.keuze.sub + ")" : "-";
      var prijs = st.total === null ? "op maat" : euro(st.total) + " (incl. btw)";

      if (via === "wa") {
        var lines = [
          "Hallo! Ik wil graag een afspraak boeken via goedgekeurdschema.be.",
          "",
          "👤 Naam: " + naam,
          "📍 Gemeente: " + gem,
        ];
        if (tel) lines.push("📞 Telefoon: " + tel);
        if (mail) lines.push("✉️ E-mail: " + mail);
        lines.push("🏠 Type: " + type, "🎯 Waarvoor: " + fd.get("reden"), "🗓️ Voorkeur: " + fd.get("moment"));
        if (opm) lines.push("💬 Opmerking: " + opm);
        lines.push("", st.total === null ? "Graag een prijs op maat." : "💶 Prijs volgens de website: " + prijs);
        window.open(waLink(lines.join("\n")), "_blank", "noopener");
        return;
      }

      // Versturen per e-mail via FormSubmit
      var data = {
        "Naam": naam,
        "Gemeente": gem,
        "email": mail,
        "Telefoon": tel || "-",
        "Type woning": type,
        "Prijs volgens website": prijs,
        "Waarvoor": fd.get("reden"),
        "Voorkeur moment": fd.get("moment"),
        "Opmerking": opm || "-",
        _subject: "Nieuwe afspraak: " + naam + " (" + gem + ")",
        _replyto: mail,
        _template: "table",
        _honey: v("_honey"),
        _autoresponse: "Bedankt voor je aanvraag bij " + S.naam + "! We hebben ze goed ontvangen en nemen zo snel mogelijk contact met je op om een moment af te spreken. Je vaste prijs: " + prijs + ".",
      };
      if (S.boekingCc) data._cc = S.boekingCc;

      var btn = e.submitter;
      btn.disabled = true;
      var oldLabel = btn.innerHTML;
      btn.innerHTML = "Bezig met versturen…";
      var fallback = function () {
        var body = Object.keys(data).filter(function (k) { return k.charAt(0) !== "_"; })
          .map(function (k) { return k + ": " + data[k]; }).join("\n");
        var to = S.boekingEmail.indexOf("@") > -1 ? S.boekingEmail : S.email;
        return "mailto:" + to + "?subject=" + encodeURIComponent(data._subject) +
          (S.boekingCc ? "&cc=" + encodeURIComponent(S.boekingCc) : "") + "&body=" + encodeURIComponent(body);
      };

      fetch("https://formsubmit.co/ajax/" + S.boekingEmail, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok || String(res.j.success) !== "true") throw new Error(res.j.message || "Versturen mislukt");
          form.hidden = true;
          var ok = $("#bookOk");
          ok.hidden = false;
          ok.focus();
          ok.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch(function () {
          btn.disabled = false;
          btn.innerHTML = oldLabel;
          showErr('Het versturen is niet gelukt. Probeer het opnieuw, stuur ons een WhatsApp of <a href="' + fallback() + '">mail ons rechtstreeks</a>.');
        });
    });
  }

  // Zwevende knop verbergen zolang de grote knoppen bovenaan zichtbaar zijn
  var fab = $(".fab"), hero = $(".hero-cta");
  if (fab && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { fab.classList.toggle("hide", en[0].isIntersecting); }).observe(hero);
  }
})();
