# spec-coda — medição da home https://www.coda.co/ (26/11/2026)

Medido com Playwright (Chromium, DPR 1) via `getComputedStyle` / `getBoundingClientRect` em 1440×900, 1024×768, 768×1024 e 390×844. Cores de banner conferidas por pixel nos screenshots. Nenhum asset da Coda foi baixado: só screenshots em `.design/v3/ref/` e números.

Convenção deste documento: **`u`** = valor de design na largura de 1200px. O site inteiro (fonte, espaço, raio, container) é esse valor multiplicado por um fator que depende do viewport (seção 3.1). Quando aparecer `24u (26.88)`, o número entre parênteses é o valor em 1440.

## 0. Leitura rápida

- **O site é um layout de 1200px que escala com o viewport.** De 800 a 1200px vai de 0.75× a 1×, de 1200 a 1600px vai de 1× a 1.2×, e trava em 1.2× acima de 1600. Em 1440 o fator é **1.12**, por isso os valores "quebrados" do BRIEF (22.4 = 20×1.12, 31.36 = 28×1.12, 1128.96 = 1008×1.12). Abaixo de 800px vale uma tabela fixa de valores mobile, sem escala.
- **Um breakpoint de layout só: 800px.** Abaixo dele tudo é coluna única (768 já é mobile). Acima, o desktop só muda de escala.
- **Ritmo vertical uniforme:** toda seção tem a mesma margem, e elas colapsam. O intervalo entre seções é **71.68px em 1440** (64u), 56.96 em 1024 e **48px** no mobile. Não é 96–128.
- **Raio dos cards é 12u (13.44 em 1440)**, não 16. Vale para banner, card "Why", bloco de números, painel "Explore", mídia do hero, botões e CTA. Só o nav (20u) e o topo do rodapé (20u) são maiores.
- **A faixa de logos é um marquee** (9 logos, 50px/s para a esquerda, fade de 200px nas pontas), não 6 logos parados.
- **A mídia do hero tem 16:9** (1440×810), raio 13.44 nos **quatro** cantos, largura máxima de 1580px.
- **O carrossel "Explore more" mostra um card por vez**, da largura do container (1129×448), com ~106px do card vizinho aparecendo dentro do painel.
- **Existe uma seção a mais:** "Featured press" (marquee de logos de imprensa) entre "Explore more" e o CTA final.
- **Não existem FAQ nem bloco de preço** na home da Coda. Para esses dois slots do mapa do BRIEF não há referência direta: derive do sistema (cabeçalho de 2 colunas, superfícies bege, raio 12u).
- Hover de botão: o raio cresce de 12u para 20u e entra uma seta "→" à esquerda do texto. Hover de banner: o raio cresce de 12u para 24u e o chevron vira seta.

## 1. Confirmado / corrigido contra a tabela do BRIEF

| Elemento | BRIEF | Medido em 1440 | Veredito |
|---|---|---|---|
| Container | 1128px, margem 156 | 1128.96px (1008u), margens 155.5 | Confirmado |
| Nav: forma | pílula clara, raio ~20, inset ~28 / 16 | fundo `#ffffff`, raio 22.4 (20u), inset 26.88 lateral e 17.92 topo, altura 71.68 | Corrigido (raio e insets) |
| Nav: links | 17px / 500 com chevron | 17.92px, **peso 400**, line-height 1, chevron de 17.92px | Corrigido (peso) |
| Nav: direita | idioma, Login, botão escuro | idioma (globo + "EN"), Login, "Get started" `#202020` com texto `#f8f9eb`, todos com 43px de altura e raio 13.44 | Confirmado |
| Nav: comportamento | não citado | `position: fixed`; some ao rolar para baixo e volta ao rolar para cima | Acréscimo |
| H1 | 72px, lh 1.0, 800, −0.01em, centro, 2 linhas | 71.68px / 71.68px, 800, −0.01em, `#202020`, centro, 2 linhas (quebra manual) | Confirmado |
| Lead hero | 22.4/1.3, 400, #5A5A4F, ~900px | 22.4 / 29.12, 400, **letter-spacing +0.01em**, `#5a5a4f`, max-width 896, 3 linhas, `text-wrap: balance` | Confirmado (+ tracking) |
| Botões | raio ~10, padding ~14×18, 17px/500 | **raio 13.44** (12u), padding 13.95×17.92, 17.92 / 26.88, 500, altura 53.76 | Corrigido (raio) |
| Botões: ordem | primário escuro e secundário bege | **secundário à esquerda** (`#edeee1`, texto `#000`), **primário à direita** (`#000000`, texto `#f8f9eb`), gap 17.92 | Confirmado (+ ordem) |
| Faixa "trusted by" | label 15.7 à esquerda, 6 logos numa linha | label 15.68 / 26.8 à esquerda + **marquee de 9 logos** numa janela de 797px (~6 visíveis), fade de 200px nas duas pontas | Corrigido |
| Mídia do hero | 100vw, raio ~24 só em cima, ~900px de altura | 1440×**810** (16:9), **raio 13.44 nos 4 cantos**, largura `min(100%, 1580px)` | Corrigido |
| Botão de pausa | canto inferior direito | 53.76×53.76, raio 13.44, `rgba(32,32,32,.2)`, a 17.92 da direita e de baixo, ícone 26.88 `#f8f9eb` | Confirmado |
| H2 de seção | 31.4/1.2, 500 | 31.36 / 37.63, 500, −0.01em, `#000` | Confirmado |
| Cabeçalho de seção | 2 colunas, H2 + lead 22.4 | 2 colunas de 50% (533px cada), gap 62.72; lead 22.4 / 29.12 `#5a5a4f`, 2 linhas | Confirmado |
| Bento: raio | ~16 | **13.44** (12u); no hover vai a 26.88 (24u) | Corrigido |
| Bento: gap | 18 | 17.92 | Confirmado |
| Bento: padding | 26 | 26.88 em cima e nas laterais do texto; **0 embaixo e 0 nas laterais da mídia** | Confirmado (+ detalhe) |
| Bento: altura | ~600 | 614.8 / 605.9 / 605.9 / 576.8 / 655.8 (definida pelo conteúdo, não fixa) | Corrigido |
| Bento: rótulo | ícone outline + nome em display caixa-alta, tom claro | ícone 25×26.88 + **logotipo em SVG** de 17.92 de altura; primeira palavra no tom pastel cheio, segunda a ~75% de opacidade | Confirmado (+ detalhe) |
| Bento: corpo | 22.4 **branco**, até ~620px | 22.4 / 29.12, cor **`#edeee1`** (bege, não branco), coluna de texto de 60% do card = 623.6px úteis | Corrigido (cor) |
| Bento: botão | quadrado branco 44, raio 10 | 44.8×44.8, **raio 12.9**, `#ffffff`, glifo `#202020`, a 26.88 do topo e da direita | Corrigido (raio) |
| Bento: grade | inteiro / meio+meio / inteiro / inteiro | igual: 5 banners | Confirmado |
| "Why": card | bege, raio 16, padding 26 | `#edeee1`, **raio 13.44**, padding 26.88, gap interno 17.92, sem borda nem sombra | Corrigido (raio) |
| "Why": ícone / título / texto | 24px / 20px 500 / 18px 1.5 | 25×26.88 / 20.16 / 24.19, 500 / 17.92 / 26.88 `#5a5a4f` | Confirmado |
| Números | bloco grafite no container, raio 16, 4 colunas, 45px/800, legenda 15.7 | `#202020`, **raio 13.44**, padding 35.84×26.88; número 44.8 / 44.8, 800, caixa-alta, `#fff`; legenda 15.68 / 22.4 `#c0c2a9` | Corrigido (raio) |
| Prêmios | 4 colunas: imagem, título 20, fonte apagada, "Learn more" | igual; faixa mais larga que o container (1368px, inset 35.84), não 1129 | Confirmado (+ largura) |
| "Explore more": painel | inset 36, raio ~24 | inset 35.84, **raio 13.44**, `#edeee1`, padding vertical 35.84 | Corrigido (raio) |
| "Explore more": carrossel | cards grandes, setas quadradas | **1 card por vez** de 1129×448; setas 44.8×44.8 só com contorno de 1px, raio 12.9 | Corrigido |
| CTA final | grafite full-bleed, raio no topo, 63px/800 caixa-alta, lh 0.9, um botão | `#202020`, raio 13.44 em cima; 62.72 / 56.45, 800, caixa-alta, `#fff`, 2 linhas; botão **de vidro** `rgba(248,249,235,.2)` + blur 4px | Confirmado (+ botão) |
| Rodapé | grafite, divisórias 1px, logo + social, 4 colunas, label mono 14, links 17, linha final mono | `#202020`, divisórias 1px `#5a5a4f`, label JetBrains Mono 14 / 12.6 `#c0c2a9`, links 17.92 / 26.88 `#f8f9eb`; na linha final só o copyright é mono, os links legais são grotesca 15.68 | Confirmado (+ detalhe) |
| Ritmo vertical | ~96–128 entre seções, 18 no bento | **71.68 entre todas as seções**; 71.68 entre cabeçalho e bento; 35.84 entre título e grade em "Why", números, prêmios, press; 17.92 dentro das grades | Corrigido |
| Sombra | quase nenhuma | **nenhuma** `box-shadow` em nenhum componente medido | Confirmado |

## 2. Ordem real das seções

| # | Seção (classe) | 1440: y / altura | 1024: altura | 768: altura | 390: altura |
|---|---|---|---|---|---|
| 0 | Nav fixo | 0 / pílula de 71.68 (17.92 → 89.6) | 57 | 52 | 52 |
| 1 | Hero (`hero`): H1, lead, botões, logos, vídeo | 170 / 1265 | 937 | 791 | 627 |
| 2 | Produtos (`products-hightlight`): cabeçalho + bento de 5 | 1507 / 2637 | 2095 | 3143 | 2250 |
| 3 | "Why Coda" (`benefits-stack`): título + grade 3×2 | 4215 / 570 | 453 | 968 | 1136 |
| 4 | Números (`metrics`) | 4857 / 212 | 169 | 193 | 193 |
| 5 | Prêmios (`awards`) | 5141 / 284 | 217 | 1177 | 913 |
| 6 | "Explore more" (`card-carousel`) | 5497 / 591 | 470 | 816 | 461 |
| 7 | "Featured press" (`press-carousel`) | 6160 / 179 | 143 | 139 | 139 |
| 8 | CTA final (`pre-footer`) | 6411 / 355 | 282 | 204 | 204 |
| 9 | Rodapé | 6703 / 696 | 554 | 1213 | 1213 |
| | Altura total da página | 7399 | 5804 | 9057 | 7549 |

Espaçamento entre seções consecutivas (fim de uma até o começo da outra):

| Par | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| Qualquer par de 1 a 8 | 71.68 | 56.96 | 48 | 48 |
| CTA final → rodapé | −62.72 (sobrepõe) | −49.84 | −32 | −32 |
| Fundo da pílula do nav → topo do H1 | 80.6 | 64.1 | 48 | 48 |

Dentro do hero em 1440: H1 170.2–313.6, lead 331.5–418.9, botões 436.8–490.6, faixa de logos 535.3–598.0, vídeo 624.9–1434.9. Intervalos: 17.92 / 17.92 / 44.8 / 26.88. No mobile: 12 / 12 / 28 / 16.

O CTA final e o rodapé são o mesmo `#202020` e se sobrepõem: na prática é um bloco escuro contínuo do CTA até o fim da página.

## 3. Tokens

### 3.1 Escala fluida

Para qualquer valor de design `V` (em `u`):

| Viewport | Valor renderizado | Fator |
|---|---|---|
| < 800px | tabela mobile fixa (3.2 e 3.3) | — |
| 800 a 1199 | `calc(V × 0.25px + V × 0.0625vw)` | 0.75 → 1.0 |
| 1200 a 1599 | `calc(V × 0.4px + V × 0.05vw)` | 1.0 → 1.2 |
| ≥ 1600 | `V × 1.2` | 1.2 |

Exemplo real da folha de estilo: H1 de 64u é `calc(16px + 4vw)` entre 800 e 1199 e `calc(25.6px + 3.2vw)` entre 1200 e 1599. Fatores nos viewports medidos: **1440 → 1.12**, **1024 → 0.89**, 768 e 390 → mobile.

### 3.2 Espaçamentos

| Token | Design (u) | 1440 | 1024 | Mobile (< 800) |
|---|---|---|---|---|
| 1 | 4 | 4.48 | 3.56 | 2 |
| 2 | 8 | 8.96 | 7.12 | 4 |
| 3 | 12 | 13.44 | 10.68 | 8 |
| 3½ | 14 | 15.68 | 12.46 | 10 |
| 4 | 16 | 17.92 | 14.24 | 12 |
| 5 | 24 | 26.88 | 21.36 | 16 |
| 6 | 32 | 35.84 | 28.48 | 20 |
| 7 | 40 | 44.8 | 35.6 | 24 |
| 8 | 56 | 62.72 | 49.84 | 32 |
| 9 | 64 | 71.68 | 56.96 | 48 |
| 10 | 80 | 89.6 | 71.2 | 64 |
| 11 | 96 | 107.52 | 85.44 | 80 |
| 12 | 120 | 134.4 | 106.8 | 100 |

Tamanhos nomeados: container 1008u (1128.96 / 897.1; no mobile 100% com padding lateral de 20px); largura máxima do lead do hero 800u (896); janela dos logos 712u (797.4); altura do nav 64u (71.68; mobile 52); botão 48u (53.76; mobile 40); logo do nav 88u (98.5×26.6; mobile 88×23.7); logo do rodapé 117u (131×35.3; mobile 88×23.7); altura do marquee de celulares 367u (411; mobile 367); logo de imprensa 247u (276.6; mobile 247); largura máxima full-bleed 1580px.

### 3.3 Raios

| Token | Design (u) | 1440 | 1024 | Mobile | Onde |
|---|---|---|---|---|---|
| sm | 8 | 8.96 | 7.12 | 8 | botão "Get started" do nav mobile, ícone do menu |
| md | 12 | 13.44 | 10.68 | 10 | **quase tudo**: banners, cards "Why", números, painel "Explore", card do carrossel, vídeo, botões, itens do nav, CTA (só em cima) |
| mdu | 16 | 17.92 | 14.24 | 16 | card destacado do dropdown; pílula do nav no mobile |
| lg | 20 | 22.4 | 17.8 | 24 | pílula do nav no desktop, topo do rodapé, **botão em hover** |
| xlu | 24 | 26.88 | 21.36 | 24 | **banner em hover** |
| full | 9999 | — | — | — | chip do dropdown, link "Learn more" |
| botão de chevron | rx 11.5 num SVG de 40 | 12.9 | 10.2 | 9.2 | chevron do banner, setas do carrossel |

### 3.4 Cores

| Token | Hex | Uso |
|---|---|---|
| slightWhite | `#fcfcfc` | fundo da página |
| white | `#ffffff` | pílula do nav, card do carrossel, botão de chevron, título e número sobre grafite |
| offWhite | `#f8f9eb` | texto de botão escuro, texto do rodapé, ícone de pausa |
| grey-0 | `#edeee1` | superfície bege (cards "Why", botão secundário, painel "Explore", hover do nav); **texto de corpo dos banners** |
| grey-1 | `#c0c2a9` | texto apagado sobre grafite (legendas dos números, labels e links legais do rodapé), divisória do dropdown, fundo de imagem carregando |
| grey-2 | `#5a5a4f` | texto apagado sobre claro; **divisórias do rodapé**; seta desabilitada a 50% |
| grey-mid | `#7c7d76` | popover de créditos |
| charcoal | `#202020` | blocos escuros (números, CTA, rodapé), cor do H1, botão do nav, glifo do chevron |
| black | `#000000` | botão primário, H2, títulos de card, texto padrão |

Famílias de cor (1 = pastel, 2 = médio, 3 = saturado, 4 = escuro):

| Família | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| orange | `#ffbcad` | `#f68068` | `#ed4521` | `#721b08` |
| blue | `#b0f4ff` | `#4eaaff` | `#002eff` | `#041668` |
| green | `#aafdc0` | `#1bc97a` | `#007c44` | `#003d21` |
| pink | `#ffc0e6` | `#fe77c7` | `#d62c92` | `#3f0929` |
| purple | `#d3beff` | `#a47aff` | `#671fff` | `#2d0078` |
| yellow | `#fff293` | `#f6df5a` | `#efce0a` | `#945e0c` |

Cores de cada banner (regra do sistema: **fundo = tom 3 da família, rótulo e ícone = tom 1 da mesma família**):

| # | Banner | Fundo | Rótulo e ícone | 2ª palavra do rótulo | Texto | Botão de chevron |
|---|---|---|---|---|---|---|
| 1 | Consumer Platforms (inteiro) | `#ed4521` | `#ffbcad` | `#fba491` | `#edeee1` | `#ffffff`, glifo `#202020` |
| 2 | Codapay (meio) | `#002eff` | `#b0f4ff` | `#7bb9ff` | `#edeee1` | idem |
| 3 | Coda Links (meio) | `#002eff` | `#b0f4ff` | `#7bb9ff` | `#edeee1` | idem |
| 4 | Webstore (inteiro) | `#007c44` | `#aafdc0` | `#88e3a7` | `#edeee1` | idem |
| 5 | Distribution (inteiro) | `#d62c92` | `#ffc0e6` | `#f294cd` | `#edeee1` | idem |

O fundo dos banners é uma imagem chapada (`object-fit: cover`) sobre `#202020`; os hex acima foram lidos por pixel (±1). No banner 5, a terra do mapa é `#e274b0` (branco a ~33% sobre o rosa) e a pílula dos pins é ~`#f1d0db` (branco a ~80%).

### 3.5 Tipografia

Famílias: `abcMonumentGrotesk, Helvetica, sans-serif` (pesos 400, 500, 800) e `jetBrainsMono, monospace` (400). `text-rendering: geometricPrecision`. O container principal tem `text-wrap: balance`.

| Papel | Design (u) tam / lh | Peso | Tracking | 1440 | 1024 | Mobile | Cor | Linhas (1440 / 390) |
|---|---|---|---|---|---|---|---|---|
| H1 | 64 / 64 | 800 | −0.01em | 71.68 / 71.68 | 56.96 / 56.96 | 32 / 32 | `#202020` | 2 (44 car.) / 3 |
| Lead do hero | 20 / 26 | 400 | +0.01em | 22.4 / 29.12 | 17.8 / 23.14 | 16 / 24 | `#5a5a4f` | 3 (178 car., max 896) / 5 |
| H2 de seção | 28 / 33.6 | 500 | −0.01em | 31.36 / 37.63 | 24.92 / 29.9 | 24 / 28.8 | `#000` (branco no bloco de números) | 1 / 1 |
| Lead de seção | 20 / 26 | 400 | +0.01em | 22.4 / 29.12 | 17.8 / 23.14 | 16 / 24 | `#5a5a4f` | 2 (81 car.) / 2 |
| Corpo de banner | 20 / 26 | 400 | +0.01em | 22.4 / 29.12 | 17.8 / 23.14 | 16 / 24 | `#edeee1` | 2 a 3 / 3 a 4 |
| Rótulo de banner | logotipo SVG, altura 16 | — | — | 17.92 | 14.24 | 12 | tom 1 da família | 1 |
| Título de card (Why, prêmio, carrossel) | 18 / 21.6 | 500 | −0.01em | 20.16 / 24.19 | 16.02 / 19.22 | 16 / 19.2 | `#000` (carrossel: `#5a5a4f`) | 1 / 1 |
| Texto de card "Why" | 16 / 24 | 400 | +0.01em | 17.92 / 26.88 | 14.24 / 21.36 | 16 / 24 | `#5a5a4f` | 3 a 4 (99–131 car.) / 3 a 4 |
| Número | 40 / 40 | 800, caixa-alta | −0.01em | 44.8 / 44.8 | 35.6 / 35.6 | 24 / 24 | `#ffffff` | 1 (3–4 car.) |
| Legenda de número, fonte de prêmio | 14 / 20.02 | 400 | +0.01em | 15.68 / 22.4 | 12.46 / 17.8 | 15 / 20 | `#c0c2a9` / `#5a5a4f` | 1 (17–22 car.) |
| "Learn more", "Read more" | 14 / 20.02 | 500 | +0.01em | 15.68 / 22.4 | 12.46 / 17.8 | 15 / 20 | `#000` | 1 |
| Link do nav | 16 / 16 | 400 | 0 | 17.92 / 17.92 | 14.24 | 14 / 14 | `#000` | 1 |
| Login, botão do nav, link do rodapé | 16 / 24 | 400 | 0 | 17.92 / 26.88 | 14.24 / 21.36 | 14 / 16 | `#000`, `#f8f9eb` | 1 |
| Botão (hero, CTA) | 16 / 24 | 500 | 0 | 17.92 / 26.88 | 14.24 / 21.36 | 14 / 20 | ver 4.3 | 1 (11–13 car.) |
| Label "trusted by", links legais | 14 / 23.94 | 400 | 0 | 15.68 / 26.8 | 12.46 / 21.3 | 12 / 24 | `#5a5a4f` / `#c0c2a9` | 1 (48 car.) |
| Label mono (rodapé, dropdown, copyright) | 12.5 / 11.25 | 400, caixa-alta, mono | 0 | 14 / 12.6 | 11.13 / 10 | 11 / 9.9 | `#c0c2a9` (rodapé), `#5a5a4f` (dropdown) | 1 |
| CTA final | 56 / 50.4 (0.9) | 800, caixa-alta | −0.01em | 62.72 / 56.45 | 49.84 / 44.86 | 24 / 24 | `#ffffff` | 2 (14 + 17 car.) / 2 |
| Título do card destacado (dropdown) | 24 / 28.8 | 500 | −0.01em | 26.88 / 32.26 | — | 20 / 24 | `#202020` | 1 |

### 3.6 Breakpoints

Media queries da folha de estilo: `600`, `800`, `1200`, `1600`, `2000` (todas `width >=`).

- **800px** é o único que troca layout (prefixo `md:` do Tailwind): nav hambúrguer ↔ nav completo, 1 coluna ↔ 2/3/4 colunas, tipografia mobile ↔ fluida.
- 1200 e 1600 só mudam a inclinação da escala (3.1). 2000 repete os valores de 1600.
- 600: não encontrei diferença de layout entre 390 e 768 além da largura; ver seção 8.
- Sem scroll horizontal em nenhum dos 4 viewports (`scrollWidth` = largura do viewport).

## 4. Componentes

### 4.1 Nav em pílula

**Desktop (≥ 800), valores em 1440:**

- Wrapper `position: fixed; top: 0; left: 0; width: 100%; z-index: 55`, padding `17.92px 26.88px` (16u / 24u). Altura total 107.5.
- Pílula: 1386.3×71.68, fundo `#ffffff`, raio 22.4, padding `13.44px 17.92px`, `display: flex; align-items: center; justify-content: space-between`. Sem borda, sem sombra, sem blur.
- Logo à esquerda: 98.5×26.6, preto, x = 44.8.
- Links no centro (grupo centralizado no espaço livre): 5 itens, gap 17.92. Cada item: padding 13.44, raio 13.44, altura 44.8, texto 17.92 / 17.92 peso 400, chevron de 17.92 com margem esquerda de 4.48 (os 4 primeiros; "Pricing" não tem). Hover e item aberto: fundo `#edeee1`, transição de cor 0.15s.
- Direita, gap 8.96, tudo com 43px de altura (2.4em) e raio 13.44:
  - idioma: ícone de globo (caixa de 26.88) + "EN" em caixa-alta, padding `0 14.34px 0 8.96px`, gap 4.48;
  - Login: padding `8.96px 17.92px`, sem fundo; hover `#edeee1`;
  - "Get started": 124.1×43, fundo `#202020`, texto `#f8f9eb` 17.92 peso 400; hover troca para fundo `#edeee1` e texto `#000` em 0.15s.
- Dropdown (abre no hover do item): a própria pílula branca cresce para baixo (Products: 334px de altura total, mesmo raio 22.4), padding `94.08px 17.92px 13.44px`. Grade de 3 colunas com gap 62.72. Cada grupo: label mono 14px caixa-alta `#5a5a4f` + divisória de 1px `#c0c2a9`; itens de 408×82 com padding 13.44 e raio 13.44 (hover `#edeee1`): ícone de 31.4px, título 17.92 / 26.88 `#000`, descrição 15.68 `#5a5a4f`, gap 13.44 entre ícone e texto. Resources e Company têm à direita um card destacado de 442.7×258.2 (480:280), `#edeee1`, raio 17.92, padding 26.88: chip mono com contorno de 1px (altura 31.4, raio total) em cima à esquerda, ícone de 31.4 em cima à direita, título 26.88 / 32.26 peso 500 embaixo. Com o dropdown aberto, a página atrás recebe `backdrop-filter: blur(20px)` (camada de 100vw×100vh, opacidade 0 → 1 em 0.7s). Fecha com clique fora.

**Mobile (< 800), valores em 390:**

- Wrapper com padding 8. Pílula 374×52, raio 16, fundo `#ffffff`.
- Esquerda: logo 88×23.7 em x = 24. Direita: idioma (55.6×33.6), "Get started" (92.9×33.6, raio 8, `#202020`, texto 14px) e hambúrguer (área de 44×36, 3 linhas de 16×2 com gap 3, pretas).
- Menu aberto: a pílula cresce para baixo com o mesmo fundo branco e raio 16; 5 itens de 40.8px de altura (texto 14 / 14, padding `12px 16px`, chevron para a direita de 16.8px); depois uma linha centralizada com Login (58.5×32) e "Get started" (92.9×32, raio 10, `#202020`). Total ~300px. O hambúrguer vira X (linhas de cima e de baixo giram ±45°). O resto da página fica com blur de 20px.
- Submenu: entra por cima da lista, com "‹ Back" no topo, labels mono com divisória e itens com ícone de ~28px, título 14px e descrição 12px.

### 4.2 Hero

| | 1440 | 390 |
|---|---|---|
| Topo do H1 | y 170.2 | y 108 |
| H1 | 71.68 / 71.68, 2 linhas, largura do texto 944.8, sem max-width | 32 / 32, 3 linhas (quebra manual diferente), largura do texto 272.9 |
| Lead | 22.4 / 29.12, max-width 896, 3 linhas | 16 / 24, largura total (390), 5 linhas |
| Linha de botões | flex, centro, gap 17.92, altura 53.76 | flex, centro, gap 12, altura 40 (ficam lado a lado) |
| Intervalos H1 → lead → botões → logos → vídeo | 17.92 / 17.92 / 44.8 / 26.88 | 12 / 12 / 28 / 16 |

Tudo centralizado. O H1 usa quebras manuais: uma versão para desktop (2 linhas, 27 + 17 caracteres) e outra para mobile (3 linhas).

### 4.3 Botões

| | Primário | Secundário | Vidro (CTA final) |
|---|---|---|---|
| Fundo | `#000000` | `#edeee1` | `rgba(248,249,235,.2)` + `backdrop-filter: blur(4px)` (renderiza ~`#4c4c49` sobre `#202020`) |
| Texto | `#f8f9eb` | `#000000` | `#f8f9eb` |
| 1440 | altura 53.76, padding `13.95px 17.92px`, raio 13.44, 17.92 / 26.88 peso 500 | idem | idem |
| 390 | altura 40, padding `11.34px 12px`, raio 10, 14 / 20 peso 500 | idem | idem |
| Largura em 1440 | 126.4 (11 car.) | 145.7 (13 car.) | 126.4 |

- Sem borda, sem sombra. `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Hover:** raio 13.44 → 22.4 (12u → 20u) e um `::before` com o caractere "→" abre à esquerda do texto (largura 0 → 16.8px, opacidade 0 → 1). O botão alarga 16.8px e, como a linha é centralizada, os dois botões se deslocam 8.4px. Cores não mudam.
- **Active:** sem estilo próprio. **Focus:** contorno padrão do navegador (`outline: auto 1px`), sem anel customizado.

### 4.4 Faixa de logos

- 1440: linha flex centralizada, gap 26.88, margem superior 26.88. Label à esquerda (340.6 de largura, 1 linha, 15.68 / 26.8 `#5a5a4f`), marquee à direita numa janela de 797.4×62.7. O conjunto (1164.9) fica centralizado na página.
- Marquee: 9 logos, cada um num slot de 134.4×35.84 (proporção 120:32, imagem de 240×64), margem vertical 13.44, sem gap entre slots (o respiro está dentro da imagem). Faixa de 1209.4px duplicada, animação linear infinita de 24.19s → **50px/s para a esquerda**. Não pausa no hover. Máscaras de fade de 200px nas duas pontas, de `#fcfcfc` para transparente. Cerca de 6 logos visíveis, os dois das pontas esmaecidos.
- 390: vira coluna (label em cima, 12 / 24, centralizado; gap 16). Marquee na largura total (390), slots de 102.8×27.4, **sem** máscaras de fade, mesma velocidade (925.5px em 18.5s).

### 4.5 Mídia do hero

- 1440: 1440×810 (16:9), largura `min(100%, 1580px)` centralizada, raio 13.44 nos 4 cantos, `overflow: hidden`, margem superior 8.96 além do gap. `<video autoplay loop muted playsinline>` sem controles, `object-fit: contain`, fonte 1920×1080, 26.5s, sem poster.
- Botão de pausa: 53.76×53.76, padding 13.44, raio 13.44, fundo `rgba(32,32,32,.2)`, ícone 26.88 `#f8f9eb` (duas barras de 3×14 num viewBox de 20, cantos de 0.75). `position: absolute; right: 17.92px; bottom: 17.92px`. Sem hover. Clique pausa o vídeo e troca o ícone por um triângulo de play; outro clique retoma.
- 1024: 1024×576, raio 10.68, botão 42.7 a 14.24 das bordas.
- 390: 390×219.4, raio 10, botão 32×32 (padding 8, ícone 16) a 12 das bordas.

### 4.6 Cabeçalho de seção em 2 colunas

- 1440: `display: flex; flex-direction: row; gap: 62.72px` (56u), largura do container (1129). Duas colunas de 50% que encolhem por igual: 533.1 cada. H2 à esquerda (31.36 / 37.63, 1 linha), lead à direita (22.4 / 29.12 `#5a5a4f`, 2 linhas). Altura 58.3. Margem inferior até a grade: **71.68**.
- 390: coluna, gap 8, H2 24 / 28.8 e lead 16 / 24 (2 linhas), margem inferior 48.
- Variante só com título (em "Why"): H2 na largura total, margem inferior 35.84 (mobile 20).
- Variante centralizada (números, prêmios, press): H2 centralizado, gap 35.84 até o conteúdo (mobile 20).

### 4.7 Bento de banners

**Grade.** 1440: `display: grid; grid-template-columns: 1fr 1fr; gap: 17.92px`, colunas de 555.5. Ordem: banner 1 (2 colunas), 2 e 3 (1 coluna cada), 4 (2 colunas), 5 (2 colunas). Alturas pelo conteúdo: 614.8 / 605.9 / 576.8 / 655.8. 1024: mesmas proporções ×0.89 (colunas de 441.4, gap 14.24, alturas 488.6 / 481.5 / 458.3 / 521.2). Mobile: 1 coluna, gap 12, mesma ordem.

**Anatomia comum de um banner** (1440; `u` entre parênteses quando ajuda):

- O banner inteiro é um link. Dentro: wrapper de reveal (`overflow: hidden`) → card.
- Card: raio 13.44, `overflow: hidden`, `padding-top: 26.88px` (24u), sem padding lateral nem inferior, fundo da cor do banner.
- Botão de chevron: SVG de 44.8×44.8, `position: absolute; top: 26.88px; right: 26.88px`, quadrado branco de raio 12.9 com chevron `#202020` centralizado (glifo ~6.7×11.2).
- Conteúdo: coluna flex com gap 17.92.
  1. **Rótulo** (y = 26.88, altura 26.88): linha flex com padding lateral 26.88 e gap 8.96. Ícone outline 25×26.88 em x = 26.88; logotipo de 17.92 de altura em x = 60.8, centralizado na vertical com o ícone. Larguras dos logotipos: 357 / 116 / 131.7 / 202.2 / 243.1.
  2. **Texto** (y = 71.68): padding lateral 26.88, 22.4 / 29.12, `#edeee1`, `text-wrap: pretty`. Nos banners inteiros o bloco ocupa 60% do card (677.4, texto útil 623.6); nos de meia largura ocupa 100% (555.5, texto útil 501.7).
  3. **Mídia:** largura total do card, encostada nas duas laterais e no fundo (`right: 0; bottom: 0`), sem padding. O recorte é feito pelo `overflow: hidden` e pelo raio do card.
- Altura do banner = 26.88 + 26.88 + 17.92 + altura do texto + 17.92 + altura da mídia (+ 26.88 no banner 1).

| # | Banner | L × A (1440) | Colunas | Texto | Mídia: tipo | Mídia: caixa (x, y, L × A no card) | Proporção |
|---|---|---|---|---|---|---|---|
| 1 | Consumer Platforms | 1129 × 614.8 | 2 | 3 linhas, 147 car. | marquee de celulares | 0, 203.8, 1129 × 411 (margem superior extra de 26.88) | altura fixa 367u |
| 2 | Codapay | 555.5 × 605.9 | 1 | 3 linhas, 112 car. | imagem que sobe no hover | 0, 176.9, 555.5 × 429 | 1.295 |
| 3 | Coda Links | 555.5 × 605.9 | 1 | 3 linhas, 106 car. | imagem com troca no hover | 0, 176.9, 555.5 × 429 | 1.295 |
| 4 | Webstore | 1129 × 576.8 | 2 | 2 linhas, 81 car. | imagem com troca no hover | 0, 147.8, 1129 × 429 | 2.632 |
| 5 | Distribution | 1129 × 655.8 | 2 | 2 linhas, 117 car. | imagem com troca no hover | 0, 147.8, 1129 × 508 | 2.222 |

Como cada mídia é posicionada e quanto "sangra":

- **Banner 1:** faixa de 3 celulares em loop (cada um 327×411, gap 17.92), 25px/s para a esquerda. A faixa passa por baixo das bordas esquerda e direita do card (cabem ~3.3 celulares) e encosta no fundo; cada celular já vem cortado na base (só os ~411px de cima da tela aparecem). Sem escala, sem rotação.
- **Banner 2:** um celular de 344px de largura (62% do card), centralizado, com o topo a 237px do topo do card; o card corta o celular a 369px de altura (cerca de metade do aparelho). A imagem fica 8.96px abaixo da posição final e sobe 8.96px no hover. Sem rotação.
- **Banner 3:** celular desfocado ao fundo (313px de largura, topo a 202px, cortado pela base) e, por cima, um cartão nítido de 356×224 centralizado (x 100–456, y 331–555), flutuando sobre o celular. Sem rotação.
- **Banner 4:** um campo de input branco de 487×134 centralizado na horizontal (x 321–808) com o centro a 69% da altura do card (y 331–465). Muito fundo verde vazio em volta: 201px entre o fim do texto e o campo, e 112px abaixo do campo. Nada sangra neste estado; no hover aparece atrás um celular desfocado que sangra pela base.
- **Banner 5:** mapa-múndi ocupando 1129×508, colado nas duas laterais e no fundo; os continentes e os arcos são cortados pelas três bordas.

**Responsivo do bento:**

| | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|
| Colunas | 2 | 2 | 1 | 1 |
| Gap | 17.92 | 14.24 | 12 | 12 |
| Padding-top do card / lateral do texto | 26.88 | 21.36 | 16 | 16 |
| Raio | 13.44 | 10.68 | 10 | 10 |
| Botão de chevron | 44.8, a 26.88 | 35.6, a 21.36 | 32, a 16 | 32, a 16 |
| Rótulo: y / ícone / logotipo | 26.88 / 25×26.88 / 17.92 | 21.36 / 19.8×21.4 / 14.24 | 24 / 14.8×16 / 12 | 24 / 14.8×16 / 12 |
| Gap ícone → logotipo | 8.96 | 7.12 | 4 | 4 |
| Texto: y / tamanho / largura | 71.68 / 22.4 / 60% ou 100% | 57 / 17.8 / 60% ou 100% | 52 / 16 / 100% | 52 / 16 / 100% |
| Gap texto → mídia | 17.92 | 14.24 | 12 | 12 |
| Alturas dos 5 banners | 614.8 / 605.9 / 605.9 / 576.8 / 655.8 | 488.6 / 481.5 / 481.5 / 458.3 / 521.2 | 495 / 674.1 / 674.1 / 679.5 / 439.6 | 543 / 406.3 / 406.3 / 420.4 / 293.5 |
| Mídia do banner 1 | 3 celulares de 327×411 | 259.9×326.6 | 292×367 | 292×367 (cabe ~1.2 celular) |
| Mídia dos banners 2 e 3 | 555.5×429 | 441.4×340.9 | 728×562.1 | 350×270.3 |
| Mídia do banner 4 | 1129×429 (2.632) | 897.1×340.9 | 728×591.5 (**1.231**) | 350×284.4 (**1.231**) |
| Mídia do banner 5 | 1129×508 | 897.1×403.7 | 728×327.6 | 350×157.5 |

No mobile a ordem é a mesma (1 a 5 empilhados), o texto passa a ter 3 a 4 linhas e a mídia mantém a proporção (a altura acompanha a largura). O banner 4 troca de imagem no mobile: usa uma composição mais alta (1.231) que já mostra o estado "preenchido" (campo com texto + celular desfocado atrás). Os banners 2, 3 e 5 usam a mesma composição reduzida. No mobile não há hover.

### 4.8 Cards "Why"

- 1440: grade `repeat(3, 1fr)`, gap 17.92, cards de 364.4×239.2 (linha com a altura do card mais alto), 2 linhas.
- Card: fundo `#edeee1`, raio 13.44, padding 26.88, coluna flex com gap 17.92, sem borda nem sombra, sem hover.
  - Ícone 25×26.88 em y = 26.88, alinhado à esquerda, preto.
  - Título em y = 71.68: 20.16 / 24.19 peso 500, 1 linha (11 a 26 caracteres).
  - Texto em y = 104.8: 17.92 / 26.88 `#5a5a4f`, 3 a 4 linhas (99 a 131 caracteres), largura útil 310.6.
- 1024: 3 colunas de 289.5×190.1, padding 21.36, título 16, texto 14.24 / 21.36.
- 768 e 390: 1 coluna, gap 12, padding 16, gap interno 12, raio 10, ícone 22.3×24, título 16 / 19.2, texto 16 / 24. Altura 167.2 em 390 (3 linhas) e 143.2 em 768 (2 linhas).

### 4.9 Faixa de números

- 1440: bloco de 1129×212.3 dentro do container, fundo `#202020`, raio 13.44, padding `35.84px 26.88px`, coluna flex com gap 35.84.
- Título centralizado, branco, 31.36 / 37.63 peso 500.
- Linha: 4 itens de 268.8 (25% cada), `justify-content: space-between`, sem divisórias. Cada item é centralizado: número 44.8 / 44.8 peso 800 caixa-alta branco e, colada embaixo (sem gap), a legenda 15.68 / 22.4 `#c0c2a9`. Altura do item 67.2.
- 390: o bloco vira **full-bleed** (x 0 a 390, sem margem lateral), raio 10, padding `20px 16px`, gap 20. Grade **2×2**: itens de 179×44, gap vertical 16. Número 24 / 24, legenda 15 / 20.

### 4.10 Prêmios

- 1440: seção mais larga que o container: largura `min(100%, 1580px)` com padding lateral 35.84 → faixa de 1368.3. Título centralizado, gap 35.84.
- Linha flex com gap 35.84: 4 itens de 315.2×210.9, conteúdo centralizado.
  - Imagem: caixa de 315.2×99.1 (y 0–99.1), arte centralizada dentro; margem inferior 8.96.
  - Título (y 108–132.2): 20.16 / 24.19 peso 500, 1 linha (15 a 26 caracteres).
  - Fonte (y 136.7–159.1): 15.68 / 22.4 `#5a5a4f`, margem vertical 4.48.
  - Link "Learn more" (y 163.6–210.9): 128.1×47.3, padding `12.46px 22.9px`, raio total, **sem fundo e sem borda** (aparece como texto em negrito), 15.68 peso 500 `#000`.
- Hover no item: a imagem sobe 4.48px em 0.3s.
- 390: empilhados, gap 20, cada item 350×201.1 (imagem 350×110). 768: itens de 728×267.1 (imagem 560×176).

### 4.11 Painel "Explore more"

- 1440: seção com padding lateral 35.84. Painel de 1368.3×591.3, fundo `#edeee1`, raio 13.44, padding vertical 35.84, `overflow: hidden`.
- Dentro, coluna na largura do container (1129) com gap 26.88:
  - Cabeçalho (altura 44.8): H2 à esquerda (31.36 / 37.63) e duas setas à direita, gap 8.96. Cada seta é um SVG de 44.8×44.8: quadrado de raio 12.9 **sem preenchimento**, contorno de 1px, chevron no centro. Ativa: `#202020`. Desabilitada (fim da lista): `rgba(90,90,79,.5)`. A da esquerda é a mesma seta girada 180°. No hover o chevron vira seta "→".
  - Carrossel: caixa de 1129×448 (proporção 1008:400). **Cada card tem a largura inteira do container** (1129×448); passo de 1142px (card + 13.44). 3 cards. Aparece 1 card inteiro e ~106px do vizinho até a borda do painel (dos dois lados no card do meio).
- Card: fundo `#ffffff`, raio 13.44, `overflow: hidden`, link inteiro.
  - Imagem: 1129×345 (1008:308), `object-fit: cover`, fundo de espera `#c0c2a9`. Na base da imagem, faixa de 25% da altura (86px) com gradiente de `rgba(0,0,0,.9)` para transparente e um logo branco pequeno (122×26.9) em x = 35.84, y = 26.88 da faixa (só no primeiro card).
  - Barra de texto: 1129×103, padding lateral 35.84, flex em linha, gap 89.6. Título à esquerda (867 de largura): 20.16 / 24.19 peso 500 `#5a5a4f`, 1 a 2 linhas (79 a 116 caracteres), `line-clamp: 4`. "Read more" à direita: 15.68 peso 500 `#000`, padding vertical 35.84; uma seta de 17.92 à esquerda dele fica invisível (opacidade 0, deslocada 50%) e entra no hover.
- 1024: painel 967.1×469.9, card 897.1×356, imagem 274.1 de altura, barra 81.9.
- 390: painel full-bleed (390×461.1), raio 10, padding vertical 20; conteúdo com padding lateral 20 e gap 16. Carrossel com **85% da largura**: card de 297.5×328.3 (328:362), passo 306. Imagem 297.5×183.2 (328:202), logo 72.9×16. Barra em coluna (145.1 de altura, padding lateral 16): título 16 / 19.2 `#000` em até 4 linhas com margem superior 16; embaixo "→ Read more" (seta de 16 sempre visível + texto 15 / 20, altura 44). As setas saem do cabeçalho e vão para **baixo do carrossel, à direita**: 32×32 cada, gap 4.
- 768: card de 618.8×682.9 (mesma regra de 85%).

### 4.12 "Featured press"

- Título centralizado (31.36 / 37.63), gap 35.84.
- Marquee full-bleed (1440×106): 9 logos em escala de cinza, cada um 276.6×89.6 (imagem de 277×89), gap 8.96. Faixa de 2561px em 51.2s → 50px/s para a esquerda. Sem máscara de fade, sem pausa no hover. Sem texto embaixo dos logos.
- 390: logos de 247×80, gap 4, título 24 / 28.8, gap 20.

### 4.13 CTA final

- 1440: bloco full-bleed 1440×354.8, fundo `#202020`, raio 13.44 só nos cantos de cima, padding `44.8px 35.84px 89.6px`, margem superior 71.68 e **margem inferior −62.72** (o rodapé sobe por cima).
- Conteúdo centralizado, coluna com gap 35.84:
  - Headline: 62.72 / 56.45, 800, caixa-alta, branca, 2 linhas (cada linha é um bloco: 565.3 e 635.7 de largura), margem vertical 8.96. Topo a 53.8 do topo do bloco.
  - Um botão de vidro (4.3), 126.4×53.76, a 211.4 do topo.
- Altura visível antes do rodapé: 318.9.
- 390: padding `24px 20px 64px`, raio 10 em cima, headline 24 / 24 (243.3 de largura, 2 linhas), gap 20, botão 94.8×40.

### 4.14 Rodapé

- 1440: wrapper com padding superior 26.88; bloco 1440×669.4, fundo `#202020`, texto `#f8f9eb`, raio 22.4 nos cantos de cima, padding 35.84.
- **Linha do topo** (y 35.84–145.3): padding vertical 35.84, borda de 1px `#5a5a4f` em cima e embaixo, flex `space-between`. Logo 131×35.3 `#f8f9eb` à esquerda; um ícone social de 26.88 `#c0c2a9` à direita (hover `#edeee1`, 0.3s). Margem inferior 35.84.
- **Colunas** (y 181.1–525.1): flex, 4 colunas iguais de 328.7, gap 17.92, alinhadas ao topo. Cada coluna: label mono 14 / 12.6 caixa-alta `#c0c2a9`; gap 17.92; lista com gap 8.96 de links 17.92 / 26.88 peso 400 `#f8f9eb` (passo de 35.84 entre linhas). Quantidade de links: 6 / 9 / 6 / 8. Link externo ganha um ícone de 14.3px com margem esquerda 8.96.
- **Linha final** (y 561–633.5): margem e padding superiores 35.84, borda superior 1px `#5a5a4f`, flex `space-between`, alinhada ao centro. Esquerda: 4 links legais 15.68 / 26.8 `#c0c2a9`, gap 35.84. Direita: copyright em mono 14 caixa-alta `#c0c2a9` + "Site credits" em mono sublinhado, gap 44.8.
- 1024: tudo ×0.89 (4 colunas de 231.1, altura 532.5).
- 390: padding 20, raio 24 em cima. Linha do topo com padding vertical 20 (logo 88×23.7, ícone 20). **Colunas empilhadas** (gap 20): label mono 11 / 9.9, gap 12, links 14 / 16 com padding vertical 4 (passo 26). Linha final em coluna com gap 24: links legais empilhados 12 / 24 (28 de altura cada), depois copyright e créditos em mono 11 numa linha. Altura total 1205.

## 5. Motion

Easing padrão de quase tudo: `cubic-bezier(0.4, 0, 0.2, 1)`.

| O quê | Comportamento medido |
|---|---|
| Reveal de seção e de bloco (título, parágrafo, ícone, mídia) | só fade: `opacity` 0 → 1, 0.5s, easing padrão, sem deslocamento. O hero já entra visível |
| Reveal dos banners do bento | `opacity` 0 → 1 **e** `translateY(44.8px)` → 0 (40u), 0.5s, stagger de 50ms por banner (50, 100, 150, 200, 250ms) |
| Reveal dos cards "Why", itens de número e prêmios | só fade, 0.5s, stagger de 50ms por item (50 a 300ms) |
| Gatilho do reveal | dispara quando o topo do elemento cruza ~70% da altura do viewport (entre 67% e 73%). Acontece uma vez só; não reverte ao voltar |
| Nav no scroll | visível no topo; ao rolar para baixo some com `translateY(-100%)` em 0.3s (visível em y = 120, escondido em y = 600); reaparece em qualquer rolagem para cima |
| Hover de link do nav | fundo → `#edeee1`, 0.15s |
| Hover do botão do nav | fundo `#202020` → `#edeee1`, texto → `#000`, 0.15s |
| Hover de botão (hero, CTA) | raio 12u → 20u + seta "→" entra à esquerda (largura 0 → 16.8px, opacidade 0 → 1), 0.3s |
| Hover de banner | raio 13.44 → 26.88 em 0.15s; chevron vira seta "→" e desliza 0.15em para a direita em 0.3s |
| Hover do banner 2 | a imagem sobe 8.96px em 0.15s |
| Hover dos banners 3, 4 e 5 | crossfade para uma segunda imagem, 0.2s |
| Hover de prêmio | imagem sobe 4.48px em 0.3s |
| Hover do card do carrossel | imagem escala 1 → 1.05 em 0.5s; título `#5a5a4f` → `#202020` em 0.3s; seta do "Read more" aparece e desliza em 0.3s |
| Hover de link do rodapé | uma seta abre à esquerda do texto (largura 0 → 1.2em = 21.5px) em 0.2s e empurra o texto |
| Marquee de logos (hero) e de imprensa | 50px/s, linear, infinito, para a esquerda, conteúdo duplicado, **não pausa** no hover nem no clique |
| Marquee de celulares (banner 1) | 25px/s, linear, infinito, para a esquerda, não pausa |
| Vídeo do hero | autoplay, loop, mudo, inline; o botão alterna pausa/play e troca o ícone |
| Carrossel | feito em JS (cada card recebe `translateX`), sem `scroll-snap`. Um clique anda **1 card** (1142px). A animação é uma desaceleração exponencial: 41% do caminho em 60ms, 78% em 180ms, 93% em 300ms, ~100% em 0.7–0.8s (equivale a algo como `0.8s cubic-bezier(0.16, 1, 0.3, 1)`). Arraste com o mouse funciona: arraste curto (100px) volta, arraste rápido leva ao próximo por inércia. Não é infinito, não tem autoplay, não tem bolinhas, não responde a scroll horizontal |
| Dropdown do nav | o fundo branco desce de `translateY(-100%)`; a página atrás desfoca (blur 20px, opacidade em 0.7s) |
| Menu mobile | lista entra com fade + `translateY(-24px → 0)` em 0.3s; hambúrguer vira X |
| Parallax | não há |
| `prefers-reduced-motion` | **não é tratado** para marquee, vídeo, reveal ou carrossel (só existem regras do lightbox do WordPress). No v3 isso precisa ser feito por nós |
| Scroll suave | não há biblioteca (sem Lenis, sem GSAP); `scroll-behavior: auto` |

## 6. Inventário visual

Na página há 83 `<img>` (69 visíveis em 1440, todos com `loading="lazy"`), 1 `<video>` e 51 SVGs visíveis. Em ordem:

| # | Seção | Elemento | Tipo | Tamanho renderizado (1440) | Proporção | Posição e recorte | Animado? |
|---|---|---|---|---|---|---|---|
| 1 | Nav | Logo | logotipo SVG, 1 cor | 98.5×26.6 | 3.7:1 | esquerda da pílula, x = 44.8 | não |
| 2 | Nav | Chevrons dos 4 links | ícone | 17.92 | 1:1 | depois do texto, margem 4.48 | não |
| 3 | Nav | Globo do idioma | ícone | caixa 26.88, glifo ~17 | 1:1 | antes de "EN" | não |
| 4 | Nav (dropdown) | 6 a 9 ícones de item | ícone outline em squircle | 31.4, glifo 22 | 1:1 | à esquerda de cada item | não |
| 5 | Nav (dropdown) | Card destacado | bloco de cor com chip | 442.7×258.2 | 480:280 | direita do painel | sobe com fade |
| 6 | Hero | 9 logos de clientes | logos raster 1 cor | 134.4×35.84 cada | 120:32 | janela de 797 à direita do label | marquee 50px/s |
| 7 | Hero | Vídeo | vídeo 1920×1080 | 1440×810 | 16:9 | full-bleed, raio 13.44 | loop de 26.5s |
| 8 | Hero | Ícone de pausa / play | ícone preenchido | 26.88 num botão de 53.76 | 1:1 | canto inferior direito do vídeo | troca no clique |
| 9 | Banner 1 | Ícone do rótulo | ícone outline em squircle | 25×26.88 | 26:28 | x 26.88, y 26.88 | fade |
| 10 | Banner 1 | Logotipo do rótulo | logotipo SVG, 2 tons | 357×17.92 | — | x 60.8 | fade (+50ms) |
| 11 | Banner 1 | Botão de chevron | ícone em quadrado branco | 44.8 | 1:1 | topo direito, a 26.88 | vira seta no hover |
| 12 | Banner 1 | 3 telas de celular | mockup de UI (raster) | 327×411 cada | 0.796 | faixa colada no fundo, sangra nas laterais | marquee 25px/s |
| 13 | Banner 2 | Ícone + logotipo + chevron | como 9–11 | logotipo 116×17.92 | — | idem | idem |
| 14 | Banner 2 | Celular com checkout | mockup de UI (raster) | 555.5×429 (celular de 344) | 1.295 | centralizado, cortado pela base | sobe 8.96 no hover |
| 15 | Banner 3 | Ícone + logotipo + chevron | como 9–11 | logotipo 131.7×17.92 | — | idem | idem |
| 16 | Banner 3 | Cartão de oferta sobre tela de jogo | mockup de UI em 2 camadas | 555.5×429 | 1.295 | cartão central flutuando, celular atrás cortado pela base | crossfade no hover |
| 17 | Banner 4 | Ícone + logotipo + chevron | como 9–11 | logotipo 202.2×17.92 | — | idem | idem |
| 18 | Banner 4 | Campo de input com botão | mockup de UI | 1129×429 (campo de 487×134) | 2.632 | campo central, sem sangria | crossfade no hover |
| 19 | Banner 5 | Ícone + logotipo + chevron | como 9–11 | logotipo 243.1×17.92 | — | idem | idem |
| 20 | Banner 5 | Mapa-múndi com arcos e 7 pins | ilustração vetorial (raster) | 1129×508 | 2.222 | cola nas 2 laterais e no fundo | crossfade no hover |
| 21 | Why | 6 ícones | ícone outline em squircle | 25×26.88 | 26:28 | topo esquerdo de cada card | fade |
| 22 | Números | — | só tipografia | — | — | — | fade com stagger |
| 23 | Prêmios | 4 selos | imagem raster | caixa 315.2×99.1, arte ~130–220 de largura | 315:99 | centralizada em cada coluna | sobe 4.48 no hover |
| 24 | Explore | 2 setas | ícone em quadrado com contorno | 44.8 | 1:1 | direita do título | chevron → seta no hover |
| 25 | Explore | 3 capas de card | 2 capas de logo + 1 ilustração | 1129×345 | 1008:308 | topo do card, `cover` | zoom 1.05 no hover |
| 26 | Explore | Logo pequeno sobre gradiente | logo raster branco | 122×26.9 | 4.56:1 | base esquerda da capa do card 1 | não |
| 27 | Explore | Seta do "Read more" | ícone | 17.92 | 1:1 | antes do texto | entra no hover |
| 28 | Press | 9 logos de imprensa | logos raster em cinza | 276.6×89.6 | 277:89 | marquee full-bleed | 50px/s |
| 29 | CTA final | — | só tipografia e botão de vidro | — | — | — | fade |
| 30 | Rodapé | Logo | logotipo SVG off-white | 131×35.3 | 3.7:1 | esquerda da linha do topo | não |
| 31 | Rodapé | Ícone social | ícone preenchido | 26.88 | 1:1 | direita da linha do topo | cor no hover |
| 32 | Rodapé | 2 ícones de link externo | ícone outline | 14.3 | 1:1 | depois do texto do link | não |
| 33 | Rodapé | Setas de hover dos links | ícone | 1.2em | — | antes do texto | abre no hover |

Não há padrão de fundo, textura, gradiente decorativo nem forma solta em nenhuma seção: o fundo é sempre cor chapada. As únicas "formas" são as máscaras do vídeo (item 7) e o squircle dos ícones.

### Descrições de composição

**Estilo dos ícones (itens 4, 9, 21).** Todos seguem um molde: um contorno de quadrado super-arredondado (squircle), um pouco mais alto que largo (viewBox 26×28), com um glifo simples dentro. Traço único de ~1.5px na escala de 25px, pontas e junções arredondadas, sem preenchimento. Desenhados como contorno convertido em forma (`fill: currentColor`), então herdam a cor do texto: preto nos cards bege, tom pastel nos banners. Glifos vistos: diamante, moedas/círculos sobrepostos, seta diagonal, grade de 4 quadrados, setas de expandir para os 4 cantos, planta/coração, globo com meridianos, alvo de círculos concêntricos, nós conectados (compartilhar), chevrons duplos de avançar.

**Rótulo de banner (itens 10, 13, 15, 17, 19).** Não é texto: é um logotipo em SVG numa display pesada e larga, de cantos arredondados e contraformas pequenas, tudo em caixa-alta, com 17.92px de altura. Duas palavras coladas com um espaço curto: a primeira (a marca) no tom pastel cheio, a segunda (o produto) no mesmo tom a ~75% de opacidade. Largura entre 116 e 357px conforme o nome. Fica na mesma linha do ícone, centralizado na vertical com ele.

**Botão de chevron (item 11).** Quadrado branco de 44.8 com raio 12.9, sem borda nem sombra, com um chevron ">" fino e escuro no centro (~6.7×11.2). No hover do banner o chevron é trocado por uma seta "→" com haste.

**Vídeo do hero (item 7).** Montagem de 26.5s em cortes de 2 a 4s, sempre com pessoas e celulares na mão, luz natural, fundos desfocados. Três tipos de quadro se alternam: (a) fundo off-white chapado com 2 ou 3 janelas grandes em forma de squircle (~590×650 cada), cada uma com um retrato de pessoa olhando o celular, deslizando na horizontal e cortadas pela borda do quadro; (b) plano cheio: close de uma mão segurando um celular levemente inclinado, com uma tela do produto nítida (vitrine de loja, lista de itens) e fundo totalmente desfocado; (c) tela dividida 50/50: de um lado a mão com o celular mostrando um recibo de "pagamento aprovado" (ícone de check verde no topo, linhas de detalhe), do outro o rosto de uma pessoa sorrindo para o aparelho. O botão de pausa fica sempre sobre o canto inferior direito. Em 390 é o mesmo vídeo em 390×219.

**Marquee de celulares (item 12).** Três telas de celular lado a lado, em loop. Cada uma é só a parte de cima de um aparelho em pé: moldura branca com cantos superiores bem arredondados (~42px) e um contorno fino no tom escuro do banner; no topo uma barra de endereço em pílula cinza-clara com cadeado e domínio; abaixo, a página de uma loja diferente em cada tela (uma clara em rosa/lilás com card de produto e botão escuro; uma branca com busca e cards de capa escura; uma roxo-escura com banner e grade de 3 miniaturas). As telas são cortadas retas na base pelo fundo do card. Sem sombra, sem inclinação.

**Celular com checkout (item 14).** Um único aparelho em pé, de frente, moldura preta fina (~4px) com botões laterais, cantos de ~52px, tela branca. De cima para baixo: barra de endereço em pílula cinza (cadeado + nome), linha com a marca à esquerda e seletor de idioma à direita, linha do produto (miniatura quadrada azul com moeda dourada, nome, preço em negrito e preço antigo riscado, seta de expandir), faixa cinza "selecione a forma de pagamento", e duas linhas de opção com rádio (bandeiras de cartão; carteiras digitais). O card corta o aparelho logo depois da segunda opção. No hover o aparelho sobe 9px.

**Cartão de oferta sobre tela de jogo (item 16).** Duas camadas. Atrás, a tela de um jogo casual dentro de um celular, desfocada e azulada, centralizada e cortada pela base. Na frente, nítido, um cartão de oferta dourado de 356×224 com cantos de ~14px: título com ícone de relógio à esquerda e botão de fechar à direita, no meio um ícone quadrado de moedas ao lado de um número grande e uma palavra, e embaixo dois botões lado a lado com rótulos pequenos em cima (um amarelo, um verde com selo de desconto vermelho). Estado de hover: a composição muda para um celular branco de checkout na frente (mesma estrutura do item 14, com um cartão salvo selecionado) e a tela do jogo desfocada deslocada para trás e para a esquerda.

**Campo de input (item 18).** Sobre o verde chapado, um único cartão branco de 487×134 com cantos de ~8px e borda fina clara. Dentro: uma linha de placeholder cinza no canto superior esquerdo e, no canto inferior direito, um botão escuro pequeno (135×36, raio 8) com ícone de brilho + 2 palavras. Nada mais. Estado de hover (e versão mobile): o placeholder vira uma URL digitada em 2 linhas, o botão ganha um brilho roxo em volta, e atrás do cartão aparece, desfocada e translúcida, a prévia de uma loja dentro de um celular (barra de endereço, logo, card de produto, abas, banner de desconto) cortada pela base.

**Mapa-múndi (item 20).** Projeção plana, sem fronteiras: continentes em silhueta num tom mais claro que o fundo (`#e274b0` sobre `#d62c92`), sem contorno. Por cima, arcos tracejados brancos (traço ~2px, tracejado curto) em curvas largas ligando os pontos entre si e saindo pelas bordas. 7 pins, cada um formado por um ponto pequeno (anel branco de ~8px com miolo rosa) e, logo abaixo, uma pílula branca translúcida de ~120×48 com raio total contendo um logo colorido de parceiro. Posição do centro de cada pílula no card de 1129×656: (597, 243), (873, 331), (1044, 236), (541, 427), (669, 557), (964, 556), (312, 592). Distribuição: norte da Europa, sul da Ásia, leste da Ásia, oeste da África, leste da África, sudeste asiático, América do Sul. O mapa é cortado pelas laterais e pela base do card. O estado de hover é praticamente idêntico.

**Selos de prêmio (item 23).** Quatro imagens retangulares pequenas, cada uma com a arte original do prêmio centralizada numa caixa de 315×99: uma escura com uma onda de partículas azul-esverdeada e texto serifado branco; uma branca com borda azul e texto serifado; uma preta com tipografia em bloco verde; uma larga cinza-escura com borda cor de pêssego e texto branco. São heterogêneas de propósito (cada uma tem a identidade de quem premiou).

**Capas do carrossel (item 25).** Três capas de 1129×345: (1) fundo grafite com uma textura muito sutil de ondas e um logo branco grande centralizado (~630px de largura); na base, gradiente preto e o mesmo logo pequeno à esquerda; (2) ilustração vetorial chapada em fundo creme: duas mãos cor de pêssego com textura pontilhada segurando um celular na horizontal, cuja tela escura mostra uma lojinha de jogo com cards verdes (2 destaques em cima, 4 itens embaixo com preço); (3) fundo grafite liso com dois logos brancos lado a lado separados por um "×".

**Logos (itens 6 e 28).** Marquee do hero: 9 logos de marcas em uma cor (preto ou cinza-escuro, alguns mais claros), todos normalizados numa caixa de 240×64 com respiro interno. Marquee de imprensa: 9 logos de veículos em cinza, caixas de 277×89, mais espaçados.

## 7. Índice dos screenshots

Todos em `.design/v3/ref/`. Nomes: `coda-<largura>-<NN>-<seção>.png`.

| Arquivo | O que mostra |
|---|---|
| `coda-1440-full.png`, `coda-1024-full.png`, `coda-768-full.png`, `coda-390-full.png` | página inteira em cada viewport, depois de rolar tudo (reveals disparados) |
| `coda-<w>-01-nav-hero.png` | nav + H1 + lead + botões + logos + começo do vídeo |
| `coda-<w>-02-logos.png` | faixa "trusted by" |
| `coda-<w>-03-hero-media.png` | vídeo do hero com o botão de pausa |
| `coda-<w>-04-products-header.png` | cabeçalho de 2 colunas da seção de produtos |
| `coda-<w>-05-bento-1.png` a `09-bento-5.png` | um banner por arquivo, na ordem da página |
| `coda-<w>-10-why.png` | "Why Coda": título + grade |
| `coda-<w>-11-stats.png` | bloco de números |
| `coda-<w>-12-awards.png` | prêmios |
| `coda-<w>-13-explore.png` | painel "Explore more" |
| `coda-<w>-14-press.png` | "Featured press" |
| `coda-<w>-15-cta.png` | CTA final |
| `coda-<w>-16-footer.png` | rodapé |

Os 16 arquivos por seção existem para `<w>` = 1440, 1024, 768 e 390. As capturas de seção têm 24px de fundo em volta e o nav escondido.

Só em 1440:

| Arquivo | O que mostra |
|---|---|
| `coda-1440-03-hero-media-t01.png` … `t25.png` (t01, t05, t09, t13, t17, t21, t25) | 7 quadros do vídeo a cada 4s (a pílula do nav aparece por cima do topo) |
| `coda-1440-state-nav-dropdown-products.png` | dropdown de Products aberto, página desfocada atrás |
| `coda-1440-state-nav-dropdown-resources.png` | dropdown de Resources, com o card destacado |
| `coda-1440-state-btn-primary-hover.png`, `…-btn-secondary-hover.png` | par de botões do hero com um deles em hover (raio maior + seta) |
| `coda-1440-state-cta-btn-hover.png` | botão de vidro do CTA em hover |
| `coda-1440-state-bento-1-hover.png` … `bento-5-hover.png` | cada banner em hover (raio 26.88, chevron em seta, mídia alternativa nos banners 3, 4 e 5) |
| `coda-1440-state-video-paused-btn.png` | botão do vídeo no estado pausado (ícone de play) |
| `coda-1440-state-explore-card-hover.png` | card do carrossel em hover |
| `coda-1440-state-explore-slide-2.png`, `…-slide-3.png` | carrossel no 2º e no 3º card (vizinhos aparecendo, seta desabilitada no fim) |
| `coda-1440-detail-bento-label-1.png`, `…-label-5.png` | recorte do rótulo + texto + chevron de um banner |
| `coda-1440-detail-map-pins.png` | recorte do mapa com 3 pins |
| `coda-1440-detail-why-card.png` | um card "Why" |
| `coda-1440-detail-explore-arrows.png`, `…-explore-card-bar.png` | setas do carrossel; barra de texto do card |
| `coda-1440-detail-hero-pause.png` | canto do vídeo com o botão de pausa |
| `coda-1440-detail-footer-top.png`, `…-footer-bottom.png` | linha do topo e linha final do rodapé |

Só em 390:

| Arquivo | O que mostra |
|---|---|
| `coda-390-state-menu-open.png` | menu mobile aberto |
| `coda-390-state-menu-open-sub.png` | submenu de Products dentro do menu mobile |

## 8. O que não foi medido, e por quê

- **Limiar exato em que o nav some:** sei que está visível em scrollY = 120 e escondido em 600; não fiz a busca fina entre os dois.
- **Limiar exato do reveal:** medido em passos de 50px, fica entre 67% e 73% da altura do viewport.
- **Curva do carrossel:** inferida de amostras de posição a cada 60ms, não lida do código (a animação é em JS minificado).
- **Toque real:** arraste testado só com mouse em 1440. Swipe no carrossel e no menu em aparelho físico não foi testado.
- **Faixa 600–799px:** existem 120 regras em `(width >= 600px)`, mas 768 se comportou igual a 390 em tudo o que medi. Não auditei regra por regra.
- **Acima de 1600px:** valores vêm da folha de estilo (fator 1.2 fixo, mídia limitada a 1580px); não tirei screenshot.
- **Opacidade da 2ª palavra do rótulo:** estimada por pixel (entre 0.70 e 0.80 conforme a cor); o SVG não foi inspecionado caminho a caminho.
- **Fundo dos banners:** vem de uma imagem, não de CSS; os hex foram lidos nos screenshots e batem com os tokens (±1).
- **Linha do tempo do vídeo:** só 7 quadros amostrados; a ordem e a duração de cada cena são aproximadas.
- **Dropdowns de Solutions e Company e seletor de idioma:** não medidos em detalhe (mesma anatomia do de Products).
- **Geometria interna dos mockups** (celular, cartão, campo, pins): lida nos screenshots com precisão de ±3px, porque são imagens raster.
- **Espessura do traço dos ícones:** estimada em ~1.5px; os ícones são formas preenchidas, não há `stroke-width` para ler.
- **Banner de cookies:** não apareceu em nenhuma carga, então não há captura dele.
- **Focus e active:** o site não define estilos próprios (contorno padrão do navegador; nenhum `:active`). O anel de foco do v3 precisa ser desenhado por nós.
