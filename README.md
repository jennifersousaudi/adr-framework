# ADR Framework

Modelo enxuto e pragmático para registro de decisões arquiteturais
(Architecture Decision Records), pensado pra times de alta maturidade
que não precisam de burocracia formal pra documentar por que
escolheram X em vez de Y.

## Por que isso existe

Toda equipe técnica já passou pela mesma cena: alguém pergunta por
que o time escolheu um banco, um protocolo ou um padrão de
arquitetura específico, e ninguém lembra o motivo real. A decisão foi
tomada num Slack que já rolou, numa reunião sem ata, ou na cabeça de
alguém que trocou de time.

Esse framework resolve isso com um template de uma página, um fluxo
de trabalho simples baseado em pull request, e um script que mantém
o índice de decisões sempre atualizado sem esforço manual.

## Estrutura do repositório

```
adr-framework/
├── template.md              → template puro pra copiar e colar
├── examples/                → ADRs de exemplo, totalmente preenchidos
├── docs/adr/README.md       → índice gerado automaticamente
├── scripts/generate-index.js → script que regenera o índice
└── CONTRIBUTING.md          → fluxo de uso pro time
```

## Como usar

1. Copie `template.md` pra dentro da pasta `docs/adr/` do seu
   projeto, renomeando pro próximo número sequencial (ex.:
   `0001-titulo-da-decisao.md`).
2. Preencha as seções seguindo os exemplos em `examples/`.
3. Abra um pull request. Discussão acontece nos comentários do PR.
4. Depois do merge, rode o script de índice:

```bash
node scripts/generate-index.js caminho/para/docs/adr
```

Isso atualiza `docs/adr/README.md` com a tabela de todos os ADRs,
extraindo título, status e data direto do conteúdo de cada arquivo.

## Exemplos

Veja três ADRs completos em [`examples/`](./examples), cobrindo desde
escolha de banco de dados até estratégia de retry e migração de
modelo de fila — incluindo um exemplo de decisão superada por outra
mais recente, pra mostrar como funciona esse fluxo na prática.

## Princípios

- **Registro no momento certo.** Escreva o ADR enquanto a decisão
  está sendo tomada, não depois de já implementada.
- **Imutabilidade com evolução.** ADRs aceitos não são editados
  depois. Se o contexto muda, cria-se um novo ADR que supera o
  anterior.
- **Tamanho de uma página.** Se passou de uma tela de leitura,
  virou documentação de arquitetura, não registro de decisão.
- **Dono e status claros.** Toda decisão tem responsável e um status
  que qualquer pessoa do time entende de cara.

## Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) pro fluxo completo de uso
em equipe.

## Licença

MIT — use, adapte e distribua livremente.
