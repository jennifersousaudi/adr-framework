# ADR 0001: Escolha do banco de dados para o serviço de mensageria

- Status: Aceita
- Data: 2026-08-15
- Responsável: @jenni-sousa
- Contexto do time/squad: Mensageria

## Contexto

O serviço de Mensageria vinha usando um banco relacional único pra
armazenar histórico de mensagens, filas de entrega e metadados de
templates. Com o crescimento do volume (de ~2M pra ~40M mensagens por
mês em seis meses), o banco começou a apresentar lentidão em escritas
concorrentes durante picos de envio, e as queries de histórico
competiam por recurso com as escritas em tempo real.

Precisávamos decidir se resolvíamos isso com tuning e sharding do
banco atual, ou se separávamos as responsabilidades em bancos
diferentes, otimizados pra cada padrão de acesso.

## Decisão

Vamos manter o banco relacional (Postgres) só pra metadados de
templates e configuração, e mover o histórico de mensagens e o
controle de filas pra um banco orientado a documentos (MongoDB),
otimizado pra escrita em alto volume e consultas por chave.

## Alternativas consideradas

- **Sharding do Postgres atual** — resolvia o problema de escrita no
  curto prazo, mas exigia reestruturação de todas as queries de
  histórico e adicionava complexidade operacional de manter shards
  balanceados. Descartada pelo custo de manutenção a longo prazo.
- **Migração completa pra MongoDB** — simplificava a arquitetura pra
  um único banco, mas os metadados de template têm relacionamentos
  fortes (template → variáveis → regras de validação) que fazem mais
  sentido num modelo relacional. Descartada por perder integridade
  referencial sem ganho real de performance nessa parte do sistema.
- **Postgres pra metadados + MongoDB pra histórico e filas** — separa
  cada dado pelo padrão de acesso que ele realmente tem. Escolhida
  por resolver o gargalo de escrita sem sacrificar a integridade dos
  dados que precisam dela.

## Consequências

Ganhamos capacidade de escrita bem maior pro histórico de mensagens e
isolamento entre o tráfego de leitura de templates e o de escrita de
envios. Em troca, o time passa a manter dois bancos em produção, o
que aumenta a superfície de operação e exige que qualquer pessoa nova
no time aprenda os dois modelos de dados. Consultas que cruzam
template e histórico (por exemplo, relatórios de uso por template)
agora precisam de uma camada de agregação na aplicação, já que não há
mais join nativo entre os dois bancos.

## Referências

- Benchmark interno de carga: 40M mensagens simuladas, comparando
  latência de escrita Postgres vs. MongoDB (documento no Drive do
  time de Mensageria)
- [MongoDB — Data Modeling for High Write Throughput](https://www.mongodb.com/docs/manual/core/data-model-design/)
