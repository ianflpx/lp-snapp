/* ===== GLOBO REAL (d3-geo + países do world-atlas 110m) ===== */
(function () {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HUBS = { // lon, lat, bandeira
    sp: [-46.6, -23.5, "br"], ny: [-74, 40.7, "us"], la: [-118.2, 34, "us"],
    lon: [-0.1, 51.5, "gb"], par: [2.3, 48.9, "fr"], ber: [13.4, 52.5, "de"],
    mad: [-3.7, 40.4, "es"], rom: [12.5, 41.9, "it"], mex: [-99.1, 19.4, "mx"],
    tok: [139.7, 35.7, "jp"], syd: [151.2, -33.9, "au"], dub: [55.3, 25.2, "ae"],
    jnb: [28, -26.2, "za"], tor: [-79.4, 43.7, "ca"], bue: [-58.4, -34.6, "ar"],
    lis: [-9.1, 38.7, "pt"], ams: [4.9, 52.4, "nl"]
  };
  // v4: mais cidades para o globo de vendas (o do hero segue com os HUBS), só de países com bandeira em /v4/images/flags
  const NET_HUBS = Object.assign({}, HUBS, {
    chi: [-87.6, 41.9, "us"], mia: [-80.2, 25.8, "us"], sea: [-122.3, 47.6, "us"],
    aus: [-97.7, 30.3, "us"], van: [-123.1, 49.3, "ca"], mtl: [-73.6, 45.5, "ca"],
    man: [-2.2, 53.5, "gb"], edi: [-3.2, 55.9, "gb"], mun: [11.6, 48.1, "de"],
    ham: [10, 53.6, "de"], lyo: [4.8, 45.8, "fr"], bcn: [2.2, 41.4, "es"],
    mil: [9.2, 45.5, "it"], opo: [-8.6, 41.2, "pt"], osa: [135.5, 34.7, "jp"],
    gdl: [-103.3, 20.7, "mx"], auh: [54.4, 24.5, "ae"], rio: [-43.2, -22.9, "br"],
    rec: [-34.9, -8.1, "br"], mao: [-60, -3.1, "br"], bog: [-74.1, 4.7, "co"], scl: [-70.7, -33.5, "cl"],
    osl: [10.8, 59.9, "no"], waw: [21, 52.2, "pl"], abv: [7.5, 9.1, "ng"],
    nbo: [36.8, -1.3, "ke"], del: [77.2, 28.6, "in"], sel: [127, 37.6, "kr"],
    jkt: [106.8, -6.2, "id"], per: [115.9, -31.9, "au"], akl: [174.8, -36.9, "nz"],
    lim: [-77, -12, "pe"], mvd: [-56.2, -34.9, "uy"], asu: [-57.6, -25.3, "py"], uio: [-78.5, -0.2, "ec"],
    sjo: [-84.1, 9.9, "cr"], cai: [31.2, 30, "eg"], cas: [-7.6, 33.6, "ma"], acc: [-0.2, 5.6, "gh"],
    ist: [29, 41, "tr"], ruh: [46.7, 24.7, "sa"], sto: [18.1, 59.3, "se"], zrh: [8.5, 47.4, "ch"],
    dub2: [-6.3, 53.3, "ie"], bru: [4.4, 50.8, "be"], vie: [16.4, 48.2, "at"], ath: [23.7, 38, "gr"],
    mnl: [121, 14.6, "ph"], bkk: [100.5, 13.8, "th"], sin: [103.8, 1.35, "sg"], kul: [101.7, 3.1, "my"]
  });
  // Pontos entre a Europa e a Ásia mantêm rastros no recorte inicial do hero no celular.
  const ROUTE_POINTS = Object.values(HUBS).concat([
    [37.6, 55.8], [44.8, 41.7], [51.4, 35.7], [69.2, 41.3],
    [71.4, 51.2], [76.9, 43.2], [77.2, 28.6], [106.9, 47.9]
  ]);

  // Um download do mapa para os dois globos. Cada país traz o centro (c) e o raio em radianos (r) para o frame pular
  // os que estão inteiros atrás do globo: o desenho fica igual e o custo por frame cai pela metade. O JSON já vem
  // com c/r calculados; o cálculo aqui só roda se um mapa novo vier sem eles.
  let worldP = null;
  function loadWorld() {
    return worldP || (worldP = fetch("/v4/images/world-countries.json").then(r => r.json()).then(j => {
      j.features.forEach(f => {
        if (f.c) return;
        const c = d3.geoCentroid(f); let r = 0;
        (function walk(a) { if (typeof a[0] === "number") r = Math.max(r, d3.geoDistance(c, a)); else a.forEach(walk); })(f.geometry.coordinates);
        f.c = c; f.r = r + 0.05;
      });
      return j;
    }));
  }

  function globe(canvas, opts) {
    if (!canvas || !window.d3) return;
    const ctx = canvas.getContext("2d");
    const HB = opts.network ? NET_HUBS : HUBS, KS = Object.keys(HB);
    let W, H, R, dpr, world = null;
    const proj = d3.geoOrthographic().clipAngle(90);
    const path = d3.geoPath(proj, ctx);
    const gridStep = opts.network ? 15 : 12;
    const grat = d3.geoGraticule().step([gridStep, gridStep])();
    const arcs = [];
    // no modo rede os arcos nascem no frame(), entre cidades que estão na parte visível
    if (!opts.network) for (let i = 0; i < (opts.arcs || 8); i++) arcs.push(newArc(Math.random()));
    function newArc(t) {
      const a = Math.floor(Math.random() * ROUTE_POINTS.length);
      const b = (a + 1 + Math.floor(Math.random() * (ROUTE_POINTS.length - 1))) % ROUTE_POINTS.length;
      return { ip: d3.geoInterpolate(ROUTE_POINTS[a], ROUTE_POINTS[b]), t, s: 0.0028 + Math.random() * 0.0022 };
    }
    // corpo, grade e países ficam num canvas fora da tela, redesenhado só quando o giro anda ~0,75px (ver frame)
    const bg = document.createElement("canvas"), bctx = bg.getContext("2d"), bpath = d3.geoPath(proj, bctx);
    let bgA = NaN, bgL = 0, bgWorld = false;
    function size(w, h) {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = w; H = h;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg.width = canvas.width; bg.height = canvas.height; bctx.setTransform(dpr, 0, 0, dpr, 0, 0); bgA = NaN;
      R = opts.rh ? H * opts.rh : Math.min(W, H) * (opts.radius || 0.45);
      proj.translate([W * (opts.cx || 0.5), H * (opts.cy || 0.5)]).scale(R);
    }
    // Mede pelo ResizeObserver: sem layout forçado no carregamento e sem recriar o canvas a cada "resize" do
    // celular (a barra de endereço some e volta durante a rolagem). Até a primeira medida o frame não desenha.
    new ResizeObserver(es => { const b = es[0].contentRect; if (b.width && (b.width !== W || b.height !== H)) size(b.width, b.height); }).observe(canvas);
    // rede: cada cidade ligada às duas mais próximas (traço fino de fundo)
    const LINKS = [];
    if (opts.network) KS.forEach(a => {
      KS.filter(b => b !== a).map(b => [b, d3.geoDistance(HB[a], HB[b])]).sort((x, y) => x[1] - y[1]).slice(0, 2)
        .forEach(([b]) => { if (!LINKS.some(l => l[0] === HB[b] && l[1] === HB[a])) LINKS.push([HB[a], HB[b]]); });
    });
    // O ponto precisa deixar espaço para o cartão acima dele, dentro do recorte e da tela.
    let cr = null, pr = null;
    function salePoint(ll, center) {
      if (d3.geoDistance(ll, center) > Math.PI / 2 - 0.15) return null;
      const p = proj(ll);
      const x = p[0] + cr.left - pr.left, y = p[1] + cr.top - pr.top;
      if (x < 24 || x > pr.width - 24 || y < 52 || y > pr.height * 0.57) return null;
      if (y + pr.top < 100 || y + pr.top > innerHeight - 8) return null;
      const cardX = Math.max(75, Math.min(pr.width - 75, x));
      return [cardX, y, x - cardX];
    }
    function netArc(center) {
      const vis = KS.filter(k => salePoint(HB[k], center));
      if (vis.length < 2) return null;
      const a = vis[Math.floor(Math.random() * vis.length)];
      const far = vis.filter(b => { const d = d3.geoDistance(HB[a], HB[b]); return b !== a && d > 0.15 && d < 1.4 && !sales.some(s => s.k === b); });
      if (!far.length) return null;
      const b = far[Math.floor(Math.random() * far.length)], d = d3.geoDistance(HB[a], HB[b]);
      // velocidade pela distância: o ponto anda sempre no mesmo ritmo
      return { a: HB[a], b: HB[b], to: b, ip: d3.geoInterpolate(HB[a], HB[b]), t: 0, s: (0.009 + Math.random() * 0.003) / Math.max(0.4, d) };
    }
    let lastArc = 0;
    loadWorld().then(j => { world = j; });

    let lon = opts.lon || -30, mx = 0, tmx = 0, visible = true, sx = 0, tsx = 0, tilt = 0, targetTilt = 0, dragOffset = 0;
    const lat = opts.lat || -22;
    // seção presa (sticky) por PIN px de scroll: nesse trecho o scroll gira o globo ~155° (da Ásia às Américas) antes da página seguir
    const sec = opts.scroll && !reduced && canvas.closest(".world"), pin = sec && sec.parentElement;
    let PIN = 0, stickyTop = 0, globeEntry = 0;
    function turnOnScroll() {
      const top = pin.getBoundingClientRect().top;
      const approach = Math.max(0, globeEntry - Math.max(top, stickyTop));
      const pinned = Math.min(PIN, Math.max(0, stickyTop - top));
      tsx = approach * 0.06 + pinned * 155 / PIN + dragOffset;
      // No meio do giro o recorte sobe um pouco: Europa, norte da África e Oriente Médio juntos na frente.
      targetTilt = -14 * Math.sin(pinned / PIN * Math.PI * 0.85);
    }
    function pinSize() {
      PIN = innerHeight * 0.9;
      const h = sec.offsetHeight;
      stickyTop = Math.min(0, innerHeight - h);
      globeEntry = innerHeight - canvas.parentElement.offsetTop;
      pin.style.height = h + PIN + "px";
      sec.style.top = stickyTop + "px";
      turnOnScroll();
    }
    if (pin && pin.classList.contains("world-pin")) {
      pinSize();
      addEventListener("resize", pinSize);
      addEventListener("load", pinSize);
      addEventListener("scroll", turnOnScroll, { passive: true });
    }
    let dragging = false, lx = 0;
    if (opts.drag) {
      canvas.addEventListener("pointerdown", e => { dragging = true; lx = e.clientX; canvas.setPointerCapture(e.pointerId); });
      canvas.addEventListener("pointermove", e => {
        if (!dragging) return;
        const delta = (e.clientX - lx) * 0.35;
        dragOffset += delta; tsx += delta; sx = tsx; lx = e.clientX;
      });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => canvas.addEventListener(ev, () => { dragging = false; }));
    }
    /* vendas: chips DOM presos ao ponto do país */
    const sales = [], cards = [], countries = new Map();
    const regionNames = opts.salesEl && new Intl.DisplayNames(["pt-BR"], { type: "region" });
    let lastSpawn = -Infinity, lastAttempt = -Infinity, prevAngle = null, prevNow = 0;
    const lastSale = {}, entered = {}; // por país: última venda e quando entrou na parte visível
    function hasRoom(p) {
      return p && cards.length < (innerWidth <= 720 ? 2 : 3)
        && !cards.some(q => Math.abs(q[0] - p[0]) < 146 && Math.abs(q[1] - p[1]) < 38);
    }
    function spawn(now, center, only, card) {
      if (!world) return false;
      const candidates = [];
      for (const k of only ? [only] : KS) {
        const ll = HB[k];
        const p = salePoint(ll, center);
        if (!p || sales.some(s => s.ll[2] === ll[2])) continue;
        // A chegada do arco só acende o país; cartão "Venda aprovada" só no ritmo das vendas, para não piscar demais.
        const showCard = (!only || card) && hasRoom(p);
        if (showCard || only) candidates.push({ ll, p, showCard });
      }
      if (!candidates.length) return false;
      // embaralha e ordena (sort é estável): quem acabou de aparecer primeiro, depois quem vendeu há mais tempo
      const fresh = c => (lastSale[c.ll[2]] || 0) < (entered[c.ll[2]] || 0);
      candidates.sort(() => Math.random() - 0.5).sort((a, b) => (fresh(b) - fresh(a)) || ((lastSale[a.ll[2]] || 0) - (lastSale[b.ll[2]] || 0)));
      const { ll, p, showCard } = candidates[0];
      const code = ll[2];
      if (showCard) lastSale[code] = now;
      if (!countries.has(code)) {
        // A costa simplificada pode deixar cidades litorâneas fora do polígono.
        const locations = KS.map(k => HB[k]).filter(h => h[2] === code);
        countries.set(code, world.features.find(f => locations.some(h => d3.geoContains(f, h))));
      }
      let el = null;
      if (showCard) {
        el = document.createElement("div"); el.className = "sale";
        el.innerHTML = '<img src="/v4/images/flags/' + code + '.png" alt=""><span>Venda aprovada</span><i></i>';
        el.firstElementChild.alt = regionNames.of(code.toUpperCase());
        opts.salesEl.appendChild(el);
        cards.push(p);
      }
      sales.push({ ll, el, t0: now, country: countries.get(code) });
      return showCard;
    }
    if (opts.mouse) addEventListener("pointermove", e => { tmx = (e.clientX / innerWidth - 0.5); });
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(canvas);

    function frame() {
      requestAnimationFrame(frame);
      if (!visible || !W) return;
      mx += (tmx - mx) * 0.04; sx += (tsx - sx) * 0.08;
      tilt += (targetTilt - tilt) * 0.08;
      if (!reduced && !dragging) {
        // no globo de vendas o Pacífico vazio passa 4x mais rápido, para ficar o máximo de tempo com continente na frente
        const front = ((-(lon + mx * 40 + sx) + 160) % 360 + 540) % 360 - 180; // 0 = meio do Pacífico
        lon += (opts.speed || 0.07) * (opts.network ? 1 + 3 * Math.max(0, 1 - Math.abs(front) / 50) : 1);
      }
      const angle = lon + mx * 40 + sx;
      const latitude = lat + tilt;
      const center = [-angle, -latitude];
      proj.rotate([angle, latitude]);
      const now = performance.now();
      if (opts.salesEl) { cr = canvas.getBoundingClientRect(); pr = opts.salesEl.getBoundingClientRect(); }
      ctx.clearRect(0, 0, W, H);
      const CX = W * (opts.cx || 0.5), CY = H * (opts.cy || 0.5);
      // A camada de fundo é o grosso do custo do frame e anda devagar: só redesenha quando o giro move ~0,75px.
      // Arcos, pontos e vendas continuam a cada frame, por cima.
      const still = 0.75 / R * 180 / Math.PI;
      if (!(Math.abs(angle - bgA) < still && Math.abs(latitude - bgL) < still && bgWorld === !!world)) {
        bgA = angle; bgL = latitude; bgWorld = !!world;
        bctx.clearRect(0, 0, W, H); bctx.globalAlpha = opts.dim || 1;

        /* corpo */
        const g = bctx.createRadialGradient(CX - R * 0.35, CY - R * 0.4, R * 0.05, CX, CY, R);
        g.addColorStop(0, "#2a2a2e"); g.addColorStop(0.55, "#131315"); g.addColorStop(1, "#050505");
        bctx.beginPath(); bctx.arc(CX, CY, R, 0, Math.PI * 2); bctx.fillStyle = g; bctx.fill();

        /* graticule */
        bctx.beginPath(); bpath(grat); bctx.strokeStyle = "rgba(255,255,255,.045)"; bctx.lineWidth = 0.7; bctx.stroke();

        /* países */
        if (world) {
          bctx.beginPath();
          for (const f of world.features) if (d3.geoDistance(f.c, center) - f.r < Math.PI / 2) bpath(f);
          const lf = bctx.createLinearGradient(W / 2 - R, H / 2 - R, W / 2 + R, H / 2 + R);
          lf.addColorStop(0, "rgba(235,235,240,.22)"); lf.addColorStop(1, "rgba(235,235,240,.08)");
          bctx.fillStyle = lf; bctx.fill();
          bctx.strokeStyle = "rgba(255,255,255,.28)"; bctx.lineWidth = 0.6; bctx.stroke();
        }
      }
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.drawImage(bg, 0, 0); ctx.restore();
      ctx.globalAlpha = opts.dim || 1;
      /* vendas ativas: país aceso + onda + chip */
      if (opts.salesEl) {
        cards.length = 0;
        for (let i = sales.length - 1; i >= 0; i--) {
          const s = sales[i], age = reduced ? 150 : now - s.t0, life = s.el ? 2400 : 1000;
          if (age > life + 250) { if (s.el) s.el.remove(); sales.splice(i, 1); continue; }
          const k = Math.min(1, age / 130, (life + 250 - age) / 250);
          if (s.country) { ctx.beginPath(); path(s.country); ctx.fillStyle = "rgba(254,210,23," + (0.66 * k) + ")"; ctx.fill(); }
          const vis = d3.geoDistance(s.ll, center) < Math.PI / 2 - 0.08;
          const p = proj(s.ll);
          if (vis && p) {
            const rr = (age % 1200) / 1200;
            ctx.beginPath(); ctx.arc(p[0], p[1], 4 + rr * 26, 0, Math.PI * 2); ctx.strokeStyle = "rgba(254,210,23," + ((1 - rr) * 0.7 * k) + ")"; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.shadowColor = "#fed217"; ctx.shadowBlur = 16; ctx.fill(); ctx.shadowBlur = 0;
          }
          if (s.el) {
            const point = salePoint(s.ll, center);
            const show = hasRoom(point);
            s.el.style.visibility = show ? "visible" : "hidden";
            if (!show) {
              if (reduced) { s.el.remove(); sales.splice(i, 1); }
              continue;
            }
            cards.push(point);
            s.el.style.left = point[0] + "px";
            s.el.style.top = point[1] + "px";
            s.el.style.setProperty("--sale-pin-x", point[2] + "px");
            s.el.style.opacity = k;
          }
        }
        const seen = new Set();
        for (const k of KS) if (salePoint(HB[k], center)) seen.add(HB[k][2]);
        for (const c in entered) if (!seen.has(c)) delete entered[c];
        let hasFresh = false;
        seen.forEach(c => {
          if (!entered[c]) entered[c] = now;
          if ((lastSale[c] || 0) < entered[c] && !sales.some(s => s.ll[2] === c)) hasFresh = true;
        });
        // giro rápido (scroll forte ou arrasto): todo país que passa na frente vende na hora, com cartão se couber
        const spin = prevAngle === null ? 0 : Math.abs(angle - prevAngle) / Math.max(1, now - prevNow) * 16.7;
        prevAngle = angle; prevNow = now;
        if (!reduced && spin > 0.6) for (const k of KS) {
          if (salePoint(HB[k], center) && !sales.some(s => s.ll[2] === HB[k][2]) && spawn(now, center, k, true)) lastSpawn = now;
        }
        // menos vendas por vez, mas país que acabou de girar para a frente não espera o ritmo normal
        if (now - lastAttempt >= 100 && (reduced ? !sales.length : now - lastSpawn >= (hasFresh ? 700 : 1800))) {
          lastAttempt = now;
          if (spawn(now, center)) lastSpawn = now;
        }
      }

      /* rede de fundo */
      if (opts.network) {
        ctx.beginPath(); LINKS.forEach(l => path({ type: "LineString", coordinates: l }));
        ctx.strokeStyle = "rgba(254,210,23,.2)"; ctx.lineWidth = 0.8; ctx.stroke();
        if (!reduced && arcs.length < (opts.arcs || 8) && now - lastArc > 1500) {
          lastArc = now; const n = netArc(center); if (n) arcs.push(n);
        }
      }
      /* arcos */
      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i]; if (!reduced) a.t += a.s;
        // a venda aparece onde o arco chega
        if (a.to && !a.hit && a.t >= 1) { a.hit = true; spawn(now, center, a.to); }
        if (a.t > 1.35) { if (opts.network) { arcs.splice(i, 1); continue; } arcs[i] = newArc(-0.3); }
        const from = Math.max(0, a.t - 0.35), to = Math.min(1, a.t);
        if (to > 0 && from < 1) {
          const pts = []; const n = 40;
          for (let k = 0; k <= n; k++) pts.push(a.ip(from + (to - from) * k / n));
          ctx.beginPath(); path({ type: "LineString", coordinates: pts });
          ctx.strokeStyle = opts.network ? "rgba(254,210,23,.85)" : "rgba(254,210,23,.78)";
          ctx.lineWidth = opts.network ? 1.4 : 1.2; ctx.stroke();
          if (!opts.network) continue;
          const head = a.ip(to); const p = proj(head);
          if (p && d3.geoDistance(head, center) < Math.PI / 2) {
            ctx.fillStyle = "#fed217"; ctx.shadowColor = "#fed217"; ctx.shadowBlur = 14;
            ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
          }
        }
      }
      /* hubs */
      const pulse = reduced ? 0 : Math.sin(now / 500) * 1.5;
      for (const k of KS) {
        const h = HB[k]; if (d3.geoDistance(h, center) > Math.PI / 2 - 0.05) continue;
        const p = proj(h);
        ctx.fillStyle = "rgba(254,210,23,.95)"; ctx.beginPath(); ctx.arc(p[0], p[1], 2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(254,210,23,.3)"; ctx.beginPath(); ctx.arc(p[0], p[1], 6 + pulse, 0, Math.PI * 2); ctx.stroke();
      }
      /* luz de borda */
      ctx.globalAlpha = opts.dim || 1;
      const rim = ctx.createRadialGradient(CX, CY, R * 0.86, CX, CY, R);
      rim.addColorStop(0, "rgba(0,0,0,0)"); rim.addColorStop(1, opts.dim ? "rgba(254,210,23,.07)" : "rgba(254,210,23,.16)");
      ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = opts.dim ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.1)"; ctx.lineWidth = 1; ctx.stroke();
    }
    frame();
  }
  globe(document.getElementById("horizon"), { rh: 1.05, cx: 0.5, cy: 1.42, dim: 0.42, speed: 0.025, lat: -8, lon: -70, arcs: 12, mouse: true });
  // o globo de vendas fica bem abaixo da dobra: inicia na tarefa seguinte para não somar com o do hero
  setTimeout(() => globe(document.getElementById("globe2"), { radius: 0.47, lat: 22, lon: -145, arcs: 4, speed: 0.045, scroll: true, salesEl: document.getElementById("sales"), drag: true, network: true }));
})();
/* ===== MARQUEE sem buraco: clona até cobrir 2x e anima pela largura medida ===== */
(function () {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll(".integ4 .track").forEach(track => {
    const wrap = track.parentElement;
    const set = [...track.children];
    function build() {
      track.getAnimations().forEach(a => a.cancel());
      [...track.children].slice(set.length).forEach(e => e.remove());
      wrap.classList.toggle("is-animated", !reduced.matches);
      if (reduced.matches) return;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const setW = set.reduce((a, e) => a + parseFloat(getComputedStyle(e).width), 0) + gap * set.length;
      const need = Math.ceil((wrap.clientWidth * 2) / setW) + 1;
      for (let i = 1; i < need; i++) {
        set.forEach(item => {
          const clone = item.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          track.appendChild(clone);
        });
      }
      const rev = track.classList.contains("rev"); const dur = Math.max(12, setW / 60) * 1000;
      track.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + (-setW) + "px)" }], { duration: dur, iterations: Infinity, easing: "linear", direction: rev ? "reverse" : "normal" });
    }
    document.fonts.ready.then(build);
    reduced.addEventListener("change", build);
    addEventListener("resize", build);
    track.addEventListener("pointerenter", () => track.getAnimations().forEach(a => a.pause()));
    track.addEventListener("pointerleave", () => track.getAnimations().forEach(a => a.play()));
  });
})();
