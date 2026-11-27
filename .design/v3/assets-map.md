# assets-map — LP Snapp `/v3`

> Agente A3 · snapp-assets. Inventário de imagens, logos e componentes animados do repo e plano de visual para cada slot da `/v3`.
> Levantado em 26/11/2026 lendo os arquivos e abrindo as imagens. Só leitura no repo; este é o único arquivo criado.
> Medidas de banner usadas aqui: inteiro 1128×600, meio 555×600 (gap 18), padding 26, mobile ~358 de largura. Confirmar com o recon.

## 0. Achados que mudam o plano

1. **Não existe nenhum screenshot real do produto no repo.** Tudo o que parece "tela do Snapp" é render 3D estilizado (`checkouts.webp`, `checkout-layouts-3d.webp`) ou mockup inventado para a LP (mini-telas `.sc` da v2). A anatomia da seção 7 é a melhor reconstrução possível a partir disso e dos textos de `content/*.md`. Antes do build, vale pedir ao dono 3 ou 4 capturas reais (checkout no celular, order bump marcado, tela de teste A/B, lista de assinaturas) ou o ok dele para a "pele" proposta.
2. **Nenhuma imagem 3D deve entrar na `/v3`.** As `feature-*-3d` e as `feat3/*` são objetos de brinquedo em render brilhante (cursor, cesta, megafone, balança, porquinho), não UI de produto. Destoam da anatomia flat e nítida da referência e caem na regra "nada de imagem genérica". As `feat3/*` ainda têm fundo preto opaco (só funcionam com `mix-blend-mode: lighten` sobre preto, nunca sobre banner amarelo ou grafite). Recomendação: reconstruir todos os visuais em HTML/CSS/SVG.
3. **Os componentes animados da v2 carregam fatos que o conteúdo atual não sustenta.** Ao portar, corrigir (fonte: `llms-full.txt` e `content/*.md`):
   - "135+ moedas · 195 países" e "pelo IP do comprador" (`v2/app.js:441`, `v2/index.html:1218-1219`) → a oferta é criada em **16 moedas**, o checkout abre em **17 idiomas**, a detecção de idioma e moeda é **opcional e pelo país** do comprador, e a venda alcança **mais de 190 países**.
   - Hubs do globo com £, A$, C$, AED e R (`v2/app.js:5-12`) → libra, dólar australiano, dólar canadense, dirham e rand **não estão** na lista das 16 moedas. Pins do mapa só com real, dólar, euro, zloty, coroa tcheca, florim, leu, lira turca, peso mexicano, peso argentino, peso colombiano, sol, peso uruguaio, boliviano, iene e won.
   - Assinatura "trimestral" (`v2/index.html:1204`) → os ciclos são **diário, semanal, mensal ou anual**.
   - Cenários do chat com nomes de ferramenta que não existem no MCP (`create_product`, `set_delivery`, `set_pixel`, `read_page`, `translate`, `create_order_bump`, em `v2/app.js:236-247`), conferidos contra a lista de ferramentas do servidor MCP do Snapp conectado nesta sessão. Usar só os cenários com ferramentas reais: `list_sales`, `get_metrics`, `create_offer`, `update_offer`, `duplicate_offer`, `set_offer_upsell`, `create_ab_test`, `get_offer_analytics`, `get_offers_ranking`, `get_offer`.
   - "Rotmart" como nome de modelo de checkout (`v2/app.js:255`): parece referência velada a concorrente. Não levar para a `/v3`.
   - "Te aviso quando houver um vencedor com significância" (`v2/app.js:254`): o teste A/B mostra **visitas, vendas e faturamento** por oferta; significância não é prometida.
   - Link no formato `pay.snappcheckout.com/confeitaria-express` (`v2/app.js:239`) → o formato real é `pay.snappcheckout.com/c/codigo`.
   - E-mail de "oferta de upsell 24 h depois" (`v2/index.html:1262-1266`): o conteúdo só cita e-mail de confirmação e entrega, recuperação de carrinho com até dois lembretes e e-mail de venda recusada.
4. **Faixa de gateways: nenhum dos seis tem wordmark monocromático no repo.** Quatro não têm versão utilizável (Mercado Pago, Pagar.me, Efí, dLocal Go) e dois só têm o símbolo (Stripe, PayPal). `logo-openai.svg` tem 0 byte. Detalhe na seção 2.
5. **Os loops JS da v2 não respeitam `prefers-reduced-motion` direito** (chat e fluxo de e-mail disparam em alta velocidade, os arcos do globo continuam). Portar a coreografia, não o motor como está. Detalhe na seção 3.
6. `v2/fonts/` está **vazia**. A v2 só carrega Outfit pelo Google Fonts; a janela do Claude declara `"Inter"`, que nunca é carregada e cai em `system-ui`.

---

## 1. Imagens

Todos os `.png` de `/images/` são gêmeos pesados dos `.webp` (até 1,4 MB): nunca referenciar. `/images/` e `/v2/images/` repetem vários arquivos; a home e a v2 usam `/v2/images/`.

| URL | px | Peso | Fundo | O que mostra | Serve para (v3) |
|---|---|---|---|---|---|
| `/images/checkouts.webp` | 612×408 | 15 KB | Transparente; cartões claros com borda esfumada | Leque de 5 cartões de checkout claros. O central tem faixa preta no topo com selo de check dourado, stepper de 3 pontos, campos de nome e e-mail com ícone à esquerda, chips de bandeira (VISA, MASTERCARD, ELO), 3 tiles de forma de pagamento (cartão selecionado e PayPal) e CTA amarelo num painel preto | Só referência de anatomia. Baixa resolução e cara de render: não usar |
| `/images/checkout-layouts-3d.webp` (= `/v2/images/…`) | 1536×1024 | 62 KB | Preto opaco, sem alfa | Três modelos de checkout em 3D (A, central com moldura amarela e check, B) e uma chave A/B embaixo. Central: stepper de 3 passos, campo de e-mail, campo de cartão com cadeado, chips cartão / VISA / Mastercard / PIX / boleto, resumo com miniatura e "R$ 197,00", CTA amarelo. A: produto no topo e formulário. B: produto com preço no topo e chips de pagamento | Melhor referência de anatomia (seção 7). Não usar como imagem |
| `/v2/images/feature-upsell-3d.webp` (trim 866×837) | 1536×1024 | 35 KB (trim 37) | Transparente | Cursor branco 3D e tile com check amarelo | Não usar |
| `/v2/images/feature-order-bump-3d.webp` (trim 858×723) | 1503×1047 | 34 KB (trim 35) | Transparente | Cesta branca e preta, presente e moeda "+" | Não usar |
| `/v2/images/feature-ab-test-3d.webp` (trim 622×928) | 670×976 | 28 KB (trim 29) | Transparente | Teclas "A" e "B" com setas amarelas | Não usar |
| `/v2/images/feature-subscriptions-3d.webp` (trim 817×784) | 1536×1024 | 50 KB (trim 54) | Transparente | Calendário de mesa com setas de ciclo e cartão preto | Não usar |
| `/v2/images/feature-email-funnel-3d.webp` (trim 1088×716) | 1536×1024 | 42 KB (trim 43) | Transparente | Megafone preto soltando envelopes | Não usar |
| `/v2/images/feature-multi-currency-3d.webp` (trim 973×899) | 1536×1024 | 107 KB (trim 112) | Transparente | Globo preto com tiles de bandeira (EUA, Brasil, Espanha, Japão, Alemanha, Reino Unido) e símbolos $, €, £ | Não usar; £ e Reino Unido contradizem a lista de moedas |
| `/images/feature-cart-recovery-3d.webp` | 1536×1024 | 77 KB | Transparente | Alvo com dois dardos | Não usar |
| `/images/feature-sales-recovery-3d.webp` | 1402×1122 | 44 KB | Transparente | Painel preto com gráfico de barras e lupa | Não usar |
| `/v2/images/logo3d-stripe-paypal.webp` (trim 882×788) | 1024×1024 | 102 KB | Transparente | Dois tiles 3D: "S" roxo e "PP" azul | Não usar |
| `/v2/images/login-silver.webp` (trim 808×874) | 1024×1024 | 140 KB (trim 111) | Transparente | "S" do Snapp em cromo 3D com triângulo amarelo | Não usar na v3 (cromo destoa do flat) |
| `/v2/images/feat3/upsell-downsell.webp` | 1024×1024 | 46 KB | Preto opaco | Formulário com cursor clicando e duas setas para uma caixa aberta e uma caixa menor | Não usar. Serve de roteiro: compra, upsell, downsell |
| `/v2/images/feat3/order-bump.webp` | 1024×1024 | 39 KB | Preto opaco | Lista de 3 itens, o do meio com moldura tracejada amarela e check; caixa com "+" entrando | Não usar. Confirma a metáfora: item extra marcado dentro da lista |
| `/v2/images/feat3/ab-test.webp` | 1024×1024 | 38 KB | Preto opaco | Balança amarela com duas telas, coroa na vencedora | Não usar |
| `/v2/images/feat3/subscriptions.webp` | 1024×1024 | 45 KB | Preto opaco | Calendário, seta circular, moedas caindo num porquinho | Não usar |
| `/v2/images/feat3/email-delivery.webp` | 1024×1024 | 56 KB | Preto opaco | Celular com notificação de e-mail, envelope, chave, sino e caixa | Não usar |
| `/v2/images/feat3/multi-currency.webp` | 1024×1024 | 57 KB | Preto opaco | Livro aberto, moedas, bandeirinhas e um cartão de checkout | Não usar |
| `/v2/images/feat3/mcp-ai.webp` | 1024×1024 | 34 KB | Preto opaco | Balão de chat com estrela ligado por cabo a um painel com barras | Não usar |
| `/v2/images/pay/tile-pix.svg` | 100×100 | 0,9 KB | Tile branco | Glifo do Pix verde-água | Chip de forma de pagamento nos mockups de checkout |
| `/v2/images/pay/tile-applepay.svg` | 100×100 | 2,7 KB | Tile branco | Marca Apple Pay preta | Idem (mockup Stripe) |
| `/v2/images/pay/tile-googlepay.svg` | 100×100 | 1,5 KB | Tile branco | Marca Google Pay | Idem |
| `/v2/images/pay/tile-klarna.svg` | 100×100 | 0,4 KB | Tile rosa `#FFA8CD` | "K" da Klarna | Idem (opcional) |
| `/v2/images/pay/tile-cashapp.svg` | 100×100 | 1,1 KB | Tile verde `#00D632` | "$" do Cash App | Idem (opcional) |
| `/v2/images/flags/{ae,ar,au,br,ca,de,es,fr,gb,it,jp,mx,nl,pt,us,za}.png` | 80×40 a 80×56 | < 1 KB cada | Opaco | Bandeiras | Pins do mapa e seletor de moeda. Faltam pl, cz, hu, ro, tr, co, pe, uy, bo, kr |
| `/v2/images/world-countries.json` | 177 países | 166 KB (53 KB gzip) | — | GeoJSON `FeatureCollection`, propriedade `n` com o nome | Mapa do banner Multi-moeda |
| `/brand/og-snapp.png` | 1200×630 | 110 KB | Preto | Logo e "Checkout e link de pagamento para vender no mundo inteiro." | `og:image`, se a `/v3` levar |
| `/public/icon.png` | 1024×1024 | 429 KB | Preto | "S" branco com triângulo amarelo | Não usar (pesado); use `/brand/snapp-icon.svg` |
| `/images/ChatGPT Image 19 de mai. de 2026, 14_27_41.webp` | 1254×1254 | 19 KB | Branco com cantos pretos | Ícone de webhook (duplicata de `logo-webhook.webp`) | Ignorar (nome com espaço) |

Franqueza sobre as 3D: três problemas somados. Estética de pacote de ícones 3D gerado, que é o oposto do "produto real sangrando pela borda". Metáforas no lugar da tela (megafone para e-mail, porquinho para assinatura). E dado errado em duas delas (libra, Reino Unido). Reconstruir é mais trabalho e é o que entrega o pedido extra do dono.

---

## 2. Logos

Teste do filtro: `filter: brightness(0) invert(1)` transforma em branco tudo o que tem alfa. Funciona em SVG e em raster com fundo transparente. Em arquivo com fundo opaco vira um quadrado branco. Em logo com letra vazada dentro de uma forma preenchida (Mercado Pago, tile do Stripe) a letra some.

### Gateways (faixa "Funciona com os seus gateways")

| Marca | Melhor arquivo | Formato | Mono? | Serve no escuro? | Tratamento | Veredito |
|---|---|---|---|---|---|---|
| Stripe | `/images/logo-stripe.webp` (só o glifo "S" roxo, 296×390, alfa). `/v2/images/logo-stripe2.webp` é o tile roxo 512×512 | webp | Não | Glifo: sim, com filtro. Tile: vira quadrado branco | `brightness(0) invert(1)` no glifo | Parcial. Só símbolo, sem wordmark "stripe" |
| PayPal | `/v2/images/PayPal_Logo_Icon_2014.svg` (monograma em 3 azuis). `/v2/images/logo-paypal.webp` é o mesmo em raster 500×616 | svg | Não | Sim, com filtro (vira silhueta e perde a sobreposição dos dois "P") | `brightness(0) invert(1)` | Parcial. Só símbolo, sem wordmark |
| Mercado Pago | `/v2/images/logo-mercadopago.svg` (selo oval azul com aperto de mãos, 64×64) | svg | Não | Com filtro vira uma elipse branca chapada | — | **Sem versão utilizável. Redesenhar** |
| Pagar.me | `/v2/images/logo-pagarme.webp` (64×64, tile verde opaco) | webp | Não | Não | — | **Sem versão utilizável. Redesenhar** |
| Efí | `/v2/images/logo-efibank.webp` (240×240, laranja opaco, "efí BANK" escuro) | webp | Não | Não | — | **Sem versão utilizável. Redesenhar** |
| dLocal Go | `/v2/images/logo-dlocalgo.webp` (400×400, azul opaco, wordmark branco) | webp | Não | Só com gambiarra: `filter: grayscale(1) contrast(4) brightness(.7)` e `mix-blend-mode: screen`, e só sobre `#050505` | — | **Sem versão utilizável. Redesenhar** |

Recomendação para a faixa: seis wordmarks em SVG inline, uma cor só (`currentColor` em `#f5f5f5` com opacidade ~.72), mesma altura óptica (~24 px de altura de caixa), em `v3/images/logos/` ou como sprite. Os vetores devem vir do kit de marca oficial de cada gateway, não de desenho aproximado à mão. Se o build não puder buscar os vetores, o plano B honesto é a faixa tipográfica: os seis nomes em Outfit 600, mesma cor apagada, mais os dois símbolos que já funcionam (Stripe e PayPal). Nenhum slot fica vazio em nenhum dos dois casos.

### Tráfego

| Marca | Melhor arquivo | Formato | Mono? | Serve no escuro? | Tratamento |
|---|---|---|---|---|---|
| Meta | `/v2/images/logo-meta-color.svg` (símbolo azul em gradiente e texto branco; 948×191, **sem `viewBox`**) | svg | Não | Sim, como está | Colorido no tile de integração. Mono: filtro. Para uso inline, acrescentar `viewBox="0 0 948 191"` |
| Google Ads | `/v2/images/logo-googleads-color.svg` (149×27, símbolo colorido e texto branco) | svg | Não | Sim | Idem |
| TikTok Ads | `/v2/images/logo-tiktokads-color.svg` (viewBox 1000×291, 4 KB) | svg | Não | Sim | Idem. Evitar `logo-tiktokads.svg` (cinza, 25 KB) |
| Taboola | `/v2/images/logo-taboola-color.svg` (723×175, uma cor só, `#5FA8FF`) | svg | Sim (1 cor) | Sim | Filtro deixa branco |

As variantes sem `-color` (`logo-meta.svg`, `logo-googleads.svg`, `logo-taboola.svg`, `logo-tiktokads.svg`) são cinza-claro pensadas para a v1 clara. Com o filtro também viram branco, mas não acrescentam nada às `-color`.

### IA

| Marca | Melhor arquivo | Formato | Mono? | Serve no escuro? | Tratamento |
|---|---|---|---|---|---|
| Claude | `/v2/images/logo-claude.svg` (24×24, um path, `fill="#ffffff"`). Inline com `currentColor` em `v2/index.html:1103` | svg | Sim | Sim | Para tingir (laranja `#d97757` na janela), usar o inline |
| Anthropic | `/v2/images/logo-anthropic.svg` (24×24, `fill="#ffffff"`) | svg | Sim | Sim | Provavelmente dispensável: a marca que aparece é Claude |
| ChatGPT / OpenAI | **`/v2/images/logo-openai.svg` tem 0 byte.** O glifo existe inline em `v2/index.html:1104` | — | Sim | Sim | Copiar o path inline para a `/v3` (ou gravar `v3/images/logo-openai.svg`) |
| Cursor | `/v2/images/logo-cursor.svg` (24×24, `fill="#ffffff"`). Inline em `v2/index.html:1105` | svg | Sim | Sim | Como está |

### Snapp

| Uso | Arquivo | Notas |
|---|---|---|
| Wordmark sobre escuro (nav, rodapé) | `/v2/images/logo-snapp-white.svg` (igual a `/brand/snapp-logo-white.svg`) | viewBox 3253×771, proporção 4,22:1. "snap" branco, "p" e triângulo amarelos. Usar com `width`/`height` (93×22 no rodapé, 80×19 no nav, como nas páginas internas) |
| Wordmark sobre amarelo (CTA final, se for amarelo) | `/brand/snapp-logo.svg` com `filter: brightness(0)` | A versão preta mantém o "p" amarelo, que some sobre amarelo. O filtro deixa tudo preto |
| Símbolo | `/v2/images/logo-s-mark.svg` (560×610, 1 KB, transparente) | Usar nas linhas de ferramenta do chat e nos mockups. Substitui `logo-S.webp` (65 KB) que a v2 usa em 18 px |
| Ícone de app | `/brand/snapp-icon.svg` (1024, fundo preto) | Favicon e tiles |

---

## 3. Componentes reaproveitáveis

A home (`/index.html`) é a v2 com a copy atualizada e carrega o mesmo `/v2/app.js`. O markup equivalente fica cerca de 33 linhas abaixo do da v2 (janela do Claude em `index.html:1141`, fluxo em `1289`, painel em `1196`, `#globe2` em `1326`). As linhas abaixo são de `v2/`.

### 3.1 Janela do Claude (conversa com a IA)

- **JS:** `v2/app.js:202-360`. Ícones da barra lateral `212-219`, skins por host `220-230`, 11 cenários `231-276`, `applyHost` `285-297`, digitação `300-306`, blocos de ferramenta `311-320`, `play` `322-354`, início `358-359`.
- **Markup:** `v2/index.html:1108-1132` (janela), abas de host `1102-1106`, lista de casos `1134-1146`.
- **CSS:** `v2/index.html:401-493` (janela), skins ChatGPT e Cursor `495-520`, responsivo `521-532`.
- **Dependências:** nenhuma lib. Fonte declarada `"Inter"` (não carregada, cai em `system-ui`) e Georgia no wordmark "Claude". Lê os logos do DOM em `#iaTabs` (`app.js:277-278`): sem esse elemento o script quebra com `TypeError`.
- **Início e pausa:** começa na primeira interseção (`threshold .3`) e nunca pausa, nem fora da tela. Clicar num caso ou numa aba reinicia.
- **Reduced motion:** ruim. `sleep` é limitado a 60 ms, a digitação continua e a espera de 4,2 s entre cenários vira 60 ms: os cenários passam em disparada, em loop.
- **Para viver num banner:**
  1. Transformar em fábrica `chat(root, opts)` com seletores por atributo. Hoje são 17 `id` únicos (`#chatBody`, `#chatField`, `#win`, `#iaTabs`…), o que impede duas instâncias (hero e banner 7).
  2. Embutir os glifos como constantes, sem ler de `#iaTabs`.
  3. Converter px em `em` (base 13,5 px = 1 em) para a janela escalar com o container. A mini-janela `.sc-cl` (`v2/index.html:999-1027`) já está toda em `em` e é a melhor base.
  4. Tirar `min-height: 540px` do corpo e `height: 340px` das mensagens (`410`, `430`). Dimensionar pelo wrapper.
  5. **A sangria por baixo corta o que o chat tem de mais novo.** As mensagens rolam para o fim (`scrollTop`, `app.js:283`). Num banner com a base cortada, ancorar a conversa no topo, usar cenário curto que caiba na área visível (1 balão, 2 linhas de ferramenta, 2 linhas de resposta, 1 card pequeno, ~330 px) e deixar a sangria comer só o compositor.
  6. Trocar a sombra pesada (`0 50px 120px -40px`, linha `404`) por borda de 1 px: a referência quase não usa sombra.
  7. Sleep pausável (flag `paused` aguardada dentro do `sleep`) e, em reduced motion, renderizar o estado final de um cenário e não entrar em loop.

### 3.2 Globo e mapa (d3 + `world-countries.json`)

- **JS:** `v2/app.js:1-200`. Hubs `5-12`, produtos e valores `13-14`, pontos de moedas `18-24`, função `globe()` `26-197`, instâncias `198` (horizonte do hero) e `199` (globo com chips de venda, arrasto e rolagem).
- **Markup:** `v2/index.html:1065` e `1092` (canvas do hero), `1291-1294` (`#globe2` e `#sales`), fileira de bandeiras `1289`.
- **CSS:** `v2/index.html:718-742` (chip `.sale` em `728-736`), hero `336-342`.
- **Dependências:** `d3@7.9.0` (cdnjs), usando `geoOrthographic`, `geoPath`, `geoGraticule`, `geoInterpolate`, `geoDistance`, `geoContains`. Busca `/v2/images/world-countries.json` no carregamento, sem lazy.
- **Início e pausa:** `requestAnimationFrame` desde o load; só desenha se visível (`IntersectionObserver`). Sem pausa manual.
- **Reduced motion:** parcial. Para a rotação, os chips e as moedas, mas os arcos (`133-148`) e o pulso dos hubs (`151`) continuam.
- **Para viver num banner:** o renderizador é uma esfera ortográfica em canvas com arcos cheios em forma de cometa. O slot pede **mapa plano com arcos tracejados e pins em pílula**. Reaproveitar o dado e a lib, não o renderizador:
  - `d3.geoNaturalEarth1()` (ou `geoEquirectangular()`) com `fitWidth`, gerando `<path>` em **SVG** (nítido, estilizável por CSS, sem loop de `rAF`).
  - Arcos como curvas SVG com `stroke-dasharray` e `stroke-dashoffset` animado por CSS, o que dá pausa com `animation-play-state`.
  - Pins em HTML posicionados pelas coordenadas projetadas, partindo do estilo de `.sale`.
  - Carregar d3 e o JSON só quando o banner se aproximar da tela. Alternativa mais leve, a decidir pelo lead: gerar uma vez um `v3/images/world-map.svg` e posicionar os pins em porcentagem, sem d3 em runtime (d3 minificado tem ~280 KB).

### 3.3 Fluxo de e-mail

- **JS:** `v2/app.js:362-391` (`runLane` `369-379`, `loop` `382-389`).
- **Markup:** `v2/index.html:1255-1280` (duas raias de 5 nós).
- **CSS:** `v2/index.html:627-700`. Envelope que abre e aviãozinho `659-664`, anel do temporizador `665-671`, check que se desenha `672-674`, bolinha que viaja no conector `686-691`, **variante vertical já pronta** em `692-700`.
- **Dependências:** nenhuma. Preso ao `id="flow"`.
- **Início e pausa:** começa na interseção (`threshold .25`), `while (true)`, nunca pausa.
- **Reduced motion:** ruim. `sleep` vira 40 ms e o laço reinicia a cada ~0,6 s, piscando as classes.
- **Para viver num banner:** em 555 de largura cabem 3 nós na vertical (usar a variante de `692-700`); em 1128 cabem os 5 na horizontal. O preview do e-mail (`.node .prev`, linha `682`) some abaixo de 1000 px (`699`): promover a um card de e-mail próprio. Tirar `backdrop-filter` dos nós (`641`). Trocar o conteúdo pelos três e-mails que o produto tem de fato (ver ficha do banner 5). O verde `#2fd36e` dos nós finais é uma quarta cor: decidir se entra na família.

### 3.4 Mini-telas dos sete recursos

- **JS:** `v2/app.js:393-458`. Paths de ícones `396-406`, cursor `409`, HTML das sete cenas `413-450`, montagem `451-457`.
- **CSS:** `v2/index.html:852-1040`. Base `854-892`, upsell `894-908`, order bump `910-928`, A/B `930-955`, assinaturas `957-968`, e-mail `970-984`, multi-moeda `986-995`, mini-janela do Claude `997-1034`.
- **Dependências:** nenhuma. Usa `container-type: inline-size` e `font-size: 3.15cqw` (`854-855`): tudo em `em`, escala com o container.
- **Início e pausa:** animações CSS infinitas de 7 a 10 s; a classe `.on` liga e desliga (`857`), o que reinicia em vez de pausar.
- **Reduced motion:** bom. A regra global zera as animações (`836-839`) e o estado base é o quadro final; `1040` esconde cursor e elementos de passagem.
- **Para viver num banner:** são cartões escuros no estilo da LP, não a UI clara do checkout, e centralizados num quadrado. O que vale ouro é a **coreografia** (keyframes e tempos) e a técnica de escala. Portar os keyframes para dentro das molduras novas (celular, navegador) com a pele clara do checkout. Pausa: `animation-play-state: paused` por atributo no banner.

### 3.5 Marquee

- **JS:** `v2/app.js:500-526`. Clona até cobrir 2× a largura e anima com WAAPI pela largura medida; pausa no hover.
- **CSS:** `v2/index.html:534-543`. **Markup:** `1357-1368`.
- **Reduced motion:** bom (`if (reduced) return`).
- **Cuidado:** o script **remove a segunda metade dos filhos** (`505-507`) porque o HTML vem duplicado. Com um conjunto só no HTML ele apagaria metade dos logos. Sem pausa por teclado nem botão.
- **Uso na v3:** só se o recon mostrar que a faixa de logos vira marquee no mobile. No desktop são 6 logos parados numa linha.

### 3.6 Outros

- **Roleta dos tiles de pagamento do H1** (só na home): CSS `index.html:377-388`, script `index.html:1598-1612`. Troca pares de formas de pagamento a cada 2,4 s, para em reduced motion e com a aba oculta. Reuso possível no card "Checkout para Stripe" do carrossel.
- **Script inline da v2** (`v2/index.html:1421-1544`): reveal por `IntersectionObserver` (`1448-1450`), contadores `data-count` (`1452-1458`), Lenis (`1460-1469`), frase que acende (`1471-1491`), parallax do hero (`1493-1501`), botões magnéticos (`1503-1511`), spotlight nos cards (`1529-1537`), FAQ com um aberto por vez (`1539-1541`). Para a `/v3`, que é calma como a referência: reveal, contadores e o acordeão. O acordeão (`details` com `grid-template-rows` de `0fr` a `1fr`, CSS `773-784`) serve como está.
- **Código morto:** `v2/app.js:485-497` (troca de modelos de checkout num celular, `#shots`). O markup não existe em nenhuma página e as capturas também não.
- **`motion.js`, `motion.css` e `style.css` da raiz** só servem à `/v1` (tema claro). De `motion.js` vale copiar o padrão, não o arquivo: contador com `data-count` e `data-count-suffix` (`41-63`), reveal que só esconde depois que o JS confirma (`js-motion`) e a escuta de mudança de reduced motion durante a sessão (`124-130`).

---

## 4. Ícones

### O que existe

Não há set de ícones. São 23 SVGs inline na home, todos `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, geometria de Lucide/Feather, com espessuras misturadas: 3 nas setas dos botões, 2,2 e 2,6 nos nós do fluxo, 2 nos ícones do chat e das mini-telas, 1,8 na barra da janela. `stroke-linecap="round"` só em 2 ou 3 deles. As páginas internas só têm setas com espessura 3.

Paths prontos para reaproveitar (já no repo):

| Ícone | Onde | `d` |
|---|---|---|
| repeat | `v2/app.js:399` | `m17 2 4 4-4 4` · `M3 11v-1a4 4 0 0 1 4-4h14` · `m7 22-4-4 4-4` · `M21 13v1a4 4 0 0 1-4 4H3` |
| mail | `v2/app.js:401` | `<rect x="2" y="4" width="20" height="16" rx="2"/>` · `m22 7-10 6L2 7` |
| check | `v2/app.js:400` | `M20 6 9 17l-5-5` |
| spark | `v2/app.js:402` | `M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z` |
| gift | `v2/app.js:398` | ver arquivo |
| zap | `v2/app.js:403` | `M13 2 3 14h9l-1 8 10-12h-9z` |
| trophy | `v2/app.js:404` | ver arquivo |
| arrow-up | `v2/app.js:405` | `M12 19V5M5 12l7-7 7 7` |
| arrow-right | `v2/index.html:1057` | `M5 12h14M13 6l6 6-6 6` |
| chat | `v2/app.js:215` | `M21 12a8 8 0 01-11.6 7.2L4 21l1.8-5.4A8 8 0 1121 12z` |
| cart | `v2/index.html:1270` | ver arquivo |
| cursor (preenchido) | `v2/app.js:409` | `M5 3l14 7-6 2-2 6z` |

### Estilo único proposto

```
viewBox="0 0 24 24" fill="none" stroke="currentColor"
stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"
```

- Grade de 24 com área viva de 20×20 (2 px de respiro), raio 2 a 2,5 nos retângulos, só traço, sem preenchimento.
- Renderizar em 24 px (rótulo de banner, cards "Por que") e 20 px (dentro dos botões de 44 px). Evitar 16 px: o traço cai para ~1,2 px. Se precisar, classe com `stroke-width: 2`.
- 1,75 fica entre o 1,5 fino da referência e o 2 que o repo usa hoje, e segura ao lado do rótulo em Outfit 800 caixa-alta.
- Um sprite `<svg><symbol>` no topo de `v3/index.html` e `<use href="#i-…">`; cor herdada do banner.

### Lista (27)

Paths novos são ponto de partida geométrico: conferir no browser antes de fechar.

| # | id | Uso | Desenho |
|---|---|---|---|
| 1 | `i-upsell` | Rótulo banner 1 | Linha subindo: `M3 17l6-6 4 4 8-8` · `M15 7h6v6` |
| 2 | `i-bump` | Rótulo banner 2 | Sacola com mais: `M6 8h12l1 12H5L6 8z` · `M9 8V7a3 3 0 0 1 6 0v1` · `M12 12v5M9.5 14.5h5` |
| 3 | `i-ab` | Rótulo banner 3 | Caminho que se divide: `M12 21v-7` · `M12 14 6 8V3` · `M12 14l6-6V3` · `m3.5 5.5 2.5-2.5 2.5 2.5` · `m15.5 5.5 2.5-2.5 2.5 2.5` |
| 4 | `i-repeat` | Rótulo banner 4 (Assinaturas) | Reaproveitar `repeat` |
| 5 | `i-mail` | Rótulo banner 5 (E-mail) | Reaproveitar `mail` |
| 6 | `i-globe` | Rótulo banner 6 (Multi-moeda) | `<circle cx="12" cy="12" r="9"/>` · `M3 12h18` · `M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9s1.2-6.4 3.6-9z` |
| 7 | `i-ai` | Rótulo banner 7 (IA) | Balão `chat` com faísca dentro: `M12 8.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z` |
| 8 | `i-bank` | Por que: dinheiro direto na sua conta | `M3 10 12 4l9 6` · `M5 10v8M9.5 10v8M14.5 10v8M19 10v8` · `M3 20h18` |
| 9 | `i-percent` | Por que: sem mensalidade | `M19 5 5 19` · `<circle cx="7" cy="7" r="2.5"/>` · `<circle cx="17" cy="17" r="2.5"/>` |
| 10 | `i-layers` | Por que: vários gateways | `m12 3 9 5-9 5-9-5 9-5z` · `m3 12.5 9 5 9-5` · `m3 17 9 5 9-5` |
| 11 | `i-send` | Por que: e-mail sem ferramenta extra | `M21 3 10.5 13.5` · `M21 3l-6.5 18-4-7.5L3 9.5 21 3z` |
| 12 | `i-play-screen` | Por que: área de membros | `<rect x="3" y="4" width="18" height="14" rx="2.5"/>` · `m10.5 8.5 4.5 2.5-4.5 2.5z` · `M8 21h8` |
| 13 | `i-target` | Por que: pixels de tráfego | `<circle cx="12" cy="12" r="8.5"/>` · `<circle cx="12" cy="12" r="3.5"/>` · `M12 2v3M12 19v3M2 12h3M19 12h3` |
| 14 | `i-chevron-right` | Botão quadrado dos banners | `m9 6 6 6-6 6` |
| 15 | `i-chevron-down` | Nav | `m6 9 6 6 6-6` |
| 16 | `i-arrow-left` | Carrossel | `M19 12H5M11 6l-6 6 6 6` |
| 17 | `i-arrow-right` | Carrossel, links | `M5 12h14M13 6l6 6-6 6` |
| 18 | `i-arrow-up-right` | "Saiba mais" | `M7 17 17 7M8 7h9v9` |
| 19 | `i-play` | Botão de pausa do hero | `M8 5.5v13l10.5-6.5z` |
| 20 | `i-pause` | Botão de pausa do hero | `M9 5.5v13M15 5.5v13` |
| 21 | `i-menu` | Nav mobile | `M4 7h16M4 12h16M4 17h16` |
| 22 | `i-x` | Fechar menu | `M6 6l12 12M18 6 6 18` |
| 23 | `i-plus` | FAQ fechado | `M12 5v14M5 12h14` |
| 24 | `i-minus` | FAQ aberto | `M5 12h14` |
| 25 | `i-check` | Listas, preço, estados | `M20 6 9 17l-5-5` |
| 26 | `i-copy` | Campo de link | `<rect x="9" y="9" width="11" height="11" rx="2.5"/>` · `M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15` |
| 27 | `i-lock` | Campo de cartão nos mockups | `<rect x="5" y="11" width="14" height="9" rx="2.5"/>` · `M8 11V8a4 4 0 0 1 8 0v3` |

Os seis de "Por que" seguem as vantagens listadas no BRIEF; se a copy mudar um card, troca-se o ícone correspondente. Instagram no rodapé: glifo de contorno no mesmo traço.

---

## 5. Fichas de visual por slot

Convenções para todas as fichas:

- **Produto fictício único** em toda a página: "Planner Digital", US$ 27 (R$ 97, € 25). Order bump "Guia Rápido", +US$ 7. Upsell "Kit Avançado", US$ 37. Downsell "Kit Essencial", US$ 17. Assinatura "Clube do Planner", US$ 9 por mês. Compradora "Ana". Link `pay.snappcheckout.com/c/planner`. Site do vendedor `seusite.com`.
- **Mockups independentes da cor do banner.** As cores de apoio ainda dependem do ok do dono (decisão 3 do BRIEF). Cada moldura traz o próprio fundo (tela clara do checkout, janela escura do Claude) e o que encosta no banner (mapa, conectores, chips) usa variáveis do card: `--b-bg`, `--b-fg`, `--b-tint`.
- **Escala:** cada mídia num wrapper com `container-type: inline-size` e medidas em `em`/`cqw` (técnica de `v2/index.html:854-855`). O mesmo markup serve 1128, 555 e 358.
- **Zona de mídia estimada:** banner inteiro, de y≈190 até a base (≈410 px visíveis); meio banner, de y≈245 (≈355 px visíveis); mobile, ≈358×300. A mídia começa dentro dessa zona e passa da borda de baixo (o banner tem `overflow: hidden`).
- **Movimento:** recomendo coreografia **única e curta (até 5 s) ao entrar na tela**, terminando num quadro final que explica o recurso, em vez de loop infinito. Assim só o hero (e, se o lead quiser, os arcos do mapa) é animação contínua e precisa de botão de pausa. Se o lead preferir loops, cada banner ganha o próprio botão.

### 5.0 Primitivas compartilhadas (construir uma vez)

| Primitiva | O que é | Base no repo |
|---|---|---|
| `.dev-phone` | Moldura de celular: corpo `#0a0a0b`, raio 2,6 em, borda 0,5 em, ilha no topo, tela com `overflow: hidden` | Nova |
| `.dev-browser` | Janela de navegador: barra com 3 pontos e pílula de URL com cadeado | `.win-bar` (`v2/index.html:405-409`), `.sc-clbar` (`1001-1004`) |
| `.ck` | Pele clara do checkout (seção 7): cabeçalho, produto, campos, formas de pagamento, order bump, total, CTA | Nova, guiada por `checkout-layouts-3d.webp` |
| `.chip` | Pílula flutuante (venda aprovada, +US$ 7, preço no mapa) | `.sale` (`728-736`), `.sc-pill` (`884-885`), `.sc-st` (`891`) |
| `.cursor` | Cursor branco com contorno | `CUR` (`v2/app.js:409`), `.sc-cur` (`886`) |
| `.chatwin` | Janela do Claude em `em`, instanciável | `.win` (`401-493`) e `.sc-cl` (`999-1027`) |

### 5.1 Hero: mídia full-bleed

- **Tamanho-alvo:** 100vw × ~900 px, raio 24 só em cima, `overflow: hidden`. Mobile: 100vw × ~600.
- **O que mostra:** uma cena só, com causa e efeito. À esquerda a janela do Claude, à direita um celular com o checkout do Snapp, ligados por um conector tracejado. O vendedor pede no chat, o checkout nasce no celular, a compradora paga, a venda aparece.
- **Composição (desktop, sistema de 1440×900):**
  - Fundo: palco na cor escolhida pelo lead. Minha recomendação é **amarelo `#fed217`** com trama pontilhada em `rgba(10,10,11,.08)`: a janela escura e a tela branca do celular saltam, e é o equivalente em impacto ao vídeo da referência. Alternativa calma: palco grafite `#131315` com brilho amarelo na base. Se o palco for amarelo, o primeiro banner do bento não deve ser.
  - Janela do Claude: ~880×620, à esquerda (x≈150), topo em y≈120. A base passa da borda do palco.
  - Celular: ~320×660, à direita (x≈980), topo em y≈150, sobrepondo ~80 px a borda direita da janela. A base também sangra.
  - Conector: curva SVG tracejada do link do card de resultado até o topo do celular.
  - Chips: "Venda aprovada · US$ 34,00" sobre o canto superior esquerdo do celular.
  - Botão de pausa: quadrado de 44 px, raio 10, canto inferior direito (inset 24), ícones `i-pause` e `i-play`.
- **Reaproveita:** motor e markup do chat (`v2/app.js:300-354`, `v2/index.html:1108-1132`, CSS `401-493`) depois das mudanças da seção 3.1; cenário no formato de `S[]` (`231-276`); keyframes de clique de `894-928`.
- **Constrói do zero:** primitivas `.dev-phone` e `.ck`; a linha do tempo que sincroniza chat e celular; o conector; o botão de pausa; a composição mobile.
- **Microtextos:**
  - Usuário: "Cria um checkout para o Planner Digital por US$ 27, com order bump do Guia Rápido por US$ 7."
  - Ferramentas: `create_offer` "Planner Digital · USD 27" e `update_offer` "order bump: Guia Rápido · US$ 7".
  - Resposta: "Pronto. O checkout do **Planner Digital** está no ar por **US$ 27**, com o Guia Rápido como order bump."
  - Card: "Checkout criado · Ativo"; Oferta: Planner Digital; Preço: US$ 27,00; Order bump: Guia Rápido +US$ 7; Pagamento: Stripe + PayPal; link `pay.snappcheckout.com/c/planner` com "copiar".
  - Celular: cabeçalho com cadeado e "Pagamento seguro"; Planner Digital, US$ 27,00; campo "E-mail" (ana@email.com); campo "Cartão" (•••• 4242); caixa de order bump "Sim, quero o Guia Rápido · +US$ 7"; "Total US$ 34,00"; botão "Pagar agora"; estado final "Pagamento aprovado".
- **Animação (ciclo de ~16 s):** 0 a 3 s digita o pedido · 3 a 6,5 s envia, pensa, ferramentas marcam o check · 6,5 a 8 s resposta e card · 8 a 9 s o conector se desenha e a tela do celular sai do esqueleto para o checkout · 9 a 11,5 s o e-mail se preenche, o order bump é marcado e o total sobe de 27 para 34 · 11,5 a 12,5 s "Pagar agora" vira "Pagamento aprovado" · 12,5 a 14,5 s o chip de venda aparece e segura · 14,5 a 16 s reinicia.
- **Reduced motion:** quadro final estático (conversa completa com card, celular em "Pagamento aprovado", chip visível). Sem loop; o botão de pausa pode sumir.
- **Mobile (~390):** composição em retrato. Celular centralizado (~250 de largura) sangrando por baixo; a conversa vira um cartão de chat compacto (balão do usuário, uma linha de ferramenta, link) sobreposto ao canto superior do celular. Sem barra lateral (a v2 já a esconde abaixo de 720 px, `527-532`).
- **Risco:** alto. É a peça mais complexa (dois dispositivos sincronizados, pausa, duas composições). A janela reproduz a interface do Claude, como a home já faz. Com o texto em px ela fica ilegível ao escalar: converter para `em` antes de tudo.

### 5.2 Banner 1 · Upsell + Downsell one click (inteiro)

- **Formato:** sequência de janelas de navegador (o "marquee de telas" da referência, aqui com direção: é o caminho do funil).
- **O que mostra:** quatro janelas lado a lado, sangrando pela direita e por baixo: (1) checkout pago, (2) página de upsell, (3) página de downsell, (4) obrigado. Entre elas, conectores tracejados com as etiquetas "recusou" e "aceitou".
- **Fidelidade:** a página de upsell é **do vendedor**, feita no construtor dele, com os botões de aceitar e recusar que o Snapp entrega. Por isso as janelas 2 e 3 têm URL `seusite.com/oferta-especial` e uma etiqueta pequena "botões do Snapp" apontando para o par de botões. Não desenhar como tela hospedada pelo Snapp.
- **Reaproveita:** coreografia de clique e troca de estado de `v2/index.html:894-908`; botão com estado "ok" (`877-881`); cursor (`v2/app.js:409`).
- **Constrói do zero (HTML/CSS):** 4 instâncias de `.dev-browser` (~380×460 cada, topo em y≈225), conectores SVG, chip de total.
  - Janela 1: `pay.snappcheckout.com/c/planner`, selo "Pago", Planner Digital US$ 27.
  - Janela 2: título "Antes de sair: Kit Avançado", preço "US$ 37", botão amarelo "Sim, adicionar ao meu pedido", link "Não, obrigado".
  - Janela 3: título "Última chance: Kit Essencial", "US$ 17", mesmos botões.
  - Janela 4: "Pedido confirmado", linhas "Planner Digital US$ 27" e "Kit Essencial US$ 17", "Total US$ 44", "Acesso enviado para ana@email.com".
  - Chip: "+US$ 17 sem digitar o cartão de novo".
- **Animação:** cursor clica em "Não, obrigado" na janela 2 · o conector "recusou" acende e a fileira desliza uma janela para a esquerda · cursor clica em "Sim" na 3 · o botão vira "Adicionado em 1 clique" · o total da janela 4 sobe de 27 para 44 e o chip aparece. ~5 s.
- **Reduced motion:** janelas 2, 3 e 4 visíveis já no estado final.
- **Tamanho-alvo:** 1128×600. Mobile: uma janela em foco (~300 de largura) com a seguinte aparecendo na borda direita.
- **Risco:** médio. Quatro telas pedem conteúdo curto para não virar ruído. O "um clique" vale para cartão pela Stripe, PayPal com compra em um clique e Mercado Pago à vista; no Pix o comprador recebe um Pix novo. O visual mostra o caso do cartão e a copy não deve generalizar.

### 5.3 Banner 2 · Order bump (meio)

- **Formato:** celular.
- **O que mostra:** um celular (~300×620) centralizado, topo em y≈250, sangrando por baixo. Na tela, o checkout com o order bump sendo marcado. Fora do celular, um chip "+US$ 7 no mesmo pagamento".
- **Importante para o corte:** só ~350 px do celular ficam visíveis. A ordem da tela precisa ser cabeçalho, produto, **order bump**, total; campos e CTA ficam abaixo do corte.
- **Reaproveita:** cena 2 das mini-telas: markup `v2/app.js:419-423`, CSS e keyframes `v2/index.html:910-928` (caixa que passa de tracejada a sólida, check, valor que voa, total antigo que sai e novo que entra).
- **Constrói do zero:** `.dev-phone` + `.ck`.
  - Cabeçalho: cadeado, "Pagamento seguro".
  - Produto: miniatura, "Planner Digital", "Pagamento único", "US$ 27".
  - Order bump 1 (marcado): "Sim, quero o Guia Rápido", "Oferta só nesta página", "+US$ 7".
  - Order bump 2 (desmarcado): "Planilha de Metas", "+US$ 5". O produto aceita vários bumps por oferta.
  - Total: "US$ 27" passa a "US$ 34".
- **Animação:** toque no checkbox · caixa fica sólida e amarela · "+US$ 7" sobe · total troca. ~3 s.
- **Reduced motion:** bump 1 já marcado, total em US$ 34.
- **Tamanho-alvo:** 555×600; mobile 358 com o celular em ~240 de largura.
- **Risco:** baixo.

### 5.4 Banner 3 · Teste A/B (meio)

- **Formato:** gráfico (painel de resultado).
- **O que mostra:** um cartão de painel (~620×420) ancorado embaixo, sangrando pela direita e por baixo. No topo, um campo de link único com a divisão "50% · 50%". Abaixo, duas colunas, A e B, cada uma com uma miniatura de checkout em layout diferente e três métricas com barras.
- **Fidelidade:** o conteúdo diz que "um link divide o tráfego entre ofertas diferentes e mostra visitas, vendas e faturamento de cada uma". Mostrar exatamente essas três métricas. Sem "significância", sem nome de modelo inventado (usar "Versão A" e "Versão B").
- **Reaproveita:** cena 3: markup `v2/app.js:425-426`, CSS e keyframes `v2/index.html:930-955` (barras que crescem, selo que entra, coluna vencedora que destaca).
- **Constrói do zero:** o cartão de painel, as duas miniaturas (versão A com o produto no topo, versão B com o resumo embaixo, como nos modelos de `checkout-layouts-3d.webp`), as barras.
  - Campo: "Link do teste" `pay.snappcheckout.com/c/planner`.
  - Versão A: Visitas 1.204 · Vendas 35 · Faturamento US$ 945.
  - Versão B: Visitas 1.198 · Vendas 55 · Faturamento US$ 1.485. Selo "Vendendo mais".
- **Animação:** barras crescem, números contam, o selo entra na B. ~3 s.
- **Reduced motion:** números finais e selo visíveis.
- **Tamanho-alvo:** 555×600; mobile 358 com as colunas mais estreitas, métricas em linhas.
- **Risco:** médio-baixo. Muito número num espaço pequeno: limitar a três métricas e a dois tamanhos de texto.

### 5.5 Banner 4 · Assinaturas (meio, na posição que recomendo; ver nota em 5.7)

- **Formato:** cartão de plano com linha do tempo de cobranças.
- **O que mostra:** um cartão de plano (~420 de largura) com seletor de ciclo e, saindo dele para a direita, uma linha do tempo horizontal de cobranças que sangra pela borda: três cobradas, a próxima tracejada, as seguintes esmaecendo.
- **Reaproveita:** cena 4: markup `v2/app.js:428-430`, CSS `v2/index.html:957-968`; pílula de status `.sc-st` (`891`); ícone `repeat`.
- **Constrói do zero:** cartão, seletor segmentado, linha do tempo.
  - Cartão: "Clube do Planner", "US$ 9 / mês", status "Ativa", "Próxima cobrança: 12 dez".
  - Seletor: Diária · Semanal · **Mensal** · Anual (os quatro ciclos reais).
  - Linha do tempo: "12 set · Cobrado", "12 out · Cobrado", "12 nov · Cobrado", "12 dez · Agendada".
  - Rodapé do cartão: "Renovação automática pela Stripe ou pelo PayPal".
  - Contador: "Recebido US$ 27".
- **Animação:** os três pontos marcam o check em sequência, o contador sobe 9, 18, 27. ~3 s.
- **Reduced motion:** estado final.
- **Tamanho-alvo:** 555×600 (ou 1128×600 se a ordem do BRIEF for mantida: aí a linha do tempo ganha 8 pontos e ocupa a largura toda). Mobile: cartão em cima, linha do tempo sangrando à direita.
- **Risco:** baixo.

### 5.6 Banner 5 · Entrega por e-mail (meio)

- **Formato:** fluxo de nós.
- **O que mostra:** à esquerda, um fluxo vertical de três nós ligados por conectores; à direita, um cartão de e-mail aberto que sangra pela direita e por baixo. No topo da mídia, três abas pequenas: "Entrega", "Recuperação", "Venda recusada", que são os três e-mails que o produto envia.
- **Reaproveita:** nós, selos e conectores de `v2/index.html:641-691`, na variante vertical de `692-700`; envelope que abre e aviãozinho (`659-664`); anel do temporizador (`665-671`); check que se desenha (`672-674`); motor `runLane` (`v2/app.js:369-379`) com `sleep` pausável; cartão de e-mail da cena 5 (`v2/app.js:432-435`, CSS `970-984`).
- **Constrói do zero:** o cartão de e-mail como peça própria, as abas, o conteúdo das três automações.
  - Entrega (estado padrão): "Venda aprovada · Planner Digital · US$ 27" → "E-mail de confirmação · Enviado na hora" → "Acesso liberado".
  - Recuperação: "Checkout abandonado" → "Lembrete 1" → "Lembrete 2" (até dois, como no produto).
  - Venda recusada: "Pagamento recusado" → "E-mail para tentar de novo".
  - Cartão de e-mail: remetente "Loja da Ana", assunto "Seu acesso chegou", corpo "Olá, Ana. O Planner Digital já está liberado.", botão "Acessar conteúdo", anexo "planner-digital.pdf".
- **Animação:** o nó 1 acende, a bolinha viaja, o envelope abre, o avião sai e o cartão de e-mail entra. ~4 s, só a aba "Entrega". As outras duas abas trocam por clique.
- **Reduced motion:** os três nós concluídos e o cartão visível.
- **Tamanho-alvo:** 555×600; mobile com o fluxo em cima e o cartão sangrando embaixo.
- **Risco:** médio. Não repetir o fluxo "upsell por e-mail 24 h depois" da v2. Sem tempos inventados nos lembretes (o conteúdo não diz quanto tempo depois). O verde dos nós finais da v2 precisa de decisão de cor.

### 5.7 Banner 6 · Multi-moeda / vender no mundo (recomendo inteiro)

- **Nota de grade:** na ordem do BRIEF (inteiro / meio + meio / inteiro / meio + meio / inteiro), o mapa cairia num meio banner de 555 px e Assinaturas ficaria com o inteiro. Recomendo **trocar a posição dos dois**: inteiro para o mapa, meios para Assinaturas e E-mail. Na referência o mapa é um card inteiro, e em 555 px ele perde os continentes ou os pins. Se o lead mantiver a ordem, vale a variante de meio banner descrita no fim.
- **Formato:** mapa-múndi com arcos tracejados e pins de moeda em pílula.
- **O que mostra:** mapa plano ocupando toda a largura do banner (sangra pelos dois lados e por baixo; a Antártida fica fora), terra num tom mais claro da cor do card. Pins em pílula sobre as cidades dos compradores, cada um com bandeira e o preço da mesma oferta na moeda local. Arcos tracejados saem de cada pin e chegam a um pin especial, "Sua conta", com o símbolo do Snapp.
- **O que diferencia da referência:** os pins contam uma história do produto (a mesma oferta com sete preços) e todos os arcos convergem para a conta do vendedor, que é a promessa central do Snapp.
- **Reaproveita:** `/v2/images/world-countries.json`, d3 (`geoNaturalEarth1`, `geoPath`), coordenadas de `v2/app.js:5-12`, estilo do chip `.sale` (`v2/index.html:728-736`), bandeiras de `/v2/images/flags/`.
- **Constrói do zero:** o renderizador em SVG (~40 linhas), os arcos, as pílulas, a bandeira da Polônia (dois retângulos, em CSS).
  - Pins: São Paulo "R$ 97" (br) · Nova York "US$ 27" (us) · Cidade do México "MX$ 499" (mx) · Lisboa "€ 25" (pt) · Berlim "€ 25" (de) · Varsóvia "zł 99" (pl) · Tóquio "¥ 3.900" (jp).
  - Pin "Sua conta": símbolo `/v2/images/logo-s-mark.svg`, fundo amarelo, texto preto.
  - Etiqueta no canto: "16 moedas · 17 idiomas".
- **Animação:** as pílulas entram em cascata e os arcos se desenham até a conta (~3 s). Depois, opcional e contínuo: o tracejado caminha devagar em direção à conta. Se ficar contínuo, precisa de botão de pausa ou parar após alguns ciclos.
- **Reduced motion:** tudo desenhado e parado.
- **Tamanho-alvo:** 1128×600, projeção ajustada a ~1240 px de largura para o mapa passar das bordas. Mobile 358: recorte Américas e Europa, 4 pins. Variante de meio banner (555): mesmo recorte do mobile, 4 ou 5 pins.
- **Risco:** médio. Peso (d3 e JSON) pede carregamento sob demanda. Só moedas da lista de 16. O conteúdo diz que a detecção mostra a moeda local "sempre que a Stripe aceita aquela moeda", o que talvez permita libra: enquanto o dono não confirmar, fora. Pílulas se sobrepõem na Europa: no máximo três ali.

### 5.8 Banner 7 · IA por chat MCP (inteiro)

- **Formato:** janela do Claude com campo de input e botão.
- **O que mostra:** dois blocos. À direita, a janela do Claude em coluna (~480×560, sem barra lateral), topo em y≈100, sangrando pela direita e por baixo. À esquerda, abaixo do texto do banner, o "input com botão" da referência na nossa versão: três chips de pedido e um campo grande com o pedido digitado e o botão de enviar.
- **O que diferencia do hero:** no hero a janela divide a cena com o celular e a história é "pedir, vender". Aqui a janela está sozinha e o foco é a IA usando as ferramentas do Snapp e devolvendo um resultado em tabela. Os chips são clicáveis e trocam o cenário.
- **Reaproveita:** a mesma fábrica de chat do hero; cenários de `v2/app.js:231-276` que usam ferramentas reais: `S[0]` vendas de hoje, `S[4]` melhor order bump, `S[6]` funil de upsell e downsell, `S[7]` relatório do mês; cards de resultado (CSS `v2/index.html:458-478`); o padrão da lista de casos (`1134-1146`).
- **Constrói do zero:** o campo grande com botão amarelo, os chips, o layout em duas colunas.
  - Chips: "Quantas vendas tive hoje?", "Qual order bump converte mais?", "Monta um funil de upsell e downsell".
  - Campo: placeholder "Peça ao Claude…", botão quadrado amarelo com seta para cima.
  - Janela (cenário padrão): balão "Quantas vendas tive hoje?"; ferramentas `list_sales` "hoje" e `get_metrics` "aprovadas, reembolsos, upsell"; resposta "Hoje você teve **38 vendas aprovadas**, somando **US$ 1.246**."; card com 38 vendas, US$ 1.246 de receita, 11 upsells.
- **Animação:** o pedido é digitado no campo, o botão pulsa, a conversa acontece na janela. ~5 s e para no quadro final. Clicar num chip roda outro cenário.
- **Reduced motion:** conversa do cenário padrão já completa; chips continuam funcionando sem digitação animada.
- **Tamanho-alvo:** 1128×600. Mobile: chips em fileira rolável, campo, e a janela sangrando por baixo.
- **Risco:** médio. Depende da fábrica de chat do hero (construir uma vez, usar duas). Manter só o Claude na janela; ChatGPT e Cursor aparecem em Integrações. O `llms-full.txt` cita MCP para Claude e ChatGPT; Cursor só aparece na home.

### 5.9 Faixa de logos

- **O que mostra:** rótulo "Funciona com os seus gateways" à esquerda (15,7 px, apagado) e seis wordmarks numa linha: Stripe, PayPal, Mercado Pago, Pagar.me, Efí, dLocal Go.
- **Reaproveita:** nada utilizável como wordmark (seção 2).
- **Constrói do zero:** seis SVGs monocromáticos em `v3/images/logos/`, `fill="currentColor"`, altura de caixa ~24 px, cor `#f5f5f5` com opacidade ~.72. Vetores do kit oficial de cada marca.
- **Animação:** nenhuma no desktop. No mobile, seguir o que o recon medir (grade 3×2 ou marquee; se marquee, ver o cuidado da seção 3.5).
- **Tamanho-alvo:** uma linha dentro de 1128; ~6 × 110 px de largura óptica.
- **Risco:** médio. Depende de buscar os vetores fora do repo. Plano B: faixa tipográfica em Outfit 600.

### 5.10 Seis ícones dos cards "Por que o Snapp"

- Ícones 8 a 13 da seção 4, 24 px, traço 1,75, na cor do texto do card (`#f5f5f5`) ou em amarelo se o lead quiser um acento. Sem tile de fundo, como na referência.
- **Risco:** baixo. Trocar o ícone se a copy do card mudar.

### 5.11 Integrações (4 colunas com tile no topo)

- **O que mostra:** quatro tiles (~268×170, raio 16, superfície grafite com borda de 1 px), cada um com o logo e uma linha de evento que mostra o que a integração faz.
- **Proposta de agrupamento** (sete marcas em quatro colunas; a copy decide):
  1. Meta: logo e chip "Purchase · US$ 27 · enviado".
  2. Google Ads: logo e chip "Conversão · enviada".
  3. TikTok Ads e Taboola: os dois logos empilhados e chip "Pixel + API".
  4. IA por MCP: três glifos (Claude, ChatGPT, Cursor) em quadrados arredondados e chip `mcp.snappcheckout.com/mcp`.
- **Reaproveita:** `/v2/images/logo-meta-color.svg`, `logo-googleads-color.svg`, `logo-tiktokads-color.svg`, `logo-taboola-color.svg` (como estão, pois foram feitas para fundo escuro); glifos de IA inline (`v2/index.html:1103-1105`).
- **Constrói do zero:** os tiles e os chips de evento em HTML/CSS; trama pontilhada de fundo (a de `v2/index.html:630-632`).
- **Animação:** nenhuma, ou o check do chip se desenhando no reveal.
- **Risco:** baixo. Se o lead quiser a faixa toda monocromática, o filtro resolve nas quatro. O ChatGPT não tem arquivo válido: usar o path inline.

### 5.12 Preço

- **O que mostra:** ao lado (ou abaixo) do "3%", um **recibo de uma venda** em HTML: linhas alinhadas à direita, fonte mono nos valores.
  - "Venda aprovada … R$ 100,00"
  - "Taxa do Snapp (3%) … R$ 3,00"
  - "Mensalidade … R$ 0,00"
  - "Taxa de adesão … R$ 0,00"
  - Nota: "A taxa do gateway é cobrada pelo próprio gateway."
- **Fonte:** "Numa venda de R$ 100,00, a taxa do Snapp é de R$ 3,00" (`llms-full.txt:548`).
- **Reaproveita:** nada. **Constrói do zero:** o recibo (P). **Animação:** nenhuma.
- **Risco:** baixo. Não repetir o comparativo "Outros checkouts 4,9 a 10%" da v2 (`v2/index.html:1322-1337`): não tem fonte na página.

### 5.13 Carrossel "Explore mais" (7 cards)

Cada card leva um visual grande (alvo ~520×325, proporção 16:10; confirmar com o recon) sobre um campo de cor da família. São recortes e recombinações das primitivas, sem peça nova grande.

| Página | Visual | Reaproveita |
|---|---|---|
| `/link-de-pagamento` | **Campo de input com botão**: `pay.snappcheckout.com/c/planner` e botão "Copiar"; abaixo, quatro destinos em chips com ícone: Anúncio, WhatsApp, Instagram, E-mail | `i-copy`, `.chip` |
| `/checkout-para-infoprodutos` | Leque de três cartões de checkout (os modelos A, central e B), em CSS, com chips "Curso", "E-book", "Mentoria", "Assinatura" | Anatomia de `checkout-layouts-3d.webp`; `.ck` |
| `/checkout-stripe` | Bloco de pagamento do checkout: campo de cartão com cadeado, botões Apple Pay e Google Pay, chip "Conta Stripe conectada" | `/v2/images/pay/tile-applepay.svg`, `tile-googlepay.svg`; roleta opcional (`index.html:1598-1612`) |
| `/checkout-paypal` | Seletor de forma de pagamento com duas linhas, "Cartão" e "PayPal", a segunda selecionada, e botão "Pagar com PayPal" | `/v2/images/PayPal_Logo_Icon_2014.svg` |
| `/upsell-e-order-bump` | Recorte do banner 2 (caixa do order bump marcada) sobre o par de botões "Sim, adicionar" e "Não, obrigado" | `.ck`, banner 1 |
| `/area-de-membros` | Janela de navegador com a área de membros: lista de módulos à esquerda, player de vídeo com botão de play, aulas com progresso, chip "Acesso liberado" | `.dev-browser`, `i-play-screen` |
| `/vender-no-exterior` | Recorte do mapa com três pílulas (US$ 27, € 25, R$ 97) e a etiqueta "16 moedas · 17 idiomas" | Banner 6 |

- **Animação:** nenhuma dentro dos cards (o carrossel já se move).
- **Risco:** médio pelo volume (sete peças). A área de membros não tem nenhuma referência visual no repo: é o card mais inventado, manter genérico (módulos, aulas, player).

### 5.14 CTA final e rodapé

- **CTA:** a referência só tem headline e botão. Manter limpo. Se o lead quiser um elemento gráfico, o triângulo amarelo do logo (o "play" do Snapp) em escala grande, recortado no canto, com 6 a 8% de opacidade, ou o símbolo `/v2/images/logo-s-mark.svg` no mesmo tratamento. Sobre fundo amarelo, logo em preto com `filter: brightness(0)`. Não usar `login-silver.webp` (o "S" cromado da v2).
- **Rodapé:** `/v2/images/logo-snapp-white.svg` em 93×22, ícone de Instagram no traço do set. Sem ilustração, como na referência.
- **Risco:** baixo.

---

## 6. Construir do zero (consolidado)

| # | Peça | Técnica | Complexidade | Depende de |
|---|---|---|---|---|
| 1 | Primitivas: `.dev-phone`, `.dev-browser`, `.ck`, `.chip`, `.cursor` | HTML/CSS em `em` | M | Anatomia aprovada (seção 7) |
| 2 | Fábrica de chat `.chatwin` (porte de `v2/app.js:202-360`) | JS + CSS em `em`, pausável | M | — |
| 3 | Cena do hero (chat + celular + conector + pausa + mobile) | HTML/CSS/JS | G | 1, 2 |
| 4 | Banner 1: funil de quatro janelas | HTML/CSS + keyframes | M | 1 |
| 5 | Banner 2: celular com order bump | HTML/CSS + keyframes | P | 1 |
| 6 | Banner 3: painel de teste A/B | HTML/CSS + keyframes | M | 1 |
| 7 | Banner 4: plano e linha do tempo | HTML/CSS + keyframes | P | — |
| 8 | Banner 5: fluxo de nós e cartão de e-mail | HTML/CSS/JS (porte de `362-391`) | M | — |
| 9 | Banner 6: mapa com arcos e pílulas | d3 + SVG | M | Decisão sobre d3 em runtime |
| 10 | Banner 7: chips, campo com botão e janela | HTML/CSS/JS | M | 2 |
| 11 | Seis wordmarks de gateway em SVG mono | SVG (kit oficial) | M | Buscar vetores fora do repo |
| 12 | Sprite de 27 ícones | SVG | M | — |
| 13 | Quatro tiles de integração | HTML/CSS | P | — |
| 14 | Recibo do preço | HTML/CSS | P | — |
| 15 | Sete visuais do carrossel | HTML/CSS (recortes) | G no total | 1, 9 |
| 16 | Bandeira da Polônia (e outras, se entrarem mais pins) | CSS ou SVG | P | — |
| 17 | Glifo do ChatGPT em arquivo válido | SVG (path já existe inline) | P | — |
| 18 | Botão de pausa e controle de reduced motion comuns | JS | P | — |

Ordem sugerida: 1 e 2 primeiro (destravam 3, 4, 5, 6, 10 e 15), depois 12 e 11, depois os banners em paralelo.

---

## 7. Anatomia da UI do Snapp

**Aviso:** não há captura real no repo. O que segue vem de `checkout-layouts-3d.webp`, `checkouts.webp`, das mini-telas da v2 e dos textos de `content/*.md`. Tratar como pele aprovável, a conferir com o dono.

### Checkout

Visto nas duas imagens de checkout (os três modelos de `checkout-layouts-3d.webp` concordam entre si):

- **Cartão claro sobre fundo escuro.** Superfície branca ou off-white, cantos bem arredondados (~16 a 20 px), texto escuro.
- **Faixa preta no topo** em dois dos três modelos, com a identidade da oferta.
- **Stepper de 3 passos:** três pontos ligados por linha, o ativo em amarelo.
- **Campos com ícone à esquerda:** envelope (e-mail), pessoa (nome), cartão (número) com **cadeado à direita**.
- **Linha de formas de pagamento** em chips quadrados: cartão, VISA, Mastercard, PIX, boleto (código de barras). Em `checkouts.webp` aparecem também tiles de PayPal.
- **Resumo do produto:** miniatura quadrada escura com ícone amarelo, duas ou três linhas de texto e o preço alinhado à direita ("R$ 197,00"). Fica no topo (modelos A e B) ou logo acima do botão (modelo central).
- **CTA amarelo em largura total**, texto escuro, cantos arredondados.
- **Seis modelos de layout** existem no produto (`llms-full.txt:129`); as imagens mostram três arranjos: produto no topo e formulário; stepper e formulário com resumo embaixo; produto com preço no topo e chips de pagamento.

Pele proposta para `.ck`: fundo `#ffffff`, texto `#111113`, texto secundário `#6b6b72`, borda `#e7e7e4`, raio 16; campos de 44 px com borda de 1 px e ícone de 20 px; chips de pagamento de 40×28 com borda; CTA `#fed217` com texto `#0a0a0b`, 48 px de altura, raio 12; cabeçalho com cadeado e "Pagamento seguro"; preço em Outfit 600.

Do conteúdo, para os microtextos: o checkout abre em 17 idiomas; aceita cartão, Pix, boleto, PayPal, Apple Pay e Google Pay conforme os gateways ligados; o QR Code do Pix aparece dentro do checkout; para produto digital a coleta de endereço pode ser só país e código postal; há cupom de desconto.

### Order bump

- Fica **na tela do pagamento**, entra na mesma cobrança.
- Cada oferta aceita **vários**, cada um com nome, preço, imagem, chamada e entregável próprios; a ordem é arrastável no painel.
- Na mini-tela da v2 (`v2/app.js:419-423`): caixa com borda amarela e fundo amarelo translúcido, checkbox quadrado à esquerda, título "Sim! Adicionar o …", subtítulo "Oferta só aqui no checkout", preço "+$7" à direita; antes de marcar, a borda é tracejada. `feat3/order-bump.webp` usa a mesma ideia: item do meio com moldura tracejada amarela.

### Upsell e downsell

- Aparecem **depois da compra aprovada**, numa página do vendedor, com um script e os botões de aceitar e recusar que o Snapp entrega. Uma página pode oferecer mais de um produto. O preço é definido no servidor do Snapp.
- Cada upsell pode ter um downsell, e o downsell pode ter um segundo; dá para encadear vários upsells; no fim, página de obrigado.
- Um clique: cartão pela Stripe (pagamento único ou assinatura); Amazon Pay, Cash App Pay e Klarna pela Stripe; PayPal com compra em um clique ligada; cartão pelo Mercado Pago à vista. Pix: Pix novo com os dados preenchidos e QR Code válido por 30 minutos. Cartão recusado: o comprador vai para um checkout alternativo.
- Na mini-tela (`v2/app.js:415-417`): etiqueta "Oferta única", produto com "+$17", botão "Sim, quero adicionar" que vira "Adicionado ao pedido", link "Não, obrigado".

### E-mail

- Tipos reais: **confirmação com o arquivo ou o link do produto** (no idioma do checkout), **acesso à área de membros**, **recuperação de carrinho com até dois lembretes**, **venda recusada**.
- Na mini-tela (`v2/app.js:432-435`): cabeçalho "Snapp · E-mail · agora", título "Seu acesso chegou!", texto curto, botão "Acessar conteúdo".
- No fluxo da v2 (`v2/index.html:1258-1278`): nós com rótulo pequeno em caixa-alta (Gatilho, E-mail, Aguardar, Resultado), título, linha de meta e selo redondo de 56 px.

### Painel

Não há nenhuma imagem do painel. O que o conteúdo descreve:

- Menu **Adquirentes** (conectar Stripe, PayPal e os outros gateways; várias contas por gateway).
- **Ofertas** com nome, preço, moeda, entregável, liga e desliga por forma de pagamento, modelo de layout.
- **Integrações**, com aba **Domínios** (CNAME) e os pixels.
- **Taxas e Pagamentos**: por venda, o valor, a taxa do Snapp, a taxa do gateway e o lucro líquido; resumo por gateway; exportação.
- **Teste A/B**: um link, várias ofertas, visitas, vendas e faturamento de cada uma.
- **Compra teste** pelo próprio painel.
- Área de membros com módulos, aulas em vídeo e arquivos; aba Shopping; até 3 aparelhos por aluno.

Para os mockups de painel (banner 3, card da área de membros), usar a superfície escura da LP (`#111113`, borda `rgba(255,255,255,.08)`, texto `#f5f5f5`), tabelas e pares rótulo/valor no estilo dos cards de resultado do chat (`v2/index.html:458-478`), sem inventar navegação.

### Chat (MCP)

- Servidor em `https://mcp.snappcheckout.com/mcp`, conectado ao Claude e ao ChatGPT (a home cita também o Cursor).
- Cada resposta mostra: balão do usuário, bloco "Ferramenta utilizada" com uma linha por chamada (símbolo do Snapp, nome da ferramenta em mono, argumento apagado, check), texto da resposta e um card de resultado (tabela, pares rótulo/valor ou três números).
- Cores da janela do Claude na v2 (`v2/index.html:402`): fundo `#262624`, lateral `#1f1e1b`, texto `#e8e6df`, apagado `#9a978f`, balão `#3a3936`, acento `#d97757`, campo `#30302d`.

---

## 8. Pendências para o lead e para o dono

1. **Capturas reais do produto** (ou ok para a pele da seção 7).
2. **Vetores oficiais dos seis gateways** (ou ok para a faixa tipográfica).
3. **Troca de posição** entre Assinaturas e Multi-moeda no bento, para o mapa ficar no banner inteiro.
4. **Cor do palco do hero** (amarelo recomendado) e das cores de apoio; se o verde de status (`#2fd36e` no fluxo e `#4ade80` nas mini-telas, hoje dois verdes diferentes) entra na família.
5. **Moedas nos pins:** confirmar se a detecção exibe moedas fora da lista de 16 (libra, por exemplo).
6. **Cursor** ao lado de Claude e ChatGPT em Integrações: o `llms-full.txt` cita só os dois primeiros para MCP.
7. **Loops ou coreografia única** nos banners (afeta quantos botões de pausa a página precisa).
8. **d3 em runtime ou mapa pré-gerado** em `v3/images/world-map.svg`.
