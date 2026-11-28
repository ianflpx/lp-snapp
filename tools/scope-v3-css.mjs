// Gera /v4/v3.css: o CSS da /v3 preso a .v3x, para os blocos da v3 conviverem com o CSS do root na /v4.
// Uso: node tools/scope-v3-css.mjs   (rode de novo sempre que v3/style.css mudar)
import { readFileSync, writeFileSync } from "node:fs";

const SCOPE = ".v3x";
// partes da v3 que a /v4 não usa (a v4 fica com o hero, as integrações e o FAQ do root)
const DROP = ["01-hero", "21-numeros", "22-integracoes", "25-faq"];

let css = readFileSync(new URL("../v3/style.css", import.meta.url), "utf8");
for (const name of DROP) {
  const re = new RegExp(`/\\* ═════════ ${name} ═════════ \\*/[\\s\\S]*?(?=/\\* ═════════ |$)`);
  if (!re.test(css)) throw new Error(`parte ${name} não encontrada em v3/style.css`);
  css = css.replace(re, "");
}
css = css.replace(/\/\*[\s\S]*?\*\//g, "");

// separa por vírgula fora de parênteses
function splitList(s) {
  const out = []; let depth = 0, cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out.map(x => x.trim()).filter(Boolean);
}

// :root/html/body viram o próprio escopo; .js-motion (posto no <html>) fica antes dele
function scope(sel) {
  if (/^(:root|html|body)$/.test(sel)) return SCOPE;
  let m = sel.match(/^(html[^\s]*|\.js-motion)\s+(.+)$/); // html.x y / .js-motion y → html.x .v3x y
  if (m) return `${m[1]} ${SCOPE} ${m[2]}`;
  m = sel.match(/^body\s+(.+)$/);
  if (m) return `${SCOPE} ${m[1]}`;
  if (/^(html|body|:root)/.test(sel)) throw new Error("seletor de raiz não previsto: " + sel);
  return `${SCOPE} ${sel}`;
}

function walk(src) {
  let out = "", i = 0;
  while (i < src.length) {
    const open = src.indexOf("{", i), semi = src.indexOf(";", i);
    if (open === -1) break;
    if (semi !== -1 && semi < open) { out += src.slice(i, semi + 1).trim() + "\n"; i = semi + 1; continue; }
    const prelude = src.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (depth && j < src.length) { if (src[j] === "{") depth++; else if (src[j] === "}") depth--; j++; }
    const body = src.slice(open + 1, j - 1);
    if (/^@(media|supports|container|layer)/.test(prelude)) out += `${prelude} {\n${walk(body)}}\n`;
    else if (prelude.startsWith("@")) out += `${prelude} {${body}}\n`;
    else out += `${splitList(prelude).map(scope).join(", ")} {${body.trim()}}\n`;
    i = j;
  }
  return out;
}

// as @font-face das fontes self-hosted (/fonts) moram só no v4/v3.css: carrega do arquivo atual para não perder
const fonts = (readFileSync(new URL("../v4/v3.css", import.meta.url), "utf8").match(/\/\* Fontes servidas[\s\S]*?\*\/\n(?:@font-face\{[^}]*\}\n)+/) || [""])[0];
const result = `/* GERADO por tools/scope-v3-css.mjs a partir de v3/style.css. Não edite: ajustes da v4 ficam no <style> da v4/index.html. */\n${fonts}${walk(css)}`;

// self-check: nenhum seletor fora do escopo
for (const line of result.split("\n")) {
  if (!line.includes("{") || line.trim().startsWith("@") || /^\s*(from|to|\d+%)/.test(line)) continue;
  const sels = splitList(line.slice(0, line.indexOf("{")));
  if (sels.some(s => !s.includes(SCOPE))) throw new Error("seletor sem escopo: " + line.slice(0, 120));
}
writeFileSync(new URL("../v4/v3.css", import.meta.url), result);
console.log("v4/v3.css", result.length, "bytes");
