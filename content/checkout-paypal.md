---
title: Checkout com PayPal para produtos digitais | Snapp Checkout
description: Aceite PayPal no mesmo checkout do cartão e do Pix, com assinaturas, order bump e entrega automática. O valor da venda cai direto no seu saldo do PayPal.
h1: Checkout com PayPal ao lado do cartão
nav: Checkout com PayPal
card: PayPal no mesmo checkout do cartão, com assinatura e entrega automática.
related: checkout-stripe, vender-no-exterior, link-de-pagamento
---

No Snapp você conecta a sua conta PayPal e o botão do PayPal aparece no mesmo checkout do cartão. O comprador escolhe como pagar e o valor cai no seu saldo do PayPal.

## Por que colocar PayPal no checkout

Parte dos compradores, principalmente nos Estados Unidos e na Europa, prefere pagar com PayPal porque já tem saldo ou cartão salvo ali. Com o PayPal ao lado do cartão, esse comprador conclui a compra na mesma tela.

## Como conectar o PayPal

1. No painel de desenvolvedor do PayPal, crie um app e copie o Client ID e o Client Secret.
2. No Snapp, abra Adquirentes, escolha PayPal e cole as duas chaves.
3. Cadastre no PayPal a URL de webhook que o painel mostra. É por ela que chegam recusas, reembolsos e reversões.
4. Na oferta, ligue o PayPal e escolha a conta que recebe.

O Snapp aceita várias contas PayPal e cada oferta usa a que você indicar.

## O que funciona com PayPal

- **Pagamento único e assinatura**, com a cobrança recorrente criada na sua conta PayPal.
- **Order bump** no mesmo pagamento.
- **Upsell depois da compra.** Com a compra em um clique do PayPal ligada, o comprador aceita o upsell de pagamento único sem aprovar de novo. Sem ela, ele conclui o upsell em um checkout alternativo.
- **Entrega automática** por e-mail e acesso à [área de membros](/area-de-membros).

## PayPal e Stripe juntos

Para vender fora do Brasil, uma combinação comum é cartão pela Stripe e PayPal na mesma oferta. O comprador que desiste do cartão ainda encontra o PayPal na mesma tela. Veja o [checkout para Stripe](/checkout-stripe) e como [vender no exterior](/vender-no-exterior).

## Quanto custa

O Snapp cobra 3% por venda aprovada e não tem mensalidade. O PayPal cobra a taxa dele direto na sua conta. Veja a página de [preços](/precos).

## Perguntas frequentes

### O dinheiro da venda passa pelo Snapp?

Não. O pagamento é feito na sua conta PayPal e o saldo fica disponível ali, nas regras do PayPal.

### Posso vender assinatura pelo PayPal?

Sim. O Snapp cria o plano na sua conta PayPal e a renovação é automática.

### O PayPal aparece junto com cartão e Pix?

Sim. Todas as formas de pagamento ligadas na oferta aparecem no mesmo checkout.

### Posso ter mais de uma conta PayPal?

Sim. Você conecta várias contas e escolhe qual recebe em cada oferta.

### O upsell funciona para quem pagou com PayPal?

Sim. Com a compra em um clique do PayPal ligada, o upsell de pagamento único é aceito em um clique. Nos outros casos o comprador é levado a um checkout alternativo para concluir.
