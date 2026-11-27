/* ── Banner Entrega por e-mail: abas (Entrega, Recuperação, Venda recusada) ── */
(function () {
  "use strict";
  var root = document.querySelector("[data-email]");
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panelOf = function (t) { return document.getElementById(t.getAttribute("aria-controls")); };
  var current = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
  var timer;

  function select(tab, focus) {
    if (tab !== current) {
      // o painel que sai e o que entra se cruzam: cada um desliza para o lado em que a aba está
      var dir = tabs.indexOf(tab) > tabs.indexOf(current) ? 1 : -1;
      var out = panelOf(current), into = panelOf(tab);
      out.style.setProperty("--dir", -dir);
      out.classList.add("is-off");
      into.style.setProperty("--dir", dir);
      into.classList.add("is-off");
      into.hidden = false;
      void into.offsetWidth; // fixa o ponto de partida antes de soltar a transição
      into.classList.remove("is-off");
      clearTimeout(timer);
      timer = setTimeout(function () { // some com os outros quando a transição acaba (vale também sem movimento)
        tabs.forEach(function (t) { if (t !== tab) panelOf(t).hidden = true; });
      }, 380);
      current = tab;
    }
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    root.classList.add("is-done"); // a coreografia de entrada não se repete ao voltar para "Entrega"
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab); });
    tab.addEventListener("keydown", function (e) {
      var to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      select(tabs[(to + tabs.length) % tabs.length], true);
    });
  });
})();
