/* ── Banner IA por chat: três pedidos de exemplo que rodam na janela do Claude ── */
(function () {
  "use strict";
  var root = document.querySelector("[data-ia]");
  var V3 = window.V3;
  if (!root || !V3 || !V3.chat) return;

  // só ferramentas que existem no conector; o primeiro cenário é o que já está escrito no HTML
  var S = [
    { title: "Resumo de hoje", user: "Quantas vendas tive hoje?",
      tools: [["get_dashboard_overview", "hoje"]],
      reply: "Hoje você teve <b>38 vendas aprovadas</b>, somando <b>US$ 1.246</b>.",
      card: { title: "Vendas de hoje", rows: [["Vendas", "38"], ["Faturamento", "US$ 1.246"], ["Ticket médio", "US$ 32,79"]] } },
    { title: "Melhor order bump", user: "Qual order bump converte mais?",
      tools: [["get_offers_ranking", "últimos 30 dias"], ["get_offer_analytics", "Planner Digital"]],
      reply: "O <b>Guia Rápido</b>: entra em <b>41% dos pedidos</b> do Planner Digital.",
      card: { title: "Guia Rápido · +US$ 7", rows: [["Adesão", "41%"], ["Vendas", "217"], ["Receita", "US$ 1.519"]] } },
    { title: "Funil do Planner", user: "Monta um funil no Planner: Kit Avançado por US$ 37 e downsell Kit Essencial por US$ 17.",
      tools: [["set_offer_upsell", "Planner Digital · Kit Avançado + downsell"]],
      reply: "Funil montado e ativo no <b>Planner Digital</b>.",
      card: { title: "Funil pós-compra", status: "Ativo", rows: [["Upsell · US$ 37", "Kit Avançado"], ["Downsell · US$ 17", "Kit Essencial"]] } },
  ];

  var chat = V3.chat(root);
  var field = root.querySelector("[data-chat-field]");
  var msgs = root.querySelector("[data-chat-msgs]");
  var chips = Array.prototype.slice.call(root.querySelectorAll(".ia__chip"));
  var send = root.querySelector(".ia__send");
  var title = root.querySelector("[data-ia-title]");
  var current = 0;
  var touched = false;

  function run(i) {
    current = i;
    chips.forEach(function (c, j) { c.setAttribute("aria-pressed", String(i === j)); });
    if (title) title.textContent = S[i].title;
    // o V3.chat devolve o campo ao texto inicial depois de "enviar"; aqui o campo continua mostrando o pedido
    var keep = function () { field.textContent = S[i].user; };
    if (V3.reduced.matches) { chat.show(S[i]); keep(); return; }
    chat.play(S[i], function (step) {
      if (step !== "user") return;
      keep();
      // o pedido saiu: o botão de enviar afunda e solta
      if (send.animate) send.animate({ scale: [1, 0.86, 1.04, 1] }, { duration: 420, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
    });
  }
  function ask(i) {
    touched = true;
    msgs.setAttribute("aria-live", "polite"); // só anuncia a conversa quando foi a pessoa que pediu
    run(i);
  }
  chips.forEach(function (c, i) { c.addEventListener("click", function () { ask(i); }); });
  send.addEventListener("click", function () { ask(current); });

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
