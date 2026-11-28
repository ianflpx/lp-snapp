# Chargeback e disputas com as provas já reunidas

> Veja cada disputa com o prazo de resposta, as provas que o Snapp junta da venda e um dossiê em PDF. Na Stripe e no PayPal, a defesa sai do próprio painel.

Página: https://www.snappcheckout.com/chargeback

A página Disputas do Snapp mostra cada chargeback com o prazo para responder e as provas que o Snapp já juntou da venda. Você confere as provas, revisa o texto da defesa e envia ao gateway ou baixa tudo para responder por conta própria.

## O que aparece na lista

Cada disputa mostra o comprador, a oferta, o gateway, o valor, o motivo, a data de abertura e a coluna Responder até, com o tempo que falta para o prazo. Quando o prazo passa, a coluna mostra Prazo encerrado.

As abas separam as disputas que aguardam resposta, as que estão em análise, as ganhas, as perdidas e as consultas. A coluna Respondida diz se a resposta saiu pelo Snapp, se foi dada direto no gateway ou se ainda não existe.

A página reúne as disputas da Stripe, do PayPal e da Whop. Também entram os estornos que já chegam decididos, como o MED do Pix e o chargeback do Mercado Pago.

## Provas que o Snapp junta da venda

Quando uma disputa da Stripe ou do PayPal abre, o Snapp guarda uma cópia das provas da venda. A cópia é feita na hora porque o conteúdo dos e-mails e o IP da compra deixam de ser guardados depois de um tempo.

- **Entrega e uso:** e-mail de compra entregue ao comprador, clique no link de acesso, entrada na área de membros, aulas abertas e entrada no Discord.
- **Pagamento:** autenticação 3D Secure, pagamento com Apple Pay ou Google Pay, código de segurança (CVC) conferido, país do IP igual ao país do cartão e IP da compra registrado.
- **Venda:** venda sem reembolso e produto com descrição na oferta.

As checagens mudam conforme o motivo da disputa. Em fraude, contam a autenticação e o IP. Quando o comprador diz que não recebeu, contam a entrega e o acesso. Cada e-mail aparece como o comprador recebeu, com a informação de envio, entrega e clique.

## Força das provas

O Snapp classifica o conjunto como Forte, Média ou Fraca pelo que encontrou. Em uma disputa por fraude, por exemplo, um pagamento autenticado com 3D Secure já deixa as provas fortes. A classificação é uma sugestão. A decisão de contestar é sua.

## Defesa escrita em inglês

A defesa vai em inglês, que é o idioma que o banco do comprador e o PayPal leem. Uma IA escreve o texto só com os fatos do dossiê. O nome, o e-mail e o IP do comprador não são enviados à IA e entram no texto depois.

Junto com a defesa vem um resumo em português do que ela argumenta e de qual prova está faltando. Você pode editar o texto, que tem até 2.000 caracteres, ou pedir um texto novo. Se a IA não responder, entra um modelo pronto montado com os mesmos fatos.

## Dossiê em PDF

O dossiê reúne, em inglês, o resumo da compra, as checagens do pagamento, a defesa, a linha do tempo de acesso e a imagem de cada e-mail de entrega como o comprador recebeu. Você pode baixar o PDF e copiar o texto da defesa para usar onde precisar.

## Envio ao gateway

Na Stripe e no PayPal, o botão de envio manda a defesa, o dossiê em PDF e o recibo da compra para o gateway. O envio é único: depois dele não dá para mudar nem completar as provas. Por isso o painel pede confirmação antes.

| Gateway | Como responder |
|---|---|
| Stripe | Pelo Snapp. Se você conectou a Stripe com chave restrita, a chave precisa das permissões `Disputes: Write` e `Files: Write`. Sem elas, envie o PDF e o texto pelo Dashboard da Stripe. |
| PayPal | Pelo Snapp, quando o PayPal aceita provas naquela fase da disputa e o app do PayPal tem a permissão `Customer disputes`. Na fase de consulta, o PayPal só aceita mensagem ao comprador, e a resposta é dada na Central de Resoluções. |
| Whop | A disputa aparece na lista e nos números. A resposta é dada no painel da Whop. |
| MED do Pix e Mercado Pago | Chegam já decididos e entram na lista e na taxa de chargeback. |

Se o prazo terminou, se as provas já foram enviadas pelo painel do gateway ou se o gateway recusar o envio, o Snapp mantém as provas para consulta e você responde com o PDF e o texto no painel do gateway.

## Números das disputas

No topo da página ficam a taxa de chargeback, as disputas abertas, o valor que está em jogo nas disputas em andamento e a taxa de vitória. A taxa de chargeback compara as disputas com as vendas pagas do período, e as consultas ficam fora dela. A taxa de vitória conta só as disputas já decididas.

Abaixo vêm um gráfico de disputas por dia, semana ou mês e a divisão por motivo. Você filtra por período e por gateway e busca por nome ou e-mail do comprador.

## Perguntas frequentes

### Em quais gateways dá para responder pelo Snapp?

Na Stripe e no PayPal. Nos dois, o Snapp monta o dossiê e envia a defesa. Nos outros gateways, a disputa aparece na lista e nos números, e a resposta é dada no painel do gateway.

### O Snapp decide se vale contestar?

Não. A força das provas é uma sugestão pelo que o Snapp encontrou na venda. Quem decide se contesta é você.

### A defesa é enviada em português?

Não. A defesa e o dossiê vão em inglês, que é o idioma que o banco e o PayPal leem. Para você, o painel mostra um resumo em português.

### Posso enviar as provas mais de uma vez?

Não. O envio pelo Snapp é único e, depois dele, não dá para mudar nem completar as provas. Confira o texto e o PDF antes de confirmar.

### E se a minha chave da Stripe não tiver permissão?

O Snapp avisa e você pode responder pelo Dashboard da Stripe com o PDF e o texto. Para enviar pelo Snapp, inclua `Disputes: Write` e `Files: Write` na chave restrita conectada em Adquirentes.

### A página de disputas tem custo extra?

Não. Ela faz parte de toda conta do Snapp. Veja a página de [preços](https://www.snappcheckout.com/precos).
