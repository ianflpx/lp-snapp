# Content map · LP Snapp Checkout `/v3`

Copy final em PT-BR, seção por seção, na ordem do "Mapa de seções" do `BRIEF.md`. Cada afirmação factual leva a fonte ao lado.

**Como ler**

- Fontes: `index.html` é a home atual; `content/<slug>.md` são as páginas de recurso (base mais auditada, é dela que saem `llms.txt` e `llms-full.txt`); `v2/app.js` são os mockups animados que a home carrega; `tools/build.mjs` traz as regras do dono e o rodapé das páginas internas.
- `<br>` marca quebra de linha obrigatória. Nesses casos a contagem vem por linha.
- A contagem inclui espaços e pontuação.
- **ilustrativo** = dado de demonstração (nome de produto, valor, nome de pessoa). Só pode aparecer dentro de mockup e nunca como afirmação sobre o produto.
- Onde a home e as páginas de `content/` se contradizem, a copy abaixo segue `content/` e a divergência está em "Dúvidas para o dono". Nada foi escolhido em silêncio.

**Âncoras que a página precisa ter:** `#recursos` (bento), `#ia` (banner da IA), `#por-que`, `#integracoes`, `#precos`, `#faq`.

---

## 0. Meta da página

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| `<title>` | Snapp Checkout: checkout e link de pagamento para infoprodutos | 62 (máx. 62) | index.html:6 (mesmo título da home; a v3 é noindex e não disputa busca) |
| `description` | Checkout e link de pagamento para infoprodutos, com Stripe, PayPal e Pix, upsell em um clique e área de membros. 3% por venda aprovada, sem mensalidade. | 152 (máx. 160) | index.html:7 |
| `robots` | noindex, nofollow | n/a | v1/index.html:5; BRIEF.md:17 |

Sem JSON-LD de FAQ na v3: a página é noindex e a home já declara o FAQPage (index.html:183).

---

## 1. Nav em pílula

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Logo (alt) | Snapp Checkout | 14 | index.html:1081 (`/v2/images/logo-snapp-white.svg`) |
| Logo (aria-label do link) | Snapp Checkout, início | 22 | index.html:1081 |
| Link 1 | Recursos | 8 | index.html:1083 → `#recursos` |
| Link 2 | Preço | 5 | index.html:1085 → `#precos` |
| Link 3 | FAQ | 3 | index.html:1086 → `#faq` |
| Link de login | Entrar | 6 | index.html:1088 → `https://admin.snappcheckout.com/login` |
| Botão primário | Começar agora | 13 | index.html:1089 → `https://admin.snappcheckout.com/register` |
| Botão do menu no mobile (aria-label) | Abrir menu | 10 | index.html:1090 (a home usa "Menu") |

### Dropdown de "Recursos" (se o chevron abrir um painel)

Rótulo e linha de apoio saem do `nav:` e do `card:` de cada página. Recomendo o dropdown: ele usa páginas que já existem e repete o chevron do nav de referência. Sem dropdown, "Recursos" só rola até `#recursos`.

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Item 1 → `/link-de-pagamento` | Link de pagamento | 17 | content/link-de-pagamento.md:5 |
| Item 1, apoio | Crie o link, compartilhe e receba com cartão, Pix, boleto ou PayPal. | 68 (máx. 90) | content/link-de-pagamento.md:6 |
| Item 2 → `/checkout-para-infoprodutos` | Checkout para infoprodutos | 26 | content/checkout-para-infoprodutos.md:5 |
| Item 2, apoio | O que o Snapp faz para quem vende curso, e-book, mentoria e assinatura. | 71 (máx. 90) | content/checkout-para-infoprodutos.md:6 |
| Item 3 → `/checkout-stripe` | Checkout para Stripe | 20 | content/checkout-stripe.md:5 |
| Item 3, apoio | Use a sua conta Stripe com upsell em um clique, Apple Pay, Google Pay e assinaturas. | 84 (máx. 90) | content/checkout-stripe.md:6 |
| Item 4 → `/checkout-paypal` | Checkout com PayPal | 19 | content/checkout-paypal.md:5 |
| Item 4, apoio | PayPal no mesmo checkout do cartão, com assinatura e entrega automática. | 72 (máx. 90) | content/checkout-paypal.md:6 |
| Item 5 → `/upsell-e-order-bump` | Upsell e order bump | 19 | content/upsell-e-order-bump.md:5 |
| Item 5, apoio | Order bump na tela do pagamento e funil de upsell e downsell depois da compra. | 78 (máx. 90) | content/upsell-e-order-bump.md:6 |
| Item 6 → `/area-de-membros` | Área de membros | 15 | content/area-de-membros.md:5 |
| Item 6, apoio | Aulas e arquivos numa área própria, liberada quando o pagamento é confirmado. | 77 (máx. 90) | content/area-de-membros.md:6 |
| Item 7 → `/vender-no-exterior` | Vender no exterior | 18 | content/vender-no-exterior.md:5 |
| Item 7, apoio | Oferta em 16 moedas, checkout em 17 idiomas e formas de pagamento de cada país. | 79 (máx. 90) | content/vender-no-exterior.md:6 |

---

## 2. Hero centralizado

### H1 (72px, peso 800, 2 linhas, até ~28 caracteres por linha)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| **Opção A (recomendada)** | Venda para o mundo inteiro.<br>O checkout faz o trabalho. | 27 + 26 (máx. 28 por linha) | index.html:1321 ("Venda facilmente para o mundo inteiro"); index.html:1109-1115 ("um checkout que faz o trabalho por você"); alcance em content/vender-no-exterior.md:51 |
| Opção B | Venda globalmente e deixe<br>o checkout fazer o trabalho | 25 + 27 (máx. 28 por linha) | index.html:1103-1115 |
| Opção C | Seu checkout vende lá fora<br>e faz o trabalho por você | 26 + 25 (máx. 28 por linha) | index.html:1103-1115; content/vender-no-exterior.md:10 |

Por que a A: são duas frases inteiras, cada uma numa linha, com largura quase igual (o bloco centralizado fica reto). A primeira diz para onde se vende e a segunda diz o que o Snapp tira das costas de quem vende. A B é a mais fiel à frase da home, mas a quebra cai no meio da ideia. A C guarda o "por você", só que "lá fora" deixa o Brasil de fora da promessa. Se quiser o amarelo da marca numa palavra, como a home faz com "globalmente" (index.html:1104), use em "mundo inteiro".

Os logos de Stripe e PayPal que hoje ficam dentro do H1 da home passam para a faixa de logos (seção 3).

### Lead e CTAs

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| **Lead (recomendado)** | Conecte seus gateways e publique um checkout com upsell, order bump e entrega por e-mail. Depois, crie ofertas e veja as vendas pelo chat da sua IA. | 148 (máx. 150) | index.html:1117; o que a IA faz em content/checkout-para-infoprodutos.md:45 |
| Lead alternativo (com o prazo, sem a IA) | Em menos de 10 minutos, conecte seus gateways e publique um checkout com upsell, order bump e entrega por e-mail. | 113 (máx. 150) | index.html:1117 |
| CTA primário | Começar agora | 13 | index.html:1119 → `https://admin.snappcheckout.com/register` |
| CTA secundário | Ver a IA em ação | 16 | index.html:1120 → `#ia` |

A home diz "gerencie tudo por chat" (index.html:1117). Troquei "tudo" pelo que `content/` confirma que a IA faz: criar ofertas e consultar vendas. O prazo de 10 minutos saiu do lead recomendado para caber em duas linhas e foi para a faixa de números (seção 8, com ressalva).

---

## 3. Faixa de logos

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Label | Funciona com os seus gateways | 29 | BRIEF.md:68; fato em content/_llms.md:9 |
| Logo 1 (alt) | Stripe | 6 | index.html:1273 (`/v2/images/logo-stripe2.webp`) |
| Logo 2 (alt) | PayPal | 6 | index.html:1274 (`/v2/images/logo-paypal.webp`) |
| Logo 3 (alt) | Mercado Pago | 12 | index.html:1275 (`/v2/images/logo-mercadopago.svg`) |
| Logo 4 (alt) | Pagar.me | 8 | index.html:1275 (`/v2/images/logo-pagarme.webp`) |
| Logo 5 (alt) | Efí | 3 | index.html:1275 (`/v2/images/logo-efibank.webp`; a home usa alt "Efí Bank" e texto "Efí") |
| Logo 6 (alt) | dLocal Go | 9 | index.html:1275 (`/v2/images/logo-dlocalgo.webp`) |

As fontes listam 8 gateways. Whop (tem logo em `/v2/images/logo-whop.png`) e XPag (sem logo no repo) ficam fora da faixa de 6 do BRIEF. Ver dúvida 10.

---

## 4. Mídia full-bleed (checkout no celular + janela do Claude)

Nenhuma copy de marketing aqui. Só textos de interface e de mockup.

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Descrição acessível da composição | Demonstração do Snapp: um checkout no celular recebe um pagamento e, ao lado, uma conversa no Claude consulta as vendas do dia. | 127 | texto novo, descreve o que o mockup mostra |
| Botão de pausa (aria-label) | Pausar a animação | 17 | texto novo, rótulo de interface |
| Botão de pausa, estado pausado | Retomar a animação | 18 | texto novo, rótulo de interface |
| Celular: produto | Planner Digital | 15 | ilustrativo (v2/app.js:415) |
| Celular: preço | $27 | 3 | ilustrativo (v2/app.js:415) |
| Celular: order bump | Sim! Adicionar o Guia Rápido | 28 | ilustrativo (v2/app.js:420) |
| Celular: preço do bump | +$7 | 3 | ilustrativo (v2/app.js:420) |
| Celular: total | Total $34 | 9 | ilustrativo (v2/app.js:421) |
| Celular: formas de pagamento | Cartão, Pix, PayPal, Apple Pay, Google Pay | 42 | real: content/checkout-para-infoprodutos.md:27 (ícones em `/v2/images/pay/`) |
| Celular: botão | Pagar agora | 11 | ilustrativo (v2/app.js:415) |
| Celular: estado final | Pago | 4 | ilustrativo (v2/app.js:415) |
| Claude: barra de endereço | claude.ai | 9 | v2/app.js:221 |
| Claude: pergunta do usuário | Quanto vendi hoje no Snapp? | 27 | ilustrativo (v2/app.js:445) |
| Claude: status | Consultando o Snapp… | 20 | v2/app.js:446 |
| Claude: chamada de ferramenta | get_metrics · Snapp · hoje | 26 | v2/app.js:446 (o nome `get_metrics` existe no conector MCP do Snapp) |
| Claude: resposta | Hoje você vendeu $1.284 em 37 pedidos. O pico foi às 20h. | 57 | ilustrativo (v2/app.js:447) |
| Claude: campo de texto | Responder ao Claude… | 20 | v2/app.js:448 |
| Claude: rodapé | Claude é uma IA e pode cometer erros. | 37 | v2/app.js:223 |

---

## 5. Cabeçalho "Explore os produtos" (2 colunas)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| H2 | O que já vem dentro do checkout | 31 (máx. 40) | index.html:1192 ("dentro do mesmo checkout") |
| Lead | Sete ferramentas dentro do mesmo checkout, para vender mais na mesma visita e cuidar do que acontece depois da compra. | 118 (máx. 160) | index.html:1192; content/checkout-para-infoprodutos.md:14 e :18 |
| H2 alternativo | As ferramentas do seu checkout | 30 (máx. 40) | index.html:1192 |

A continuação da home, "Nenhum app externo, nenhuma integração manual" (index.html:1192), saiu. A página do upsell é feita no construtor do próprio vendedor (content/upsell-e-order-bump.md:26), então a frase não se sustenta inteira.

---

## 6. Bento de banners (7 ferramentas)

**Grade proposta:** inteiro (Upsell e downsell) / meio + meio (Order bump, Teste A/B) / inteiro (Multi-moeda, com o mapa) / meio + meio (Assinaturas, Entrega por e-mail) / inteiro (IA por chat, com `id="ia"`). O mapa e a janela do Claude pedem largura total. Se a ordem do BRIEF for mantida, os corpos abaixo ainda cabem: só Upsell e IA passam de 110 caracteres, e os dois são de largura inteira nas duas grades.

### 6.1 Upsell e downsell (inteiro)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Rótulo | UPSELL E DOWNSELL | 17 | index.html:1215 |
| Corpo | Depois da compra aprovada, o comprador aceita a próxima oferta em um clique no cartão. Se recusar, vê o downsell, mais barato. | 126 (máx. 130) | content/upsell-e-order-bump.md:10, :15 e :16 |
| Botão de chevron (aria-label) | Conhecer o upsell em um clique | 30 | n/a |
| Destino | `/upsell-e-order-bump` | n/a | página existe |
| Ícone sugerido | cursor de clique | n/a | n/a |

Microtextos do mockup:

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Compra: produto e preço | Planner Digital · Pagamento único · $27 | 39 | ilustrativo (v2/app.js:415) |
| Compra: botão e estado | Pagar agora → Pago | 18 | ilustrativo (v2/app.js:415) |
| Upsell: selo | Oferta única | 12 | ilustrativo (v2/app.js:416) |
| Upsell: produto e preço | Pacote Bônus · Só nesta página · +$17 | 37 | ilustrativo (v2/app.js:416) |
| Upsell: botão de aceitar | Sim, quero adicionar | 20 | ilustrativo (v2/app.js:416); o botão de aceitar existe (content/upsell-e-order-bump.md:26) |
| Upsell: estado | Adicionado ao pedido | 20 | ilustrativo (v2/app.js:416) |
| Upsell: botão de recusar | Não, obrigado | 13 | ilustrativo (v2/app.js:416); o botão de recusar existe (content/upsell-e-order-bump.md:26) |
| Downsell: produto e preço | Kit Essencial · $17 | 19 | ilustrativo (v2/app.js:257) |
| Pílula | +$17 no pedido com 1 clique, sem digitar o cartão | 49 | valor ilustrativo (v2/app.js:417); "sem digitar os dados de novo" em content/upsell-e-order-bump.md:15 |

O um clique vale para cartão pela Stripe, PayPal com a compra em um clique ligada e cartão à vista pelo Mercado Pago. Quem pagou no Pix recebe um Pix novo (content/upsell-e-order-bump.md:30-37). Por isso o corpo diz "no cartão".

### 6.2 Order bump (meio)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Rótulo | ORDER BUMP | 10 | index.html:1222 |
| Corpo | Ofertas complementares na tela do pagamento. O comprador marca as que quiser e paga tudo de uma vez. | 100 (máx. 110) | content/upsell-e-order-bump.md:14 e :20 |
| Botão de chevron (aria-label) | Conhecer o order bump | 21 | n/a |
| Destino | `/upsell-e-order-bump#como-funciona-o-order-bump-no-snapp` | n/a | âncora existe em upsell-e-order-bump/index.html |
| Ícone sugerido | caixa de seleção com sinal de mais | n/a | n/a |

Microtextos do mockup:

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Produto principal | Planner Digital · Produto principal · $27 | 41 | ilustrativo (v2/app.js:419) |
| Caixa do bump | Sim! Adicionar o Guia Rápido | 28 | ilustrativo (v2/app.js:420) |
| Apoio do bump | Oferta só aqui no checkout | 26 | ilustrativo (v2/app.js:420) |
| Preço do bump | +$7 | 3 | ilustrativo (v2/app.js:420) |
| Total | Total $27 → $34 | 15 | ilustrativo (v2/app.js:421) |
| Botão | Finalizar compra | 16 | ilustrativo (v2/app.js:422) |
| Pílula | Oferta extra dentro do checkout | 31 | v2/app.js:423; fato em content/upsell-e-order-bump.md:14 |

### 6.3 Teste A/B (meio)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Rótulo | TESTE A/B | 9 | index.html:1229 |
| Corpo | Um link divide o tráfego entre ofertas diferentes e mostra visitas, vendas e faturamento de cada uma. | 101 (máx. 110) | content/checkout-para-infoprodutos.md:22 |
| Botão de chevron (aria-label) | Conhecer o teste A/B | 20 | n/a |
| Destino | `/checkout-para-infoprodutos#recursos-para-vender-mais-na-mesma-visita` | n/a | âncora existe; não há página só de teste A/B (dúvida 11) |
| Ícone sugerido | caminho que se divide em dois | n/a | n/a |

Microtextos do mockup:

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Colunas | Versão A · Versão B | 19 | ilustrativo (v2/app.js:425) |
| Divisão do tráfego | 50/50 | 5 | ilustrativo (v2/app.js:426) |
| Rótulos das métricas | Visitas · Vendas · Faturamento | 30 | real: content/checkout-para-infoprodutos.md:22 |
| Valores da versão A | 1.000 visitas · 29 vendas · $783 | 32 | ilustrativo (derivado dos 2,9% de v2/app.js:425 e dos $27 de v2/app.js:415) |
| Valores da versão B | 1.000 visitas · 46 vendas · $1.242 | 34 | ilustrativo (derivado dos 4,6% de v2/app.js:425) |
| Botões das versões | Comprar · Comprar agora | 23 | ilustrativo (v2/app.js:425) |

Fora do mockup: o selo "Vencedor" e a frase "vencedor em números" (v2/app.js:425-426). As fontes dizem que o painel mostra os números de cada oferta, não que ele aponta um vencedor. Fora também o nome de modelo "Rotmart" (v2/app.js:255), que lembra uma marca concorrente.

### 6.4 Assinaturas (meio)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Rótulo | ASSINATURAS | 11 | index.html:1236 |
| Corpo | Cobrança diária, semanal, mensal ou anual, com renovação automática pela Stripe ou pelo PayPal. | 95 (máx. 110) | index.html:1419; content/link-de-pagamento.md:83; content/_llms.md:12 |
| Botão de chevron (aria-label) | Conhecer as assinaturas | 23 | n/a |
| Destino | `/checkout-para-infoprodutos#entrega-e-pos-venda` | n/a | âncora existe; não há página só de assinaturas (dúvida 11) |
| Ícone sugerido | setas em ciclo | n/a | n/a |

Microtextos do mockup:

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Plano | Plano Mensal · Renova sozinho · $19/mês | 39 | ilustrativo (v2/app.js:428) |
| Linhas de cobrança | Outubro · $19 · Cobrado | 23 | ilustrativo (v2/app.js:429; repete para Novembro e Dezembro) |
| Pílula | Cobrança automática via Stripe ou PayPal | 40 | v2/app.js:430; fato em content/checkout-para-infoprodutos.md:37 |

### 6.5 Entrega por e-mail (meio)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Rótulo | ENTREGA POR E-MAIL | 18 | index.html:1243 |
| Corpo | O e-mail de confirmação leva o arquivo ou o link do produto. Carrinho parado recebe até dois lembretes. | 103 (máx. 110) | content/checkout-para-infoprodutos.md:33 e :35 |
| Corpo, se o card for de largura inteira | Venda aprovada, o comprador recebe o e-mail com o arquivo ou o link do produto. Quem não pagou recebe até dois lembretes. | 121 (máx. 130) | content/checkout-para-infoprodutos.md:33 e :35; content/link-de-pagamento.md:35 |
| Botão de chevron (aria-label) | Conhecer a entrega por e-mail | 29 | n/a |
| Destino | `/checkout-para-infoprodutos#entrega-e-pos-venda` | n/a | âncora existe; não há página só de e-mail (dúvida 11) |
| Ícone sugerido | envelope | n/a | n/a |

Microtextos do mockup (fluxo em duas raias):

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Raia 1: título e estado | Pós-venda · Ativa | 17 | index.html:1290 |
| Raia 1: gatilho | Gatilho · Venda aprovada | 24 | index.html:1292 |
| Raia 1: detalhe do gatilho | Inglês em 30 Dias · $27 | 23 | ilustrativo (index.html:1292) |
| Raia 1: e-mail | E-mail · Confirmação + acesso | 29 | index.html:1294; fato em content/checkout-para-infoprodutos.md:33 |
| Raia 1: assunto do e-mail | Seu acesso chegou | 17 | ilustrativo (index.html:1294) |
| Raia 1: prévia do e-mail | Olá, Ana! Aqui está o seu acesso… | 33 | ilustrativo (adaptado de index.html:1294) |
| Raia 1: botão do e-mail | Acessar conteúdo | 16 | ilustrativo (v2/app.js:434) |
| Raia 2: título e estado | Recuperação · Ativa | 19 | index.html:1302 |
| Raia 2: gatilho | Gatilho · Checkout abandonado | 29 | index.html:1304; fato em content/link-de-pagamento.md:35 |
| Raia 2: detalhe do gatilho | Planner Financeiro · R$ 47 | 26 | ilustrativo (index.html:1304) |
| Raia 2: primeiro lembrete | E-mail · Lembrete 1 | 19 | fato em content/checkout-para-infoprodutos.md:35 (até dois lembretes) |
| Raia 2: assunto do lembrete | Ficou faltando pouco | 20 | ilustrativo (index.html:1308) |
| Raia 2: segundo lembrete | E-mail · Lembrete 2 | 19 | fato em content/checkout-para-infoprodutos.md:35 |
| Raia 2: resultado | Venda recuperada · R$ 47 | 24 | ilustrativo (index.html:1312) |
| Raia 3 opcional: gatilho | Gatilho · Venda recusada | 24 | fato em content/checkout-para-infoprodutos.md:36 |
| Raia 3 opcional: e-mail | E-mail · Tente de novo | 22 | fato em content/checkout-para-infoprodutos.md:36 (assunto ilustrativo) |

Fora do mockup até o dono confirmar (dúvida 5): o e-mail "Oferta de upsell" com espera de 24 horas e "Upsell aceito" (index.html:1296-1300), os tempos "30 minutos" e "24 horas" entre lembretes (index.html:1306 e :1310), "Enviado em 0 s" (index.html:1294) e "Acesso no e-mail em segundos" (v2/app.js:435). Nenhum deles aparece em `content/`.

### 6.6 Multi-moeda (inteiro, com o mapa-múndi)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Rótulo | MULTI-MOEDA | 11 | index.html:1250 |
| Rótulo alternativo | VENDA GLOBAL | 12 | tools/build.mjs:164 |
| Corpo | Crie a oferta em 16 moedas. O checkout abre em 17 idiomas e pode mostrar o preço na moeda do comprador. | 103 (máx. 110) | content/vender-no-exterior.md:18, :20 e :24 |
| Botão de chevron (aria-label) | Conhecer a venda em várias moedas | 33 | n/a |
| Destino | `/vender-no-exterior` | n/a | página existe |
| Ícone sugerido | globo | n/a | n/a |

Microtextos do mockup:

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Pins de moeda (só as 16 da fonte) | BRL · USD · EUR · PLN · CZK · HUF · RON · TRY · MXN · ARS · COP · PEN · UYU · BOB · JPY · KRW | 93 | moedas em content/vender-no-exterior.md:18 (a fonte dá os nomes; os códigos são os ISO de cada uma) |
| Cidades para os pins | São Paulo, Nova York, Berlim, Paris, Madri, Roma, Lisboa, Amsterdã, Cidade do México, Buenos Aires, Tóquio | 106 | cidades de v2/app.js:6-11 cujas moedas estão entre as 16 |
| Cidades novas, se precisar cobrir o mapa | Varsóvia, Praga, Budapeste, Bucareste, Istambul, Bogotá, Lima, Montevidéu, La Paz, Seul | 87 | ilustrativo (capitais ou maiores cidades dos países das outras moedas da lista) |
| Cartão do checkout: produto | Planner Digital | 15 | ilustrativo (v2/app.js:437) |
| Cartão do checkout: preço e botão por país | R$ 97 · Comprar agora / $19 · Buy now / 19 € · Jetzt kaufen / 19 € · Acheter | 76 | ilustrativo (v2/app.js:412); português, inglês, alemão e francês estão entre os 17 idiomas (content/vender-no-exterior.md:24) |
| Pílula | Moeda e idioma pelo país do comprador | 37 | content/_llms.md:11 |
| Formas locais (chips opcionais) | Pix · boleto · OXXO · SPEI · Klarna · BLIK · Bancontact · MB WAY | 64 | content/vender-no-exterior.md:34-37 |
| Aviso de venda no mapa | Venda aprovada · Nova York | 26 | ilustrativo (v2/app.js:76) |

Fora do mockup: libra, dólar canadense, dólar australiano, dirham e rand, que a v2 mostra em Londres, Toronto, Sydney, Dubai e Joanesburgo (v2/app.js:7-10 e :412). Essas moedas não estão entre as 16. Fora também "135+ moedas · 195 países" e "pelo IP do comprador" (v2/app.js:441). Ver dúvidas 1, 2, 8 e 12.

### 6.7 IA por chat (inteiro, `id="ia"`)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Rótulo | IA POR CHAT | 11 | index.html:1257 |
| Corpo | Conecte o Snapp ao Claude ou ao ChatGPT e peça em texto. A IA cria ofertas, monta o funil de upsell e consulta as suas vendas. | 126 (máx. 130) | content/checkout-para-infoprodutos.md:45; content/_llms.md:13 |
| Botão de chevron (aria-label) | Conhecer a IA por chat | 22 | n/a |
| Destino | `/checkout-para-infoprodutos#inteligencia-artificial-no-snapp` | n/a | âncora existe |
| Ícone sugerido | balão de conversa | n/a | n/a |

Microtextos do mockup (janela do Claude, conversa "Funil upsell + downsell"):

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Abas | Claude · ChatGPT | 16 | index.html:1136-1137; content/_llms.md:13 (a aba Cursor depende da dúvida 3) |
| Barra de endereço | claude.ai | 9 | v2/app.js:221 (no ChatGPT: chatgpt.com, v2/app.js:224) |
| Título da conversa | Funil upsell + downsell | 23 | v2/app.js:256 |
| Fala do usuário | Monta um funil: upsell de $27 e, se recusar, downsell de $17. | 61 | ilustrativo (v2/app.js:256) |
| Status | Pensando… | 9 | v2/app.js:223 |
| Chamada de ferramenta 1 | set_offer_upsell · passo 1: Kit Avançado · $27 | 46 | ilustrativo (v2/app.js:257; o nome `set_offer_upsell` existe no conector MCP do Snapp) |
| Chamada de ferramenta 2 | set_offer_upsell · downsell: Kit Essencial · $17 | 48 | ilustrativo (v2/app.js:257) |
| Resposta da IA | Funil montado. Depois da compra aparece o Kit Avançado por $27 em um clique. Se recusar, vem o Kit Essencial por $17. | 117 | ilustrativo (v2/app.js:258, sem o "Nada de redigitar cartão" do fim) |
| Cartão de resultado: cabeçalho | Funil pós-compra · Ativo | 24 | ilustrativo (v2/app.js:259) |
| Cartão de resultado: linhas | Upsell · Kit Avançado · $ 27 / Downsell · Kit Essencial · $ 17 | 62 | ilustrativo (v2/app.js:259) |
| Campo de texto | Responda ao Claude… | 19 | v2/app.js:222 |
| Rodapé | Claude é uma IA e pode cometer erros. | 37 | v2/app.js:223 |
| Endereço do conector (opcional) | mcp.snappcheckout.com/mcp | 25 | real: content/checkout-para-infoprodutos.md:45 |
| Lista lateral de casos (se houver) | Vendas de hoje · Funil upsell + downsell · Assinatura mensal · Melhor order bump · Reembolsos · Entrega por link | 112 | v2/app.js:232, :256, :268, :248, :264 e :272 |

Casos da v2 que ficam fora: "Checkout novo" e "Criação de produto" (usam `create_product`, `set_delivery` e `set_pixel`, v2/app.js:237 e :241), "Tradução de checkout" (usa `read_page`, `translate`, `create_order_bump` e o endereço `pay.checkout.com`, v2/app.js:244-245), "Trocar modelo + A/B" (cita "Rotmart" e promete avisar quando houver vencedor, v2/app.js:254-255) e "Relatório do mês" (mostra receita em libra, v2/app.js:263). Fora também "e mais infinitas possibilidades" (index.html:1180). Os links de checkout dentro dos cartões da v2 usam `pay.snappcheckout.com/nome` (v2/app.js:239); o formato real é `pay.snappcheckout.com/c/codigo` (content/link-de-pagamento.md:16).

---

## 7. "Por que o Snapp" (grade 3×2)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| H2 | Por que vender com o Snapp | 26 (máx. 40) | n/a |
| Lead | O gateway é seu e a conta é sua. O Snapp cuida da página onde o comprador paga, do pós-compra e dos números do painel. | 118 (máx. 160) | index.html:1381; content/checkout-para-infoprodutos.md:14 |
| Card 1, título | O dinheiro cai direto na sua conta | 34 (máx. 38) | index.html:1380 |
| Card 1, texto | O Snapp não segura o valor da venda. Ele vai para a sua conta no gateway, e o prazo de repasse é o do próprio gateway. | 118 (máx. 150) | content/_llms.md:7; content/link-de-pagamento.md:87 |
| Card 1, ícone | cofre | n/a | n/a |
| Card 2, título | Sem mensalidade nem taxa de adesão | 34 (máx. 38) | content/precos.md:10 |
| Card 2, texto | Você paga 3% por venda aprovada. Venda recusada ou não paga não gera taxa. | 74 (máx. 150) | content/precos.md:10 e :45-47 |
| Card 2, ícone | porcentagem | n/a | n/a |
| Card 3, título | Vários gateways na mesma oferta | 31 (máx. 38) | content/_llms.md:9 |
| Card 3, texto | Ligue mais de um gateway na oferta. O comprador vê as formas de pagamento lado a lado e escolhe. | 96 (máx. 150) | content/link-de-pagamento.md:40 |
| Card 3, ícone | camadas | n/a | n/a |
| Card 4, título | E-mails da venda sem ferramenta extra | 37 (máx. 38) | index.html:1286 |
| Card 4, texto | O Snapp envia a confirmação com o produto, o aviso de venda recusada e até dois lembretes de carrinho, no idioma do checkout. | 125 (máx. 150) | content/checkout-para-infoprodutos.md:33, :35 e :36 |
| Card 4, ícone | envelope | n/a | n/a |
| Card 5, título | Área de membros em toda conta | 29 (máx. 38) | content/area-de-membros.md:10 |
| Card 5, texto | Monte módulos, aulas em vídeo e arquivos. O acesso é liberado sozinho quando o pagamento é confirmado. | 102 (máx. 150) | content/area-de-membros.md:10 e :14 |
| Card 5, ícone | tela com botão de play | n/a | n/a |
| Card 6, título | Pixel e API de Conversões | 25 (máx. 38) | content/_llms.md:12 |
| Card 6, texto | O checkout envia os eventos de compra para a Meta, o TikTok, o Google Ads e a Taboola. | 86 (máx. 150) | content/checkout-para-infoprodutos.md:41 |
| Card 6, ícone | alvo | n/a | n/a |

Reservas com fonte, se algum card cair: "Checkout em 17 idiomas" (content/vender-no-exterior.md:24), "Seis modelos de checkout" (content/checkout-para-infoprodutos.md:23), "O link abre no seu domínio" (content/link-de-pagamento.md:16).

---

## 8. Faixa de números

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Título da faixa | O Snapp em quatro números | 25 (máx. 50) | n/a |
| Número 1 | 3% | 2 | content/precos.md:10 |
| Legenda 1 | por venda aprovada | 18 (máx. 40) | content/precos.md:10 |
| Número 2 | R$ 0 | 4 | index.html:165-169 (oferta com preço 0 em BRL, "Sem mensalidade") |
| Legenda 2 | de mensalidade e de taxa de adesão | 34 (máx. 40) | content/precos.md:10 |
| Número 3 | 7 | 1 | index.html:1192 |
| Legenda 3 | ferramentas no mesmo checkout | 29 (máx. 40) | index.html:1192 |
| Número 4 | <10 min | 7 | index.html:1117 |
| Legenda 4 | para conectar o gateway e publicar | 34 (máx. 40) | index.html:1117 |

Conferência dos quatro números sugeridos pelo BRIEF:

- **3% por venda aprovada:** fonte exata (content/precos.md:10; content/_llms.md:8; index.html:1336).
- **R$ 0 de mensalidade:** sustentado. As fontes dizem "Não há mensalidade nem taxa de adesão" (content/precos.md:10) e o dado estruturado da home declara preço 0 em BRL (index.html:165-169). A forma "R$ 0" não aparece escrita, é a tradução direta desses dois trechos.
- **7 ferramentas:** fonte exata na home (index.html:1192, com a lista em index.html:1215-1257). As páginas de `content/` não usam essa contagem.
- **Menos de 10 min para publicar:** só a home afirma (index.html:1117; a v1 repete em i18n.js:13 e :21). Nenhuma página de `content/` nem o `llms.txt` trazem esse prazo, e não há medição. Mantive com ressalva (dúvida 9). Substituto com fonte firme: **17** + "idiomas no checkout" (content/vender-no-exterior.md:24).

Outros pares com fonte, prontos para troca: **8** + "gateways para conectar" (content/_llms.md:9); **16** + "moedas para criar a oferta" (content/vender-no-exterior.md:18); **190+** + "países pela Stripe e pelo PayPal" (content/vender-no-exterior.md:51); **6** + "modelos de checkout" (content/checkout-para-infoprodutos.md:23).

---

## 9. Integrações (slot dos prêmios, 4 colunas)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| H2 | Ligado ao seu tráfego e à sua IA | 32 (máx. 40) | n/a |
| Lead | O checkout envia os eventos de compra para as plataformas de anúncio e tem um servidor MCP para o Claude e o ChatGPT. | 117 (máx. 160) | content/checkout-para-infoprodutos.md:41 e :45 |
| Coluna 1, imagem | logos Meta e TikTok Ads | n/a | `/v2/images/logo-meta.svg`, `/v2/images/logo-tiktokads.svg` |
| Coluna 1, título | Meta e TikTok Ads | 17 | content/checkout-para-infoprodutos.md:41 |
| Coluna 1, categoria | Tráfego · Pixel e API de Conversões | 35 | content/_llms.md:12; content/link-de-pagamento.md:34 |
| Coluna 1, link | Ver o rastreamento | 18 | → `/checkout-para-infoprodutos#rastreamento-e-integracoes` |
| Coluna 2, imagem | logos Google Ads e Taboola | n/a | `/v2/images/logo-googleads.svg`, `/v2/images/logo-taboola.svg` |
| Coluna 2, título | Google Ads e Taboola | 20 | content/checkout-para-infoprodutos.md:41 |
| Coluna 2, categoria | Tráfego · eventos de compra | 27 | content/checkout-para-infoprodutos.md:41 |
| Coluna 2, link | Ver o que o link já traz | 24 | → `/link-de-pagamento#o-que-o-link-de-pagamento-do-snapp-ja-traz` |
| Coluna 3, imagem | logos Claude e ChatGPT | n/a | `/v2/images/logo-claude.svg`, `/v2/images/logo-openai.svg` |
| Coluna 3, título | Claude e ChatGPT | 16 | content/_llms.md:13 |
| Coluna 3, categoria | IA por chat · servidor MCP | 26 | content/checkout-para-infoprodutos.md:45 |
| Coluna 3, link | Ver a IA em ação | 16 | → `#ia` |
| Coluna 4, imagem | ícone de webhook | n/a | `/v2/images/logo-webhook.webp` |
| Coluna 4, título | Webhooks e chaves de API | 24 | content/checkout-para-infoprodutos.md:41 |
| Coluna 4, categoria | Para ligar o que você quiser | 28 | content/checkout-para-infoprodutos.md:41 |
| Coluna 4, link | Ver as integrações | 18 | → `/checkout-para-infoprodutos#rastreamento-e-integracoes` |

**Como distribuí:** duas colunas de tráfego (redes sociais na primeira, busca e anúncio nativo na segunda), uma de IA e uma para quem integra por conta própria. Todos os links caem em âncoras que existem.

**Se o dono confirmar o Cursor (dúvida 3):** a coluna 4 vira "Cursor", categoria "IA por chat · servidor MCP", imagem `/v2/images/logo-cursor.svg`, link "Como conectar a sua IA" → `/checkout-para-infoprodutos#inteligencia-artificial-no-snapp`.

**Alternativa só de tráfego:** uma coluna por plataforma (Meta, Google Ads, TikTok Ads, Taboola), todas com a categoria "Tráfego · Pixel e API de Conversões" e o link "Ver o rastreamento". A IA fica só no banner 6.7.

---

## 10. Preço

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Título | Só pague quando vender | 22 (máx. 40) | index.html:1335 |
| Lead | O Snapp cobra 3% sobre cada venda aprovada. Não há mensalidade nem taxa de adesão, então o custo só existe quando a venda acontece. | 131 (máx. 160) | content/precos.md:10 |
| Nome do plano | Snapp Checkout | 14 | index.html:1340 |
| Número | 3% | 2 | content/precos.md:10 |
| Legenda do número | por venda aprovada | 18 | content/precos.md:10 (a home usa "por transação aprovada", index.html:1341; ver dúvida 13) |
| Linha de apoio | Vendeu, paga. Não vendeu, não paga nada. | 40 | index.html:1342; content/precos.md:45-47 |
| Título da lista | O que faz parte de toda conta | 29 | content/precos.md:12 |
| Item 1 | Link de pagamento e checkout em 17 idiomas, com seis modelos de layout | 70 | content/precos.md:14 |
| Item 2 | Stripe, PayPal, Mercado Pago, Efí, Pagar.me, Whop, XPag e dLocal Go | 67 | content/precos.md:15 |
| Item 3 | Order bump e upsell e downsell em um clique | 43 | content/precos.md:16 |
| Item 4 | Assinaturas recorrentes | 23 | content/precos.md:17 |
| Item 5 | Área de membros | 15 | content/precos.md:18 |
| Item 6 | E-mails de confirmação, entrega e recuperação de carrinho | 57 | content/precos.md:19 |
| Item 7 | Teste A/B, cupom de desconto e domínio próprio | 46 | content/precos.md:20 |
| Item 8 | Pixel e API de Conversões, webhooks e chaves de API | 51 | content/precos.md:21 |
| Item 9 | Conexão com Claude e ChatGPT por MCP | 36 | content/precos.md:22 |
| Exemplo | Numa venda de R$ 100,00, a taxa do Snapp é de R$ 3,00. | 54 | content/precos.md:29 |
| Nota sobre o gateway | A taxa do gateway é à parte, cobrada por ele na tabela dele. | 60 | content/precos.md:26; content/link-de-pagamento.md:61 |
| Nota perto do botão | Criar a conta, montar a oferta e fazer a compra teste não têm custo. | 68 | content/precos.md:55 |
| CTA | Começar agora | 13 | index.html:1354 → `https://admin.snappcheckout.com/register` |
| Link secundário | Como a taxa é cobrada | 21 | index.html:1336 → `/precos` |

A lista da home (index.html:1344-1352) foi trocada pela de `content/precos.md` porque três itens dela têm número em disputa: "mais de 135 moedas e até 195 países", "Order bumps ilimitados" e "Funil de e-mail nativo". A coluna "Outros checkouts, 4,9 a 10%+" (index.html:1356-1371) saiu: os números não têm fonte.

---

## 11. "Explore mais" (carrossel de 7 cards)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| H2 do painel | Explore mais | 12 (máx. 40) | BRIEF.md:76 |
| Seta anterior (aria-label) | Card anterior | 13 | n/a |
| Seta próxima (aria-label) | Próximo card | 12 | n/a |
| Card 1, eyebrow | Link de pagamento | 17 | content/link-de-pagamento.md:5 |
| Card 1, título | Link de pagamento com checkout completo | 39 (máx. 55) | content/link-de-pagamento.md:4 |
| Card 1, apoio | Crie o link, compartilhe e receba com cartão, Pix, boleto ou PayPal. | 68 (máx. 90) | content/link-de-pagamento.md:6 → `/link-de-pagamento` |
| Card 2, eyebrow | Infoprodutos | 12 | content/checkout-para-infoprodutos.md:5 |
| Card 2, título | Checkout para infoprodutos, no Brasil e fora dele | 49 (máx. 55) | content/checkout-para-infoprodutos.md:4 (H1 encurtado; o original tem 58 caracteres) |
| Card 2, apoio | O que o Snapp faz para quem vende curso, e-book, mentoria e assinatura. | 71 (máx. 90) | content/checkout-para-infoprodutos.md:6 → `/checkout-para-infoprodutos` |
| Card 3, eyebrow | Stripe | 6 | content/checkout-stripe.md:5 |
| Card 3, título | Checkout para Stripe com upsell em um clique | 44 (máx. 55) | content/checkout-stripe.md:4 |
| Card 3, apoio | Use a sua conta Stripe com upsell em um clique, Apple Pay, Google Pay e assinaturas. | 84 (máx. 90) | content/checkout-stripe.md:6 → `/checkout-stripe` |
| Card 4, eyebrow | PayPal | 6 | content/checkout-paypal.md:5 |
| Card 4, título | Checkout com PayPal ao lado do cartão | 37 (máx. 55) | content/checkout-paypal.md:4 |
| Card 4, apoio | PayPal no mesmo checkout do cartão, com assinatura e entrega automática. | 72 (máx. 90) | content/checkout-paypal.md:6 → `/checkout-paypal` |
| Card 5, eyebrow | Upsell e order bump | 19 | content/upsell-e-order-bump.md:5 |
| Card 5, título | Upsell em um clique, downsell e order bump | 42 (máx. 55) | content/upsell-e-order-bump.md:4 |
| Card 5, apoio | Order bump na tela do pagamento e funil de upsell e downsell depois da compra. | 78 (máx. 90) | content/upsell-e-order-bump.md:6 → `/upsell-e-order-bump` |
| Card 6, eyebrow | Área de membros | 15 | content/area-de-membros.md:5 |
| Card 6, título | Área de membros liberada quando a venda é aprovada | 50 (máx. 55) | content/area-de-membros.md:4 (H1 encurtado; o original tem 61 caracteres) |
| Card 6, apoio | Módulos, aulas em vídeo e arquivos, com versões nos 17 idiomas do checkout. | 75 (máx. 90) | content/area-de-membros.md:14 e :32 → `/area-de-membros` |
| Card 7, eyebrow | Vender no exterior | 18 | content/vender-no-exterior.md:5 |
| Card 7, título | Venda no exterior em dólar, euro e mais 14 moedas | 49 (máx. 55) | content/vender-no-exterior.md:4 |
| Card 7, apoio | Oferta em 16 moedas, checkout em 17 idiomas e formas de pagamento de cada país. | 79 (máx. 90) | content/vender-no-exterior.md:6 → `/vender-no-exterior` |

Cada card inteiro é o link. O texto acessível do link é o próprio título.

---

## 12. FAQ (acordeão, cabeçalho em 2 colunas)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| H2 | Perguntas frequentes | 20 (máx. 40) | index.html:1409 |
| Lead | Tire as principais dúvidas antes de conectar suas contas e começar a vender com o Snapp. | 88 (máx. 160) | index.html:1410 |
| Botão de ajuda | Precisa de ajuda? | 17 | index.html:1411 → `https://wa.me/554896320504?text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20com%20a%20Snapp%20Checkout.` |
| P1 | O que é o Snapp Checkout? | 25 | index.html:1414 |
| R1 | O Snapp Checkout é uma plataforma de checkout e link de pagamento para quem vende infoprodutos e outros produtos digitais. Você conecta a sua conta de pagamento, publica a oferta e recebe direto no gateway. | 206 | index.html:1414 |
| P2 | O Snapp processa o pagamento? | 29 | index.html:1415 |
| R2 | Não. O Snapp é a camada de checkout, automação e gestão. O pagamento é processado pela conta que você conecta, como Stripe, PayPal ou Mercado Pago, e o dinheiro cai direto nela. | 177 | index.html:1415 |
| P3 | Preciso ter conta em um gateway de pagamento? | 45 | index.html:1416 |
| R3 | Sim. Você conecta a sua própria conta da Stripe, do PayPal, do Mercado Pago, da Efí, da Pagar.me, da Whop, do XPag ou do dLocal Go. É nela que você recebe, com a segurança e a infraestrutura do gateway. | 202 | index.html:1416 |
| P4 | Como crio um link de pagamento? | 31 | index.html:1417 |
| R4 | Crie uma oferta com nome, preço e moeda e copie o link do checkout. O link pode ir no anúncio, no WhatsApp, no e-mail ou no botão da sua página de vendas. | 154 | index.html:1417 |
| P5 | O checkout aceita Pix e boleto? | 31 | index.html:1418 |
| R5 | Sim. O Pix funciona pela Efí, Pagar.me, XPag, Mercado Pago, Whop e Stripe, e o boleto pelo Mercado Pago, pela Whop e pelo dLocal Go, no mesmo checkout do cartão e do PayPal. | 173 | index.html:1418 |
| P6 | Posso vender assinaturas? | 25 | index.html:1419 |
| R6 | Sim. A cobrança pode ser diária, semanal, mensal ou anual, com renovação automática pela Stripe ou pelo PayPal. | 111 | index.html:1419 |
| P7 | O Snapp tem área de membros? | 28 | index.html:1420 |
| R7 | Sim. A área de membros faz parte de toda conta e libera o acesso do comprador quando o pagamento é confirmado. | 110 | index.html:1420 |
| P8 | Tem mensalidade? | 16 | index.html:1421 |
| R8 | Não. O modelo é simples: você paga apenas 3% por transação aprovada. Se não vender, não paga nada. Sem mensalidade, sem taxa de setup, sem custo oculto. | 152 | index.html:1421 |
| P9 | Para quais países posso vender? | 31 | index.html:1422 |
| R9 | Mais de 190 países com gateways internacionais como Stripe e PayPal. O checkout abre em 17 idiomas e pode adaptar idioma e moeda pelo país do comprador. | 152 | index.html:1422 |
| P10 | Dá para usar o Snapp com o ChatGPT ou o Claude? | 47 | index.html:1423 |
| R10 | Sim. O Snapp tem um servidor MCP. Conectado ao Claude, ao ChatGPT ou ao Cursor, você pede em texto e a IA cria ofertas, consulta as vendas e gera relatórios na sua conta. | 170 | index.html:1423 |

As dez perguntas e respostas estão como na home, sem mudança de sentido. Dois pontos seguem decisões pendentes: a R10 cita o Cursor (dúvida 3) e a R8 diz "transação aprovada" onde o resto do site diz "venda aprovada" (dúvida 13). Se o dono decidir, a R10 passa a "Conectado ao Claude ou ao ChatGPT" e a R8 a "3% por venda aprovada".

---

## 13. CTA final e rodapé

### CTA final (CAIXA ALTA, 63px, peso 800, 2 a 3 linhas, até ~45 caracteres)

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| **Opção 1 (recomendada)** | PUBLIQUE O SEU PRIMEIRO<br>CHECKOUT HOJE | 23 + 13 = 37 com os espaços (máx. 45) | tools/build.mjs:201 ("Crie a conta e publique o primeiro checkout hoje.") |
| Opção 2 | VENDA PARA O MUNDO.<br>RECEBA NA SUA CONTA. | 19 + 20 = 40 com os espaços (máx. 45) | index.html:1321 e :1380 |
| Opção 3 | SÓ PAGUE<br>QUANDO VENDER | 8 + 13 = 22 com os espaços (máx. 45) | index.html:1335 |
| Botão | Começar agora | 13 | index.html:1437 → `https://admin.snappcheckout.com/register` |
| Linha de apoio (só se o layout tiver espaço) | Você paga 3% por venda aprovada. Sem mensalidade. | 49 | tools/build.mjs:202 |

Por que a 1: o H1 já fez a promessa do mundo e o bloco de preço já disse "só pague quando vender". O fim da página pede o próximo passo, e esta frase é a que as páginas internas já usam no fechamento. A 2 repete o H1 e fecha a página em anel, boa escolha se o dono preferir encerrar pela promessa. A citação de Leonardo da Vinci do CTA da home (index.html:1433-1434) não tem lugar na anatomia de uma headline e um botão.

### Rodapé

| Slot | Texto final | Caracteres | Fonte (arquivo:linha) |
|---|---|---|---|
| Logo (alt) | Snapp Checkout | 14 | `/v2/images/logo-snapp-white.svg` (index.html:1446) |
| Rede social | Instagram | 9 | index.html:1455 → `https://www.instagram.com/snappcheckout/` (única rede com link real na home) |
| Coluna 1, label | PRODUTO | 7 | BRIEF.md:78 |
| Coluna 1, link | Recursos | 8 | → `#recursos` |
| Coluna 1, link | Por que o Snapp | 15 | → `#por-que` |
| Coluna 1, link | Integrações | 11 | → `#integracoes` |
| Coluna 1, link | Preço | 5 | → `#precos` |
| Coluna 1, link | FAQ | 3 | → `#faq` |
| Coluna 2, label | RECURSOS | 8 | BRIEF.md:78 |
| Coluna 2, link | Link de pagamento | 17 | index.html:1458 → `/link-de-pagamento` (existe) |
| Coluna 2, link | Checkout para infoprodutos | 26 | index.html:1459 → `/checkout-para-infoprodutos` (existe) |
| Coluna 2, link | Checkout para Stripe | 20 | index.html:1460 → `/checkout-stripe` (existe) |
| Coluna 2, link | Checkout com PayPal | 19 | index.html:1461 → `/checkout-paypal` (existe) |
| Coluna 2, link | Vender no exterior | 18 | index.html:1462 → `/vender-no-exterior` (existe) |
| Coluna 2, link | Upsell e order bump | 19 | index.html:1463 → `/upsell-e-order-bump` (existe) |
| Coluna 2, link | Área de membros | 15 | index.html:1464 → `/area-de-membros` (existe) |
| Coluna 2, link | Preços | 6 | index.html:1465 → `/precos` (existe) |
| Coluna 3, label | SUPORTE E LEGAL | 15 | BRIEF.md:78 |
| Coluna 3, link | Suporte | 7 | index.html:1454 → `/support` (existe) |
| Coluna 3, link | Termos de uso | 13 | index.html:1451 → `/terms-of-use` (existe) |
| Coluna 3, link | Privacidade | 11 | index.html:1452 → `/privacy-policy` (existe) |
| Coluna 3, link | Proteção de dados | 17 | index.html:1453 → `/data-protection` (existe) |
| Coluna 4, label | CONTA | 5 | BRIEF.md:78 |
| Coluna 4, link | Entrar | 6 | index.html:1088 → `https://admin.snappcheckout.com/login` |
| Coluna 4, link | Criar conta | 11 | index.html:178 → `https://admin.snappcheckout.com/register` |
| Linha final, esquerda | © 2026 Snapp Checkout. Todos os direitos reservados. | 52 | index.html:1467 |
| Linha final, direita | Feito para quem vende para o mundo. | 35 | index.html:1467 |

As doze pastas internas foram conferidas no repo (`<pasta>/index.html` existe em todas). Use os caminhos sem barra no fim: o `vercel.json` tem `trailingSlash: false` e é assim que `tools/build.mjs:217-220` escreve.

---

## Fatos verificados

**Preço**

- 3% sobre cada venda aprovada, sem mensalidade e sem taxa de adesão (content/precos.md:10; content/_llms.md:8).
- Venda recusada ou não paga não gera taxa (content/precos.md:45-47).
- A taxa é a mesma no cartão, no Pix, no boleto e no PayPal (content/precos.md:51) e em qualquer moeda (content/vender-no-exterior.md:71).
- Toda venda tem duas taxas: a do gateway, cobrada por ele, e os 3% do Snapp (content/precos.md:26-27). Numa venda de R$ 100,00, a taxa do Snapp é de R$ 3,00 (content/precos.md:29).
- A taxa do Snapp acumula e é debitada do cartão cadastrado no painel quando o total pendente chega a R$ 5,00 (content/precos.md:33).
- Criar a conta, montar a oferta e fazer a compra teste não têm custo (content/precos.md:55).

**Dinheiro e gateways**

- O Snapp não segura o valor da venda, que cai direto na conta do vendedor no gateway. O prazo de repasse é o do gateway (content/_llms.md:7; content/link-de-pagamento.md:87).
- Oito gateways: Stripe, PayPal, Mercado Pago, Efí, Pagar.me, Whop, XPag e dLocal Go (content/_llms.md:9).
- Mais de um gateway pode ficar ligado na mesma oferta, e o comprador vê as formas de pagamento lado a lado (content/link-de-pagamento.md:40). Na maioria dos gateways dá para conectar várias contas (content/checkout-para-infoprodutos.md:77).
- Formas de pagamento: cartão, Apple Pay, Google Pay, Pix, boleto, PayPal e formas locais (content/_llms.md:10). A lista por gateway está em content/link-de-pagamento.md:42-51.
- Pix pela Efí, Pagar.me, XPag, Mercado Pago, Whop e Stripe; boleto pelo Mercado Pago, pela Whop e pelo dLocal Go (index.html:1418).

**Moedas, idiomas e países**

- A oferta pode ser criada em 16 moedas: real, dólar americano, euro, zloty polonês, coroa tcheca, florim húngaro, leu romeno, lira turca, peso mexicano, peso argentino, peso colombiano, sol peruano, peso uruguaio, boliviano, iene e won sul-coreano (content/vender-no-exterior.md:18).
- O checkout está traduzido para 17 idiomas: português, inglês, espanhol, francês, italiano, alemão, polonês, tcheco, eslovaco, húngaro, romeno, búlgaro, grego, croata, sérvio, japonês e coreano (content/vender-no-exterior.md:24).
- A detecção de idioma e moeda pelo país do comprador é opcional, ligada na oferta. O preço na moeda local aparece quando a Stripe aceita aquela moeda (content/_llms.md:11; content/vender-no-exterior.md:20 e :26).
- Dá para vender em qualquer país onde a Stripe ou o PayPal aceitem pagamento, o que hoje passa de 190 (content/vender-no-exterior.md:51).
- Formas locais por região: Affirm, Cash App Pay, Amazon Pay e Klarna nos Estados Unidos; Klarna, Bancontact, BLIK, EPS, Satispay, MB WAY, Multibanco e Pay by Bank na Europa; OXXO e SPEI no México; Pix e boleto no Brasil (content/vender-no-exterior.md:34-37).

**As sete ferramentas** (a contagem é da home, index.html:1192)

1. **Upsell e downsell em um clique.** O upsell aparece depois da compra aprovada, numa página própria, e é aceito sem digitar os dados de novo. O downsell é a oferta mais barata para quem recusou. O funil roda em sequência até a página de obrigado (content/upsell-e-order-bump.md:15-16 e :24). O um clique depende de como o comprador pagou (content/upsell-e-order-bump.md:30-37). A página do upsell é do vendedor, com script e botões do Snapp (content/upsell-e-order-bump.md:26).
2. **Order bump.** Oferta complementar marcada na tela do pagamento, na mesma cobrança. Cada oferta aceita vários, cada um com nome, preço, imagem, chamada e entregável próprios (content/upsell-e-order-bump.md:14 e :20).
3. **Teste A/B.** Um link divide o tráfego entre ofertas diferentes e mostra visitas, vendas e faturamento de cada uma. Dá para comparar dois dos seis modelos de checkout (content/checkout-para-infoprodutos.md:22-23).
4. **Assinaturas.** Cobrança diária, semanal, mensal ou anual pela Stripe e pelo PayPal, com renovação automática (content/checkout-para-infoprodutos.md:37; content/link-de-pagamento.md:83).
5. **Entrega por e-mail.** E-mail de confirmação com o arquivo ou o link do produto, no idioma do checkout; recuperação de carrinho com até dois lembretes; e-mail de venda recusada (content/checkout-para-infoprodutos.md:33-36).
6. **Checkout multi-moeda.** Ver "Moedas, idiomas e países".
7. **IA por chat (MCP).** Ver abaixo.

**IA**

- O Snapp tem um servidor MCP em `https://mcp.snappcheckout.com/mcp`. Conectado ao Claude ou ao ChatGPT, o vendedor pede em texto e a IA cria ofertas, monta o funil de upsell, consulta as vendas e gera relatórios na conta (content/checkout-para-infoprodutos.md:45).
- A conexão com Claude e ChatGPT por MCP faz parte de toda conta (content/precos.md:22).
- O Cursor aparece só na home (index.html:1133, :1258 e :1423), não em `content/`.
- Criação com IA, Assistente Snapp, Meta Ads e Conquistas são liberados conta a conta pela equipe do Snapp (content/checkout-para-infoprodutos.md:46-51). Não entram na v3 como recurso de todos.

**Área de membros**

- Faz parte de toda conta e libera o acesso sozinha quando o pagamento é confirmado (content/area-de-membros.md:10).
- Montada no painel com módulos, aulas em vídeo e arquivos; produto principal, order bump e upsell podem liberar conteúdos diferentes (content/area-de-membros.md:14).
- Vídeo hospedado no Vimeo, Panda Video, Bunny, Wistia ou vTurb; YouTube não é aceito. Arquivo de até 100 MB, 10 GB por conta (content/area-de-membros.md:20-24).
- Até 3 aparelhos por aluno; versões nos 17 idiomas; logo, login e domínio próprios (content/area-de-membros.md:28, :32 e :36).
- Reembolso total ou chargeback retira o acesso (content/area-de-membros.md:16).

**Pixels e integrações**

- O checkout envia os eventos de compra para o Pixel e a API de Conversões da Meta, para o TikTok, o Google Ads e a Taboola (content/checkout-para-infoprodutos.md:41; content/link-de-pagamento.md:34).
- A venda fica registrada com a origem que veio nos parâmetros da URL (content/link-de-pagamento.md:55).
- Também há integração com UTMify, vTurb, Discord e Resend, além de webhooks e chaves de API (content/checkout-para-infoprodutos.md:41).

**Link e checkout**

- Cada oferta gera um link no formato `pay.snappcheckout.com/c/codigo`; dá para usar domínio próprio (content/link-de-pagamento.md:16 e :75).
- O link não expira enquanto a oferta estiver ativa (content/link-de-pagamento.md:79).
- Seis modelos de checkout (content/checkout-para-infoprodutos.md:23); cupom com validade e limite de usos (content/link-de-pagamento.md:36); checkout embutido por iframe (content/link-de-pagamento.md:57).

**Tempo para publicar**

- "Em menos de 10 minutos" aparece só no lead do hero da home (index.html:1117) e na v1 (i18n.js:13 e :21). Não está em `content/` nem no `llms.txt`.

**Contato e marca**

- WhatsApp de suporte (index.html:1411), e-mail snappcheckout@gmail.com (llms-full.txt:18), Instagram (index.html:1455).
- Regra de conteúdo e lista de concorrentes que não podem ser citados: tools/build.mjs:7-9 e :21. Nenhum texto deste arquivo cita concorrente.

---

## Dúvidas para o dono

Em cada uma, a primeira opção é a recomendada e é a que a copy acima já usa.

**1. Quantas moedas?** A home diz "mais de 135 moedas" (index.html:1252, :1273 e :1346). As páginas de conteúdo e o dado estruturado da própria home dizem 16 (content/vender-no-exterior.md:18; index.html:146).
- a) **16 moedas (recomendada).** É o número de moedas em que a oferta pode ser criada e o que as páginas auditadas afirmam.
- b) "Mais de 135 moedas", atribuindo o número à Stripe na frase.
- c) Os dois: "oferta em 16 moedas, recebimento pela Stripe em mais de 135".

**2. Quantos países?** A home tem "195 países" (index.html:1251 e :1346), "mais de 190" no FAQ (index.html:1422) e "+180" na fila de bandeiras (index.html:1323). O conteúdo diz "passa de 190" (content/vender-no-exterior.md:51).
- a) **"Mais de 190 países" (recomendada).** Bate com o FAQ e com `content/`.
- b) "195 países".
- c) Sem número de países na v3.

**3. O Cursor entra?** A home cita Claude, ChatGPT e Cursor (index.html:1133, :1258 e :1423). O `content/`, o `llms.txt` e o dado estruturado da home citam só Claude e ChatGPT (content/_llms.md:13; content/precos.md:22; index.html:160). O BRIEF pede o Cursor nas integrações.
- a) **Só Claude e ChatGPT (recomendada).** É o que as páginas auditadas confirmam. A coluna 4 das integrações vira "Webhooks e chaves de API".
- b) Os três, como na home. Muda o banner 6.7, a coluna 4 das integrações e a aba do mockup.
- c) "Claude, ChatGPT e outros clientes MCP", sem nomear o Cursor.

**4. O que a IA faz por chat?** O conteúdo lista quatro ações: criar ofertas, montar o funil de upsell, consultar vendas e gerar relatórios (content/checkout-para-infoprodutos.md:45). A home acrescenta pixel, entrega por e-mail, order bumps e "sem abrir o painel" (index.html:1133 e :1258), e a demo usa ferramentas como `create_product`, `set_delivery`, `set_pixel`, `read_page` e `translate` (v2/app.js:237-245). Esses nomes não aparecem na lista de ferramentas do conector MCP do Snapp ligado a esta sessão, que traz `create_offer`, `update_offer`, `set_offer_upsell`, `list_sales`, `get_metrics` e `create_ab_test`, entre outras (essa lista está fora do repo).
- a) **Copy com as quatro ações do conteúdo e demo só com casos de ferramentas que existem (recomendada).**
- b) Manter a lista ampla da home e todos os onze casos da demo.
- c) O dono passa a lista oficial do que o MCP faz hoje e a copy é ajustada a ela.

**5. Existe e-mail de upsell? Quais os tempos dos lembretes?** A home mostra um fluxo "aguardar 24 horas, e-mail com oferta de upsell, upsell aceito" (index.html:1296-1300), lembretes de carrinho em 30 minutos e 24 horas (index.html:1306 e :1310) e "enviado em 0 s" (index.html:1294). O conteúdo lista confirmação com o produto, até dois lembretes de carrinho e e-mail de venda recusada, sem tempos (content/checkout-para-infoprodutos.md:33-36). Ele também cita integração com o Resend (content/checkout-para-infoprodutos.md:41), o que toca a frase "sem ferramenta extra".
- a) **Fluxo só com confirmação, dois lembretes e venda recusada, sem tempos (recomendada).**
- b) Manter o fluxo da home, se o produto envia o e-mail de upsell hoje e os tempos são esses.
- c) Como a opção a, e trocar o título do card 4 de "Por que o Snapp" para "E-mails da venda já inclusos", se o Resend for necessário para algum envio.

**6. Order bump "ilimitado" ou "vários"?** A home diz "ilimitado" (index.html:1222 e :1348). O conteúdo diz "vários" e responde "Vários" à pergunta de quantos (content/upsell-e-order-bump.md:20 e :49-51).
- a) **"Vários order bumps por oferta" (recomendada).**
- b) "Ilimitado", se não houver nenhum teto técnico.

**7. Ciclos de assinatura.** O passo 04 da home diz "semanais, mensais ou anuais" (index.html:1237). O FAQ da home e o conteúdo dizem "diária, semanal, mensal ou anual" (index.html:1419; content/_llms.md:12). A v2 e a v1 dizem "mensais, trimestrais ou anuais" (v2/index.html:1204; i18n.js:40).
- a) **Diária, semanal, mensal ou anual (recomendada).** É o que o FAQ e `content/` dizem.
- b) Semanal, mensal ou anual.

**8. Idioma e moeda automáticos?** A home diz que "se adaptam sozinhos pelo IP do comprador" (index.html:1251). O conteúdo diz que a detecção é opcional, pelo país do comprador, e que a moeda local depende de a Stripe aceitar (content/_llms.md:11; content/vender-no-exterior.md:20).
- a) **"Pode mostrar o preço na moeda do comprador" (recomendada).** Trata a detecção como opção da oferta.
- b) "Idioma e moeda automáticos pelo IP", como na home.

**9. "Menos de 10 minutos" fica na faixa de números?** Só o lead da home afirma (index.html:1117). Não há medição nem menção em `content/`. O caminho inclui cadastrar o webhook no gateway (content/checkout-stripe.md:14-17).
- a) **Fica, com a legenda "para conectar o gateway e publicar" (recomendada).** A home já promete isso hoje e o BRIEF sugere o número.
- b) Sai e entra "17 idiomas no checkout" (content/vender-no-exterior.md:24).
- c) Fica só no lead do hero (versão alternativa da seção 2) e sai da faixa de números.

**10. Quais logos na faixa?** O BRIEF pede seis (Stripe, PayPal, Mercado Pago, Pagar.me, Efí, dLocal Go). As fontes listam oito gateways (content/_llms.md:9). A Whop tem logo no repo (index.html:1275); o XPag não tem.
- a) **Os seis do BRIEF (recomendada).** O bloco de preço e o FAQ já nomeiam os oito.
- b) Sete, com a Whop.
- c) Os oito. Precisa do logo do XPag.

**11. Para onde vai o chevron dos banners sem página própria?** Teste A/B, Assinaturas e Entrega por e-mail não têm página de recurso.
- a) **Âncoras de `/checkout-para-infoprodutos` (recomendada).** `#recursos-para-vender-mais-na-mesma-visita` para o A/B e `#entrega-e-pos-venda` para os outros dois.
- b) Os três vão para o cadastro.
- c) Esses três banners ficam sem chevron.

**12. Demo com moedas fora da lista e com "Rotmart".** Os mockups da v2 mostram libra, dólar canadense, dólar australiano, dirham e rand (v2/app.js:7-10, :263 e :412), que não estão entre as 16 moedas. Um deles chama o modelo de checkout atual de "Rotmart" (v2/app.js:255), que lembra o nome de um concorrente, e outro usa o endereço `pay.checkout.com` (v2/app.js:244).
- a) **Na v3, só moedas da lista de 16, sem "Rotmart" e com links no formato `pay.snappcheckout.com/c/codigo` (recomendada).**
- b) Manter os mockups como estão na v2.
- c) Como a opção a, e o dono confirma se libra, dólar canadense e dólar australiano podem ser cobrados, para voltarem aos pins.

**13. "Venda aprovada" ou "transação aprovada"?** O bloco de preço e o FAQ da home dizem "por transação aprovada" (index.html:1341 e :1421). O título da home, a página de preços e o `llms.txt` dizem "por venda aprovada" (index.html:7; content/precos.md:10).
- a) **"Por venda aprovada" em toda a v3 (recomendada).**
- b) "Por transação aprovada".

**14. Comparativo com "outros checkouts".** A home tem a coluna "Outros checkouts, 4,9 a 10%+" com nove itens (index.html:1356-1371). Os números não têm fonte.
- a) **Fora da v3 (recomendada).** O bloco de preço fica só com o plano do Snapp.
- b) Entra sem números, só com os itens qualitativos.

**15. Área de membros é de toda conta?** O site diz que faz parte de toda conta (content/area-de-membros.md:10; index.html:1420). A descrição do conector MCP do Snapp ligado a esta sessão fala em "Área de membros (contas liberadas)". Essa descrição está fora do repo e pode se referir só ao uso pela IA.
- a) **Manter "em toda conta", como o site afirma (recomendada).** Só confirme que continua valendo.
- b) Trocar o card 5 por "Checkout em 17 idiomas" até a liberação ser geral.

---

## Cortado por falta de fonte

Sugestões do BRIEF que não se sustentaram inteiras:

- **Cursor nas integrações** (BRIEF.md:74). Só a home cita. Ficou fora até a dúvida 3.
- **"Nenhum app externo, nenhuma integração manual"**, a continuação do lead "Sete ferramentas dentro do mesmo checkout…" (BRIEF.md:70; index.html:1192). A página do upsell é feita no construtor do vendedor (content/upsell-e-order-bump.md:26).
- **"Menos de 10 min para publicar"** (BRIEF.md:73). Mantido, mas a única fonte é a promessa do hero da home. Está na dúvida 9, com substituto pronto.

Afirmações da home e da v2 que não entraram na v3:

- "Mais de 135 moedas" e "195 países" (index.html:1251-1252, :1273 e :1346).
- "Order bump ilimitado" (index.html:1222 e :1348).
- "Acesso em 0 s" e "em segundos" (index.html:1245 e :1294; v2/app.js:435).
- "Números em tempo real", "Vencedor claro" e "Layouts validados" no teste A/B (index.html:1230-1231).
- "Sem Mailchimp, sem custo extra" (index.html:1244). Cita uma ferramenta de terceiros e nenhuma página de conteúdo repete a frase.
- E-mail de upsell com espera de 24 horas (index.html:1296-1300).
- "Idioma e moeda se adaptam sozinhos pelo IP" (index.html:1251).
- "Sem abrir o painel" e "e mais infinitas possibilidades" na seção de IA (index.html:1258 e :1180).
- "Gerencie tudo por chat" (index.html:1117), trocado pelas ações que o conteúdo confirma.
- Coluna "Outros checkouts, 4,9 a 10%+" (index.html:1356-1371).
- "Planos mensais, trimestrais ou anuais" (v2/index.html:1204; i18n.js:40).
- Citação atribuída a Leonardo da Vinci (index.html:1433-1434).
- Criação com IA, Assistente Snapp, Meta Ads e Conquistas. Existem, mas são liberados conta a conta (content/checkout-para-infoprodutos.md:51).
