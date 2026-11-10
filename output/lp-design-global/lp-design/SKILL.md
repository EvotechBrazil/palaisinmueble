---
name: lp-design
description: >
  Build or refine landing pages and marketing sites with a distinct visual
  direction, responsive layouts, Lenis, GSAP ScrollTrigger and Motion.
  Use for /lp-design, cinematic scrolling, parallax, launch pages, or
  critique, audit, polish, typography, color, motion and performance work
  on an existing landing page. Includes Impeccable's 24 design commands.
license: MIT AND Apache-2.0
metadata:
  short-description: Cinematic landing pages with Impeccable
  version: "2.0.0"
  argument-hint: "[command] [brand, route, section or target]"
  compatibility: "Agent Skills; any LLM that reads files; optional shell and browser."
---

# lp-design

Crie e refine a página real do produto. Preserve seus dados, sua marca e seus
fluxos. A entrega inclui a implementação e a verificação possível no ambiente.

Esta skill funciona pelo formato Agent Skills. O modelo não precisa ser de um
fornecedor específico. Leia os caminhos relativos a partir da pasta desta skill,
mesmo quando ela for aberta por um link global e o projeto estiver em outra pasta.

## Escolher o trabalho

- `/lp-design <briefing>`: construa a landing page solicitada. Com um pedido
  concreto, avance com o contexto disponível. Com apenas `/lp-design`, mostre os
  comandos e peça o briefing.
- `/lp-design <comando> <alvo>`: execute somente o comando pedido e carregue seu
  playbook na tabela abaixo. Um refinamento preserva a identidade existente.
- Um redesign autorizado pode substituir a linguagem visual, preservando fatos,
  conteúdo necessário, funções e restrições do produto.
- Se o pedido for ambíguo, inspecione o projeto antes de perguntar. Pergunte apenas
  pelo que altera uma decisão relevante e não pode ser inferido.

Leia [references/impeccable.md](references/impeccable.md) antes do primeiro uso
dos playbooks ou do motor incorporado. Essa adaptação define os caminhos,
os recursos opcionais e a execução em agentes sem ferramentas específicas.

## Comandos incorporados do Impeccable

Os 24 playbooks estão incluídos localmente. Carregue apenas o necessário.
Os links abaixo levam aos arquivos originais, mantidos sem alterações.

| Comando | Resultado | Playbook |
| --- | --- | --- |
| `shape` | Planejar a experiência antes do código. | [shape](vendor/impeccable/reference/shape.md) |
| `init` | Registrar o contexto confirmado em PRODUCT.md. | [init](vendor/impeccable/reference/init.md) |
| `document` | Registrar a linguagem visual existente em DESIGN.md. | [document](vendor/impeccable/reference/document.md) |
| `extract` | Extrair tokens e componentes reutilizáveis. | [extract](vendor/impeccable/reference/extract.md) |
| `critique` | Avaliar a experiência e priorizar melhorias. | [critique](vendor/impeccable/reference/critique.md) |
| `audit` | Verificar acessibilidade, responsividade e desempenho. | [audit](vendor/impeccable/reference/audit.md) |
| `polish` | Refinar o acabamento antes da entrega. | [polish](vendor/impeccable/reference/polish.md) |
| `bolder` | Aumentar a expressão de uma interface genérica. | [bolder](vendor/impeccable/reference/bolder.md) |
| `quieter` | Reduzir excesso de estímulos visuais. | [quieter](vendor/impeccable/reference/quieter.md) |
| `distill` | Remover complexidade que atrapalha o objetivo. | [distill](vendor/impeccable/reference/distill.md) |
| `harden` | Tratar erros, traduções, limites e estados extremos. | [harden](vendor/impeccable/reference/harden.md) |
| `onboard` | Criar primeiros passos e estados vazios úteis. | [onboard](vendor/impeccable/reference/onboard.md) |
| `animate` | Adicionar movimento com função clara. | [animate](vendor/impeccable/reference/animate.md) |
| `colorize` | Trabalhar a cor e seu papel na hierarquia. | [colorize](vendor/impeccable/reference/colorize.md) |
| `typeset` | Melhorar fontes, escala e hierarquia tipográfica. | [typeset](vendor/impeccable/reference/typeset.md) |
| `layout` | Corrigir composição, espaços e ritmo. | [layout](vendor/impeccable/reference/layout.md) |
| `delight` | Adicionar detalhes de personalidade. | [delight](vendor/impeccable/reference/delight.md) |
| `overdrive` | Criar efeitos visuais avançados quando o briefing pede. | [overdrive](vendor/impeccable/reference/overdrive.md) |
| `clarify` | Esclarecer textos, rótulos e mensagens. | [clarify](vendor/impeccable/reference/clarify.md) |
| `adapt` | Adaptar a página a telas e formas de interação. | [adapt](vendor/impeccable/reference/adapt.md) |
| `optimize` | Diagnosticar e corrigir gargalos medidos. | [optimize](vendor/impeccable/reference/optimize.md) |
| `live` | Comparar e aceitar variantes no navegador local. | [live](vendor/impeccable/reference/live.md) |
| `generate` | Gerar alternativas para um elemento indicado. | [generate](vendor/impeccable/reference/generate.md) |
| `craft` | Alias legado para construir uma página. | [craft](vendor/impeccable/reference/craft.md) |

`teach` é alias de `init`. `doctor` e `hooks` são utilitários adicionais do motor,
documentados na adaptação. Um `audit` ou `critique` solicitado como análise não
autoriza uma reformulação da página.

## Construir uma landing page

1. Leia as rotas, o conteúdo, a identidade e os dados existentes. Use PRODUCT.md
   e DESIGN.md quando existirem. Registre contexto confirmado quando isso ajudar
   o trabalho, sem transformar documentos ausentes em bloqueio.
2. Defina o que a pessoa deve entender e a ação principal que deve conseguir
   fazer. Use fatos fornecidos ou verificados. Não invente preços, benefícios,
   depoimentos, disponibilidade ou características de um empreendimento.
3. Escolha uma direção visual ligada ao produto. Preserve preferências explícitas
   e tokens existentes, incluindo sua sintaxe, como `hsl(var(--...))`.
   Leia [new-work](vendor/impeccable/reference/new-work.md) para decisões de
   composição e direção. Imagens reais do produto têm prioridade. Identifique
   uma imagem conceitual quando ela puder ser confundida com o produto real.
4. Prefira **Sections**: seções de apresentação, prova, oferta e ação, ajustadas
   ao conteúdo. Use **World** somente para uma experiência 3D contínua solicitada
   pelo usuário. Se a skill `scroll-world` estiver disponível, use-a nesse modo.
   Sem ela, construa Sections e informe a limitação.
5. Antes de editar a interface, leia
   [craft-floor](vendor/impeccable/reference/craft-floor.md). Use imagens,
   tipografia, contraste e composição com intenção. Alertas sobre padrões comuns
   não substituem o briefing ou uma escolha explícita da marca.
6. Implemente o conteúdo, os estados e a ação principal com dados reais. Preserve
   integrações. Separe movimento de componentes de conteúdo. Mantenha cada
   arquivo de visualização abaixo de 500 linhas quando a arquitetura permitir.

Kits pagos, como Aceternity All-Access e Magic UI Pro, servem como referência
visual. Implemente o efeito sem copiar arquivos pagos sem licença.

## Preservar a base cinematográfica

Leia [references/wiring.md](references/wiring.md) antes de montar ou alterar o
scroll shell. Essa referência é a fonte da integração Lenis + GSAP.

- Em React, a base é `lenis`, `gsap` e `motion`, quando o projeto comportar essa
  stack. Em outra stack, adapte o ciclo de vida e preserve uma única inicialização.
- Lenis controla a rolagem; GSAP ScrollTrigger controla a narrativa por rolagem;
  Motion controla interações pequenas. Evite duas timelines no mesmo elemento.
- No modo cinematográfico, planeje ao menos quatro recursos da gramática abaixo.
  Ajuste a quantidade quando o briefing pedir contenção, o dispositivo limitar
  desempenho ou a acessibilidade exigir menos movimento. Refinamentos pontuais
  e comandos como `quieter` não precisam adicionar efeitos.
- Preserve rolagem nativa, teclado, âncoras, foco, navegação e leitura sem efeitos.
- Com `prefers-reduced-motion: reduce`, não inicie Lenis, pin, scrub ou preloader.
  Revele todo o conteúdo. Marquees ficam parados. Não esconda conteúdo se o
  JavaScript falhar. Limpe timelines e listeners ao desmontar componentes.

| Recurso | Implementação |
| --- | --- |
| Rolagem suave | Uma instância de Lenis no layout. |
| Pin e scrub | ScrollTrigger, respeitando o ciclo de vida descrito em wiring.md. |
| Parallax em camadas | Camadas com velocidades distintas; evite `background-attachment`. |
| Entrada por palavra | GSAP ou Motion, mantendo o texto acessível. |
| Marquee | CSS ou GSAP; ofereça pausa quando aplicável. |
| Faixa horizontal | Preserve acesso a todo o conteúdo no celular e pelo teclado. |
| Controle magnético | Motion, sem deslocar a área clicável para fora do alcance. |
| Spotlight | Efeito restrito à área que precisa dele. |
| Preloader | Curto, sem bloquear conteúdo ou repetir a cada navegação. |

## Verificar a entrega

Abra a página quando houver navegador disponível. Confira a hierarquia no
primeiro viewport, percorra as seções e execute a ação principal. Verifique
celular, desktop, teclado, foco, formulários, erros, imagens e redução de movimento.
No modo `optimize`, meça o problema antes e depois de alterar o código.

Use o detector incorporado conforme a adaptação. O detector de código não prova
contraste ou layout renderizado. Corrija os problemas encontrados e verifique as
áreas afetadas. Informe o que foi testado e o que o ambiente não permitiu testar.
Uma inspeção de código sem navegador não comprova validação visual.

## Uso global e portabilidade

- Em agentes com descoberta de skills, use `/lp-design` ou `$lp-design`, conforme
  a sintaxe do agente. O instalador publica a mesma fonte global nos diretórios
  suportados; ele não instala nem configura modelos de linguagem.
- Em outra CLI, rode `lp-design show` ou `lp-design show polish` e forneça a saída
  ao agente. Também é possível mandar o agente ler este SKILL.md pelo caminho.
- Sem shell, siga os playbooks por leitura e use as ferramentas equivalentes
  disponíveis. Sem motor ou navegador, informe quais recursos não foram executados.
- Não presuma que uma CLI desconhecida descobre skills automaticamente. A leitura
  explícita do arquivo é a alternativa portátil.

Origem, licenças e integridade: [THIRD_PARTY.md](THIRD_PARTY.md).
