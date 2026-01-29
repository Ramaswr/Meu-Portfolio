# Arquitetura de Alto Nível (HLD)

Este documento sintetiza a arquitetura que conecta o portfólio de Jesus Rama ao projeto Big Data com enfoque Python. O rascunho a seguir pode ser copiado para uma ferramenta gráfica (draw.io, Miro, Lucidchart) para facilitar a visualização dos blocos, fluxos e pontos críticos.

## Visão geral das camadas

1. **Ingestão** — Captura automática e manual de CSV/PDF no GitHub e na máquina local, com validação e normalização imediata.
2. **Processamento** — Pipelines Python (pandas/duckdb) acionados por um orquestrador leve que garante transformações confiáveis e métricas rastreáveis.
3. **Armazenamento** — Data lake local serve como backup, cache analítico em memória garante baixa latência para o portal SaaS.
4. **Portal SaaS** — Backend Python (FastAPI/Flask) expõe APIs seguras; o front-end atual evolui para dashboards dinâmicos e mantém o terminal interativo.
5. **Operações transversais** — GitHub Actions para CI/CD e monitoramento com alertas para descobrir gargalos como filas lentas ou ingestão saturada.

## Observações para o diagrama

- Conecte o terminal existente ao backend do portal para permitir análises ad-hoc dos dados.
- Destaque falhas comuns: timeout na ingestão GitHub, parsing de PDFs com formatos inconsistentes, autenticação ausente em endpoints privados.
- Marque dependências críticas, como filas internas (Redis/RabbitMQ) e serviços de segurança (JWT/OAuth2).

## Como usar o script Python

- Execute `python scripts/hld.py` para gerar um rascunho textual que pode ser atualizado à medida que o diagrama evolui.
- O script descreve camadas, componentes e responsabilidades; mantenha-o alinhado com o diagrama gráfico.

Se quiser, posso ajudar você a converter esse rascunho num diagrama SVG ou em um layout para a página. Quer que eu crie uma versão pronta para embed em Markdown ou HTML?