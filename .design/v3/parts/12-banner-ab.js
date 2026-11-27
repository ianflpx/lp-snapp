/* Banner Teste A/B: os valores contam junto com as barras quando o banner ganha .is-play.
   Tempos iguais aos do CSS da parte: cada linha começa em 1,5 s + 0,3 s por linha e dura 0,5 s + 0,7 s × --v.
   Sem .js-motion (sem JS de reveal ou com "reduzir movimento") nada roda: o HTML já traz os valores finais. */
(function () {
  "use strict";
  var ab = document.querySelector(".ab");
  var banner = ab && ab.closest(".banner");
  if (!banner || !document.documentElement.classList.contains("js-motion") || banner.classList.contains("is-play")) return;
  var nums = Array.prototype.slice.call(ab.querySelectorAll("[data-ab]"));
  function show(el, n) { el.textContent = (el.dataset.pre || "") + Math.round(n).toLocaleString("pt-BR"); }
  function run() {
    var start = performance.now();
    nums.forEach(function (el, i) {
      var to = +el.dataset.ab;
      var t0 = start + 1500 + Math.floor(i / 2) * 300;
      var ms = 500 + (parseFloat(getComputedStyle(el.parentNode).getPropertyValue("--v")) || 1) * 700;
      show(el, 0);
      (function tick(now) {
        var p = Math.min(1, Math.max(0, (now - t0) / ms));
        show(el, to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }
  new MutationObserver(function (list, obs) {
    if (!banner.classList.contains("is-play")) return;
    obs.disconnect();
    run();
  }).observe(banner, { attributes: true, attributeFilter: ["class"] });
})();
