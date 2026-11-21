// Origem do cadastro: guarda o 1º e o último toque (UTMs, click id, domínio de quem
// mandou para cá, página de entrada) por 90 dias e repassa ao painel no parâmetro
// `snapp_attr` dos links de cadastro/login. O painel (admin/src/lib/signupAttribution.ts)
// manda isso no cadastro e o backend valida e classifica o canal.
(function () {
  var KEY = "snapp_signup_attr";
  var WINDOW = 90 * 24 * 60 * 60 * 1000;
  var UTM = ["source", "medium", "campaign", "content", "term"];
  var CLICK_IDS = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid", "ttclid"];
  var now = Date.now();
  var stored = null;
  try {
    stored = JSON.parse(localStorage.getItem(KEY) || "null");
  } catch (e) {}
  if (!stored || !stored.f || !(stored.exp > now)) stored = null;

  var params = new URLSearchParams(location.search);
  var touch = { landingPath: location.pathname, at: new Date(now).toISOString() };
  UTM.forEach(function (k) {
    var v = params.get("utm_" + k);
    if (v) touch[k] = v.slice(0, 150);
  });
  for (var i = 0; i < CLICK_IDS.length; i++) if (params.get(CLICK_IDS[i])) { touch.clickId = CLICK_IDS[i]; break; }
  try {
    var host = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : "";
    if (host && !/(^|\.)snappcheckout\.com$/.test(host)) touch.referrerHost = host;
  } catch (e) {}

  var bare = function (t) { return !t.source && !t.medium && !t.clickId && !t.referrerHost; };
  // Navegação interna / volta direta não apaga a origem (mesma regra do GA);
  // um 1º toque direto é trocado pelo primeiro que diz de onde veio.
  if (!stored) stored = { f: touch, l: touch, exp: now + WINDOW };
  else if (!bare(touch)) {
    if (bare(stored.f)) stored.f = touch;
    stored.l = touch;
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(stored));
  } catch (e) {}

  var payload = JSON.stringify({ f: stored.f, l: stored.l });
  function decorate(event) {
    var a = event.target && event.target.closest && event.target.closest('a[href*="admin.snappcheckout.com"]');
    if (!a) return;
    try {
      var url = new URL(a.href);
      url.searchParams.set("snapp_attr", payload);
      a.href = url.toString();
    } catch (e) {}
  }
  // Delegado e na hora do clique: cobre links trocados pelo i18n e abrir em nova aba.
  document.addEventListener("click", decorate, true);
  document.addEventListener("auxclick", decorate, true);
  document.addEventListener("contextmenu", decorate, true);
})();
