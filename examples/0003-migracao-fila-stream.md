# ADR 0003: Migração do modelo de fila para stream de eventos

- Status: Superada por ADR-0005
- Data: 2026-09-01
- Responsável: @jenni-sousa
- Contexto do time/squad: Mensageria

## Contexto

Com a separação de bancos definida no ADR-0001 e o retry ajustado no
ADR-0002, o próximo gargalo identificado foi o modelo de fila em si.
A fila tradicional (fila FIFO simples) não permitia que múltiplos
consumidores lessem o mesmo evento de envio pra propósitos diferentes
— por exemplo, um consumidor que envia a mensagem e outro que
atualiza métricas de uso por template, sem duplicar a lógica de
consumo.

Avaliamos migrar de fila pra um modelo de stream de eventos, que
permite múltiplos consumidores lendo o mesmo tópico de forma
independente.

## Decisão

Decisão original: migrar a fila principal de envio pra um stream de
eventos (Kafka), mantendo um tópico único de "mensagem pronta pra
envio" com múltiplos grupos de consumidores.

## Alternativas consideradas

- **Manter fila e duplicar a lógica de consumo** — cada novo caso de
  uso (métricas, auditoria, envio) precisaria de sua própria
  implementação de leitura da fila. Descartada por gerar duplicação
  crescente de código à medida que novos consumidores surgissem.
- **Migrar pra stream de eventos (Kafka)** — resolve o problema de
  múltiplos consumidores de forma nativa. Escolhida inicialmente,
  mas revisitada depois (ver seção de superação abaixo).

## Consequências

Esta decisão foi revisitada antes de chegar à conclusão da migração
completa. Durante a implementação do piloto, o time identificou que
a complexidade operacional de manter um cluster Kafka pra um único
tópico com baixa cardinalidade de consumidores não se pagava no
curto prazo. O ADR-0005 registra a decisão revisada: adotar um
serviço gerenciado de streaming (Amazon Kinesis) em vez de operar
Kafka próprio, mantendo o mesmo modelo de múltiplos consumidores mas
com custo operacional menor pro time.

Esta seção é mantida como está no momento em que o ADR-0003 foi
superado. Consulte o ADR-0005 pra decisão vigente.

## Referências

- Piloto interno de migração (branch `poc/kafka-messaging`, arquivado)
- Ver ADR-0005 pra decisão final adotada
