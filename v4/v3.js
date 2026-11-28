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

    // longe do topo o header some de vez; ao rolar para cima aparece o "voltar ao topo" no lugar dele
    var top = doc.createElement("button");
    top.type = "button";
    top.className = "totop";
    top.setAttribute("aria-label", "Voltar ao topo");
    top.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    top.addEventListener("click", function () {
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
      else scrollTo({ top: 0, behavior: reduced.matches ? "auto" : "smooth" });
      top.blur();
    });
    (nav.closest(".v3x") || doc.body).appendChild(top);

    var last = scrollY;
    addEventListener("scroll", function () {
      var y = scrollY;
      var far = y > 240;
      if (!far) top.removeAttribute("data-show");
      nav.toggleAttribute("data-hidden", far && !nav.hasAttribute("data-open") && !nav.contains(doc.activeElement));
      if (Math.abs(y - last) > 6) {
        top.toggleAttribute("data-show", far && y < last);
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
    // banner que entra junto com o vizinho (mesma linha do bento) abre 120ms depois dele
    function show(el, delay) {
      if (el.classList.contains("is-in")) return;
      if (el.classList.contains("banner")) {
        el.style.setProperty("--open-delay", (delay || 0) + "ms");
        el.__openAt = performance.now() + (delay || 0);
      }
      el.classList.add("is-in");
      count(el);
    }
    var io = new IntersectionObserver(function (entries) {
      var k = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        show(e.target, e.target.classList.contains("banner") ? k++ * 120 : 0);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -28% 0px" });
    items.forEach(function (el) { io.observe(el); });
    // coreografia dos banners: só toca com quase o card inteiro na tela (90% dele, ou 90% da tela se ele for
    // mais alto que ela) e depois que ele terminou de abrir, para ninguém perder o começo nem a parte de baixo
    var OPEN_MS = 800, steps = [];
    for (var s = 0; s <= 20; s++) steps.push(s / 20);
    var play = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var b = e.target;
        if (e.intersectionRect.height < Math.min(e.boundingClientRect.height, innerHeight) * 0.9) return;
        play.unobserve(b);
        show(b);
        setTimeout(function () { b.classList.add("is-play"); }, Math.max(0, b.__openAt + OPEN_MS - performance.now()));
      });
    }, { threshold: steps });
    $$(".banner").forEach(function (el) { play.observe(el); });
    // foco por teclado nunca cai em bloco ainda invisível: quem recebe foco aparece na hora
    doc.addEventListener("focusin", function (e) {
      for (var el = e.target.closest("[data-reveal]"); el; el = el.parentElement && el.parentElement.closest("[data-reveal]")) show(el);
      var banner = e.target.closest(".banner");
      if (banner) banner.classList.add("is-play");
    });
    // quem já passou do ponto (âncora, recarregar no meio da página) aparece direto
    addEventListener("load", function () {
      items.forEach(function (el) {
        if (el.getBoundingClientRect().top < innerHeight * 0.72) show(el);
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
            return '<div class="chat-tool' + (done ? " is-done" : "") + '"><img src="/v4/images/logo-s-mark.svg" width="14" height="15" alt=""><code>' +
              esc(t[0]) + "</code><span>" + esc(t[1]) + '</span><svg class="ico"><use href="#i-check"/></svg></div>';
          }).join("") + "</div>",
        reply: '<p class="chat-reply" data-in>' + sc.reply + "</p>",
        card: !c ? "" : '<div class="chat-card" data-in><div class="chat-card__h"><span>' + esc(c.title) + "</span><b>" + esc(c.status || "") + "</b></div><dl>" +
          c.rows.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") + "</dl>" +
          (c.link ? '<div class="chat-card__link">' + esc(c.link) + "<span>copiar</span></div>" : "") + "</div>",
      };
    }
    // espera que respeita a pausa e é cancelada quando outra execução começa
    function wait(ms, id, tick) {
      tick = tick || 40;
      return new Promise(function (ok, no) {
        var iv = setInterval(function () {
          if (id !== run) { clearInterval(iv); no(); }
          else if (!paused && (ms -= tick) <= 0) { clearInterval(iv); ok(); }
        }, tick);
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
          for (var i = 1; i <= sc.user.length; i++) { field.textContent = sc.user.slice(0, i); await wait(72, id, 8); } // 72ms por letra (era 80 na prática)
          await wait(700, id);
          field.textContent = placeholder; field.classList.remove("is-typing");
        }
        add(p.user); on("user");
        await wait(700, id);
        var tools = $$(".chat-tool", add(p.tools));
        for (var j = 0; j < tools.length; j++) { await wait(850, id); tools[j].classList.add("is-done"); }
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

/* ═════════ 01-hero ═════════ */
/* ── Hero: entrada ao carregar e a cena em loop (o pedido no chat cria o checkout, o celular recebe o pagamento) ──
   O HTML já é o quadro final. Sem V3 ou com "reduzir movimento" o loop não roda e ele fica como está.
   Todas as esperas são do V3.chat (chat.wait), que segura na pausa e fora da tela. */
(function () {
  "use strict";
  var V3 = window.V3;
  var hero = document.querySelector(".hero");
  if (!hero) return;

  // A entrada do hero é só CSS (ver 01-hero.css): aparece no primeiro quadro, sem depender deste script.

  var scene = hero.querySelector("[data-hero]");
  if (!scene || !V3 || !V3.chat || V3.reduced.matches) return;
  var $ = function (s) { return scene.querySelector(s); };
  var email = $("[data-hero-email]"), card = $("[data-hero-card]"), bump = $("[data-hero-bump]");
  var total = $("[data-hero-total]"), cta = $("[data-hero-cta]");
  var chat = V3.chat($("[data-chat]"));
  var pause = scene.parentNode.querySelector(".pause");
  var wait = function (ms) { return chat.wait(ms); };
  // os textos do quadro final vêm do HTML, para não existirem em dois lugares
  var mail = email.textContent, cardNo = card.textContent;
  var SC = {
    user: "Cria um checkout para o Planner Digital por US$ 27, com order bump do Guia Rápido por US$ 7.",
    tools: [["get_payment_methods", "Stripe e PayPal"], ["create_offer", "Planner Digital · US$ 27 + order bump"]],
    reply: "Pronto. O checkout do <b>Planner Digital</b> está no ar por <b>US$ 27</b>, com o Guia Rápido como order bump.",
    card: {
      title: "Checkout criado", status: "Ativo",
      rows: [["Oferta", "Planner Digital"], ["Preço", "US$ 27"], ["Order bump", "Guia Rápido +US$ 7"], ["Pagamento", "Stripe + PayPal"]],
      link: "pay.snappcheckout.com/c/planner",
    },
  };

  // campo que ganha foco e é preenchido; pula o que a composição esconde (no retrato não há campo de cartão)
  async function fill(el, text, ms) {
    if (!el.offsetParent) return;
    el.parentNode.classList.add("is-focus");
    await wait(280);
    if (ms) for (var i = 1; i <= text.length; i++) { el.textContent = text.slice(0, i); await wait(ms); }
    else el.textContent = text; // preenchimento automático: entra de uma vez
    await wait(320);
    el.parentNode.classList.remove("is-focus");
  }
  // toque: o dedo encosta, a peça aperta; quem chama troca o estado logo depois
  function tap(el) { el.classList.add("is-tap"); return wait(200); }

  async function loop() {
    try {
      await wait(1000); // o palco termina de entrar antes de a história começar
      for (;;) {
        // tudo em branco: a cena está escondida (antes do 1º ciclo ou em .is-out) enquanto volta ao começo
        scene.classList.remove("is-live", "is-sold");
        email.textContent = card.textContent = "";
        bump.classList.remove("is-on", "is-tap");
        total.classList.remove("is-up");
        cta.classList.remove("is-ok", "is-busy", "is-tap");

        var done = chat.play(SC, function (step) { if (step === "card") scene.classList.add("is-live"); });
        scene.classList.add("is-run");    // o play já esvaziou a conversa: a cena aparece vazia, com o celular em esqueleto
        scene.classList.remove("is-out");
        if (!(await done)) return;
        await wait(1640);                 // o conector se desenha e o checkout sai do esqueleto, bloco a bloco
        await fill(email, mail, 80);
        await fill(card, cardNo);
        await tap(bump);
        bump.classList.add("is-on");
        total.classList.add("is-up");
        await wait(1080);
        await tap(cta);
        cta.classList.add("is-busy");
        await wait(1000);
        cta.classList.replace("is-busy", "is-ok");
        await wait(560);
        scene.classList.add("is-sold");
        await wait(3400);
        scene.classList.add("is-out");    // tudo o que é da história some junto, sem piscar
        await wait(480);
      }
    } catch (e) { /* chat.wait rejeita se outra execução assumir o chat: o loop só termina */ }
  }

  if (pause) pause.hidden = false;
  loop();
})();

/* ═════════ 16-banner-ia ═════════ */
/* ── Banner IA por chat: três pedidos de exemplo que rodam na janela do Claude ── */
(function () {
  "use strict";
  var root = document.querySelector("[data-ia]");
  var V3 = window.V3;
  if (!root || !V3 || !V3.chat) return;

  // só ferramentas que existem no conector; o primeiro cenário é o que já está escrito no HTML
  var S = [
    { user: "Quantas vendas tive hoje?",
      tools: [["get_dashboard_overview", "hoje"]],
      reply: "Hoje você teve <b>38 vendas aprovadas</b>, somando <b>US$ 1.246</b>.",
      card: { title: "Vendas de hoje", rows: [["Vendas", "38"], ["Faturamento", "US$ 1.246"], ["Ticket médio", "US$ 32,79"]] } },
    { user: "Cria uma oferta do Planner Digital por US$ 27.",
      tools: [["get_payment_methods", "conta conectada"], ["create_offer", "Planner Digital · US$ 27"]],
      reply: "Oferta criada. O link já está pronto para divulgar.",
      card: { title: "Planner Digital", rows: [["Preço", "US$ 27"], ["Pagamento", "Cartão e PayPal"]], link: "pay.snappcheckout.com/c/planner" } },
    { user: "Qual order bump converte mais?",
      tools: [["get_offers_ranking", "últimos 30 dias"], ["get_offer_analytics", "Planner Digital"]],
      reply: "O <b>Guia Rápido</b>: entra em <b>41% dos pedidos</b> do Planner Digital.",
      card: { title: "Guia Rápido · +US$ 7", rows: [["Adesão", "41%"], ["Vendas", "217"], ["Receita", "US$ 1.519"]] } },
  ];

  var chat = V3.chat(root);
  var chips = Array.prototype.slice.call(root.querySelectorAll(".ia__chip"));
  var send = root.querySelector(".chatwin__send");
  var touched = false;

  function run(i) {
    chips.forEach(function (c, j) { c.setAttribute("aria-pressed", String(i === j)); });
    if (V3.reduced.matches) { chat.show(S[i]); return; }
    chat.play(S[i], function (step) {
      // o pedido saiu: o botão de enviar do Claude afunda e solta
      if (step === "user" && send.animate) send.animate({ scale: [1, 0.86, 1.04, 1] }, { duration: 420, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
    });
  }
  chips.forEach(function (c, i) {
    c.addEventListener("click", function () {
      touched = true;
      root.querySelector("[data-chat-msgs]").setAttribute("aria-live", "polite"); // só anuncia quando foi a pessoa que pediu
      run(i);
    });
  });

  // ao entrar na tela, o primeiro pedido toca uma vez; sem movimento, vale o estado final que já está no HTML
  var banner = root.closest(".banner");
  if (!banner || V3.reduced.matches) return;
  function start() { if (!touched) run(0); }
  if (banner.classList.contains("is-play")) { start(); return; }
  new MutationObserver(function (list, mo) {
    if (!banner.classList.contains("is-play")) return;
    mo.disconnect();
    start();
  }).observe(banner, { attributes: true, attributeFilter: ["class"] });
})();

/* ═════════ 15-banner-email ═════════ */
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
      out.classList.remove("email__panel--play"); // a coreografia dos blocos roda de novo em toda aba que entra
      into.classList.add("email__panel--play");
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

/* ═════════ 11-banner-bump ═════════ */
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

/* ═════════ 12-banner-ab ═════════ */
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

/* ═════════ 24-explore ═════════ */
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

/* ═════════ 26-cta ═════════ */
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
