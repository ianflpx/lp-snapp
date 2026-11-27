// Captura e inspeção com um Chromium próprio (headless), para vários agentes não disputarem o mesmo navegador.
// Uso (sempre pelo wrapper, que serializa com lockf):
//   .design/v3/tools/shot.sh --url "http://127.0.0.1:8123/.design/v3/preview.html?p=01-hero" --w 1440 --out .design/v3/shots/b1-hero-1440.png
// Opções:
//   --w 1440 --h 900     viewport
//   --out arquivo.png    onde salvar (obrigatório, dentro de .design/v3/shots/)
//   --sel ".classe"      captura só esse elemento (senão, o viewport)
//   --full               página inteira (rola antes para disparar os reveals)
//   --scroll ".classe"   rola até o elemento antes de capturar o viewport
//   --hover ".classe"    passa o mouse antes de capturar   --click ".classe"  clica antes de capturar
//   --wait 800           ms de espera depois de carregar/rolar (padrão 800)
//   --nav                mantém o nav fixo na captura de elemento (por padrão ele some)
//   --reduced            emula prefers-reduced-motion: reduce
//   --eval "expressão"   avalia no contexto da página e imprime o JSON do resultado
// Sempre imprime: erros de console, erros de página, requisições que falharam e se há scroll horizontal.
import { createRequire } from "node:module";
import { readdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const k = process.argv[i].replace(/^--/, "");
  const next = process.argv[i + 1];
  args[k] = next === undefined || next.startsWith("--") ? true : (i++, next);
}
if (!args.url || !args.out) { console.error("faltou --url ou --out"); process.exit(2); }

const require = createRequire(import.meta.url);
const npx = join(homedir(), ".npm/_npx");
let chromium;
for (const dir of existsSync(npx) ? readdirSync(npx) : []) {
  const p = join(npx, dir, "node_modules/playwright-core");
  if (!existsSync(p)) continue;
  try {
    const pw = require(p);
    const b = await pw.chromium.launch();
    await b.close();
    chromium = pw.chromium;
    break;
  } catch {}
}
if (!chromium) { console.error("playwright-core com Chromium instalado não encontrado em ~/.npm/_npx"); process.exit(3); }

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: +(args.w || 1440), height: +(args.h || 900) },
  reducedMotion: args.reduced ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
const problems = [];
page.on("console", (m) => { if (m.type() === "error") problems.push("console: " + m.text()); });
page.on("pageerror", (e) => problems.push("pageerror: " + e.message));
page.on("requestfailed", (r) => problems.push("falhou: " + r.url()));
page.on("response", (r) => { if (r.status() >= 400) problems.push(r.status() + ": " + r.url()); });

const wait = +(args.wait || 800);
await page.goto(args.url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
if (args.full) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    scrollTo(0, 0);
  });
}
// captura de elemento sai sem o nav fixo por cima (use --nav para manter)
if (args.sel && !args.nav) await page.addStyleTag({ content: ".nav{visibility:hidden}" });
if (args.scroll) await page.locator(args.scroll).first().scrollIntoViewIfNeeded();
if (args.sel) await page.locator(args.sel).first().scrollIntoViewIfNeeded();
if (args.click) await page.locator(args.click).first().click();
if (args.hover) await page.locator(args.hover).first().hover();
await page.waitForTimeout(wait);

if (args.sel) await page.locator(args.sel).first().screenshot({ path: args.out });
else await page.screenshot({ path: args.out, fullPage: !!args.full });

const overflow = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth }));
console.log("salvo:", args.out);
console.log("scroll horizontal:", overflow.scrollWidth > overflow.innerWidth ? "SIM " + JSON.stringify(overflow) : "não");
if (args.eval) console.log("eval:", JSON.stringify(await page.evaluate(args.eval)));
console.log(problems.length ? "PROBLEMAS:\n" + [...new Set(problems)].join("\n") : "console: sem erros");
await browser.close();
