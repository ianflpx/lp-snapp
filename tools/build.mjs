// Gera as páginas internas da LP a partir de content/*.md:
//   /<slug>/index.html  página
//   /<slug>.md          a mesma página em Markdown, para IAs
//   /sitemap.xml, /llms.txt, /llms-full.txt
// e copia o header, o footer e o CTA final da home para essas páginas (o CTA só nas de content/) e para as estáticas (support, termos, privacidade,
// proteção de dados), entre os marcadores <!-- chrome:header --> / <!-- chrome:footer -->.
// Uso: node tools/build.mjs   (sem dependências; rode depois de editar content/ ou a home)
//
// Regras de conteúdo do dono (23/11/2026): não citar concorrente; só afirmar o que o produto
// faz hoje; avaliação e depoimento só com fonte real e visível na página. O gerador falha se
// alguma página quebrar essas regras ou os limites de SEO conferidos em check().
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.snappcheckout.com";
const REGISTER = "https://admin.snappcheckout.com/register";
const LOGIN = "https://admin.snappcheckout.com/login";
const OG = `${SITE}/brand/og-snapp.png`;
const UPDATED = new Date().toLocaleDateString("sv-SE"); // data local, AAAA-MM-DD
const STATIC_PATHS = ["/", "/support", "/terms-of-use", "/privacy-policy", "/data-protection"];
const COMPETITORS = /hotmart|kiwify|kwify|hubla|eduzz|monetizze|cakto|kirvano|ticto|perfectpay|braip|lastlink|greenn/i;

const read = (path) => readFileSync(join(ROOT, path), "utf8");
const write = (path, text) => {
  mkdirSync(dirname(join(ROOT, path)), { recursive: true });
  writeFileSync(join(ROOT, path), text);
};

/* ---------- Header e footer: os da home valem para todas as páginas ---------- */
// Copiados do index.html a cada build. Âncoras da home (#precos) viram /#precos; o skip link (#conteudo)
// continua local, então toda página precisa de <main id="conteudo">. Os ícones vão num sprite próprio.
const chrome = (() => {
  const home = read("index.html");
  const grab = (re, what) => {
    const m = home.match(re);
    if (!m) throw new Error(`index.html: ${what} da home não encontrado`);
    return m[0].replace(/(<a\b[^>]*\shref=")#(?!conteudo")/g, "$1/#").replace(/href="\/v4"/g, 'href="/"');
  };
  const header = grab(/<div class="v3x">\s*<a class="skip"[\s\S]*?<\/header>\s*<\/div>/, "header");
  const footer = grab(/<div class="v3x">\s*<footer class="footer">[\s\S]*?<\/footer>\s*<\/div>/, "footer");
  const cta = grab(/<div class="v3x">\s*<section class="section wide endcta"[\s\S]*?<\/section>\s*<\/div>/, "CTA final");
  const symbols = [...new Set([...(header + footer + cta).matchAll(/<use href="#([\w-]+)"/g)].map((m) => m[1]))].map((id) => {
    const m = home.match(new RegExp(`<symbol id="${id}"[\\s\\S]*?</symbol>`));
    if (!m) throw new Error(`index.html: ícone #${id} não encontrado`);
    return m[0];
  });
  const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">\n${symbols.join("\n")}\n</svg>`;
  // Organização, site e produto da home vão no JSON-LD de cada página, para os @id citados resolverem ali mesmo
  const graph = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
  const entities = ["Organization", "WebSite", "SoftwareApplication"].map((type) => {
    const node = graph.find((n) => [].concat(n["@type"]).includes(type));
    if (!node) throw new Error(`index.html: ${type} não encontrado no JSON-LD da home`);
    return node;
  });
  return { header: `${sprite}\n${header}`, footer, cta, entities };
})();

// Páginas estáticas: o build troca o que estiver entre <!-- chrome:header --> e <!-- /chrome:header --> (idem footer).
const syncStatic = (file) => {
  let html = read(file);
  for (const part of ["header", "footer"]) {
    const re = new RegExp(`<!-- chrome:${part} -->[\\s\\S]*?<!-- /chrome:${part} -->`);
    if (!re.test(html)) throw new Error(`${file}: faltam os marcadores <!-- chrome:${part} -->`);
    html = html.replace(re, () => `<!-- chrome:${part} -->\n${chrome[part]}\n<!-- /chrome:${part} -->`);
  }
  write(file, html);
};

/* ---------- Markdown (subconjunto usado em content/) ---------- */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
const plain = (s) => s.replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
const anchor = (s) => plain(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const cells = (line) => line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

const block = (text) => {
  const lines = text.split("\n");
  if (text.startsWith("### ")) return `<h3>${inline(text.slice(4))}</h3>`;
  if (text.startsWith("## ")) return `<h2 id="${anchor(text.slice(3))}">${inline(text.slice(3))}</h2>`;
  if (lines.every((l) => l.startsWith("- "))) return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
  if (lines.every((l) => /^\d+\. /.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
  if (lines.every((l) => l.startsWith("|"))) {
    const [head, , ...rows] = lines.map(cells);
    return `<div class="tbl"><table><thead><tr>${head.map((c) => `<th scope="col">${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows
      .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table></div>`;
  }
  return `<p>${inline(lines.join(" "))}</p>`;
};

const FAQ_HEADING = "## Perguntas frequentes";
const parse = (file) => {
  const [, front, body] = read(`content/${file}`).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = Object.fromEntries(front.split("\n").map((l) => [l.slice(0, l.indexOf(": ")), l.slice(l.indexOf(": ") + 2).trim()]));
  const blocks = body.trim().split(/\n{2,}/);
  const faqAt = blocks.indexOf(FAQ_HEADING);
  const faq = [];
  for (const b of blocks.slice(faqAt + 1)) {
    if (b.startsWith("### ")) faq.push({ q: b.slice(4), a: [] });
    else faq.at(-1).a.push(b);
  }
  return {
    ...meta,
    slug: file.replace(/\.md$/, ""),
    related: meta.related.split(",").map((s) => s.trim()),
    lead: blocks[0],
    blocks: blocks.slice(1, faqAt),
    faq,
    markdown: body.trim(),
  };
};

/* ---------- HTML ---------- */
const arrow = () =>
  `<span class="cta-btn__go"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>`;

const page = (p, all) => {
  const url = `${SITE}/${p.slug}`;
  const bySlug = (slug) => all.find((x) => x.slug === slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...chrome.entities,
      {
        "@type": ["WebPage", "FAQPage"],
        "@id": `${url}#webpage`,
        url,
        name: p.title,
        headline: p.h1,
        description: p.description,
        inLanguage: "pt-BR",
        dateModified: UPDATED,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#software` },
        publisher: { "@id": `${SITE}/#organization` },
        primaryImageOfPage: { "@type": "ImageObject", url: OG, width: 1200, height: 630 },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: p.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: plain(a.join(" ")) },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: p.nav, item: url },
        ],
      },
    ],
  };

  return `<!doctype html>
<!-- Gerado por tools/build.mjs a partir de content/${p.slug}.md. Não edite este arquivo. -->
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="author" content="Snapp Checkout">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="theme-color" content="#050505">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="pt-BR" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="alternate" type="text/markdown" href="${url}.md" title="${esc(p.h1)} (Markdown)">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Snapp Checkout">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="${OG}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Snapp Checkout: checkout e link de pagamento para vender no mundo inteiro">
<meta property="article:modified_time" content="${UPDATED}">
<meta property="article:publisher" content="${SITE}/">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${OG}">
<meta name="twitter:image:alt" content="Snapp Checkout: checkout e link de pagamento para vender no mundo inteiro">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/outfit-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/pages.css">
<link rel="stylesheet" href="/v4/v3.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script src="/attribution.js" defer></script>
<script src="/v4/v3.js" defer></script>
</head>
<body>
${chrome.header}

<main id="conteudo">
  <article>
  <header class="read head">
    <nav aria-label="Você está aqui"><ol class="crumb"><li><a href="/">Início</a></li><li aria-current="page">${esc(p.nav)}</li></ol></nav>
    <h1>${inline(p.h1)}</h1>
    <p class="lead">${inline(p.lead)}</p>
    <div class="cta-row">
      <a class="cta-btn cta-btn--yellow" href="${REGISTER}">Criar minha conta${arrow()}</a>
      <a class="cta-btn cta-btn--ghost" href="/precos">Ver preços${arrow()}</a>
    </div>
  </header>

  <div class="read prose">
${p.blocks.map(block).join("\n")}
<section aria-labelledby="perguntas-frequentes">
<h2 id="perguntas-frequentes">Perguntas frequentes</h2>
${p.faq.map(({ q, a }) => `<details><summary>${inline(q)}<i></i></summary>${a.map(block).join("")}</details>`).join("\n")}
</section>
  </div>
  </article>

  <nav class="more" aria-labelledby="veja-tambem">
    <div class="wide">
      <h2 id="veja-tambem">Veja também</h2>
      <ul class="cards">
${p.related.map((slug) => `        <li><a href="/${slug}"><b>${esc(bySlug(slug).nav)}</b><span>${esc(bySlug(slug).card)}</span></a></li>`).join("\n")}
      </ul>
    </div>
  </nav>

${chrome.cta}
</main>

${chrome.footer}
</body>
</html>
`;
};

/* ---------- Documentação técnica (content/docs/*.md → /docs/<slug>) ---------- */
// Referências para integradores e para IAs: aceitam bloco de código (```lang), têm sumário e o botão
// "Copiar para IA", que copia a página inteira em Markdown com uma instrução de uso no topo.
const parseDoc = (file) => {
  const [, front, body] = read(`content/docs/${file}`).match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = Object.fromEntries(front.split("\n").map((l) => [l.slice(0, l.indexOf(": ")), l.slice(l.indexOf(": ") + 2).trim()]));
  // Blocos separados por linha em branco, sem quebrar um bloco de código que tenha linhas em branco.
  const blocks = [];
  let text = [];
  const flush = () => text.join("\n").split(/\n{2,}/).filter((b) => b.trim()).forEach((b) => blocks.push(b.trim()));
  const lines = body.trim().split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith("```")) { text.push(lines[i]); continue; }
    flush(); text = [];
    const lang = lines[i].slice(3).trim();
    const code = [];
    while (++i < lines.length && !lines[i].startsWith("```")) code.push(lines[i]);
    blocks.push({ lang, code: code.join("\n") });
  }
  flush();
  const faqAt = blocks.indexOf(FAQ_HEADING);
  const faq = [];
  for (const b of blocks.slice(faqAt + 1)) {
    if (typeof b === "string" && b.startsWith("### ")) faq.push({ q: b.slice(4), a: [] });
    else faq.at(-1).a.push(b);
  }
  return { ...meta, slug: `docs/${file.replace(/\.md$/, "")}`, lead: blocks[0], blocks: blocks.slice(1, faqAt), faq, markdown: body.trim() };
};

const docBlock = (b) => {
  if (typeof b !== "string")
    return `<div class="code"><div class="code__bar"><span>${esc(b.lang || "texto")}</span><button type="button" class="code__copy" data-copy>Copiar</button></div><pre><code>${esc(b.code)}</code></pre></div>`;
  if (b.startsWith("### ")) return `<h3 id="${anchor(b.slice(4))}">${inline(b.slice(4))}</h3>`;
  return block(b);
};

const docMirror = (d) =>
  `# ${d.h1}\n\n> ${d.description}\n\nPágina: ${SITE}/${d.slug}\nMarkdown: ${SITE}/${d.slug}.md\nAtualizado em ${UPDATED}.\n\n${absolute(d.markdown)}\n`;

// Texto que vai na área de transferência: a instrução diz à IA para não inventar o que a referência não cobre.
const aiPrompt = (d) =>
  `Abaixo está a ${d.h1.toLowerCase()} do Snapp Checkout, a fonte oficial (${SITE}/${d.slug}). ` +
  `Use-a para me ajudar a integrar. Baseie cada resposta só no que está escrito nela: se algo não estiver descrito, diga isso em vez de supor um comportamento. ` +
  `Nomes de campos e de eventos são literais e diferenciam maiúsculas de minúsculas.\n\n<referencia>\n${docMirror(d)}</referencia>\n`;

const docPage = (d) => {
  const url = `${SITE}/${d.slug}`;
  const toc = d.blocks.filter((b) => typeof b === "string" && b.startsWith("## ")).map((b) => b.slice(3));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TechArticle", "FAQPage"],
        "@id": `${url}#webpage`,
        url,
        name: d.title,
        headline: d.h1,
        description: d.description,
        inLanguage: "pt-BR",
        dateModified: UPDATED,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#software` },
        publisher: { "@id": `${SITE}/#organization` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: d.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: plain(a.join(" ")) },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: d.nav, item: url },
        ],
      },
    ],
  };
  // JSON com "<" escapado: o Markdown tem código e não pode fechar a tag <script> por acidente.
  const aiJson = JSON.stringify(aiPrompt(d)).replace(/</g, "\\u003c");

  return `<!doctype html>
<!-- Gerado por tools/build.mjs a partir de content/${d.slug}.md. Não edite este arquivo. -->
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.title)}</title>
<meta name="description" content="${esc(d.description)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<meta name="theme-color" content="#050505">
<link rel="canonical" href="${url}">
<link rel="alternate" type="text/markdown" href="${url}.md">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Snapp Checkout">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(d.title)}">
<meta property="og:description" content="${esc(d.description)}">
<meta property="og:image" content="${OG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(d.title)}">
<meta name="twitter:description" content="${esc(d.description)}">
<meta name="twitter:image" content="${OG}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/outfit-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/pages.css">
<link rel="stylesheet" href="/v4/v3.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script src="/attribution.js" defer></script>
<script src="/v4/v3.js" defer></script>
<script src="/docs.js" defer></script>
</head>
<body>
${chrome.header}

<main id="conteudo" class="doc">
  <div class="doc__head">
    <nav aria-label="Você está aqui"><ol class="crumb"><li><a href="/">Início</a></li><li aria-current="page">${esc(d.nav)}</li></ol></nav>
    <h1>${inline(d.h1)}</h1>
    <p class="lead">${inline(d.lead)}</p>
    <div class="doc__actions">
      <button type="button" class="ai-copy" data-ai-copy>Copiar para IA</button>
      <a class="doc__md" href="/${d.slug}.md">Ver em Markdown</a>
      <span class="doc__status" role="status" aria-live="polite"></span>
    </div>
    <p class="doc__hint">O botão copia a referência inteira com uma instrução para a IA. Cole no ChatGPT, no Claude ou no assistente do seu editor e peça a integração.</p>
  </div>

  <div class="doc__body">
    <details class="toc" data-toc>
      <summary>Nesta página</summary>
      <ol>
${toc.map((h) => `        <li><a href="#${anchor(h)}">${inline(h)}</a></li>`).join("\n")}
        <li><a href="#perguntas-frequentes">Perguntas frequentes</a></li>
      </ol>
    </details>

    <article class="prose">
${d.blocks.map(docBlock).join("\n")}
<h2 id="perguntas-frequentes">Perguntas frequentes</h2>
${d.faq.map(({ q, a }) => `<details><summary>${inline(q)}<i></i></summary>${a.map(docBlock).join("")}</details>`).join("\n")}
      <p class="doc__updated">Atualizado em ${UPDATED}.</p>
    </article>
  </div>
</main>
<script type="application/json" id="ai-doc">${aiJson}</script>

${chrome.footer}
</body>
</html>
`;
};

/* ---------- Markdown para IAs, sitemap e llms ---------- */
const absolute = (md) => md.replace(/\]\(\//g, `](${SITE}/`);
const mirror = (p) => `# ${p.h1}\n\n> ${p.description}\n\nPágina: ${SITE}/${p.slug}\n\n${absolute(p.markdown)}\n`;

const sitemap = (all, docs) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["", ...all.map((p) => p.slug), ...docs.map((d) => d.slug)].map((slug) => `  <url><loc>${SITE}/${slug}</loc><lastmod>${UPDATED}</lastmod></url>`).join("\n")}
</urlset>
`;

const llms = (all, docs) => `${read("content/_llms.md").trim()}

## Páginas

${all.map((p) => `- [${p.nav}](${SITE}/${p.slug}.md): ${p.card}`).join("\n")}

## Documentação técnica

${docs.map((d) => `- [${d.nav}](${SITE}/${d.slug}.md): ${d.description}`).join("\n")}

## Produto

- [Página inicial](${SITE}/): visão geral do Snapp Checkout
- [Criar conta](${REGISTER}): cadastro do vendedor
- [Entrar no painel](${LOGIN}): painel do vendedor
- [Servidor MCP](https://mcp.snappcheckout.com/mcp): endereço para conectar o Snapp ao Claude e ao ChatGPT

## Marca

- [Logo em PNG](${SITE}/brand/snapp-logo.png): logo para fundo claro, com transparência
- [Logo branca em PNG](${SITE}/brand/snapp-logo-white.png): logo para fundo escuro, com transparência
- [Ícone em PNG](${SITE}/brand/snapp-icon-1024.png): ícone quadrado de 1024 px
- [Logo em SVG](${SITE}/brand/snapp-logo.svg): vetor da logo

## Opcional

- [Conteúdo completo](${SITE}/llms-full.txt): todas as páginas em um arquivo só
- [Suporte](${SITE}/support): canais de atendimento
- [Termos de uso](${SITE}/terms-of-use)
- [Política de privacidade](${SITE}/privacy-policy)
- [Proteção de dados](${SITE}/data-protection)
- [Instagram](https://www.instagram.com/snappcheckout/)
`;

const llmsFull = (all, docs) =>
  `${read("content/_llms.md").trim()}\n\nContato: snappcheckout@gmail.com · Site: ${SITE}/ · Painel: ${REGISTER}\nAtualizado em ${UPDATED}.\n\n` +
  [...all.map(mirror), ...docs.map(docMirror)].map((md) => `---\n\n${md.replace(/^(#+) /gm, "#$1 ")}`).join("\n");

/* ---------- Conferência ---------- */
const check = (all, docs) => {
  const errors = [];
  const fail = (where, what) => errors.push(`${where}: ${what}`);
  const slugs = new Set([...all, ...docs].map((p) => p.slug));
  const seen = new Map();

  for (const d of docs) {
    if (d.title.length > 62) fail(d.slug, `title com ${d.title.length} caracteres (máx. 62)`);
    if (d.description.length < 110 || d.description.length > 160) fail(d.slug, `description com ${d.description.length} caracteres (110 a 160)`);
    if (d.faq.length < 3) fail(d.slug, "menos de 3 perguntas frequentes");
    if (typeof d.lead !== "string" || d.lead.startsWith("#")) fail(d.slug, "falta o parágrafo de abertura antes do primeiro título");
    if (/[—–]/.test(d.title + d.h1 + d.markdown.match(/^#+ .*$/gm).join(""))) fail(d.slug, "travessão em título");
    if (COMPETITORS.test(d.markdown + d.title + d.description)) fail(d.slug, "cita concorrente");
    if (!all.some((p) => p.markdown.includes(`](/${d.slug})`))) fail(d.slug, "nenhuma página de recurso aponta para esta referência");
    for (const [, href] of d.markdown.matchAll(/\]\((\/[^)#]*)/g)) {
      if (!slugs.has(href.slice(1)) && !STATIC_PATHS.includes(href)) fail(d.slug, `link interno quebrado: ${href}`);
    }
  }

  for (const p of all) {
    if (p.title.length > 62) fail(p.slug, `title com ${p.title.length} caracteres (máx. 62)`);
    if (p.description.length < 110 || p.description.length > 160) fail(p.slug, `description com ${p.description.length} caracteres (110 a 160)`);
    for (const field of ["title", "description", "h1"]) {
      if (seen.has(p[field])) fail(p.slug, `${field} repetido de ${seen.get(p[field])}`);
      seen.set(p[field], p.slug);
    }
    if (p.faq.length < 3) fail(p.slug, "menos de 3 perguntas frequentes");
    if (p.faq.some((f) => !f.a.length)) fail(p.slug, "pergunta sem resposta");
    if (p.lead.startsWith("#")) fail(p.slug, "falta o parágrafo de abertura antes do primeiro título");
    if (/[—–]/.test(p.title + p.h1 + p.markdown.match(/^#+ .*$/gm).join(""))) fail(p.slug, "travessão em título");
    if (COMPETITORS.test(p.markdown + p.title + p.description)) fail(p.slug, "cita concorrente");
    for (const slug of p.related) if (!slugs.has(slug)) fail(p.slug, `related aponta para página inexistente: ${slug}`);
    for (const [, href] of p.markdown.matchAll(/\]\((\/[^)#]*)/g)) {
      if (!slugs.has(href.slice(1)) && !STATIC_PATHS.includes(href)) fail(p.slug, `link interno quebrado: ${href}`);
    }
  }

  // Home (escrita à mão): dados estruturados válidos, FAQ visível igual ao declarado e links para as páginas.
  const home = read("index.html");
  const ld = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let graph = [];
  try {
    graph = JSON.parse(ld[1])["@graph"];
  } catch (e) {
    fail("home", `JSON-LD inválido: ${e.message}`);
  }
  const declared = (graph.find((n) => [].concat(n["@type"]).includes("FAQPage"))?.mainEntity ?? []).map((q) => q.name);
  const visible = [...home.matchAll(/<summary>(.*?)<i><\/i><\/summary>/g)].map((m) => m[1]);
  if (declared.join("|") !== visible.join("|")) fail("home", "FAQ do JSON-LD diferente do FAQ visível");
  if (/aggregateRating|"review"/.test(ld?.[1] ?? "")) fail("home", "avaliação nos dados estruturados sem estar visível na página");
  if (COMPETITORS.test(home.replace(/<style[\s\S]*?<\/style>/g, ""))) fail("home", "cita concorrente");
  for (const { slug } of all) if (!home.includes(`href="/${slug}"`)) fail("home", `sem link para /${slug}`);

  if (errors.length) {
    console.error(errors.map((e) => `✗ ${e}`).join("\n"));
    process.exit(1);
  }
};

/* ---------- Execução ---------- */
const ORDER = ["link-de-pagamento", "checkout-para-infoprodutos", "checkout-stripe", "checkout-paypal", "vender-no-exterior", "upsell-e-order-bump", "area-de-membros", "precos"];
const files = readdirSync(join(ROOT, "content")).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
const pages = files.map(parse).sort((a, b) => (ORDER.indexOf(a.slug) + 1 || 99) - (ORDER.indexOf(b.slug) + 1 || 99));

const docs = readdirSync(join(ROOT, "content/docs")).filter((f) => f.endsWith(".md")).map(parseDoc);

check(pages, docs);
for (const p of pages) {
  write(`${p.slug}/index.html`, page(p, pages));
  write(`${p.slug}.md`, mirror(p));
}
for (const d of docs) {
  write(`${d.slug}/index.html`, docPage(d));
  write(`${d.slug}.md`, docMirror(d));
}
for (const path of STATIC_PATHS.filter((p) => p !== "/")) syncStatic(`${path.slice(1)}/index.html`);
write("sitemap.xml", sitemap(pages, docs));
write("llms.txt", llms(pages, docs));
write("llms-full.txt", llmsFull(pages, docs));

// Versão dos CSS/JS locais: ?v=<hash do conteúdo> em todo HTML (home inclusive), para o vercel.json cachear esses
// arquivos por 1 ano. Por isso rode o build também depois de mexer em qualquer .css/.js do site.
const hashes = new Map();
const version = (path) => {
  if (!hashes.has(path)) hashes.set(path, createHash("sha256").update(readFileSync(join(ROOT, path))).digest("hex").slice(0, 10));
  return hashes.get(path);
};
for (const file of ["index.html", ...[...pages, ...docs].map((p) => `${p.slug}/index.html`), ...STATIC_PATHS.filter((p) => p !== "/").map((p) => `${p.slice(1)}/index.html`)])
  write(file, read(file).replace(/((?:href|src)=")(\/[\w/.-]+\.(?:css|js))(?:\?v=\w+)?"/g, (_, attr, path) => `${attr}${path}?v=${version(path.slice(1))}"`));
console.log(`✓ ${pages.length} páginas, ${docs.length} referência(s), sitemap.xml, llms.txt e llms-full.txt (${UPDATED})`);
