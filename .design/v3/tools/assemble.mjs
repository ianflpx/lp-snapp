// Monta v3/index.html, v3/style.css e v3/app.js a partir da base do lead (.design/v3/base/) e das partes
// dos builders (.design/v3/parts/). Uso: node .design/v3/tools/assemble.mjs
// Ferramenta de trabalho: o que vai ao ar são só os três arquivos gerados em v3/ (HTML, CSS e JS puros, sem build).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8").trim() : "");
const part = (name, ext) => read(`.design/v3/parts/${name}.${ext}`);

// ordem por importância (rodada de 27/11): mundo, ticket na compra, IA, pós-venda e teste, upsell
const BANNERS = ["13-banner-mapa", "11-banner-bump", "14-banner-assinaturas", "16-banner-ia", "15-banner-email", "12-banner-ab", "10-banner-upsell"];
const BEFORE = ["01-hero"];
const AFTER = ["20-por-que", "21-numeros", "22-integracoes", "23-preco", "24-explore", "25-faq", "26-cta"];
const ALL = [...BEFORE, ...BANNERS, ...AFTER];

const missing = ALL.filter((n) => !part(n, "html"));
if (missing.length) { console.error("partes sem HTML:", missing.join(", ")); process.exit(1); }

const bento = `<section class="section wrap" id="recursos">
  <div class="sec-head">
    <h2 class="t-h2" data-reveal>O que já vem dentro do checkout</h2>
    <p class="t-lead" data-reveal>São sete ferramentas, para vender mais na mesma visita e cuidar do que acontece depois da compra.</p>
  </div>
  <div class="bento">
${BANNERS.map((n) => part(n, "html")).join("\n\n")}
  </div>
</section>`;

const html = [...BEFORE.map((n) => part(n, "html")), bento, ...AFTER.map((n) => part(n, "html"))].join("\n\n");
const shell = read(".design/v3/base/index.html");
if (!shell.includes("<!-- PARTS -->")) { console.error("base/index.html sem o marcador <!-- PARTS -->"); process.exit(1); }

const css = [read(".design/v3/base/style.css"), ...ALL.filter((n) => part(n, "css")).map((n) => `/* ═════════ ${n} ═════════ */\n${part(n, "css")}`)].join("\n\n");
const js = [read(".design/v3/base/app.js"), ...ALL.filter((n) => part(n, "js")).map((n) => `/* ═════════ ${n} ═════════ */\n${part(n, "js")}`)].join("\n\n");

writeFileSync(join(ROOT, "v3/index.html"), shell.replace("<!-- PARTS -->", () => html) + "\n");
writeFileSync(join(ROOT, "v3/style.css"), css + "\n");
writeFileSync(join(ROOT, "v3/app.js"), js + "\n");
const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + " KB";
console.log("v3/index.html", kb(shell.replace("<!-- PARTS -->", () => html)), "· v3/style.css", kb(css), "· v3/app.js", kb(js));
