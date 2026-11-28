# Referência do webhook

> Contrato completo do webhook do Snapp Checkout: eventos, quando cada um sai, todos os campos do JSON, exemplos, autenticação, reenvio e atribuição.

Página: https://www.snappcheckout.com/docs/webhooks
Markdown: https://www.snappcheckout.com/docs/webhooks.md
Atualizado em 2026-11-28.

Esta página descreve o contrato completo do webhook do Snapp Checkout: como o envio é feito, quais eventos existem e quando cada um sai, quais gateways disparam cada evento, o significado de cada campo do JSON e como receber os eventos com segurança. Ela vale tanto para quem programa a integração quanto para a IA que vai montá-la.

## Resumo em 10 linhas

- O Snapp faz um `POST` com `Content-Type: application/json` na URL que você cadastrar, uma vez por evento e por destino.
- Se você cadastrar um token, ele chega no cabeçalho `Authorization: Bearer <token>`. Não há assinatura HMAC: confira o token.
- O campo `event` diz o que aconteceu. Roteie pelo `event`, nunca pelo `status`.
- O campo `eventId` é único por ocorrência. Guarde-o e ignore a entrega que chegar com um `eventId` já processado.
- `purchase.approved` sai em toda venda aprovada, em todos os gateways. Os demais eventos dependem de opções ligadas no destino.
- Responda com status `2xx` em até 30 segundos. Qualquer outra resposta conta como falha, e o Snapp tenta de novo até 3 vezes.
- Valores em dinheiro vêm em dois formatos: `*InCents` (inteiro, na menor unidade da moeda) e o valor decimal. Use os campos `*InCents` como fonte de verdade.
- O bloco `tracking` traz UTMs, `src`, `sck`, IDs de clique, `fbp`, `fbc` e a URL de entrada do checkout, com atribuição de último toque.
- Os blocos `subscription`, `failure`, `refund` e `cancellation` estão sempre presentes no evento de venda e chegam `null` quando não se aplicam.
- Datas estão em ISO 8601, em UTC (`2026-11-28T14:03:12.000Z`).

## Como o envio funciona

| Item | Comportamento |
|---|---|
| Método | `POST` |
| Corpo | JSON em UTF-8, um evento por requisição |
| Cabeçalhos | `Content-Type: application/json` e, se houver token, `Authorization: Bearer <token>` |
| Sucesso | Qualquer resposta `2xx`. O corpo da resposta é ignorado |
| Prazo | 30 segundos para responder, contando cabeçalhos e corpo |
| Redirecionamento | Não é seguido. Uma resposta `3xx` conta como falha, então cadastre a URL final |
| Destino | URL `http` ou `https` com endereço público. IP privado, `localhost` e URL com usuário e senha são recusados |
| Ordem | Não é garantida. Use `dateTime` e o estado do seu sistema para decidir |
| Entrega | Pelo menos uma vez. A mesma ocorrência pode chegar de novo, sempre com o mesmo `eventId` |

### Reenvio automático

Um envio falha quando a resposta não tem status `2xx`, não chega em 30 segundos ou a conexão cai. O Snapp tenta de novo até 3 vezes:

1. cerca de 30 minutos depois da falha (2 minutos se a sua URL respondeu `429`);
2. 1 hora depois da 1ª nova tentativa;
3. 6 horas depois da 2ª.

Se a URL do destino mudar na oferta antes de uma nova tentativa, o reenvio automático é cancelado e nada vai para a URL antiga.

Cada envio fica na página Eventos do painel por 90 dias, com o JSON enviado, o status da resposta e o erro. De lá o vendedor reenvia qualquer evento manualmente, e o reenvio chega com o mesmo `eventId`. A visita ao checkout (`checkout.viewed`) é a única exceção: não fica registrada e não é reenviada.

## Onde o webhook é configurado

Há dois lugares, e os dois enviam o mesmo formato:

- **Webhook salvo**, em Integrações › Webhooks: nome, URL, token e as ofertas que o disparam. Editar o webhook salvo leva a mudança a todas as ofertas que o usam.
- **Webhook da oferta**, na aba Integração da oferta. Uma oferta pode ter vários destinos.

Se a mesma URL com o mesmo token estiver configurada duas vezes numa oferta, o Snapp envia uma vez só.

Cada destino tem opções que definem quais eventos ele recebe:

| Opção no painel | O que acrescenta |
|---|---|
| Nenhuma (padrão) | Só `purchase.approved` |
| Estornos e chargebacks | `purchase.refunded` e `purchase.chargeback` de vendas avulsas |
| Eventos de assinatura | `subscription.*`: renovação paga ou recusada, cobrança abandonada, cancelamento, expiração, reembolso e chargeback de um ciclo |
| Vendas + tracking completo | `checkout.viewed`, `checkout.initiated`, `payment.pending`, `payment.failed` e `cart.abandoned` |

Um destino sem nenhuma opção ligada nunca recebe um evento que não seja venda. Isso protege sistemas que tratam todo `POST` como venda nova.

## Eventos

| `event` | Quando sai | Opção necessária | `status` |
|---|---|---|---|
| `purchase.approved` | Compra aprovada: venda avulsa, 1ª cobrança de assinatura, upsell ou downsell | Nenhuma | `approved` |
| `purchase.refunded` | Venda avulsa reembolsada, total ou parcialmente | Estornos e chargebacks | `refunded` |
| `purchase.chargeback` | Chargeback perdido numa venda avulsa | Estornos e chargebacks | `chargeback` |
| `subscription.renewed` | Renovação paga (ciclo 2 em diante) | Eventos de assinatura | `approved` |
| `subscription.renewal_failed` | Renovação recusada, com o gateway ainda tentando cobrar | Eventos de assinatura | `failed` |
| `subscription.unpaid` | O gateway parou de tentar cobrar | Eventos de assinatura | `unpaid` |
| `subscription.canceled` | Assinatura cancelada pelo comprador, pelo vendedor ou pelo gateway | Eventos de assinatura | `canceled` |
| `subscription.expired` | Fim dos ciclos contratados | Eventos de assinatura | `expired` |
| `subscription.refunded` | Reembolso de um ciclo | Eventos de assinatura | `refunded` |
| `subscription.chargeback` | Reversão ou disputa perdida de um ciclo | Eventos de assinatura | `chargeback` |
| `checkout.viewed` | Visita ao checkout, uma vez por sessão a cada 24 horas | Vendas + tracking completo | `viewed` |
| `checkout.initiated` | O comprador preencheu nome, e-mail e telefone | Vendas + tracking completo | `initiated` |
| `payment.pending` | Pix, boleto ou SPEI gerado e ainda não pago | Vendas + tracking completo | `pending` |
| `payment.failed` | Pagamento recusado na compra, avisado em até 1 minuto | Vendas + tracking completo | `failed` |
| `cart.abandoned` | O comprador deixou o contato e não comprou em 30 minutos | Vendas + tracking completo | `abandoned` |

Regras que valem para todos os eventos:

- `payment.pending` é seguido de `purchase.approved` quando o Pix ou o boleto é pago. Os dois têm `saleId` igual.
- `payment.failed` só sai se a tentativa ainda estiver recusada no momento do aviso. Uma recusa que virou venda segundos depois não gera `payment.failed`.
- `cart.abandoned` não sai para quem comprou. Se o comprador voltar ao checkout, o carrinho reabre e pode gerar um novo `cart.abandoned` mais tarde.
- Reembolso parcial gera `purchase.refunded` com `refund.partial: true`. Um 2º reembolso parcial gera outro evento, com outro `eventId`.
- Cada venda do funil de upsell é uma venda própria: chega como `purchase.approved` com `isUpsell: true` (ou `isDownsell: true`) e um `saleId` diferente da compra principal.
- Renovação nunca chega como `purchase.approved`. Sem a opção Eventos de assinatura, a renovação não gera evento nenhum.

## Eventos por gateway

"Sim" quer dizer que o gateway dispara o evento hoje. "Não" quer dizer que o evento não sai por aquele gateway, porque o Snapp não recebe essa informação dele ou porque o gateway não tem aquela forma de pagamento. Stripe inclui a conta própria e o Stripe Connect.

| Evento | Stripe | PayPal | Efí | Mercado Pago | Pagar.me | XPag | Whop | dLocal Go |
|---|---|---|---|---|---|---|---|---|
| `purchase.approved` | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| `payment.pending` | Sim (Pix) | Não | Sim | Sim | Sim | Sim | Não | Não |
| `payment.failed` | Sim | Sim | Sim (cartão) | Não | Não | Não | Não | Não |
| `purchase.refunded` e `purchase.chargeback` | Sim | Sim | Não | Não | Não | Não | Sim | Não |
| `subscription.*` | Sim | Sim | Não | Não | Não | Não | Não | Não |
| `checkout.viewed`, `checkout.initiated`, `cart.abandoned` | Sim | Sim | Sim | Sim | Sim | Sim | Sim | Sim |

Os eventos do checkout (`checkout.*` e `cart.abandoned`) não dependem do gateway, porque acontecem antes do pagamento.

## Payload dos eventos de venda

Todos os eventos `purchase.*`, `subscription.*`, `payment.pending` e `payment.failed` usam o mesmo formato. Os campos estão sempre presentes: texto ausente chega como `""`, e bloco que não se aplica chega como `null`.

### Campos da raiz

| Campo | Tipo | Significado |
|---|---|---|
| `event` | string | Nome do evento. É o campo que define o que fazer |
| `eventId` | string | Identificador único da ocorrência. Trate como texto opaco: o formato pode mudar |
| `saleId` | string | ID da venda no Snapp. Igual em todos os eventos da mesma venda |
| `transactionId` | string | ID do PaymentIntent na Stripe (`pi_...`). Chega `""` nos outros gateways |
| `status` | string | Leitura curta do evento (`approved`, `refunded`...). Ver a tabela de eventos |
| `email` | string | E-mail do comprador. Igual a `customer.email` |
| `name` | string | Nome do comprador. Igual a `customer.name` |
| `price` | number | Total da venda em decimal |
| `priceInCents` | integer | Total da venda na menor unidade da moeda. Igual a `amount.totalInCents` |
| `currency` | string | Moeda em ISO 4217, maiúscula (`BRL`, `USD`, `EUR`) |
| `country` | string | País do comprador em ISO 3166-1 alfa-2 (`BR`, `US`) |
| `paymentMethod` | string | Forma de pagamento (`card`, `pix`, `boleto`, `paypal`...). Quando o tipo não é conhecido, vem o gateway |
| `dateTime` | string | Data do pagamento. Em `payment.pending` e `payment.failed`, data da tentativa |
| `paidAt` | string | Igual a `dateTime` |
| `createdAt` | string | Criação da venda no Snapp |
| `customId` | string | ID que o vendedor cadastrou no produto principal. Só aparece quando existe |
| `isRenewal` | boolean | `true` em cobrança de renovação (ciclo 2 em diante) |
| `isUpsell` | boolean | `true` quando a venda veio de um upsell |
| `isDownsell` | boolean | `true` quando a venda veio de um downsell |

### `customer`

| Campo | Tipo | Significado |
|---|---|---|
| `customer.name` | string | Nome completo |
| `customer.email` | string | E-mail |
| `customer.phone` | string | Telefone informado no checkout, quando a oferta coleta |
| `customer.document` | string | Documento informado no checkout (CPF, CNPJ...), quando a oferta coleta |
| `customer.country` | string | País em ISO 3166-1 alfa-2 |
| `customer.ip` | string | IP do comprador na compra |
| `customer.address` | object | `street`, `number`, `complement`, `neighborhood`, `city`, `state`, `zipCode` e `country`. Preenchido só quando a oferta coleta endereço |

### `offer`, `product`, `orderBumps` e `items`

| Campo | Tipo | Significado |
|---|---|---|
| `offer.id` | string | ID da oferta |
| `offer.name` | string | Nome da oferta |
| `offer.slug` | string | Identificador da oferta no link do checkout |
| `offer.currency` | string | Moeda da oferta |
| `offer.language` | string | Idioma do checkout (`pt`, `en`, `es`...) |
| `offer.product` | object | Produto principal como está cadastrado hoje: `name`, `customId`, `priceInCents`, `price` |
| `offer.orderBumps` | array | Order bumps **cadastrados** na oferta, comprados ou não: `id`, `name`, `customId`, `priceInCents`, `price` |
| `product` | object | Produto principal **desta venda**: `name`, `customId`, `priceInCents`, `price` |
| `orderBumps` | array | Order bumps **comprados nesta venda**, no formato de `items` |
| `items` | array | Tudo o que foi comprado: `id`, `name`, `customId`, `isOrderBump`, `priceInCents`, `price` |

Para saber o que o comprador levou, leia `items` ou `orderBumps` da raiz. O bloco `offer` descreve a oferta, não a compra.

### `amount` e `payment`

| Campo | Tipo | Significado |
|---|---|---|
| `amount.total` | number | Total em decimal |
| `amount.totalInCents` | integer | Total na menor unidade da moeda |
| `amount.currency` | string | Moeda |
| `amount.platformFeeInCents` | integer | Taxa do Snapp sobre a venda |
| `payment.method` | string | Gateway que processou (`stripe`, `paypal`, `efi`, `mercadopago`, `pagarme`, `xpag`, `whop`, `dlocal_go`) |
| `payment.methodType` | string | Forma de pagamento (`card`, `pix`, `boleto`, `paypal`...) |
| `payment.walletType` | string ou null | `apple_pay`, `google_pay` ou `samsung_pay` quando o cartão veio de uma carteira |
| `payment.gateway` | string | Gateway que processou. Mesmos valores de `payment.method` |

A menor unidade é o centavo em `BRL`, `USD` e `EUR`. Em moedas sem casas decimais, como `JPY` e `KRW`, o valor `*InCents` já é o valor inteiro na moeda. Por isso, faça contas com os campos `*InCents` e a moeda da venda.

### `tracking`

O bloco `tracking` traz a atribuição de marketing da venda. As chaves abaixo estão sempre presentes, vazias quando não houve valor:

| Campo | Significado |
|---|---|
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` | UTMs da URL do checkout |
| `src`, `sck` | Parâmetros de origem e de campanha da URL do checkout |
| `referrer` | Página de onde o comprador chegou ao checkout |
| `landingUrl` | URL do checkout na entrada, só com os parâmetros de marketing |
| `fbp`, `fbc` | Cookies do Pixel da Meta, para a API de Conversões |
| `userAgent` | Navegador do comprador |
| `sessionId` | Sessão do checkout. Chega `""` nos eventos de venda |

Também entram, quando vieram na URL do checkout, estes parâmetros:

- outras UTMs: `utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic` e qualquer outra chave que comece com `utm_`;
- IDs de clique: `fbclid`, `gclid`, `gbraid`, `wbraid`, `dclid`, `msclkid`, `ttclid`, `twclid`, `li_fat_id`, `ScCid`, `epik`, `tblci`, `yclid`, `clickid` e `click_id`;
- campanha e anúncio: `campaign_id`, `campaign_name`, `campaign`, `adset_id`, `adset_name`, `adset`, `adgroup_id`, `adgroup_name`, `adgroup`, `ad_id`, `ad_name`, `ad`, `cid`, `placement`, `network`, `keyword`, `matchtype`, `creative` e `device`;
- afiliado: `affiliate_id`, `aff_id`, `subid`, `sub_id`, `subid1` a `subid9` e `sub_id1` a `sub_id9`;
- chaves próprias que comecem com `tracking_` ou `marketing_`.

Como a atribuição é capturada:

- **Último toque.** Uma visita nova com parâmetros de campanha substitui a atribuição anterior inteira.
- **Só a URL do checkout conta.** Se o checkout abrir dentro de um iframe na página de vendas, a página precisa repassar os parâmetros para a URL do iframe. Sem isso, o bloco `tracking` chega vazio.
- **Limites.** Até 64 parâmetros, 2.048 caracteres por valor e 16 KB no total. Um parâmetro que estoura o limite é descartado inteiro, nunca cortado no meio.
- **Nada sensível.** Chaves com `token`, `secret`, `password`, `email`, `phone`, `document` ou `authorization` no nome nunca entram. Parâmetros fora da lista acima também não.
- **Renovação herda.** A renovação de uma assinatura leva a mesma atribuição da compra que a originou.

### `subscription`

Chega `null` em venda que não é assinatura.

| Campo | Tipo | Significado |
|---|---|---|
| `subscription.id` | string | ID da assinatura no gateway (`sub_...` na Stripe, `I-...` no PayPal) |
| `subscription.gateway` | string | Gateway da assinatura |
| `subscription.interval` | string ou null | `day`, `week`, `month` ou `year` |
| `subscription.cycle` | integer ou null | Número da cobrança: 1 na compra, 2 na 1ª renovação, e assim por diante |
| `subscription.status` | string ou null | `active`, `past_due`, `unpaid`, `canceled` ou `expired` |
| `subscription.active` | boolean | `true` só quando `status` é `active`. Use para liberar ou bloquear o acesso |
| `subscription.nextBillingAt` | string ou null | Próxima cobrança, quando o gateway informa |
| `subscription.canceledAt` | string ou null | Data do cancelamento |

`subscription.active` chega `false` em `past_due` de propósito: o gateway ainda vai tentar cobrar (ver `failure.nextRetryAt`), e cabe ao seu sistema decidir se dá carência.

### `failure`

Preenchido em `payment.failed` e `subscription.renewal_failed`. Nos outros eventos, `null`.

| Campo | Tipo | Significado |
|---|---|---|
| `failure.reason` | string | Código do erro no gateway (`card_declined`...) |
| `failure.message` | string | Mensagem do gateway |
| `failure.declineCode` | string | Motivo do banco emissor, quando há (`insufficient_funds`...) |
| `failure.attempt` | integer ou null | Número da tentativa de cobrança da renovação |
| `failure.nextRetryAt` | string ou null | Próxima tentativa automática do gateway |

### `refund`

Preenchido em `purchase.refunded`, `purchase.chargeback`, `subscription.refunded` e `subscription.chargeback`. Nos outros eventos, `null`.

| Campo | Tipo | Significado |
|---|---|---|
| `refund.id` | string | ID do reembolso no gateway |
| `refund.amountInCents` | integer | Total já devolvido nesta venda, somando os reembolsos parciais |
| `refund.amount` | number | O mesmo total, em decimal |
| `refund.partial` | boolean | `true` quando o devolvido é menor que o total da venda |
| `refund.reason` | string | Motivo informado |
| `refund.origin` | string | `snapp` quando foi pedido pelo Snapp, `external` quando veio direto do gateway |
| `refund.refundedAt` | string ou null | Data do reembolso |
| `refund.chargeback` | boolean | `true` quando foi chargeback |

### `cancellation`

Preenchido em `subscription.canceled` e `subscription.expired`. Nos outros eventos, `null`.

| Campo | Tipo | Significado |
|---|---|---|
| `cancellation.reason` | string | Motivo, quando informado |
| `cancellation.source` | string | `customer`, `vendor` ou `gateway` |
| `cancellation.at` | string ou null | Data do cancelamento |

### Exemplo: `purchase.approved`

Venda no cartão pela Stripe, com um order bump. Os valores são ilustrativos.

```json
{
  "event": "purchase.approved",
  "eventId": "purchase.approved:6748a1f0c2b3d4e5f6a7b8c9",
  "saleId": "6748a1f0c2b3d4e5f6a7b8c9",
  "transactionId": "pi_3QExample0000000000000001",
  "email": "maria@example.com",
  "name": "Maria Souza",
  "status": "approved",
  "price": 127,
  "priceInCents": 12700,
  "currency": "BRL",
  "country": "BR",
  "paymentMethod": "card",
  "dateTime": "2026-11-28T14:03:12.000Z",
  "customer": {
    "name": "Maria Souza",
    "email": "maria@example.com",
    "phone": "+5511999999999",
    "document": "12345678901",
    "country": "BR",
    "ip": "203.0.113.10",
    "address": {
      "street": "",
      "number": "",
      "complement": "",
      "neighborhood": "",
      "city": "",
      "state": "",
      "zipCode": "",
      "country": "BR"
    }
  },
  "offer": {
    "id": "6740f2a9b1c2d3e4f5a6b7c8",
    "name": "Curso de Confeitaria",
    "slug": "K7P2X9Q4M8R1T6WZ",
    "currency": "BRL",
    "language": "pt",
    "product": { "name": "Curso de Confeitaria", "customId": "CONF-01", "priceInCents": 9700, "price": 97 },
    "orderBumps": [
      { "id": "6740f2a9b1c2d3e4f5a6b7d1", "name": "Apostila de receitas", "customId": "CONF-BUMP", "priceInCents": 3000, "price": 30 }
    ]
  },
  "product": { "name": "Curso de Confeitaria", "customId": "CONF-01", "priceInCents": 9700, "price": 97 },
  "orderBumps": [
    { "id": "6748a1f0c2b3d4e5f6a7b8d2", "name": "Apostila de receitas", "customId": "CONF-BUMP", "isOrderBump": true, "priceInCents": 3000, "price": 30 }
  ],
  "items": [
    { "id": "6748a1f0c2b3d4e5f6a7b8d1", "name": "Curso de Confeitaria", "customId": "CONF-01", "isOrderBump": false, "priceInCents": 9700, "price": 97 },
    { "id": "6748a1f0c2b3d4e5f6a7b8d2", "name": "Apostila de receitas", "customId": "CONF-BUMP", "isOrderBump": true, "priceInCents": 3000, "price": 30 }
  ],
  "amount": { "total": 127, "totalInCents": 12700, "currency": "BRL", "platformFeeInCents": 381 },
  "payment": { "method": "stripe", "methodType": "card", "walletType": null, "gateway": "stripe" },
  "tracking": {
    "utm_source": "facebook",
    "utm_medium": "paid_social",
    "utm_campaign": "black-friday",
    "utm_term": "publico-quente",
    "utm_content": "video-01",
    "src": "pagina-de-vendas",
    "sck": "120210000000000001",
    "fbclid": "IwAR0Example",
    "referrer": "https://exemplo.com.br/confeitaria",
    "landingUrl": "https://pay.snappcheckout.com/c/K7P2X9Q4M8R1T6WZ?utm_source=facebook&utm_medium=paid_social&utm_campaign=black-friday&utm_term=publico-quente&utm_content=video-01&src=pagina-de-vendas&sck=120210000000000001&fbclid=IwAR0Example",
    "fbp": "fb.1.1732802400000.1234567890",
    "fbc": "fb.1.1732802400000.IwAR0Example",
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15",
    "sessionId": ""
  },
  "createdAt": "2026-11-28T14:02:40.000Z",
  "paidAt": "2026-11-28T14:03:12.000Z",
  "subscription": null,
  "failure": null,
  "refund": null,
  "cancellation": null,
  "isRenewal": false,
  "isUpsell": false,
  "isDownsell": false,
  "customId": "CONF-01"
}
```

### Exemplo: `payment.pending`

Pix gerado pela Efí. O resto do payload segue o formato da venda. Quando o Pix for pago, chega `purchase.approved` com o mesmo `saleId`.

```json
{
  "event": "payment.pending",
  "eventId": "payment.pending:6748b2c1d3e4f5a6b7c8d9e0",
  "saleId": "6748b2c1d3e4f5a6b7c8d9e0",
  "transactionId": "",
  "status": "pending",
  "paymentMethod": "pix",
  "dateTime": "2026-11-28T15:10:00.000Z",
  "payment": { "method": "efi", "methodType": "pix", "walletType": null, "gateway": "efi" },
  "subscription": null,
  "failure": null,
  "refund": null,
  "cancellation": null
}
```

### Exemplo: `payment.failed`

```json
{
  "event": "payment.failed",
  "eventId": "payment.failed:6748c3d2e4f5a6b7c8d9e0f1",
  "saleId": "6748c3d2e4f5a6b7c8d9e0f1",
  "status": "failed",
  "paymentMethod": "card",
  "failure": {
    "reason": "card_declined",
    "message": "Your card has insufficient funds.",
    "declineCode": "insufficient_funds",
    "attempt": null,
    "nextRetryAt": null
  },
  "refund": null,
  "cancellation": null
}
```

### Exemplo: `purchase.refunded`

Reembolso parcial de R$ 30,00 numa venda de R$ 127,00.

```json
{
  "event": "purchase.refunded",
  "eventId": "purchase.refunded:6748a1f0c2b3d4e5f6a7b8c9:re_3QExample0000000000000001",
  "saleId": "6748a1f0c2b3d4e5f6a7b8c9",
  "status": "refunded",
  "priceInCents": 12700,
  "refund": {
    "id": "re_3QExample0000000000000001",
    "amountInCents": 3000,
    "amount": 30,
    "partial": true,
    "reason": "requested_by_customer",
    "origin": "snapp",
    "refundedAt": "2026-11-29T10:00:00.000Z",
    "chargeback": false
  },
  "subscription": null,
  "failure": null,
  "cancellation": null
}
```

### Exemplo: `subscription.renewed`

```json
{
  "event": "subscription.renewed",
  "eventId": "subscription.renewed:6750d4e3f5a6b7c8d9e0f1a2",
  "saleId": "6750d4e3f5a6b7c8d9e0f1a2",
  "status": "approved",
  "isRenewal": true,
  "subscription": {
    "id": "sub_1QExample000000000000001",
    "gateway": "stripe",
    "interval": "month",
    "cycle": 2,
    "status": "active",
    "active": true,
    "nextBillingAt": "2027-01-28T14:03:12.000Z",
    "canceledAt": null
  },
  "failure": null,
  "refund": null,
  "cancellation": null
}
```

Cada renovação é uma venda nova no Snapp, então o `saleId` muda a cada ciclo. Para ligar as cobranças ao mesmo assinante, use `subscription.id`.

### Exemplo: `subscription.canceled`

```json
{
  "event": "subscription.canceled",
  "eventId": "subscription.canceled:6750d4e3f5a6b7c8d9e0f1a2",
  "status": "canceled",
  "subscription": {
    "id": "sub_1QExample000000000000001",
    "gateway": "stripe",
    "interval": "month",
    "cycle": 2,
    "status": "canceled",
    "active": false,
    "nextBillingAt": null,
    "canceledAt": "2026-12-15T09:30:00.000Z"
  },
  "cancellation": { "reason": "", "source": "customer", "at": "2026-12-15T09:30:00.000Z" },
  "failure": null,
  "refund": null
}
```

O cancelamento não devolve o período já pago. Se o seu sistema controla acesso, decida se bloqueia na hora ou no fim do período, que é a data da última cobrança mais o `interval`. A área de membros e o Discord do Snapp mantêm o acesso até o fim do período pago.

## Payload dos eventos do checkout

`checkout.viewed`, `checkout.initiated` e `cart.abandoned` acontecem antes de existir uma venda. Por isso, não trazem `saleId`, `items`, `payment`, `subscription`, `failure`, `refund` nem `cancellation`.

| Campo | Tipo | Significado |
|---|---|---|
| `event` | string | `checkout.viewed`, `checkout.initiated` ou `cart.abandoned` |
| `eventId` | string | Identificador único da ocorrência |
| `status` | string | `viewed`, `initiated` ou `abandoned` |
| `email`, `name` | string | Contato do comprador. Vazios em `checkout.viewed` |
| `dateTime` | string | Data do evento |
| `customer` | object | `name`, `email`, `phone`, `country` e `ip`. Em `checkout.viewed` só vêm `country` e `ip` |
| `offer` | object | Mesmo bloco `offer` dos eventos de venda |
| `product` | object | Produto principal da oferta |
| `amount` | object | `total`, `totalInCents` e `currency`. Em `checkout.initiated`, inclui os order bumps marcados |
| `tracking` | object | Mesmo bloco `tracking` dos eventos de venda, com `sessionId` preenchido |

### Exemplo: `checkout.initiated`

```json
{
  "event": "checkout.initiated",
  "eventId": "checkout.initiated:6748a1e9b1c2d3e4f5a6b7c8",
  "status": "initiated",
  "email": "maria@example.com",
  "name": "Maria Souza",
  "dateTime": "2026-11-28T14:02:05.000Z",
  "customer": {
    "name": "Maria Souza",
    "email": "maria@example.com",
    "phone": "+5511999999999",
    "country": "BR",
    "ip": "203.0.113.10"
  },
  "offer": {
    "id": "6740f2a9b1c2d3e4f5a6b7c8",
    "name": "Curso de Confeitaria",
    "slug": "K7P2X9Q4M8R1T6WZ",
    "currency": "BRL",
    "language": "pt",
    "product": { "name": "Curso de Confeitaria", "customId": "CONF-01", "priceInCents": 9700, "price": 97 },
    "orderBumps": [
      { "id": "6740f2a9b1c2d3e4f5a6b7d1", "name": "Apostila de receitas", "customId": "CONF-BUMP", "priceInCents": 3000, "price": 30 }
    ]
  },
  "product": { "name": "Curso de Confeitaria", "customId": "CONF-01", "priceInCents": 9700, "price": 97 },
  "amount": { "total": 127, "totalInCents": 12700, "currency": "BRL" },
  "tracking": {
    "utm_source": "facebook",
    "utm_medium": "paid_social",
    "utm_campaign": "black-friday",
    "utm_term": "publico-quente",
    "utm_content": "video-01",
    "src": "pagina-de-vendas",
    "sck": "120210000000000001",
    "referrer": "https://exemplo.com.br/confeitaria",
    "landingUrl": "https://pay.snappcheckout.com/c/K7P2X9Q4M8R1T6WZ?utm_source=facebook&utm_campaign=black-friday&sck=120210000000000001",
    "fbp": "fb.1.1732802400000.1234567890",
    "fbc": "",
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15",
    "sessionId": "b6f1c0de-3a1f-4c55-9a51-0c9d6c1e2f11"
  }
}
```

`cart.abandoned` tem o mesmo formato, com `status: "abandoned"`. `checkout.viewed` também, mas com `email`, `name`, `customer.name`, `customer.email` e `customer.phone` vazios.

## Como receber com segurança

1. **Confira o token.** Compare o cabeçalho `Authorization` com `Bearer <seu token>` em tempo constante e responda `401` se não bater.
2. **Responda rápido.** Grave o evento e responda `200` logo em seguida. Processe depois, numa fila. Um processamento que passa de 30 segundos vira falha e reenvio.
3. **Descarte repetição.** Antes de processar, procure o `eventId` no seu banco. Se já existir, responda `200` sem fazer nada.
4. **Roteie pelo `event`.** Um `POST` não é sempre uma venda. Trate `purchase.refunded` e `purchase.chargeback` como dinheiro devolvido, nunca como venda nova.
5. **Ligue a venda pelo `saleId`.** Reembolso, chargeback, Pix pago e recusa chegam com o `saleId` da venda original. Renovações chegam com `saleId` novo e o mesmo `subscription.id`.
6. **Ignore campo desconhecido.** O payload pode ganhar campos novos. Leia só os que você usa e não rejeite o evento por causa de um campo a mais.

### Exemplo em Node.js (Express)

```js
import express from "express";
import { timingSafeEqual } from "node:crypto";

const app = express();
const expected = Buffer.from(`Bearer ${process.env.SNAPP_WEBHOOK_TOKEN}`);

app.post("/webhooks/snapp", express.json({ limit: "1mb" }), async (req, res) => {
  const received = Buffer.from(req.get("authorization") || "");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return res.sendStatus(401);
  }

  const { event, eventId, saleId } = req.body;
  if (await db.processedEvents.exists(eventId)) return res.sendStatus(200);
  await db.processedEvents.insert({ eventId, event, saleId, payload: req.body });
  res.sendStatus(200);

  switch (event) {
    case "purchase.approved":
      return grantAccess(req.body);
    case "purchase.refunded":
    case "purchase.chargeback":
      return req.body.refund.partial ? recordPartialRefund(req.body) : revokeAccess(req.body);
    case "subscription.renewed":
      return extendAccess(req.body.subscription);
    case "subscription.unpaid":
    case "subscription.canceled":
    case "subscription.expired":
      return scheduleAccessEnd(req.body.subscription);
    default:
      return trackFunnelEvent(req.body);
  }
});
```

### Exemplo em PHP

```php
<?php
$expected = 'Bearer ' . getenv('SNAPP_WEBHOOK_TOKEN');
$received = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!hash_equals($expected, $received)) {
    http_response_code(401);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload) || empty($payload['eventId'])) {
    http_response_code(400);
    exit;
}

// Tabela com índice único em event_id: a repetição falha no INSERT e é ignorada.
$stmt = $pdo->prepare('INSERT IGNORE INTO snapp_events (event_id, event, sale_id, payload) VALUES (?, ?, ?, ?)');
$stmt->execute([$payload['eventId'], $payload['event'], $payload['saleId'] ?? null, json_encode($payload)]);

http_response_code(200);
```

Em Apache com PHP-FPM, o cabeçalho `Authorization` pode não chegar ao PHP. Nesse caso, acrescente `SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1` ao `.htaccess`.

## Como testar

- Na oferta, o botão Dados enviados mostra o JSON de `purchase.approved` montado com os dados reais da oferta.
- O link de compra teste percorre o checkout completo, dispara o webhook e as outras automações e não faz cobrança real. Ele vale por 5 minutos.
- Para inspecionar o que chega, cadastre como destino uma URL de um serviço de captura de requisições e depois troque pela URL definitiva.
- A página Eventos mostra cada envio com o JSON, o status da resposta e o erro, e permite reenviar.

## Limitações atuais

- A autenticação é só pelo token no cabeçalho `Authorization`. Não há assinatura HMAC do corpo.
- `transactionId` só é preenchido em vendas da Stripe. Nos outros gateways, use `saleId`.
- `sessionId` chega vazio nos eventos de venda: a venda não guarda a sessão do checkout.
- Disputa aberta não gera evento. O chargeback chega quando a disputa é perdida.
- A cobertura por gateway está na tabela "Eventos por gateway". Um evento marcado como "Não" não sai por aquele gateway.

## Perguntas frequentes

### O webhook dispara para vendas pela Stripe e pelo PayPal?

Sim. `purchase.approved` sai em todos os gateways. Na Stripe e no PayPal também saem recusa, reembolso, chargeback e todos os eventos de assinatura, desde que as opções estejam ligadas no destino.

### Os parâmetros da URL do checkout chegam no webhook?

Chegam no bloco `tracking`: as cinco UTMs, `src`, `sck`, IDs de clique e dados de campanha, com atribuição de último toque. Se o checkout estiver num iframe, a página de vendas precisa repassar os parâmetros para a URL do iframe.

### Como sei que o envio veio do Snapp?

Cadastre um token no destino. Ele chega no cabeçalho `Authorization` como `Bearer <token>`, e o seu sistema compara antes de aceitar.

### Como evito processar o mesmo evento duas vezes?

Guarde o `eventId`. Ele é único por ocorrência, e toda repetição, seja reenvio automático, reenvio manual ou aviso repetido do gateway, chega com o mesmo valor.

### Por que uma renovação não chegou?

Renovação só chega no destino com a opção Eventos de assinatura ligada, e só em assinaturas da Stripe e do PayPal. Sem a opção, o destino recebe apenas a 1ª cobrança.

### O que acontece se o meu sistema estiver fora do ar?

O envio fica como falha e o Snapp tenta de novo até 3 vezes, em cerca de 30 minutos, 1 hora e 6 horas. Depois disso, o reenvio é manual, pela página Eventos.
