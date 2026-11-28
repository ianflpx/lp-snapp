/* Banner Order bump: depois da coreografia de entrada, cada novo hover repete a queda do +US$ 7 no botão
   (o voo e o pulo do botão, reaproveitando as animações do CSS a partir do início do voo). */
(function () {
  "use strict";
  var fly = document.querySelector(".bp__fly");
  var cta = document.querySelector(".bp__cta");
  var banner = fly && fly.closest(".banner");
  if (!banner || !cta) return;
  var ready = false;
  cta.addEventListener("animationend", function (e) { if (e.animationName === "bp-pulse") ready = true; });
  banner.addEventListener("pointerenter", function () {
    var anims = fly.getAnimations().concat(cta.getAnimations());
    if (!ready || !anims.length) return;
    var t0 = fly.getAnimations()[0].effect.getTiming().delay;
    anims.forEach(function (a) { a.currentTime = t0; a.play(); });
  });
})();
