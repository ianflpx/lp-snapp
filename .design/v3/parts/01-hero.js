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
