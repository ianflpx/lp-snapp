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
