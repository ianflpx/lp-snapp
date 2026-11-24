---
title: Upsell em um clique e order bump | Snapp Checkout
description: Aumente o ticket médio com order bump no checkout e funil de upsell e downsell depois da compra, em um clique no cartão e com Pix novo para quem pagou no Pix.
h1: Upsell em um clique, downsell e order bump
nav: Upsell e order bump
card: Order bump na tela do pagamento e funil de upsell e downsell depois da compra.
related: checkout-para-infoprodutos, checkout-stripe, link-de-pagamento
---

O Snapp tem as três ferramentas de aumento de ticket no mesmo checkout. O order bump aparece na tela do pagamento, e o upsell e o downsell aparecem logo depois da compra, cobrados em um clique no cartão que o comprador acabou de usar.

## Order bump, upsell e downsell

- **Order bump** é uma oferta complementar que o comprador marca na tela do pagamento. Entra na mesma cobrança do produto principal.
- **Upsell** é uma oferta mostrada depois da compra aprovada, numa página só dela. O comprador aceita sem digitar os dados de novo.
- **Downsell** é a oferta mais barata que aparece para quem recusou o upsell.

## Como funciona o order bump no Snapp

Cada oferta aceita vários order bumps. Cada um tem nome, preço, imagem, chamada e entregável próprios, e você arrasta para mudar a ordem. O comprador marca os que quiser e paga tudo de uma vez.

## Como funciona o funil de upsell

O funil roda em sequência depois da compra aprovada. Cada upsell pode ter um downsell, e o downsell pode ter um segundo downsell. Você pode encadear vários upsells, e no fim o comprador chega à página de obrigado.

A página do upsell é sua, feita no construtor que você já usa. O Snapp entrega um script e o código dos botões de aceitar e recusar. Uma mesma página pode oferecer mais de um produto para o comprador escolher, e o preço é sempre definido no servidor do Snapp.

## Onde o upsell é em um clique

| Como o comprador pagou | O que acontece no upsell |
|---|---|
| Cartão pela Stripe | Um clique, em pagamento único ou assinatura |
| Amazon Pay, Cash App Pay ou Klarna pela Stripe | Um clique em pagamento único |
| PayPal | Um clique em pagamento único, com a compra em um clique ligada |
| Cartão pelo Mercado Pago | Um clique em pagamento à vista |
| Pix | Um Pix novo com os dados do comprador já preenchidos |
| Outras formas | O comprador conclui num checkout alternativo que você define |

## Upsell para quem pagou no Pix

Quem comprou no Pix e clica em comprar no upsell recebe um Pix novo no mesmo gateway, com nome, e-mail e CPF já preenchidos e QR Code válido por 30 minutos. Pago o Pix, o funil segue para o próximo passo. Vale para Pix pela Efí, Pagar.me, XPag, Mercado Pago e Stripe.

## Perguntas frequentes

### Qual a diferença entre order bump e upsell?

O order bump é escolhido antes de pagar, na mesma tela e na mesma cobrança. O upsell é oferecido depois da compra aprovada, em outra página.

### Quantos order bumps posso colocar numa oferta?

Vários. O painel mostra quantos estão ativos e você reordena arrastando.

### Preciso de uma página para o upsell?

Sim. A página é sua e pode ser feita em qualquer construtor. Você cola nela o script do Snapp e o código dos botões.

### O upsell pode ser uma assinatura?

Sim. Pela Stripe, o upsell de assinatura também é cobrado em um clique.

### E se o cartão for recusado no upsell?

O comprador é levado ao checkout alternativo daquele passo para tentar de novo com outra forma de pagamento.

### O upsell em um clique tem custo extra?

Não. Vale a mesma taxa de 3% por venda aprovada. Veja a página de [preços](/precos).
