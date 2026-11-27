# CONTRACT — regras de build da `/v3` (Fase 3)

Leia nesta ordem: este arquivo, `BRIEF.md`, a sua parte de `spec-coda.md` (medidas e anatomia da referência), `content-map.md` (copy com fonte) e `assets-map.md` (fichas de visual). Abra também `/v3/style.css` e `/v3/app.js`: são o sistema que você vai usar.

## 1. Decisões fechadas com o dono (26/11/2026). Vencem qualquer coisa nos mapas

- **Família de cores dos banners:** amarelo, grafite, creme, laranja queimado e âmbar. Não existe índigo. Classes: `.banner--yellow`, `.banner--graphite`, `.banner--cream`, `.banner--orange`, `.banner--amber`.
- **Bento, ordem e cor:**
  1. Upsell e downsell · inteiro · `banner--full banner--orange` → `/upsell-e-order-bump`
  2. Order bump · meio · `banner--amber` → `/upsell-e-order-bump#como-funciona-o-order-bump-no-snapp`
  3. Teste A/B · meio · `banner--amber` → `/checkout-para-infoprodutos#recursos-para-vender-mais-na-mesma-visita`
  4. Multi-moeda · inteiro alto · `banner--full banner--tall banner--yellow` → `/vender-no-exterior`
  5. Assinaturas · meio · `banner--graphite` → `/checkout-para-infoprodutos#entrega-e-pos-venda`
  6. Entrega por e-mail · meio · `banner--graphite` → `/checkout-para-infoprodutos#entrega-e-pos-venda`
  7. IA por chat · inteiro · `banner--full banner--cream`, `id="ia"` → `/checkout-para-infoprodutos#inteligencia-artificial-no-snapp`
- **Amarelo cheio:** palco da mídia do hero e CTA final. Faixa de números em creme (`.block--cream`).
- **IA:** só Claude e ChatGPT. O Cursor não aparece em lugar nenhum. A 4ª coluna de Integrações é "Webhooks e chaves de API". No FAQ, a R10 fica "Conectado ao Claude ou ao ChatGPT, você pede em texto…".
- **Números:** 3% · R$ 0 · 7 · **17** ("idiomas no checkout"). O "<10 min" saiu da página inteira.
- **H1:** "Venda para o mundo inteiro.<br>O checkout faz o trabalho." **CTA final:** "Publique o seu primeiro<br>checkout hoje" (a caixa-alta vem do CSS).
- **Fatos:** valem os de `content/` em tudo. 16 moedas, 17 idiomas, mais de 190 países, vários order bumps (nunca "ilimitado"), "por venda aprovada" (no FAQ, a R8 fica "3% por venda aprovada"), assinatura diária, semanal, mensal ou anual, detecção de idioma e moeda opcional. Nada de "135+ moedas", "195 países", "pelo IP", "em segundos", "0 s", tempos entre lembretes, e-mail de upsell, "vencedor" ou "significância" no teste A/B.
- **Pele dos mockups:** a proposta (`.dev-phone`, `.dev-browser`, `.ck`, `.chip`, `.chatwin` em `/v3/style.css`). Não há captura real do produto; não invente telas do painel além do que os mapas descrevem.
- **Dados fictícios, os mesmos na página inteira:** produto "Planner Digital", US$ 27 (R$ 97, € 25). Order bump "Guia Rápido", +US$ 7. Upsell "Kit Avançado", US$ 37. Downsell "Kit Essencial", US$ 17. Assinatura "Clube do Planner", US$ 9 por mês. Compradora "Ana", `ana@email.com`. Link `pay.snappcheckout.com/c/planner`. Site do vendedor `seusite.com`. Moedas só da lista de 16 (real, dólar, euro, zloty, coroa tcheca, florim, leu, lira turca, peso mexicano, argentino, colombiano, sol, peso uruguaio, boliviano, iene, won). Formato: "US$ 27", "R$ 97", "€ 25".
- **Ferramentas MCP que podem aparecer nas conversas:** `get_payment_methods`, `create_offer`, `update_offer`, `duplicate_offer`, `list_offers`, `get_offer`, `set_offer_upsell`, `create_ab_test`, `list_sales`, `list_subscriptions`, `get_metrics`, `get_dashboard_overview`, `get_offer_analytics`, `get_offers_ranking`. Nenhuma outra. Os argumentos mostrados seguem o que cada ferramenta aceita de fato (conferido no conector em 27/11/2026).
- **Movimento:** só o hero anima em loop (com o botão `.pause`). Cada banner faz uma coreografia curta (até ~5 s) quando entra na tela e para no quadro final. Sem marquee, sem loop infinito fora do hero.
- **Faixa de logos:** 6 gateways parados numa linha (não é marquee).
- **Sem Lenis e sem d3 em runtime.** O mapa é um SVG pré-gerado.
- Regras do dono de sempre: não citar concorrente; só afirmar o que o produto faz hoje; nada de cliente, número, depoimento ou selo inventado.

## 2. Seus arquivos

- Você é dono só de `.design/v3/parts/NN-nome.html`, `.css` e `.js` (os três precisam existir, mesmo vazios) e dos assets novos que criar em `v3/images/`.
- **Não edite** `v3/index.html`, `v3/style.css`, `v3/app.js` (são do lead), nem nada fora de `.design/v3/parts/`, `.design/v3/shots/` e `v3/images/`. Se uma primitiva estiver faltando ou com defeito, resolva no CSS da sua parte com o comentário `/* pedir ao lead: … */` e me avise no relatório.
- Sem commit, sem push, sem branch. Não inicie nem derrube servidor: já existe um em `http://127.0.0.1:8123`.
- O `.html` da parte é só o markup da seção (sem `<head>`, sem `<style>`, sem `<script>`). O `.css` vai ser concatenado em `v3/style.css` e o `.js` em `v3/app.js`.

## 3. Sistema (use; não recrie)

- **Escala:** tudo deriva de 1200px de design. Use os tokens: espaços `--s1`…`--s12` (4, 8, 12, 14, 16, 24, 32, 40, 56, 64, 80, 96, 120 de design; `--s3h` = 14), raios `--r-sm` 8, `--r-md` 12, `--r-mdu` 16, `--r-lg` 20, `--r-xl` 24. Fora dos tokens, escreva medidas de design como `calc(N * var(--u))` **dentro de `@media (min-width: 800px)`** e dê o valor fixo de mobile fora dele (`--u` não existe abaixo de 800px). Os valores de mobile de cada componente estão na `spec-coda.md`.
- **Um breakpoint de layout só: `@media (min-width: 800px)`.** Mobile-first. Nenhum scroll horizontal a partir de 360px.
- **Tipografia:** classes `.t-h1`, `.t-lead`, `.t-h2`, `.t-title`, `.t-body`, `.t-small`, `.t-fine`, `.t-num`, `.t-mono`, `.t-cta`, `.t-muted`. Não crie tamanho de fonte novo no layout. `.nw` impede quebra: use em `<span class="nw">e-mail</span>` onde a linha puder quebrar no hífen.
- **Cor:** `--bg`, `--ink`, `--muted`, `--surface`, `--surface-hi`, `--line`, `--line-strong`, `--yellow`, `--on-yellow`, `--cream`, `--ok` (único verde, só para estado "pago/aprovado" dentro de mockup). Não crie cor nova no layout. Dentro de mockup de produto, a pele é a das primitivas; cor de marca de terceiro só no logo dele.
- **Layout:** `.wrap` (container de 1008), `.wide` (faixa até 1580 com inset de 32), `.section` (margem de 64 entre seções), `.sec-head` (H2 à esquerda, lead à direita; `--solo` e `--center`).
- **Componentes:** `.btn` (primário amarelo; `--secondary`, `--dark`, `--glass`, `--sm`), `.btn-row`, `.sq` (botão quadrado; `--line`), `.ico` (ícone de traço, tamanho = `font-size`), `.ico-sq` (ícone dentro do quadrado arredondado), `.card` + `.cards`, `.block--cream`, `.block--yellow`, `.panel`, `.pause`.
- **Banner:** copie esta estrutura, sem mudar classes:

```html
<article class="banner banner--full banner--orange" data-reveal="up" style="--i:0">
  <div class="banner__head">
    <h3 class="banner__label"><span class="ico-sq"><svg class="ico"><use href="#i-upsell"/></svg></span>Upsell e downsell</h3>
    <a class="banner__go sq" href="/upsell-e-order-bump" aria-label="Conhecer o upsell em um clique"><svg class="ico"><use href="#i-chevron-right"/></svg><svg class="ico"><use href="#i-arrow-right"/></svg></a>
  </div>
  <p class="banner__text">…</p>
  <div class="banner__media" role="img" aria-label="descrição curta do que o mockup mostra">…</div>
</article>
```

  O `.banner__go` é o link de verdade e o `::after` dele cobre o card inteiro. `.banner__media` tem `container-type: inline-size`: dimensione o mockup com `font-size` em `cqw` e monte tudo em `em`, para o mesmo markup servir 1128, 555 e 350 de largura. A mídia encosta nas laterais e no fundo do card e o card recorta o que sangra: o mockup deve **passar da borda de baixo** (e das laterais, quando a ficha pedir). Botão, link ou input dentro da mídia já fica acima do link esticado; nesse caso tire o `role="img"` e descreva de outro jeito.
  Cada variante define `--b-bg`, `--b-fg`, `--b-label`, `--b-tint` (tom da cor do card para mapa, conectores e trilhos) e `--focus`.
- **Ícones:** sprite em `v3/index.html`: `i-upsell`, `i-bump`, `i-ab`, `i-repeat`, `i-mail`, `i-globe`, `i-ai`, `i-bank`, `i-percent`, `i-layers`, `i-send`, `i-play-screen`, `i-target`, `i-chevron-right`, `i-chevron-down`, `i-arrow-left`, `i-arrow-right`, `i-arrow-up`, `i-arrow-up-right`, `i-play`, `i-pause`, `i-menu`, `i-x`, `i-plus`, `i-minus`, `i-check`, `i-copy`, `i-lock`, `i-instagram`. Ícone que faltar: `<svg class="ico" viewBox="0 0 24 24">…</svg>` inline na sua parte, só com `<path>`/`<rect>`/`<circle>`, sem atributos de traço.
- **Mockups:** `.mk` (base tipográfica), `.dev-phone` + `.dev-phone__screen` + `.dev-phone__url`, `.dev-browser` + `__bar` + `__dots` + `__url`, `.ck` e filhos (`__secure`, `__product`, `__thumb`, `__name`, `__sub`, `__price`, `__field`, `__input`, `__pay`, `__bump` com `.is-on`, `__box`, `__total`, `__cta` com `.is-ok`), `.chip` (`--dark`, `--yellow`, `.dot`). Exemplo completo em `.design/v3/checkpoint.html`.
- **Chat:** `.chatwin` + `window.V3.chat(root)`, documentado no topo do bloco em `/v3/app.js`. Markup:

```html
<div class="chatwin" data-chat>
  <div class="chatwin__bar"><i></i><i></i><i></i><span class="chatwin__url"><svg class="ico"><use href="#i-lock"/></svg>claude.ai</span></div>
  <div class="chatwin__msgs" data-chat-msgs><!-- escreva aqui o estado final do cenário padrão, com o mesmo HTML que o V3.chat gera --></div>
  <div class="chatwin__composer"><span data-chat-field>Responder ao Claude…</span><span class="chatwin__send"><svg class="ico"><use href="#i-arrow-up"/></svg></span></div>
  <p class="chatwin__note">Claude é uma IA e pode cometer erros.</p>
</div>
```

## 4. Movimento e acessibilidade

- **Reveal:** `data-reveal` (só fade) ou `data-reveal="up"` (banners: fade + sobe), com `style="--i:N"` para o atraso de 50 ms por item. O `app.js` põe `.is-in` quando o elemento entra na tela.
- **Coreografia de banner:** o estado base do CSS é o **quadro final**. A animação só existe sob `.js-motion .is-in` e parte de um `from` (`@keyframes x { from { … } }`, com `animation-fill-mode: both`). Assim, sem JS ou com "reduzir movimento" (a regra global zera as durações), a pessoa vê o quadro final pronto. Se precisar de JS, espere o `.is-in` do banner e, com `V3.reduced.matches`, não anime.
- **Loop (só o hero):** envolva a cena em `[data-anim]` com um `<button class="pause" type="button"><svg class="ico"><use href="#i-pause"/></svg><svg class="ico"><use href="#i-play"/></svg></button>`. O `app.js` cuida do botão, pausa fora da tela, aplica `data-paused` (que congela as animações CSS) e dispara `v3:pause` (`detail.paused`) no `[data-anim]` para o seu JS.
- Hover de card e de botão segue a referência (raio que cresce, seta que entra); já está nas primitivas.
- Contraste AA em todo texto, inclusive dentro de mockup que a pessoa precise ler. Foco visível (já global; em fundo claro defina `--focus: #0a0a0b`). `alt` em toda `<img>` (vazio se decorativa). Alvo de toque de pelo menos 40px.
- `<img>` sempre com `width` e `height`; `loading="lazy"` em tudo abaixo da dobra. Formato webp ou SVG. Nenhuma fonte nova.
- JS: IIFE, vanilla, sem dependência, tolerante à ausência do markup, sem variável global nova (só use `window.V3`).
- Títulos: `<h1>` só no hero, `<h2>` nos títulos de seção, `<h3>` nos banners e cards.
- Links internos sem barra no fim. Cadastro: `https://admin.snappcheckout.com/register`. Login: `https://admin.snappcheckout.com/login`.

## 5. Nada da Coda entra

Nem logo, foto, vídeo, ilustração, texto ou fonte, e nada de hotlink. As capturas em `.design/v3/ref/` são só referência de composição, ritmo e anatomia. Recrie com conteúdo e peças do Snapp.

## 6. Como conferir (obrigatório antes de entregar)

Não use o Playwright MCP: ele é um navegador só e outros agentes estão trabalhando em paralelo. Use a ferramenta própria, que abre um Chromium isolado e entra numa fila:

```sh
.design/v3/tools/shot.sh --url "http://127.0.0.1:8123/.design/v3/preview.html?p=NN-nome" --w 1440 --sel ".sua-secao" --out .design/v3/shots/NN-nome-1440.png
```

- O preview monta `v3/index.html` com as partes de `?p=a,b,c` (partes com "banner" no nome entram dentro do bento). Opções no cabeçalho de `.design/v3/tools/shot.mjs` (`--sel`, `--full`, `--scroll`, `--hover`, `--click`, `--reduced`, `--eval`, `--wait`).
- Capture em **1440, 1024, 768, 390 e 360**. Abra as capturas com a tool Read e compare com as da referência (`.design/v3/ref/coda-<largura>-<NN>-<seção>.png`): proporção, espaçamento, hierarquia, quanto a mídia sangra.
- A saída da ferramenta precisa dizer "scroll horizontal: não" e "console: sem erros" em todas as larguras. Rode também com `--reduced` e confira que o quadro final está completo.
- Meça o que importa com `--eval` (alturas, larguras, font-size computado) em vez de estimar no olho.

## 7. Relatório final (até 25 linhas)

O que você construiu; caminhos das capturas em 1440 e 390; o que conferiu e como; desvios conscientes da referência e por quê; pedidos ao lead (primitiva faltando, ícone novo para o sprite, texto que não coube); o que ficou de fora.
