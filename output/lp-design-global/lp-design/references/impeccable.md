# Integração do Impeccable

## Origem e precedência

Esta skill incorpora o pacote oficial para Codex do Impeccable 4.8.2 em
`vendor/impeccable/`, sem alterar seus arquivos. O manifesto dessa pasta registra
o hash de cada arquivo. A licença Apache 2.0 e os avisos acompanham o pacote.

O SKILL.md da lp-design e esta adaptação definem como usar os playbooks neste
pacote. Instruções do usuário e do ambiente continuam tendo precedência. Referências
a ferramentas de uma CLI são exemplos operacionais; use a ferramenta equivalente
disponível. Não mude permissões nem o ambiente para imitar outra CLI.

## Caminhos e execução

Considere `B` a pasta que contém o SKILL.md da **lp-design**. Considere `I` a pasta
`B/vendor/impeccable`. Os placeholders B e I são explicativos; substitua-os por
caminhos reais, com aspas para espaços.

Nas referências originais, substitua `.agents/skills/impeccable/scripts/impeccable`
e `<skill-base-dir>/scripts/impeccable` por `I/scripts/impeccable`. Resolva
`reference/*.md`, `agents/` e `scripts/` a partir de I, e não de B ou do projeto.
Mantenha o diretório de trabalho no projeto do usuário.

O comando portátil evita essa substituição manual:

```sh
lp-design show polish
lp-design engine context --target src/app/page.tsx
lp-design engine detect --json src/
lp-design engine detect http://localhost:3000
```

Sem comando no PATH, use `python3 B/scripts/lp-design.py` com os mesmos argumentos.
Em Windows, o wrapper usa o launcher `.cmd` original. A instalação global
automatizada deste pacote se destina a macOS e Linux; em outros sistemas, copie
a pasta para o diretório de skills suportado ou leia SKILL.md explicitamente.

O motor é um executável do Impeccable. O launcher oficial procura uma instalação
existente ou baixa a versão indicada em `scripts/VERSION`, verificando SHA-256.
Os arquivos do motor não estão neste pacote. A primeira execução pode precisar
de rede e de gravação no cache de usuário; a skill e seus playbooks não precisam.
Respeite as permissões disponíveis. Não repita tentativas por um bloqueio conhecido.

Se o motor não puder executar, leia o contexto do projeto diretamente e siga o
playbook com as ferramentas disponíveis. Não simule resultados do detector,
contagens de regras, notas medidas ou estados do navegador.

## Carregar contexto sem bloquear o trabalho

Com motor disponível, execute `context` uma vez por sessão para o alvo e siga
as diretivas aplicáveis. Não reexecute apenas porque `init` criou PRODUCT.md.
Sem motor, leia PRODUCT.md, DESIGN.md, os arquivos do alvo e as instruções locais.
Não invente o conteúdo de documentos ausentes.

`init` registra produto, público, objetivo e restrições confirmados. `document`
registra tokens e padrões observados. Uma alteração pequena não exige produzir
ambos os documentos. Escolha a superfície Persuade para uma landing page; as
seções Operate e Read só se aplicam quando a superfície solicitada tiver esse uso.

## Revisão e detector

- `critique` avalia hierarquia, clareza, identidade, ação e experiência. Separe
  observações visuais, inferências e medidas. Qualquer nota precisa de evidência.
- `audit` verifica acessibilidade, desempenho, responsividade e consistência.
  Apresente severidade, arquivo ou elemento, evidência e correção proposta.
- `detect` executa o detector oficial; não é substituído por regex caseira.
  Preserve o status retornado: 0 sem achados, 2 com achados e 1 para erro de scan.
  O launcher pode retornar 127 quando o motor não está disponível.
- Um scan de fonte tem cobertura diferente de um scan renderizado. Informe a
  cobertura real. Valide contraste, overflow e interação com navegador quando
  disponível. Só faça afirmações de desempenho apoiadas por medidas.

## Variantes e modo live

`generate` e `live` usam os playbooks completos incluídos no pacote. O overlay
interativo depende do motor, de uma cópia local e de um servidor de desenvolvimento.

O wrapper define `IMPECCABLE_LIVE_COPY_AGENT=chat`, preservando `off` quando o
usuário desativou Apply. Assim, as alterações continuam no agente atual. Ao chamar
o launcher diretamente para live, use a mesma configuração. Não use o fallback
do upstream que inicia outra CLI com verificações de permissão desativadas.

Aceite ou descarte uma variante pela escolha do usuário. Após aceite, faça a
limpeza indicada por live.md: leve regras para o CSS responsável, remova wrappers,
marcadores e atributos temporários e confira `live-complete`. Ao encerrar, pare
o helper e remova a injeção temporária. Não injete o helper em um site de produção.

Sem suporte ao overlay, produza variantes locais para comparação e identifique
esse modo como alternativa manual. Não apresente essa comparação como live ativo.
Sem retorno do usuário, não escolha uma variante em seu nome.

## Subagentes, hooks e outras CLIs

Os contratos oficiais de subagentes estão em `I/agents/`; os procedimentos para
execução no agente principal estão em `I/reference/degraded/`. Delegue apenas se
as instruções da sessão autorizarem. Na ausência de delegação, execute os passos
aplicáveis no próprio agente. A integração não depende de spawn ou nomes de tools.

`hooks` usa [o playbook oficial](../vendor/impeccable/reference/hooks.md) e só é
aplicável às CLIs suportadas pelo upstream. O instalador global cria links para
a skill auxiliar `impeccable`, para permitir seus caminhos nativos, mas não muda
settings, trust ou hooks de nenhuma CLI. Se o usuário pedir hooks, faça apenas a
configuração solicitada e respeite a aprovação que a própria CLI exigir. Em
outras CLIs, rode `detect` na verificação da tarefa.

`doctor` usa [o playbook oficial](../vendor/impeccable/reference/doctor.md).
Não repare configurações ou documentos fora do escopo da tarefa.

## Recursos da máquina

Respeite a fila `heavy` quando ela existir e as regras locais a exigirem. Builds,
instalações, testes, scans renderizados e outros trabalhos pesados passam por
essa fila. Não coloque polls longos de live na fila de compilação: use a espera
da ferramenta e mantenha o usuário informado. Não rode builds concorrentes.
