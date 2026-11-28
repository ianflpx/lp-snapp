# Personalize o checkout e veja a mudança na hora

> Escolha entre seis modelos de checkout, ajuste tema, cores, banners e o texto do botão e defina os dados que o comprador preenche, com prévia ao vivo.

Página: https://www.snappcheckout.com/personalizar-checkout

No editor da oferta você escolhe o modelo do checkout, as cores, os banners e os dados que o comprador preenche. A prévia ao lado mostra a página como o comprador vai ver, no celular ou no computador.

## Seis modelos de checkout

O modelo muda a estrutura da página. O produto, o preço e as formas de pagamento continuam os mesmos, então você troca de modelo sem refazer a oferta.

- Resumo do pedido no topo e pagamento em lista. É o modelo padrão.
- Resumo recolhível, campos agrupados e pagamento em blocos.
- Cabeçalho com o produto e o campo de cupom à vista.
- Sem resumo no topo, direto para os dados e o pagamento.
- Resumo em barra no celular, pagamento expresso no topo e order bumps em cartões.
- Preço grande no topo, pagamento em linhas e order bumps em cartões menores.

Para saber qual modelo vende mais com o seu público, compare dois deles em um teste A/B.

## Tema, cores e banners

O checkout tem tema claro ou escuro. A cor principal vale para o pagamento, o order bump e os destaques. A cor do preço vale para o preço do produto e o total do pedido.

Você coloca até 3 banners no topo e até 3 no fim do checkout, abaixo do botão de compra. Eles servem para imagens da oferta ou da garantia, e você arrasta para mudar a ordem.

## Botão de compra e formas de pagamento

O texto do botão de compra é seu, com até 40 caracteres. Se o campo ficar vazio, o botão usa o texto padrão no idioma do checkout, como "Comprar agora".

No celular, o botão de pagamento pode acompanhar a rolagem da página. No computador e no tablet, ele fica no fim do formulário.

Você arrasta as formas de pagamento para escolher a ordem em que aparecem, e a primeira já abre selecionada. Nos dois modelos com order bumps em cartões, PayPal, Apple Pay e Google Pay ficam no topo como pagamento expresso, fora dessa ordem.

## Dados que o comprador preenche

Nome e e-mail são sempre pedidos. O resto você liga conforme o que precisa:

- **Telefone com o código do país.** O país já abre no do visitante. O número vai para a API de Conversões da Meta, o que ajuda a ligar a venda ao anúncio, e também segue no webhook.
- **CPF ou CNPJ.** O documento fiscal do comprador fica registrado na venda e segue no webhook.
- **Endereço completo.** Rua, número, cidade e estado, para quem vende produto físico.
- **Só país e código postal.** É o que a Stripe usa para conferir o cartão e ajuda a aprovar vendas para fora sem deixar o checkout mais longo.
- **Data de nascimento.** Vai para a API de Conversões da Meta e melhora a correspondência dos eventos com os perfis.

Cada campo a mais é mais uma etapa para o comprador. Ligue só os que você usa.

## Idioma, moeda e domínio

O checkout está disponível em 17 idiomas. Com a detecção automática ligada, ele identifica o país do visitante pelo IP e abre no idioma dele. O idioma que você escolheu na oferta fica como reserva.

A detecção de moeda mostra o preço na moeda local quando ela é compatível e há câmbio disponível. Mais em [vender no exterior](https://www.snappcheckout.com/vender-no-exterior).

O checkout também pode abrir em um domínio seu, como `checkout.suamarca.com`. Você cria um registro no DNS do seu provedor e o checkout passa a abrir nesse endereço depois da verificação. A propagação do DNS pode levar algumas horas.

## Cupom, cronômetro e botão de WhatsApp

- **Cupom de desconto** em porcentagem, com data de validade e limite de usos opcionais. Com os cupons ligados, o comprador vê o campo para adicionar o cupom.
- **Cronômetro** em uma barra fixa no topo, com o seu texto, o tempo em minutos e as cores. A contagem começa na primeira visita e não reinicia se o comprador recarregar a página. Quando chega a zero, a barra para e o checkout continua aberto, então use o cronômetro quando a condição tem prazo de verdade.
- **Botão de WhatsApp** fixo no canto da tela. Ao tocar, o comprador abre uma conversa no seu WhatsApp com a mensagem que você escreveu. Você escolhe o lado da tela e a cor.

## Prévia ao vivo e compra teste

A prévia do editor muda enquanto você edita e alterna entre celular e computador. Ao clicar em uma parte do checkout na prévia, você vai direto para a configuração dela.

Antes de divulgar, gere um link de compra teste. Ele percorre o checkout completo, com order bumps, automações e upsell, sem cobrança real. O link usa a última versão salva da oferta e vale por 5 minutos.

## Perguntas frequentes

### Preciso saber programar para personalizar o checkout?

Não. Modelo, cores, banners, campos e botões são configurados no editor da oferta.

### Trocar de modelo muda o que já configurei?

Não. O modelo muda só a estrutura da página. Produto, preço e formas de pagamento continuam como estavam.

### Quantos banners posso colocar?

Até 3 no topo e até 3 no fim do checkout, abaixo do botão de compra.

### Dá para pedir só nome e e-mail?

Sim. Esse é o mínimo. Telefone, documento, endereço e data de nascimento são opcionais, e você liga ou desliga cada um na oferta.

### Posso usar o meu domínio no checkout?

Sim. Você aponta um subdomínio seu para o Snapp com um registro no DNS e o checkout abre nele depois da verificação.

### Personalizar o checkout tem custo extra?

Não. Tudo isso faz parte de toda conta do Snapp. Veja a página de [preços](https://www.snappcheckout.com/precos).
