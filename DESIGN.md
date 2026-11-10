# Palais Tower

Noite quente. Ouro e prata. A página desce a torre.

## Cor

Os valores são componentes HSL, usados como `hsl(var(--nome))`.

| Nome | Valor | Uso |
| --- | --- | --- |
| `--night` | 30 12% 5% | Fundo |
| `--raise` | 32 12% 9% | Superfície acima do fundo |
| `--gold` | 39 46% 57% | Ação, ambiente ativo, linha de progresso |
| `--gold-deep` | 36 42% 34% | Barra de rolagem |
| `--silver` | 220 14% 82% | Texto principal |
| `--stone` | 36 16% 74% | Texto secundário |
| `--ink` | 30 22% 8% | Texto sobre o ouro |
| `--line` | 36 10% 22% | Fio dos campos |
| `--fault` | 12 42% 72% | Erro do formulário |

## Tipo

Títulos: Bodoni Moda, até 6rem, tracking -0.03em.
Texto: Hanken Grotesk.

## Troca do desenho

As vistas ficam em `public/brand/`. Os caminhos ficam em `src/content/tower.ts`.
Quando o desenho final chegar, substitua o arquivo e, se quiser, apague a legenda de estudo no dado daquele pavimento (`study: false`).

O scroll do coroamento comanda `public/film/descida.mp4`. A sala, o lazer, as reuniões, a garagem e o térreo comandam um giro cada: `giro-sala.mp4`, `giro-lazer.mp4`, `giro-reuniao.mp4`, `giro-garagem.mp4` e `giro-terreo.mp4`. Para trocar um filme, substitua o arquivo e mantenha o nome.

A fachada parada, usada depois do filme e quando o movimento está reduzido, usa `fachada-shaft.jpg`.
O térreo usa `fachada-base.jpg`, o recorte da chegada.
O arquivo `fachada.jpg` guarda a referência original.

## Som

O som começa mudo. O botão Som liga um ambiente que muda com a altura. Não há arquivo de áudio.

## Pedido

O formulário envia `POST /api/apresentacao`. O servidor grava uma linha em `server/data/apresentacoes.jsonl` e devolve só o identificador.
