# Webhooks para levar cada venda ao seu sistema

> Receba vendas, estornos, renovações e eventos do funil por webhook em qualquer sistema que receba HTTP, com registro de cada envio e reenvio automático.

Página: https://www.snappcheckout.com/webhooks

O webhook do Snapp envia um POST em JSON para a URL que você indicar a cada venda aprovada. Ele também pode avisar estornos, chargebacks, cada evento da assinatura e os passos do funil antes da compra. Funciona com qualquer sistema que receba HTTP.

## Webhook da conta e webhook da oferta

Em Integrações, você cadastra webhooks com nome, URL e token de autenticação e escolhe em quais ofertas usar cada um. Um webhook salvo pode ser usado em quantas ofertas você quiser.

Se preferir, cadastre a URL e o token direto na oferta, na aba Integração. Uma oferta pode ter mais de um webhook, e cada um tem as próprias opções de eventos.

## Quais eventos chegam

Toda venda aprovada chega como `purchase.approved`, seja compra avulsa ou a primeira cobrança de uma assinatura. Os outros eventos são opcionais e você liga por webhook:

- **Estornos e chargebacks.** Venda avulsa estornada ou chargeback perdido. Ligue só se o seu sistema lê o campo `event`, senão um estorno pode ser tratado como venda nova.
- **Eventos de assinatura.** Renovação paga ou recusada, cobrança abandonada pelo gateway, cancelamento, expiração, reembolso e chargeback de um ciclo.
- **Vendas + tracking completo.** Também envia os eventos do funil, para ferramentas de rastreamento.

| Evento | Quando chega | Opção |
|---|---|---|
| `purchase.approved` | Compra aprovada | Sempre |
| `purchase.refunded` | Venda avulsa estornada | Estornos e chargebacks |
| `purchase.chargeback` | Chargeback perdido em venda avulsa | Estornos e chargebacks |
| `subscription.renewed` | Renovação paga | Eventos de assinatura |
| `subscription.renewal_failed` | Renovação recusada, com o gateway ainda tentando cobrar | Eventos de assinatura |
| `subscription.unpaid` | O gateway parou de tentar cobrar | Eventos de assinatura |
| `subscription.canceled` | Cancelamento pelo comprador, por você ou pelo gateway | Eventos de assinatura |
| `subscription.expired` | Fim dos ciclos contratados | Eventos de assinatura |
| `subscription.refunded` | Reembolso de um ciclo | Eventos de assinatura |
| `subscription.chargeback` | Reversão ou disputa de um ciclo | Eventos de assinatura |
| `checkout.viewed` | Visita ao checkout, uma vez por sessão a cada 24 horas | Vendas + tracking completo |
| `checkout.initiated` | Comprador preencheu nome, e-mail e telefone | Vendas + tracking completo |
| `payment.pending` | Pix ou boleto gerado e ainda não pago | Vendas + tracking completo |
| `payment.failed` | Pagamento recusado na compra, avisado em até 1 minuto | Vendas + tracking completo |
| `cart.abandoned` | Comprador deixou o e-mail e não comprou em 30 minutos | Vendas + tracking completo |

Para liberar ou bloquear o plano de um assinante, leia `subscription.active`. Ele chega `true` na renovação paga e `false` quando o gateway para de cobrar.

## O que vem no JSON

O envio é um POST com `Content-Type: application/json`. Se você cadastrar um token, ele vai no header `Authorization` como `Bearer`.

- **`event` e `eventId`.** O primeiro diz o que aconteceu. O segundo é único por ocorrência e serve para ignorar entregas repetidas.
- **`customer`.** Nome, e-mail, telefone, documento, país, IP e endereço do comprador.
- **`offer`, `product`, `orderBumps` e `items`.** O que foi comprado, com o ID customizado do produto (`customId`) quando você cadastra um.
- **`amount` e `payment`.** Valor, moeda, forma de pagamento e gateway.
- **`tracking`.** `src`, `sck`, UTMs, IDs de clique e dados de campanha.
- **`subscription`, `failure`, `refund` e `cancellation`.** Chegam preenchidos quando se aplicam e como `null` quando não se aplicam, para o formato ser o mesmo em todo evento.
- **`isUpsell` e `isDownsell`.** Dizem se a venda veio do funil de [upsell](https://www.snappcheckout.com/upsell-e-order-bump).

Os eventos do funil trazem os blocos `offer`, `customer`, `amount` e `tracking`, com UTMs, IDs de clique, `fbp`, `fbc`, user agent e `sessionId`. Na oferta, o botão Dados enviados mostra um exemplo do JSON.

A [referência do webhook](https://www.snappcheckout.com/docs/webhooks) descreve cada campo, cada evento e os gateways que disparam cada um, com exemplos de JSON e de código para receber os envios.

## Registro de cada envio

Cada envio fica na página Eventos com o status Sucesso, Falhou ou Em reenvio. No topo aparecem o total, os envios sem contar reenvios, os sucessos, as falhas e os que estão em reenvio. Você filtra por período, tipo de evento, oferta e nome ou e-mail do cliente e abre cada envio para ver o JSON que saiu.

Um envio falha quando a resposta não tem status 2xx ou não chega em 30 segundos. Nesse caso o Snapp tenta de novo até 3 vezes: cerca de 30 minutos depois da falha, depois de mais 1 hora e depois de mais 6 horas. Se a sua URL respondeu 429, a primeira nova tentativa sai em 2 minutos.

Você também pode reenviar qualquer evento pelo painel. O reenvio vai para o destino original e fica registrado como um evento novo. O registro fica guardado por 90 dias. A visita ao checkout (`checkout.viewed`) não entra na página Eventos e não é reenviada.

## Integrações prontas

Para algumas ferramentas não é preciso montar webhook:

- **UTMify** recebe as vendas e também os reembolsos e chargebacks.
- **vTurb** recebe a conversão de cada venda paga que traz a chave de conversão (`src` ou `sck`) na URL do checkout.
- **Discord.** O bot do Snapp coloca o comprador no servidor com o cargo da oferta e tira o cargo em reembolso total, chargeback ou fim da assinatura.
- **Pixel e API de Conversões** da Meta, além de TikTok, Google Ads e Taboola.
- **Resend**, para os e-mails do checkout saírem com o seu remetente.

Os envios para a UTMify, a vTurb e as APIs de conversão da Meta, do TikTok e da Taboola também aparecem na página Eventos.

## Perguntas frequentes

### Funciona com qualquer ferramenta de automação?

Funciona com qualquer sistema que receba um POST em JSON por HTTP. Você cola a URL que a ferramenta gerar e, se ela pedir, o token.

### Como sei que o envio veio do Snapp?

Cadastre um token de autenticação no webhook. O Snapp envia o token no header `Authorization`, e o seu sistema confere antes de aceitar.

### O webhook dispara em cada renovação da assinatura?

Só se você ligar Eventos de assinatura. Desligado, o webhook dispara apenas na primeira venda, e a renovação não chega como venda nova.

### Como evito processar a mesma venda duas vezes?

Guarde o `eventId`. Ele é único por ocorrência, então uma entrega repetida chega com o mesmo valor e pode ser ignorada.

### E se o meu sistema estiver fora do ar?

O envio fica como falha e o Snapp tenta de novo até 3 vezes. Depois disso, você reenvia pela página Eventos.

### Como testo o webhook antes de vender?

Gere uma compra teste na oferta. O link percorre o checkout completo com as automações, sem cobrança real, e vale por 5 minutos.
