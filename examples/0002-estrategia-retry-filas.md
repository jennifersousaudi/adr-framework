# ADR 0002: Estratégia de retry para falhas de entrega em filas

- Status: Aceita
- Data: 2026-08-22
- Responsável: @jenni-sousa
- Contexto do time/squad: Mensageria

## Contexto

Falhas transitórias no envio de mensagens (timeout do provedor de
SMS, indisponibilidade momentânea de um gateway de e-mail) estavam
sendo tratadas com um retry imediato e fixo: três tentativas em
sequência, sem espera entre elas. Em picos de instabilidade de
provedor externo, isso gerava um efeito cascata: as tentativas
imediatas esgotavam rápido, e a mensagem caía pra fila de erro antes
do provedor se recuperar, mesmo quando a recuperação levava só
alguns segundos.

Precisávamos de uma estratégia de retry que desse tempo real pro
provedor se recuperar, sem segurar a fila principal e sem duplicar
envios.

## Decisão

Vamos adotar retry com backoff exponencial e jitter, com no máximo
5 tentativas, processado numa fila secundária dedicada a reprocessamento,
separada da fila principal de envio.

## Alternativas consideradas

- **Manter retry imediato, aumentando o número de tentativas** —
  simples de implementar, mas não resolve o problema de fundo: se o
  provedor está instável, tentativas imediatas em sequência
  continuam falhando na mesma janela de instabilidade.
- **Circuit breaker por provedor** — pausa completamente o envio pra
  um provedor específico quando a taxa de erro passa de um limite.
  Boa ideia complementar, mas sozinha não resolve o caso de mensagens
  individuais que falham por motivo pontual, não sistêmico. Fica como
  candidata pra um ADR futuro.
- **Backoff exponencial com jitter em fila secundária** — dá tempo
  crescente entre tentativas (1s, 2s, 4s, 8s, 16s, com variação
  aleatória pra evitar que todas as mensagens retentem no mesmo
  instante) e isola o reprocessamento da fila principal. Escolhida
  por resolver o problema sem impactar o throughput de mensagens
  novas.

## Consequências

Mensagens com falha transitória agora têm uma chance real de sucesso
antes de cair pra fila de erro definitiva, o que deve reduzir
significativamente os falsos negativos de entrega. Em contrapartida,
o tempo total até a confirmação final de uma mensagem problemática
aumenta (pode levar até ~30 segundos no pior caso, contra a falha
quase imediata de antes), então qualquer dashboard ou SLA que meça
"tempo até confirmação" precisa considerar essa janela. A fila
secundária também precisa de monitoramento próprio, com alerta se o
volume nela crescer de forma anormal, sinal de que um provedor está
com problema sistêmico e não transitório.

## Referências

- [AWS Architecture Blog — Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- Post-mortem interno do incidente de 2026-08-10 (indisponibilidade
  parcial do provedor de SMS)
