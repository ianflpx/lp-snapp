/* ===== GLOBO REAL (d3-geo + países do world-atlas 110m) ===== */
(function () {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HUBS = { // lon, lat, bandeira, moeda, cidade
    sp: [-46.6, -23.5, "br", "R$", "São Paulo"], ny: [-74, 40.7, "us", "$", "Nova York"], la: [-118.2, 34, "us", "$", "Los Angeles"],
    lon: [-0.1, 51.5, "gb", "£", "Londres"], par: [2.3, 48.9, "fr", "€", "Paris"], ber: [13.4, 52.5, "de", "€", "Berlim"],
    mad: [-3.7, 40.4, "es", "€", "Madri"], rom: [12.5, 41.9, "it", "€", "Roma"], mex: [-99.1, 19.4, "mx", "MX$", "Cidade do México"],
    tok: [139.7, 35.7, "jp", "¥", "Tóquio"], syd: [151.2, -33.9, "au", "A$", "Sydney"], dub: [55.3, 25.2, "ae", "AED", "Dubai"],
    jnb: [28, -26.2, "za", "R", "Joanesburgo"], tor: [-79.4, 43.7, "ca", "C$", "Toronto"], bue: [-58.4, -34.6, "ar", "$", "Buenos Aires"],
    lis: [-9.1, 38.7, "pt", "€", "Lisboa"], ams: [4.9, 52.4, "nl", "€", "Amsterdã"]
  };
  const PRODUCTS = ["Curso Confeitaria Express", "Inglês em 30 Dias", "Planner Financeiro 2026", "Pack de Presets Lightroom", "E-book Receitas Fit", "Mentoria Tráfego do Zero", "Kit de Templates Canva"];
  const AMOUNTS = [17, 19, 27, 37, 47, 67, 97];
  const KEYS = Object.keys(HUBS);

  function globe(canvas, opts) {
    if (!canvas || !window.d3) return;
    const ctx = canvas.getContext("2d");
    let W, H, R, dpr, world = null;
    const proj = d3.geoOrthographic().clipAngle(90);
    const path = d3.geoPath(proj, ctx);
    const grat = d3.geoGraticule().step([15, 15])();
    const arcs = [];
    for (let i = 0; i < (opts.arcs || 8); i++) arcs.push(newArc(Math.random()));
    function newArc(t) {
      const a = KEYS[Math.floor(Math.random() * KEYS.length)];
      let b = KEYS[Math.floor(Math.random() * KEYS.length)]; if (b === a) b = KEYS[(KEYS.indexOf(a) + 3) % KEYS.length];
      return { a: HUBS[a], b: HUBS[b], ip: d3.geoInterpolate(HUBS[a], HUBS[b]), t: t === undefined ? -0.3 : t, s: 0.0028 + Math.random() * 0.0022 };
    }
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = opts.rh ? H * opts.rh : Math.min(W, H) * (opts.radius || 0.45);
      proj.translate([W * (opts.cx || 0.5), H * (opts.cy || 0.5)]).scale(R);
    }
    size(); addEventListener("resize", size);
    fetch("/v2/images/world-countries.json").then(r => r.json()).then(j => { world = j; });

    let lon = opts.lon || -30, mx = 0, tmx = 0, visible = true, sx = 0, tsx = 0, lastY = scrollY;
    const lat = opts.lat || -22;
    if (opts.scroll) addEventListener("scroll", () => { tsx += (scrollY - lastY) * 0.06; lastY = scrollY; }, { passive: true });
    let dragging = false, lx = 0;
    if (opts.drag) {
      canvas.addEventListener("pointerdown", e => { dragging = true; lx = e.clientX; canvas.setPointerCapture(e.pointerId); });
      canvas.addEventListener("pointermove", e => { if (!dragging) return; tsx += (e.clientX - lx) * 0.35; sx = tsx; lx = e.clientX; });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => canvas.addEventListener(ev, () => { dragging = false; }));
    }
    /* vendas: chips DOM presos ao ponto do país */
    const sales = []; let lastSpawn = 0;
    function spawn(now) {
      const center = [-proj.rotate()[0], -proj.rotate()[1]];
      const ok = KEYS.filter(k => {
        if (d3.geoDistance(HUBS[k], center) >= Math.PI / 2 - 0.5 || sales.some(s => s.k === k)) return false;
        const p = proj(HUBS[k]); if (!p) return false;
        return !sales.some(s => { const q = proj(s.ll); return q && Math.hypot(q[0] - p[0], q[1] - p[1]) < 230; });
      });
      if (!ok.length) return;
      const k = ok[Math.floor(Math.random() * ok.length)], h = HUBS[k];
      const amt = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)], prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const el = document.createElement("div"); el.className = "sale";
      el.innerHTML = '<img src="/v2/images/flags/' + h[2] + '.png" alt=""><div><b>' + h[3] + " " + amt + '</b><span>Venda aprovada · ' + h[4] + "</span><small>" + prod + "</small></div><i></i>";
      opts.salesEl.appendChild(el);
      let country = null; if (world) for (const f of world.features) { if (d3.geoContains(f, h)) { country = f; break; } }
      sales.push({ k, ll: [h[0], h[1]], el, t0: now, country });
    }
    if (opts.mouse) addEventListener("pointermove", e => { tmx = (e.clientX / innerWidth - 0.5); });
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);

    function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      mx += (tmx - mx) * 0.04; sx += (tsx - sx) * 0.08;
      if (!reduced && !dragging) lon += opts.speed || 0.07;
      proj.rotate([lon + mx * 40 + sx, lat]);
      const now = performance.now();
      ctx.clearRect(0, 0, W, H); ctx.globalAlpha = opts.dim || 1;

      /* corpo */
      const CX = W * (opts.cx || 0.5), CY = H * (opts.cy || 0.5);
      const g = ctx.createRadialGradient(CX - R * 0.35, CY - R * 0.4, R * 0.05, CX, CY, R);
      g.addColorStop(0, "#2a2a2e"); g.addColorStop(0.55, "#131315"); g.addColorStop(1, "#050505");
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();

      /* graticule */
      ctx.beginPath(); path(grat); ctx.strokeStyle = "rgba(255,255,255,.045)"; ctx.lineWidth = 0.7; ctx.stroke();

      /* países */
      if (world) {
        ctx.beginPath(); path(world);
        const lf = ctx.createLinearGradient(W / 2 - R, H / 2 - R, W / 2 + R, H / 2 + R);
        lf.addColorStop(0, "rgba(235,235,240,.22)"); lf.addColorStop(1, "rgba(235,235,240,.08)");
        ctx.fillStyle = lf; ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 0.6; ctx.stroke();
      }
      /* vendas ativas: país aceso + onda + chip */
      if (opts.salesEl) {
        if (!reduced && now - lastSpawn > (opts.every || 1500)) { lastSpawn = now; spawn(now); }
        const center = [-proj.rotate()[0], -proj.rotate()[1]];
        for (let i = sales.length - 1; i >= 0; i--) {
          const s = sales[i], age = now - s.t0, life = 4200;
          if (age > life + 500) { s.el.remove(); sales.splice(i, 1); continue; }
          const k = Math.min(1, age / 400) * (age > life ? Math.max(0, 1 - (age - life) / 500) : 1);
          if (s.country) { ctx.beginPath(); path(s.country); ctx.fillStyle = "rgba(254,210,23," + (0.55 * k) + ")"; ctx.fill(); }
          const vis = d3.geoDistance(s.ll, center) < Math.PI / 2 - 0.08;
          const p = proj(s.ll);
          if (vis && p) {
            const rr = (age % 1400) / 1400;
            ctx.beginPath(); ctx.arc(p[0], p[1], 4 + rr * 26, 0, Math.PI * 2); ctx.strokeStyle = "rgba(254,210,23," + ((1 - rr) * 0.7 * k) + ")"; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.shadowColor = "#fed217"; ctx.shadowBlur = 16; ctx.fill(); ctx.shadowBlur = 0;
            const cr = canvas.getBoundingClientRect(), pr = opts.salesEl.getBoundingClientRect();
            s.el.style.left = (p[0] + cr.left - pr.left) + "px"; s.el.style.top = (p[1] + cr.top - pr.top) + "px";
            s.el.style.opacity = k; s.el.classList.toggle("on", age > 60);
          } else { s.el.style.opacity = 0; }
        }
      }

      /* arcos */
      for (let i = 0; i < arcs.length; i++) {
        const a = arcs[i]; a.t += a.s;
        if (a.t > 1.35) arcs[i] = newArc(-0.3);
        const from = Math.max(0, a.t - 0.35), to = Math.min(1, a.t);
        if (to > 0 && from < 1) {
          const pts = []; const n = 40;
          for (let k = 0; k <= n; k++) pts.push(a.ip(from + (to - from) * k / n));
          ctx.beginPath(); path({ type: "LineString", coordinates: pts });
          ctx.strokeStyle = "rgba(254,210,23,.85)"; ctx.lineWidth = 1.4; ctx.stroke();
          const head = a.ip(to); const p = proj(head);
          if (p && d3.geoDistance(head, [-proj.rotate()[0], -proj.rotate()[1]]) < Math.PI / 2) {
            ctx.fillStyle = "#fed217"; ctx.shadowColor = "#fed217"; ctx.shadowBlur = 14;
            ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
          }
        }
      }
      /* hubs */
      const center = [-proj.rotate()[0], -proj.rotate()[1]];
      const pulse = Math.sin(performance.now() / 500) * 1.5;
      for (const k of KEYS) {
        const h = HUBS[k]; if (d3.geoDistance(h, center) > Math.PI / 2 - 0.05) continue;
        const p = proj(h);
        ctx.fillStyle = "rgba(254,210,23,.95)"; ctx.beginPath(); ctx.arc(p[0], p[1], 2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(254,210,23,.3)"; ctx.beginPath(); ctx.arc(p[0], p[1], 6 + pulse, 0, Math.PI * 2); ctx.stroke();
      }
      /* luz de borda */
      const rim = ctx.createRadialGradient(CX, CY, R * 0.86, CX, CY, R);
      rim.addColorStop(0, "rgba(0,0,0,0)"); rim.addColorStop(1, opts.dim ? "rgba(254,210,23,.07)" : "rgba(254,210,23,.16)");
      ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = opts.dim ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.1)"; ctx.lineWidth = 1; ctx.stroke();
    }
    frame();
  }
  globe(document.getElementById("horizon"), { rh: 1.05, cx: 0.5, cy: 1.42, dim: 0.42, speed: 0.025, lat: -8, lon: -70, arcs: 4, mouse: true });
  globe(document.getElementById("globe2"), { radius: 0.47, lat: -18, lon: 20, arcs: 5, speed: 0.045, scroll: true, salesEl: document.getElementById("sales"), every: 1300, drag: true });
})();

/* ===== CHAT SIMULADO (MCP): janelas Claude / ChatGPT / Cursor ===== */
(function () {
  "use strict";
  const body = document.getElementById("chatBody"), field = document.getElementById("chatField"),
    typed = document.getElementById("chatTyped"), send = document.getElementById("chatSend"),
    cases = document.getElementById("iaCases"), win = document.getElementById("win"), tabs = document.getElementById("iaTabs");
  if (!body) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SNP = '<img class="snp" src="/v2/images/logo-s-mark.svg" alt="">';
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const ICO = {
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 01-11.6 7.2L4 21l1.8-5.4A8 8 0 1121 12z"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20V4H6.5A2.5 2.5 0 004 6.5z"/></svg>'
  };
  const HOSTS = {
    claude: { url: "claude.ai", wm: "Claude", nav: [["pen", "Nova conversa"], ["search", "Buscar"], ["chat", "Conversas"], ["folder", "Projetos"], ["grid", "Artefatos"]],
      label: "Conversas recentes", ph: "Responda ao Claude…", model: "Sonnet <em>⌄</em>", mid: "<svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0'/></svg>",
      foot: "Claude é uma IA e pode cometer erros.", thinking: "Pensando…", tool: "claude" },
    gpt: { url: "chatgpt.com", wm: "ChatGPT <em style='font-style:normal;color:var(--mute);font-size:12px'>⌄</em>", nav: [["pen", "Nova conversa"], ["search", "Buscar em chats"], ["book", "Biblioteca"], ["folder", "Projetos"], ["grid", "GPTs"]],
      label: "Conversas recentes", ph: "Pergunte alguma coisa", model: "<svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='9' y='3' width='6' height='11' rx='3'/><path d='M5 11a7 7 0 0014 0M12 18v3'/></svg>", mid: SNP + " Snapp <em>⌄</em>",
      foot: "O ChatGPT pode cometer erros. Confira informações importantes.", thinking: "Pensando", tool: "gpt" },
    cursor: { url: "cursor.com", wm: "Cursor", nav: [["dir", "EXPLORER"], ["dir", "▾ snapp-checkout"], ["ind", "index.html"], ["ind", "checkout.ts"], ["ind", "offers.json"], ["ind", "pixel.config.ts"]],
      label: "Chats", ph: "Plan, search, build anything", model: "Auto <em>⌄</em>", mid: "∞ Agent <em>⌄</em>",
      foot: "", thinking: "Thinking…", tool: "cursor" }
  };
  const S = [
    { title: "Vendas de hoje", user: "Quantas vendas tiveram hoje?",
      tools: [["list_sales", "hoje"], ["get_metrics", "aprovadas, reembolsos, upsell"]],
      answer: "Hoje você teve <b>38 vendas aprovadas</b> somando <b>US$ 1.246,00</b>. O ticket médio ficou em US$ 32,79 e 11 compradores aceitaram o upsell. Nenhum reembolso até agora.",
      card: '<div class="rh"><span>Hoje · 29 out</span><b>+18% vs. ontem</b></div><div class="stats"><div><b>38</b><span>vendas</span></div><div><b>$1.246</b><span>receita</span></div><div><b>11</b><span>upsells</span></div></div>' },
    { title: "Checkout novo", user: "Cria um produto chamado Curso Confeitaria Express por R$ 47 e ativa a entrega por e-mail.",
      tools: [["create_product", "Curso Confeitaria Express"], ["create_offer", "R$ 47,00 · BRL"], ["set_delivery", "e-mail automático"]],
      answer: "Pronto. Criei o produto e o checkout, com a entrega por e-mail ativada. Assim que a venda for aprovada o comprador recebe o acesso.",
      card: '<div class="rh"><span>Checkout criado</span><span class="pill-ok">Ativo</span></div><div class="kv"><div><small>Produto</small><b>Curso Confeitaria Express</b></div><div><small>Preço</small><b>R$ 47,00</b></div><div><small>Entrega</small><b>E-mail automático</b></div><div><small>Pagamento</small><b>Stripe + PayPal</b></div></div><div class="lnk">pay.snappcheckout.com/confeitaria-express <span>copiar</span></div>' },
    { title: "Criação de produto", user: "Cria um checkout para o Inglês em 30 Dias, em inglês, por $27. Coloca o meu pixel do Facebook e ativa a entrega por e-mail.",
      tools: [["create_offer", "English in 30 Days · USD 27 · en"], ["set_pixel", "Meta · 7123…904"], ["set_delivery", "e-mail automático"]],
      answer: "Feito. Checkout em inglês por <b>$27</b>, com o seu pixel da Meta disparando Purchase e a entrega por e-mail ligada.",
      card: '<div class="rh"><span>Checkout criado</span><span class="pill-ok">Ativo</span></div><div class="kv"><div><small>Oferta</small><b>English in 30 Days</b></div><div><small>Preço</small><b>$ 27,00 · EN</b></div><div><small>Pixel</small><b>Meta · Purchase</b></div><div><small>Entrega</small><b>E-mail automático</b></div></div><div class="lnk">pay.snappcheckout.com/english-30-days <span>copiar</span></div>' },
    { title: "Tradução de checkout", user: "{{https://pay.checkout.com/c/8f2k1a}}\n\nCria um checkout para mim com essas informações, traduzidas para o inglês e no valor de $17. Cria também os order bumps.",
      tools: [["read_page", "pay.checkout.com/c/8f2k1a"], ["translate", "pt → en · nome, descrição, bumps"], ["create_offer", "USD 17"], ["create_order_bump", "2 bumps · $7 e $11"]],
      answer: "Li a página, traduzi tudo para o inglês e montei o checkout por <b>$17</b> com os dois order bumps que estavam na oferta original.",
      card: '<div class="rh"><span>Checkout criado</span><span class="pill-ok">Ativo</span></div><table><tr><th>Item</th><th></th><th>Preço</th></tr><tr><td>Home Workout Challenge</td><td>principal · EN</td><td>$ 17</td></tr><tr><td>Meal Prep Recipe Book</td><td>order bump</td><td>$ 7</td></tr><tr><td>Mobility Routine Cards</td><td>order bump</td><td>$ 11</td></tr></table><div class="lnk">pay.snappcheckout.com/home-workout <span>copiar</span></div>' },
    { title: "Melhor order bump", user: "Qual order bump tem a melhor taxa de aceite? Tira o pior.",
      tools: [["get_offer_analytics", "order bumps · 30 dias"], ["update_offer", "remover bump: Planilha de Custos"]],
      answer: "O <b>Pack de Presets Lightroom</b> é o campeão, com <b>38% de aceite</b>. O pior era a Planilha de Custos (6%), já removi do checkout.",
      card: '<div class="rh"><span>Aceite por bump · 30 dias</span><b>Atualizado</b></div><table><tr><th>Order bump</th><th>Aceite</th><th>Receita</th></tr><tr><td>Pack de Presets Lightroom</td><td>38%</td><td>$ 1.204</td></tr><tr><td>E-book Receitas Fit</td><td>21%</td><td>$ 612</td></tr><tr><td style="text-decoration:line-through;opacity:.6">Planilha de Custos</td><td>6%</td><td>removido</td></tr></table>' },
    { title: "Trocar modelo + A/B", user: "Troca o modelo do checkout do Planner Financeiro 2026 para o Clássico e cria um teste A/B contra o atual.",
      tools: [["duplicate_offer", "Planner Financeiro 2026"], ["update_offer", "layout: clássico"], ["create_ab_test", "50/50 · atual vs. clássico"]],
      answer: "Teste no ar. Metade do tráfego vai para o checkout atual e metade para a versão no modelo <b>Clássico</b>. Te aviso quando houver um vencedor com significância.",
      card: '<div class="rh"><span>Teste A/B</span><span class="pill-ok">Rodando</span></div><table><tr><th>Variante</th><th>Tráfego</th><th>Modelo</th></tr><tr><td>A · atual</td><td>50%</td><td>Rotmart</td></tr><tr><td>B · nova</td><td>50%</td><td>Clássico</td></tr></table>' },
    { title: "Funil upsell + downsell", user: "Monta um funil: upsell de $27 e, se recusar, downsell de $17.",
      tools: [["set_offer_upsell", "passo 1: Kit Avançado · $27"], ["set_offer_upsell", "downsell: Kit Essencial · $17"]],
      answer: "Funil montado. Depois da compra aparece o <b>Kit Avançado por $27</b> em um clique; se recusar, vem o <b>Kit Essencial por $17</b>. Nada de redigitar cartão.",
      card: '<div class="rh"><span>Funil pós-compra</span><span class="pill-ok">Ativo</span></div><table><tr><th>Passo</th><th>Produto</th><th>Preço</th></tr><tr><td>Upsell</td><td>Kit Avançado</td><td>$ 27</td></tr><tr><td>Downsell</td><td>Kit Essencial</td><td>$ 17</td></tr></table>' },
    { title: "Relatório do mês", user: "Gera o relatório do mês com receita por país e moeda.",
      tools: [["get_metrics", "outubro · por país"], ["get_metrics", "outubro · por moeda"]],
      answer: "Outubro fechou em <b>US$ 28.410</b>. Os Estados Unidos puxaram, a Alemanha cresceu 31% e o euro já é 42% da receita.",
      card: '<div class="rh"><span>Outubro · receita</span><b>$ 28.410</b></div><table><tr><th>País</th><th>Moeda</th><th>Receita</th></tr><tr><td>Estados Unidos</td><td>USD</td><td>$ 12.930</td></tr><tr><td>Alemanha</td><td>EUR</td><td>€ 6.120</td></tr><tr><td>Reino Unido</td><td>GBP</td><td>£ 3.480</td></tr><tr><td>Brasil</td><td>BRL</td><td>R$ 9.700</td></tr></table>' },
    { title: "Reembolsos", user: "Quantos reembolsos tivemos nos últimos 30 dias e em quais produtos?",
      tools: [["list_sales", "30 dias · status: reembolsado"], ["get_offers_ranking", "reembolsos"]],
      answer: "Foram <b>14 reembolsos</b> em 30 dias, 1,6% das vendas. Nove deles no <b>E-book Receitas Fit</b>, vale olhar a promessa da página.",
      card: '<div class="rh"><span>Reembolsos · 30 dias</span><b>1,6%</b></div><table><tr><th>Produto</th><th>Reembolsos</th><th>Taxa</th></tr><tr><td>E-book Receitas Fit</td><td>9</td><td>4,1%</td></tr><tr><td>Inglês em 30 Dias</td><td>3</td><td>0,8%</td></tr><tr><td>Planner Financeiro 2026</td><td>2</td><td>0,6%</td></tr></table>' },
    { title: "Assinatura com teste", user: "Cria uma assinatura mensal de $9 com 7 dias de teste.",
      tools: [["create_offer", "Clube de Receitas · subscription · month"], ["update_offer", "trial 7 dias · $9/mês"]],
      answer: "Assinatura criada. <b>Clube de Receitas</b> cobra <b>$9 por mês</b> na Stripe, com 7 dias grátis antes da primeira cobrança.",
      card: '<div class="rh"><span>Assinatura</span><span class="pill-ok">Ativa</span></div><div class="kv"><div><small>Produto</small><b>Clube de Receitas</b></div><div><small>Cobrança</small><b>$ 9 / mês</b></div><div><small>Teste grátis</small><b>7 dias</b></div><div><small>Gateway</small><b>Stripe</b></div></div><div class="lnk">pay.snappcheckout.com/clube-receitas <span>copiar</span></div>' },
    { title: "Entrega por link", user: "Adiciona entrega por link no Curso Confeitaria Express apontando para a área de membros.",
      tools: [["get_offer", "Curso Confeitaria Express"], ["update_offer", "deliverable: link · app.confeitaria-express.com"]],
      answer: "Feito. Quem comprar o <b>Curso Confeitaria Express</b> recebe no e-mail de confirmação o link da área de membros, liberado na hora.",
      card: '<div class="rh"><span>Entregável</span><span class="pill-ok">Ativo</span></div><div class="kv"><div><small>Tipo</small><b>Link</b></div><div><small>Destino</small><b>app.confeitaria-express.com</b></div><div><small>Quando</small><b>Venda aprovada</b></div><div><small>Canal</small><b>E-mail de confirmação</b></div></div>' }
  ];
  const CLAUDE_LOGO = document.querySelector('#iaTabs [data-host="claude"] svg').outerHTML;
  const LOGOS = { claude: CLAUDE_LOGO, gpt: document.querySelector('#iaTabs [data-host="gpt"] svg').outerHTML, cursor: document.querySelector('#iaTabs [data-host="cursor"] svg').outerHTML };

  const sleep = ms => new Promise(r => setTimeout(r, reduced ? Math.min(ms, 60) : ms));
  let run = 0, host = "claude";
  function el(html) { const d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
  function scroll() { body.scrollTop = body.scrollHeight; }

  function applyHost(h) {
    host = h; const H = HOSTS[h];
    win.className = "win " + h + " in";
    document.getElementById("winUrl").textContent = H.url;
    document.getElementById("wm").innerHTML = '<span class="wm-logo">' + LOGOS[h] + '</span><span class="wm-text">' + H.wm + '</span>';
    document.getElementById("sideNav").innerHTML = H.nav.map(([ic, t]) => '<li class="' + (ICO[ic] ? "" : ic) + '">' + (ICO[ic] || "") + t + "</li>").join("");
    document.getElementById("sideLabel").textContent = H.label;
    document.getElementById("chatPh").textContent = H.ph;
    document.getElementById("compModel").innerHTML = H.model;
    document.getElementById("compMid").innerHTML = H.mid;
    document.getElementById("winFoot").textContent = H.foot;
    [...tabs.children].forEach(b => b.classList.toggle("on", b.dataset.host === h));
  }
  applyHost("claude");

  async function typeIn(text, id) {
    field.classList.add("has"); typed.textContent = "";
    const m = text.match(/^\{\{(.+?)\}\}([\s\S]*)$/);
    if (m) { const a = document.createElement("span"); a.className = "lnk"; a.textContent = m[1]; typed.appendChild(a); await sleep(500); text = m[2]; }
    for (const ch of text) { if (id !== run) return; typed.append(ch); await sleep(ch === "\n" ? 120 : 20 + Math.random() * 28); }
    await sleep(350);
  }
  function userBubble(text) {
    const m = text.match(/^\{\{(.+?)\}\}([\s\S]*)$/);
    return el('<div class="msg u">' + (m ? '<span class="lnk">' + esc(m[1]) + "</span>" + esc(m[2]) : esc(text)) + "</div>");
  }
  function toolsBlock(sc) {
    if (host === "gpt") return el('<div class="tools"><div class="th">Ferramenta utilizada <em>⌄</em></div></div>');
    if (host === "cursor") return el('<div class="tools"></div>');
    return el('<div class="tools"><div class="th">' + SNP + ' Ferramenta utilizada <em>⌄</em></div></div>');
  }
  function toolRow(fn, arg) {
    if (host === "gpt") return el('<div class="t">' + SNP + '<span><span class="arg" style="display:block;font-size:11px">Snapp</span><code>' + fn + '</code></span><span class="st"></span></div>');
    if (host === "cursor") return el('<div class="t"><span class="arg">Called MCP tool</span><code>snapp.' + fn + '</code><span class="arg">' + esc(arg) + '</span><span class="st"></span></div>');
    return el('<div class="t">' + SNP + '<code>' + fn + '</code><span class="arg">Snapp · ' + esc(arg) + '</span><span class="st"></span></div>');
  }

  async function play(i) {
    const id = ++run; const sc = S[i];
    [...cases.children].forEach((li, k) => li.classList.toggle("on", k === i));
    document.getElementById("winTitle").textContent = sc.title; document.getElementById("recentTitle").textContent = sc.title;
    body.innerHTML = ""; typed.textContent = ""; field.classList.remove("has");
    await sleep(400); if (id !== run) return;
    await typeIn(sc.user, id); if (id !== run) return;
    send.classList.add("go"); await sleep(160); send.classList.remove("go");
    body.appendChild(userBubble(sc.user)); typed.textContent = ""; field.classList.remove("has"); scroll();
    await sleep(500); if (id !== run) return;
    const a = el('<div class="msg a"><div class="alogo">' + LOGOS.claude + "</div></div>"); body.appendChild(a);
    const th = el('<div class="think"><span class="sp"></span><span>' + HOSTS[host].thinking + '</span></div>'); a.appendChild(th); scroll();
    await sleep(900); if (id !== run) return;
    th.remove();
    const tools = toolsBlock(sc); a.appendChild(tools);
    for (const [fn, arg] of sc.tools) {
      if (id !== run) return;
      const t = toolRow(fn, arg); tools.appendChild(t); scroll(); await sleep(650 + Math.random() * 450); t.classList.add("ok");
    }
    if (host === "gpt") { tools.appendChild(el('<div class="resp">Resposta<br><code>&gt; { "success": true }</code></div>')); tools.appendChild(el('<div class="done">✓ Ação concluída</div>')); }
    tools.classList.add("ok");
    await sleep(300); if (id !== run) return;
    const p = el("<p></p>"); a.appendChild(p); const full = sc.answer; let out = "", k = 0;
    while (k < full.length) {
      if (id !== run) return;
      if (full[k] === "<") { const e = full.indexOf(">", k); out += full.slice(k, e + 1); k = e + 1; continue; }
      out += full[k++]; p.innerHTML = out; if (k % 2 === 0) { scroll(); await sleep(13); }
    }
    p.innerHTML = full;
    if (sc.card) { await sleep(250); a.appendChild(el('<div class="rc">' + sc.card + "</div>")); scroll(); }
    await sleep(4200); if (id !== run) return;
    play((i + 1) % S.length);
  }
  let cur = 0;
  cases.addEventListener("click", e => { const li = e.target.closest("li"); if (li) { cur = +li.dataset.case; play(cur); } });
  tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; applyHost(b.dataset.host); const on = [...cases.children].findIndex(l => l.classList.contains("on")); play(on < 0 ? 0 : on); });
  let started = false;
  new IntersectionObserver(es => { if (es[0].isIntersecting && !started) { started = true; play(0); } }, { threshold: 0.3 }).observe(win);
})();

/* ===== CONSTRUTOR DE E-MAIL (animação em loop) ===== */
(function () {
  "use strict";
  const flow = document.getElementById("flow"); if (!flow) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = ms => new Promise(r => setTimeout(r, reduced ? 40 : ms));
  const lanes = [...flow.querySelectorAll("[data-lane]")];
  async function runLane(lane) {
    const items = [...lane.children];
    for (const el of items) {
      if (el.classList.contains("link")) { el.classList.add("go"); await sleep(560); el.classList.add("done"); continue; }
      el.classList.add("on");
      const cnt = el.querySelector(".cnt");
      if (cnt) { const to = +cnt.dataset.to, u = cnt.dataset.unit, t0 = performance.now(); (function f(n) { const p = Math.min(1, (n - t0) / 1300); cnt.textContent = Math.round(to * p) + u; if (p < 1 && el.classList.contains("on")) requestAnimationFrame(f); })(t0); }
      await sleep(el.classList.contains("wait") ? 1500 : el.classList.contains("mail") ? 1400 : 900);
      el.classList.remove("on"); el.classList.add("done");
    }
  }
  function reset() { flow.querySelectorAll(".on,.done,.go").forEach(e => e.classList.remove("on", "done", "go")); flow.querySelectorAll(".cnt").forEach(c => c.textContent = "0" + c.dataset.unit); }
  let running = false;
  async function loop() {
    if (running) return; running = true;
    while (true) {
      reset(); await sleep(400);
      await Promise.all([runLane(lanes[0]), (async () => { await sleep(1800); if (lanes[1]) await runLane(lanes[1]); })()]);
      await sleep(2600);
    }
  }
  new IntersectionObserver(es => { if (es[0].isIntersecting) loop(); }, { threshold: 0.25 }).observe(flow);
})();

/* ===== RECURSOS: scrollytelling ===== */
(function () {
  "use strict";
  const steps = [...document.querySelectorAll(".step")]; if (!steps.length) return;
  const sets = [...document.querySelectorAll("#panel [data-i]")];
  function go(i) {
    steps.forEach((s, k) => s.classList.toggle("on", k === i));
    sets.forEach(e => e.classList.toggle("on", +e.dataset.i === i));
  }
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) go(+e.target.dataset.step); });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  steps.forEach(s => io.observe(s));
  document.getElementById("pdots")?.addEventListener("click", e => {
    const i = e.target.dataset.i; if (i !== undefined) steps[+i].scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();


/* ===== MODELOS DE CHECKOUT: celular com troca ===== */
(function () {
  "use strict";
  const root = document.getElementById("shots"); if (!root) return;
  const tabs = document.getElementById("shotTabs"), imgs = [...root.querySelectorAll(".pview img")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let k = 0, timer = null;
  const keys = [...tabs.children].map(b => b.dataset.k);
  function show(i) { k = i; const key = keys[i]; imgs.forEach(im => im.classList.toggle("on", im.dataset.k === key)); [...tabs.children].forEach((b, n) => b.classList.toggle("on", n === i)); }
  function auto() { clearInterval(timer); if (!reduced) timer = setInterval(() => show((k + 1) % keys.length), 4500); }
  tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (!b || b.disabled) return; show([...tabs.children].indexOf(b)); auto(); });
  new IntersectionObserver(es => { if (es[0].isIntersecting) auto(); else clearInterval(timer); }, { threshold: 0.3 }).observe(root);
})();


/* ===== MARQUEE sem buraco: clona até cobrir 2x e anima pela largura medida ===== */
(function () {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".track").forEach(track => {
    const items = [...track.children]; const half = items.length / 2;
    // o HTML já vem com o conjunto duplicado; manter só um conjunto e clonar sob medida
    items.slice(half).forEach(e => e.remove());
    const set = [...track.children];
    function build() {
      [...track.children].slice(set.length).forEach(e => e.remove());
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const setW = set.reduce((a, e) => a + e.getBoundingClientRect().width, 0) + gap * set.length;
      const need = Math.ceil((track.parentElement.clientWidth * 2) / setW) + 1;
      for (let i = 1; i < need; i++) set.forEach(e => track.appendChild(e.cloneNode(true)));
      const rev = track.classList.contains("rev"); const dur = Math.max(18, setW / (rev ? 28 : 40)) * 1000;
      track.getAnimations().forEach(a => a.cancel());
      if (reduced) return;
      track.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + (-setW) + "px)" }], { duration: dur, iterations: Infinity, easing: "linear", direction: rev ? "reverse" : "normal" });
    }
    const imgs = [...track.querySelectorAll("img")];
    Promise.all(imgs.map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }))).then(build);
    addEventListener("resize", build);
    track.addEventListener("pointerenter", () => track.getAnimations().forEach(a => a.pause()));
    track.addEventListener("pointerleave", () => track.getAnimations().forEach(a => a.play()));
  });
})();
