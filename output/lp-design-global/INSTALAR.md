# Instalar a lp-design global

A versão preparada está em `lp-design/`. A fonte global atual não foi alterada:
esta sessão não tem permissão para gravar nas pastas globais do usuário.

Execute em um terminal com acesso normal às suas pastas:

```sh
python3 /Volumes/Dados/Projetos/Palais/output/lp-design-global/lp-design/scripts/install-global.py --apply
```

O instalador confere a integridade do pacote antes de escrever. Ele mantém uma
fonte em `~/.grok/skills/lp-design`, faz backup do conteúdo substituído em
`~/.local/state/lp-design/backups/` e compartilha a fonte por links nos diretórios
de Agent Skills, Codex, Claude Code, Grok, Gemini CLI, Antigravity, Cursor,
OpenCode, GitHub Copilot CLI e Hermes Agent. Os links auxiliares `impeccable`
apontam para o pacote original incorporado. Settings, trust e hooks não são alterados.

Se uma instalação falhar durante a gravação, o instalador tenta restaurar os
originais. O backup inclui um journal com os caminhos de origem e de recuperação.
Executar novamente com o mesmo pacote preserva uma instalação já atualizada.

Depois, recarregue os agentes e confira:

```sh
python3 /Users/rodrigobarreto/.grok/skills/lp-design/scripts/install-global.py --check
lp-design list
lp-design show polish
```

Em agentes com descoberta de skills, use `/lp-design` ou `$lp-design`, conforme
a sintaxe suportada. Em outras CLIs, forneça a saída de `lp-design show` ao agente
ou peça que ele leia `~/.grok/skills/lp-design/SKILL.md`. A descoberta automática
depende da CLI; o conteúdo da skill não depende do fornecedor do modelo.

Os 24 playbooks podem ser lidos sem rede. Detector e overlay live precisam do
motor oficial, que o launcher obtém e verifica na primeira execução, se não
estiver disponível. Não se afirmou que esse motor já está instalado neste Mac.

Para conferir o plano sem alterar as pastas globais, omita `--apply`.
