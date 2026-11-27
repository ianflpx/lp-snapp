# AJUSTES FINOS — rodada de 27/11/2026

O dono viu a página montada e pediu esta rodada. O que está aqui **vence o `CONTRACT.md`** onde os dois divergirem. As demais regras do contrato continuam valendo (arquivos de cada um, um breakpoint em 800px, conferência com `shot.sh`, sem commit).

## 1. O que o dono disse (resumo fiel)

- **Sem laranja no site.** Foco só no amarelo do Snapp, o amarelo vivo, "podendo usar um mais claro e um pouco mais escuro mas não saindo muito da paleta principal". **Nada de amarelo queimado, âmbar ou laranja.** Também não gostou do amarelo creme: "se for para usar algo assim prefiro branco ou cinza claro".
- **Ilustrações dos banners** (as peças que nós mesmos criamos): achou boas, mas quer **mais detalhes** e, onde há animação, **mais fluida e dinâmica**. "Invista um pouco nisso em todos os lugares."
- Quer **mais transição e animação** para cada seção entrar mais bonita.
- Bento: reorganizar por importância e impacto; upsell e downsell não pode ser a primeira; **deixar as ilustrações mais bonitas**.

## 2. Paleta nova (já está na base)

| Token / classe | Hex | Uso |
|---|---|---|
| `--yellow` · `.banner--yellow` · `.block--yellow` | `#fed217` | o amarelo da marca |
| `--yellow-light` · `.banner--yellow-light` · `.block--yellow-light` | `#ffe770` | o mesmo matiz, mais claro |
| `--yellow-deep` · `.banner--yellow-deep` | `#ebc000` | o mesmo matiz, um pouco mais fundo |
| `--gray` · `.banner--gray` · `.block--gray` | `#ececef` | neutro claro |
| `.banner--graphite` | `#1c1c1f` | grafite com borda |

- **Não existem mais** `.banner--orange`, `.banner--amber`, `.banner--cream`, `.block--cream` nem `--cream`. Tire do seu CSS e do seu HTML qualquer `#b34509`, `#7a5900`, `#f3ebcd`, `#c9a400`, `#fffbe6`, `#fff3b0`, tons de pêssego, bege, marrom ou ocre, e qualquer sombra colorida.
- Dentro dos mockups valem: branco, cinzas neutros, preto/grafite, os três amarelos e o verde `--ok` só para estado "pago/aprovado". O acento laranja da janela do Claude (`--cw-acc`) é a cor da marca de terceiro e fica só no botão de enviar da janela.
- Todas as variantes claras (os três amarelos e o cinza) levam texto preto. Cada variante define `--b-bg`, `--b-fg`, `--b-label`, `--b-muted` (texto apagado legível sobre o card), `--b-tint` (tom para trilhos, conectores e silhuetas) e `--focus`. **Use essas variáveis** em tudo que encosta no card (conectores, etiquetas, chips fora dos mockups), em vez de cor fixa: o mesmo banner tem que funcionar se a variante mudar.
- Sem sombra (`box-shadow` só como anel de 1px).

## 3. Bento: nova ordem, cores e atraso

| Pos. | Banner | Parte | Classes | `--i` |
|---|---|---|---|---|
| 1 | Multi-moeda | `13-banner-mapa` | `banner banner--full banner--tall banner--yellow` | 0 |
| 2 | Order bump | `11-banner-bump` | `banner banner--graphite` | 1 |
| 3 | Assinaturas | `14-banner-assinaturas` | `banner banner--graphite` | 2 |
| 4 | IA por chat | `16-banner-ia` | `banner banner--full banner--gray`, `id="ia"` | 3 |
| 5 | Entrega por e-mail | `15-banner-email` | `banner banner--graphite` | 4 |
| 6 | Teste A/B | `12-banner-ab` | `banner banner--graphite` | 5 |
| 7 | Upsell e downsell | `10-banner-upsell` | `banner banner--full banner--yellow-deep` | 6 |

Os formatos não mudam (os três inteiros continuam inteiros). Atualize as classes e o `style="--i:N"` do `<article>` da sua parte.

## 4. Movimento (base nova)

- `data-reveal` agora sobe, entra em foco e escalona (0,7 a 0,9 s, `--ease-out`, 70 ms por `--i`). `data-reveal="up"` é para bloco grande (sobe mais e assenta de 98,5% para 100%). `data-reveal="fade"` é só opacidade.
- **A mídia de todo banner já entra sozinha**, subindo de dentro do recorte logo depois do card (a base anima `.banner__media`). Não anime o `.banner__media` você mesmo.
- **A coreografia do banner começa em `.is-play`**, não em `.is-in`: o `app.js` põe `.is-play` no `.banner` quando a mídia está 40% visível, e a base segura as suas animações CSS até lá. No CSS continue escrevendo `.js-motion .banner.is-in …` (funciona, porque a base pausa até o `.is-play`) ou troque por `.js-motion .banner.is-play …`. Em JS, espere o `.is-play`.
- Continua valendo: estado base = quadro final; nada em loop fora do hero; com "reduzir movimento" o quadro final aparece pronto.

### O que "mais fluido e dinâmico" quer dizer aqui
- Curvas com caráter: `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`) para entradas, e uma mola curta para toques e marcações (por exemplo `cubic-bezier(0.34, 1.56, 0.64, 1)`), em vez de `ease` genérico.
- Encadeie: cada passo começa quando o anterior está acabando (sobreposição de 100 a 200 ms), com um ritmo que dá para acompanhar. Nada de tudo piscando junto nem de pausas mortas.
- Movimento com causa e efeito: o cursor chega, a coisa responde (aperta 2 a 4%, muda de cor, solta), o número rola ou troca com um deslize, o conector se desenha e só então o próximo elemento acorda.
- Só `transform` e `opacity` (e `stroke-dashoffset` em SVG). Nada de animar largura, altura, `top` ou `box-shadow`.
- Duração total de cada coreografia: 3 a 5 s, uma vez, e para.

### O que "mais detalhes" quer dizer aqui
Detalhe de produto de verdade, que faz a peça parecer uma tela real e não um esquema: barra de endereço com cadeado, estados (foco de campo, botão pressionado, selo de status), microtextos coerentes, ícones de forma de pagamento, miniatura de produto, linhas de recibo, divisórias, avatar do remetente, anexo, carimbo de hora, contadores. Sempre com os dados fictícios e os fatos do contrato, e só o que o produto faz hoje. Detalhe não é enfeite: nada de brilho, gradiente decorativo, partícula ou sombra.

## 5. Legibilidade (pendência da rodada anterior)

Em 1024 e 800 o texto dentro de vários mockups cai para 7 a 9px. Suba a escala do mockup nessas larguras (ele pode sangrar mais), ou esconda os detalhes secundários ali, para o texto que conta a história não ficar abaixo de ~11px renderizados em nenhuma largura entre 800 e 1440, nem em 390 e 360.

## 6. Conferência

Igual à seção 6 do contrato. O preview agora lê a base em `.design/v3/base/` (não mudou o jeito de chamar): `http://127.0.0.1:8123/.design/v3/preview.html?p=NN-nome`. Capture em 1440, 1024, 768, 390 e 360, mais `--reduced`, e alguns quadros no meio da coreografia (`--wait` diferentes) para conferir o encadeamento. Use `--h` maior que o elemento quando capturar com `--sel`. Zero erro de console, zero scroll horizontal.
