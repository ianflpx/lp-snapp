/* ── 24 · Explore mais: as setas andam um card; a rolagem, o snap e o toque são nativos ── */
(function () {
  var sc = document.querySelector("[data-explore]");
  if (!sc) return;
  var box = sc.closest(".explore") || document;
  var prev = box.querySelector("[data-explore-prev]");
  var next = box.querySelector("[data-explore-next]");
  var items = sc.querySelectorAll("li");
  if (!prev || !next || items.length < 2) return;

  function go(dir) {
    var reduced = window.V3 && V3.reduced && V3.reduced.matches;
    // passo = card + gap, medido na hora (muda com a largura da tela)
    sc.scrollBy({ left: dir * (items[1].offsetLeft - items[0].offsetLeft), behavior: reduced ? "auto" : "smooth" });
  }
  // a seta que desliga passa o foco para a outra, para o teclado não ficar sem lugar
  function set(btn, off, other) {
    if (off && document.activeElement === btn) other.focus();
    btn.disabled = off;
  }
  function sync() {
    var x = sc.scrollLeft, max = sc.scrollWidth - sc.clientWidth;
    set(prev, x < 2, next);
    set(next, x > max - 2, prev);
  }
  prev.addEventListener("click", function () { go(-1); });
  next.addEventListener("click", function () { go(1); });
  sc.addEventListener("scroll", sync, { passive: true });
  addEventListener("resize", sync);
  sync();
})();
