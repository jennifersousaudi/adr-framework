# Como usar esse framework no seu time

## Fluxo de uma decisão, do início ao fim

1. **Proposta.** Qualquer pessoa da equipe pode abrir um ADR em
   status "Proposta" via pull request. Copie `template.md`, renomeie
   com o próximo número sequencial e preencha as seções. O corpo do
   PR já é a base pra discussão — não precisa de reunião marcada só
   pra apresentar a proposta.

2. **Discussão assíncrona.** Comentários no PR substituem reunião
   síncrona na maioria dos casos. Se a decisão for grande o
   suficiente pra precisar de uma conversa ao vivo, registre o
   resumo dessa conversa no próprio ADR antes do merge — quem não
   participou precisa conseguir entender o raciocínio só lendo o
   arquivo.

3. **Decisão.** A pessoa responsável (geralmente quem propôs, ou o
   tech lead do contexto) muda o status pra "Aceita" ou "Rejeitada"
   e faz o merge. Um ADR rejeitado continua no repositório — ele
   documenta uma alternativa já avaliada, o que evita que a mesma
   discussão se repita meses depois.

4. **Atualização do índice.** Depois do merge, rode:

   ```bash
   node scripts/generate-index.js caminho/para/docs/adr
   ```

   Isso já é suficiente pra manter `docs/adr/README.md` sincronizado.
   Times maiores podem automatizar esse passo com uma GitHub Action
   que roda o script a cada push na branch principal.

5. **Superação.** Quando uma decisão antiga deixa de fazer sentido,
   crie um novo ADR com status "Aceita" que referencia o anterior no
   campo "Referências", e mude o status do ADR antigo pra "Superada
   por ADR-00XX". O arquivo antigo nunca é deletado — ele é parte do
   histórico de raciocínio do time.

## O que vira ADR e o que não vira

Nem toda escolha técnica precisa de um registro formal. Reserve o
framework pra decisões caras de reverter: escolha de banco de dados,
protocolo de comunicação entre serviços, padrão de autenticação,
estratégia de particionamento de dados. Escolhas de baixo custo —
nome de variável, estrutura de pasta, escolha de biblioteca de
formatação de data — não precisam desse processo.

## Adaptações comuns

- **Times pequenos:** o campo "Contexto do time/squad" no template
  pode ser omitido. Ele só importa quando várias squads compartilham
  o mesmo repositório de ADRs.
- **Integração com ferramentas de gestão:** referencie o link do ADR
  direto em tickets do Jira ou issues do GitHub, criando
  rastreabilidade entre a decisão registrada e a entrega que ela
  viabilizou.

## Dúvidas

Abra uma issue nesse repositório ou adapte livremente qualquer parte
do template pra realidade do seu time. O objetivo aqui é reduzir
fricção, não criar uma nova burocracia.
