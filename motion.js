/* ══════════════════════════════════════════
   SNAPP CHECKOUT — Camada de movimento
   Reveal em scroll, contadores e estado do nav.
   Sem dependência externa. Degrada para conteúdo
   estático se algo falhar.
══════════════════════════════════════════ */
(function () {
  "use strict";

  var root = document.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* O <head> ligou um failsafe que reexibe tudo se este arquivo não carregar. */
  if (window.__snappMotionFailsafe) {
    clearTimeout(window.__snappMotionFailsafe);
    window.__snappMotionFailsafe = null;
  }

  /* ── NAV: estado "scrolled" em rAF (um listener passivo, sem layout thrash) ── */
  var nav = document.querySelector(".nav");
  var navQueued = false;

  function syncNav() {
    navQueued = false;
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
  }

  window.addEventListener(
    "scroll",
    function () {
      if (navQueued) return;
      navQueued = true;
      requestAnimationFrame(syncNav);
    },
    { passive: true }
  );

  syncNav();

  /* ── CONTADORES ── */
  function finalValue(el) {
    return (el.getAttribute("data-count") || "") + (el.getAttribute("data-count-suffix") || "");
  }

  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;

    var suffix = el.getAttribute("data-count-suffix") || "";
    var duration = 1500;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }

    el.textContent = "0" + suffix;
    requestAnimationFrame(frame);
  }

  /* ── Sem IntersectionObserver ou com reduced-motion: entrega tudo estático ── */
  if (!("IntersectionObserver" in window) || reducedMotion.matches) {
    root.classList.remove("js-motion");
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = finalValue(el);
    });
    return;
  }

  /* ── Stagger: filhos diretos entram em cascata ── */
  document.querySelectorAll("[data-reveal-stagger]").forEach(function (group) {
    var variant = group.getAttribute("data-reveal-stagger") || "";
    var step = parseInt(group.getAttribute("data-reveal-step"), 10);
    if (isNaN(step)) step = 90;

    Array.prototype.forEach.call(group.children, function (child, index) {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", variant);
      child.style.setProperty("--reveal-delay", index * step + "ms");
    });
  });

  /* ── Reveal ── */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        el.classList.add("is-revealed");
        observer.unobserve(el);

        el.querySelectorAll("[data-count]").forEach(countUp);
        if (el.hasAttribute("data-count")) countUp(el);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  document.querySelectorAll("[data-reveal]").forEach(function (el) {
    observer.observe(el);
  });

  /* Contadores fora de um bloco com reveal (ex.: dentro do respiro scroll-driven) */
  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll("[data-count]").forEach(function (el) {
    if (!el.closest("[data-reveal]")) counterObserver.observe(el);
  });

  /* Se o usuário ligar reduced-motion durante a sessão, para tudo. */
  var onReducedChange = function (event) {
    if (event.matches) root.classList.remove("js-motion");
  };

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", onReducedChange);
  }
})();
