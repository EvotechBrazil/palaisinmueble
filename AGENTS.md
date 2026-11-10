<!-- graphify-global:start · gerado por `graphify-global sync`; edite ~/.graphify-global/RULES.md -->
## Navegação de código: graphify primeiro

Se existir `graphify-out/graph.json` na raiz do repo, use o grafo de conhecimento ANTES de grep/find/abrir arquivos em massa: é mais rápido e gasta bem menos tokens.

- Achar/entender algo: `graphify query "<pergunta>"` (subgrafo enxuto; `--budget N` limita tokens). Relação entre dois pontos: `graphify path "A" "B"`. Um conceito: `graphify explain "X"`.
- Antes de alterar algo: `graphify affected "X"` mostra o que é impactado.
- Depois abra só os arquivos/linhas que o grafo apontou. grep/rg ficam para texto literal (strings, logs, env, config) ou quando o grafo não cobrir.
- Visão geral da arquitetura: `graphify-out/GRAPH_REPORT.md`, só se query/path/explain não bastarem.
- Ao concluir uma tarefa que alterou código (não a cada edição): `graphify-ensure --refresh` (atualiza o grafo em background, sem LLM; não espere terminar). Commits já atualizam sozinhos via git hook.
- Repo sem `graphify-out/`: rode `graphify-ensure` uma vez (cria o grafo em background) e siga normalmente.
- Arquivos modificados em `graphify-out/` são esperados; não são motivo para ignorar o grafo.
- Ao delegar exploração de código a subagentes, inclua esta regra no prompt deles.
<!-- graphify-global:end -->
