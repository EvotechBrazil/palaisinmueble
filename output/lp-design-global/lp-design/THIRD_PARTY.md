# Origem e licenças

A base cinematográfica e `references/wiring.md` vêm da lp-design global existente,
que declara licença MIT. A integração desta versão preserva essa base e incorpora
material do Impeccable, de Paul Bakaus, sob Apache License 2.0.

- Repositório: https://github.com/pbakaus/impeccable
- Pacote incorporado: `.agents/skills/impeccable/`, versão 4.8.2.
- Os 63 arquivos desse pacote permanecem sem alterações.
- LICENSE, NOTICE.md e README.md do repositório acompanham o pacote em
  `vendor/impeccable/`. São 66 arquivos de origem no total.
- `vendor/impeccable/upstream-manifest.json` registra a árvore Git de origem,
  os caminhos, os tamanhos, os modos e os hashes Git SHA-1 dos arquivos.
- Modificações desta distribuição: novo roteamento em SKILL.md, adaptação em
  references/impeccable.md, CLI portátil e instalador global. A cópia do upstream
  não foi modificada. Esta distribuição não é uma publicação oficial do Impeccable.

Os playbooks de iOS e Android têm os avisos adicionais registrados no NOTICE.md
original. O executável do motor é obtido separadamente pelo launcher oficial,
que inclui o manifesto SHA-256 das versões suportadas.
