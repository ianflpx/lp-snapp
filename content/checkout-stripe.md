---
title: Checkout para Stripe em português | Snapp Checkout
description: Conecte a sua conta Stripe a um checkout com upsell em um clique, order bump, Apple Pay, Google Pay e assinaturas. 3% por venda aprovada, sem mensalidade.
h1: Checkout para Stripe com upsell em um clique
nav: Checkout para Stripe
card: Use a sua conta Stripe com upsell em um clique, Apple Pay, Google Pay e assinaturas.
related: checkout-paypal, vender-no-exterior, upsell-e-order-bump
---

O Snapp liga a sua conta Stripe a um checkout pronto para vender produto digital. O cartão é cobrado na sua Stripe, o valor cai no seu saldo da Stripe e o comprador vê a página no idioma dele.

## Como conectar a sua conta Stripe

1. No painel do Snapp, abra Adquirentes e escolha Stripe.
2. Cole a chave publicável e a chave de API da sua conta. A chave restrita (`rk_`) é aceita.
3. Cadastre na Stripe a URL de webhook que o painel mostra e cole de volta o segredo de assinatura.
4. Na oferta, escolha a conta Stripe que vai cobrar.

Você pode conectar várias contas Stripe, por país ou por marca, e cada oferta usa a conta que você indicar. As chaves ficam criptografadas no Snapp.

## O que o comprador pode usar

- Cartão de crédito e débito
- Apple Pay e Google Pay
- Link, o preenchimento automático da Stripe
- Klarna, Affirm, Amazon Pay, Cash App Pay, MB WAY, Bancontact, BLIK, EPS, Satispay, Pay by Bank e Pix

Cada forma tem liga e desliga na oferta. As formas da última linha valem para pagamento único e aparecem quando estão disponíveis na sua conta Stripe e o pagamento cabe nas regras de país, moeda e valor de cada uma.

## Upsell em um clique e assinaturas

Depois de uma compra no cartão pela Stripe, o comprador aceita o upsell com um clique, sem digitar o cartão de novo. O upsell pode ser pagamento único ou assinatura. Se o banco pedir autenticação 3D Secure, ela acontece na própria página do upsell.

A oferta principal também pode ser assinatura, com cobrança diária, semanal, mensal ou anual. Veja o [funil de upsell e order bump](/upsell-e-order-bump).

## Moedas e imposto

A oferta pode ser criada em 16 moedas, e o checkout pode detectar o país do comprador para mostrar o preço na moeda dele. Quem vende para a Europa pode ligar o Stripe Tax na oferta. O VAT é somado ao preço, registrado por venda e sai em relatório por período e país. Mais em [vender no exterior](/vender-no-exterior).

## Quanto custa

O Snapp cobra 3% por venda aprovada e não tem mensalidade. A Stripe cobra a taxa dela na sua conta, pela tabela do seu país. Veja a página de [preços](/precos).

## Perguntas frequentes

### Preciso ter conta na Stripe?

Sim. A conta é sua e é nela que o dinheiro cai. O Snapp usa as suas chaves para criar a cobrança.

### O Snapp segura o dinheiro da venda?

Não. O valor vai direto para o seu saldo na Stripe e o prazo de repasse é o da própria Stripe.

### Funciona com conta Stripe de fora do Brasil?

Funciona com a conta Stripe que você tiver. As formas de pagamento disponíveis dependem do país da conta.

### Posso usar Stripe e PayPal na mesma oferta?

Sim. Os dois aparecem no mesmo checkout e o comprador escolhe. Veja o [checkout com PayPal](/checkout-paypal).

### O checkout aceita Apple Pay e Google Pay?

Sim, pela Stripe. Os botões aparecem quando o aparelho e o navegador do comprador têm a carteira configurada.

### Dá para usar Pix com a Stripe?

Sim, quando o Pix está disponível na sua conta Stripe. Na mesma oferta você também pode receber Pix pela Efí, Pagar.me, XPag ou Mercado Pago.
