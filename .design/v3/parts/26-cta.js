/* ── CTA final: o link do checkout é digitado uma vez (menos de 5 s) e para em "seu-produto" ── */
(function () {
  "use strict";
  var field = document.querySelector("[data-cta]");
  var V3 = window.V3;
  if (!field || !V3 || V3.reduced.matches) return; // sem movimento, vale o texto final que já está no HTML
  var slug = field.querySelector("[data-cta-slug]");
  var words = ["planner", "curso", "e-book", slug.textContent];
  var wait = function (ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); };

  async function type() {
    field.classList.add("is-typing");
    for (var w = 0; w < words.length; w++) {
      var word = words[w];
      for (var i = 1; i <= word.length; i++) { slug.textContent = word.slice(0, i); await wait(55); }
      if (w === words.length - 1) break;
      await wait(560);
      for (var j = word.length - 1; j >= 0; j--) { slug.textContent = word.slice(0, j); await wait(28); }
    }
    field.classList.add("is-done");
    field.classList.remove("is-typing");
  }

  // começa quando o campo entra na tela (o reveal da base põe .is-in)
  new MutationObserver(function (list, mo) {
    if (!field.classList.contains("is-in")) return;
    mo.disconnect();
    slug.textContent = "";
    setTimeout(type, 500);
  }).observe(field, { attributes: true, attributeFilter: ["class"] });
})();
