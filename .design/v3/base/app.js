// Snapp Checkout · /v3. Vanilla, sem dependências. Cada bloco é independente e tolera a ausência do seu markup.
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)");
  var $ = function (s, el) { return (el || doc).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); };

  /* ── Nav: painel (dropdown no desktop, menu no mobile) e esconder ao rolar para baixo ── */
  (function () {
    var nav = $("[data-nav]");
    if (!nav) return;
    var panel = $(".nav__panel", nav);
    var toggles = $$("[data-nav-toggle]", nav);
    var behind = $$("main, footer");
    function set(open) {
      nav.toggleAttribute("data-open", open);
      panel.toggleAttribute("data-open", open);
      toggles.forEach(function (t) {
        t.setAttribute("aria-expanded", String(open));
        if (t.hasAttribute("aria-label")) t.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      });
      // aberto: o foco entra no painel, a página atrás fica inerte e, no mobile, não rola por baixo
      behind.forEach(function (el) { el.inert = open; });
      root.style.overflow = open && innerWidth < 800 ? "hidden" : "";
      if (open) {
        var first = $$("a", panel).filter(function (a) { return a.offsetParent; })[0];
        if (first) first.focus({ preventScroll: true });
      }
    }
    toggles.forEach(function (t) {
      t.addEventListener("click", function () { set(!nav.hasAttribute("data-open")); });
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("[data-nav-close], .nav__panel a")) set(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !nav.hasAttribute("data-open")) return;
      set(false);
      (toggles.filter(function (t) { return t.offsetParent; })[0] || toggles[0]).focus();
    });

    var last = scrollY;
    addEventListener("scroll", function () {
      var y = scrollY;
      var down = y > last && y > 240;
      if (Math.abs(y - last) > 6) {
        nav.toggleAttribute("data-hidden", down && !nav.hasAttribute("data-open") && !nav.contains(doc.activeElement));
        last = y;
      }
    }, { passive: true });
  })();

  /* ── Reveal: uma vez só, quando o topo do elemento cruza ~72% da altura do viewport ── */
  (function () {
    var items = $$("[data-reveal]");
    if (!root.classList.contains("js-motion")) return;
    clearTimeout(window.__v3Failsafe);
    // números com data-count sobem de 0 até o valor quando o bloco entra (o texto do HTML já é o valor final)
    function count(scope) {
      $$("[data-count]", scope).forEach(function (el) {
        if (!el.dataset.count) return; // já contou
        var to = +el.dataset.count, t0 = performance.now(), ms = 900;
        el.dataset.count = "";
        (function tick(now) {
          var p = Math.min(1, (now - t0) / ms);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        count(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -28% 0px" });
    items.forEach(function (el) { io.observe(el); });
    // coreografia dos banners: começa quando a mídia está meio visível, não quando o topo do card aparece
    var play = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.closest(".banner").classList.add("is-play");
        play.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    $$(".banner .banner__media").forEach(function (el) { play.observe(el); });
    // foco por teclado nunca cai em bloco ainda invisível: quem recebe foco aparece na hora
    doc.addEventListener("focusin", function (e) {
      for (var el = e.target.closest("[data-reveal]"); el; el = el.parentElement && el.parentElement.closest("[data-reveal]")) {
        el.classList.add("is-in");
        count(el);
      }
      var banner = e.target.closest(".banner");
      if (banner) banner.classList.add("is-play");
    });
    // quem já passou do ponto (âncora, recarregar no meio da página) aparece direto
    addEventListener("load", function () {
      items.forEach(function (el) {
        if (el.getBoundingClientRect().top < innerHeight * 0.72) el.classList.add("is-in");
      });
    });
  })();

  /* ── Chat: a janela do Claude, usada no hero e no banner da IA ──
     V3.chat(root) devolve { play(cenario, aoPasso), show(cenario), stop() }.
     cenario = { user: "texto", tools: [["nome_da_ferramenta", "argumento"]], reply: "HTML",
                 card: { title, status, rows: [["rótulo", "valor"]], link } }   (card e link são opcionais)
     play() digita o pedido, envia, marca as ferramentas e mostra a resposta; resolve true ao terminar e
     false se outro play/show/stop entrou no meio. aoPasso recebe "user" | "tools" | "reply" | "card".
     Obedece ao botão de pausa do [data-anim] em volta e, com "reduzir movimento", mostra o estado final. */
  var V3 = (window.V3 = window.V3 || {});
  V3.reduced = reduced;
  V3.chat = function (root) {
    var msgs = $("[data-chat-msgs]", root);
    var field = $("[data-chat-field]", root);
    var placeholder = field ? field.textContent : "";
    var scene = root.closest("[data-anim]");
    var paused = !!(scene && scene.hasAttribute("data-paused"));
    var run = 0;
    if (scene) scene.addEventListener("v3:pause", function (e) { paused = e.detail.paused; });

    var esc = function (t) { var d = doc.createElement("i"); d.textContent = t; return d.innerHTML; };
    function parts(sc, done) {
      var c = sc.card;
      return {
        user: '<p class="chat-user" data-in>' + esc(sc.user) + "</p>",
        tools: '<div class="chat-tools" data-in><span class="chat-tools__h">' + (sc.tools.length > 1 ? "Ferramentas utilizadas" : "Ferramenta utilizada") + "</span>" +
          sc.tools.map(function (t) {
            return '<div class="chat-tool' + (done ? " is-done" : "") + '"><img src="/v2/images/logo-s-mark.svg" width="14" height="15" alt=""><code>' +
              esc(t[0]) + "</code><span>" + esc(t[1]) + '</span><svg class="ico"><use href="#i-check"/></svg></div>';
          }).join("") + "</div>",
        reply: '<p class="chat-reply" data-in>' + sc.reply + "</p>",
        card: !c ? "" : '<div class="chat-card" data-in><div class="chat-card__h"><span>' + esc(c.title) + "</span><b>" + esc(c.status || "") + "</b></div><dl>" +
          c.rows.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
          (c.link ? '<div class="chat-card__link">' + esc(c.link) + "<span>copiar</span></div>" : "") + "</div>",
      };
    }
    // espera que respeita a pausa e é cancelada quando outra execução começa
    function wait(ms, id) {
      return new Promise(function (ok, no) {
        var iv = setInterval(function () {
          if (id !== run) { clearInterval(iv); no(); }
          else if (!paused && (ms -= 40) <= 0) { clearInterval(iv); ok(); }
        }, 40);
      });
    }
    function add(html) { msgs.insertAdjacentHTML("beforeend", html); return msgs.lastElementChild; }
    function show(sc) {
      run++;
      var p = parts(sc, true);
      msgs.innerHTML = p.user + p.tools + p.reply + p.card;
      if (field) { field.textContent = placeholder; field.classList.remove("is-typing"); }
    }
    async function play(sc, on) {
      on = on || function () {};
      if (reduced.matches) { show(sc); return true; }
      var id = ++run;
      var p = parts(sc, false);
      try {
        msgs.innerHTML = "";
        if (field) {
          field.classList.add("is-typing");
          for (var i = 2; i < sc.user.length + 2; i += 2) { field.textContent = sc.user.slice(0, i); await wait(40, id); }
          await wait(360, id);
          field.textContent = placeholder; field.classList.remove("is-typing");
        }
        add(p.user); on("user");
        await wait(700, id);
        var tools = $$(".chat-tool", add(p.tools));
        for (var j = 0; j < tools.length; j++) { await wait(640, id); tools[j].classList.add("is-done"); }
        on("tools");
        await wait(420, id);
        add(p.reply); on("reply");
        if (p.card) { await wait(520, id); add(p.card); on("card"); }
        await wait(600, id);
        return true;
      } catch (e) { return false; }
    }
    return { play: play, show: show, stop: function () { run++; }, wait: function (ms) { return wait(ms, run); } };
  };

  /* ── Pausa: todo [data-anim] com um botão .pause obedece a ele e para fora da tela ── */
  // Blocos animados por JS escutam o evento "v3:pause" (detail.paused) no próprio [data-anim].
  $$("[data-anim]").forEach(function (scene) {
    var btn = $(".pause", scene);
    var user = reduced.matches; // com "reduzir movimento" a cena já nasce parada
    var visible = true;
    function apply() {
      var paused = user || !visible;
      scene.toggleAttribute("data-paused", paused);
      scene.dispatchEvent(new CustomEvent("v3:pause", { detail: { paused: paused } }));
      if (btn) {
        btn.setAttribute("aria-pressed", String(user));
        btn.setAttribute("aria-label", user ? "Retomar a animação" : "Pausar a animação");
      }
    }
    if (btn) btn.addEventListener("click", function () { user = !user; apply(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; apply(); }).observe(scene);
    }
    apply();
  });
})();
