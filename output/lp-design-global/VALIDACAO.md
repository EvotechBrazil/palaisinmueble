# Validação da integração

Data: 10/11/2026.

## Resultado

- O validador oficial de skill-creator retornou `Skill is valid!`.
- Os 66 arquivos de origem passaram pela conferência de tamanho e Git SHA-1.
- Os links locais da documentação de integração apontam para arquivos existentes.
- Os scripts Python passaram pela verificação de sintaxe.
- O launcher shell oficial passou por `sh -n`.
- Os oito testes de instalação passaram em pastas temporárias isoladas.
- A fonte global existente permaneceu igual à cópia `original-lp-design/`.

## Testes de comportamento

1. O modo de simulação não cria nem altera a pasta do usuário de teste.
2. Todos os links dos agentes apontam para a mesma fonte; a CLI funciona pelo
   symlink e consegue carregar cada um dos 24 playbooks.
3. Reinstalar o mesmo pacote não cria outro backup.
4. Diretórios, arquivos personalizados e links substituídos são preservados no backup.
5. Uma falha simulada no meio da instalação restaura os originais.
6. Um arquivo de origem corrompido impede a instalação antes de qualquer gravação.
7. A conferência da instalação detecta um link ausente.
8. O adaptador do motor preserva argumentos literais e status de saída, usa o
   agente atual para Apply e preserva a configuração `off`.

Comando para repetir os testes:

```sh
python3 -B /Volumes/Dados/Projetos/Palais/output/lp-design-global/test_installation.py
```

## Limites da verificação

Os testes do adaptador usaram um executável controlado; não executaram o motor
real, o detector renderizado ou o overlay live. O pacote inclui o launcher e o
manifesto SHA-256 oficiais, mas não inclui o binário do motor.

A instalação global real não foi aplicada por falta de permissão de gravação
nas pastas globais. O plano real foi conferido sem aplicar mudanças. A tentativa
de atualizar o graphify também foi impedida pela gravação do log global em
`~/.cache/graphify-global.log`.
