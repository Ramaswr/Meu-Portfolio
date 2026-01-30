# Meu-Portfolio

Este workspace reúne o portfólio estático do Jesus Rama ao projeto de Big Data hospedado em [Ramaswr/Banco-de-teste-BIG_DATA](https://github.com/Ramaswr/Banco-de-teste-BIG_DATA).

## Visão Geral (PT-BR)

- O `index.html` conecta o card “Projetos em destaque” ao repositório principal ([Banco-de-teste-BIG_DATA](https://github.com/Ramaswr/Banco-de-teste-BIG_DATA)), permitindo explorar os CSV e PDFs usados nas análises sem instalar nada localmente.
- O script `scripts/hld.py` descreve a arquitetura de alto nível (camadas de ingestão, processamento, armazenamento, portal SaaS e operações) e gera um rascunho que pode ser exportado para ferramentas como draw.io, Miro ou Lucidchart.
- O documento `docs/HLD.md` traz esse resumo em formato textual, adicionando observações sobre gargalos (ingestão GitHub, parsing de PDF, autenticação) e explica como rodar o script.

## Overview (EN)

- The `index.html` page keeps the featured project card linked to the main repository so visitors can inspect the CSV/PDF datasets powering the analytics without local setup.
- `scripts/hld.py` sketches the high-level architecture (ingestion, processing, storage, SaaS portal, and cross-cutting operations) and feeds diagrams for tools such as draw.io, Miro or Lucidchart.
- `docs/HLD.md` mirrors that textual description and highlights common failure points (GitHub ingestion, PDF parsing, auth gaps) plus how to run the script to regenerate the HLD.

## Documentação automatizada

- Rode `python scripts/hld.py` na raiz do repositório sempre que alterar os projetos; o script imprime as camadas/componentes e escreve o resumo em `docs/architecture.json`.  
- O arquivo `docs/architecture.json` consolida responsabilidades, dependências e metadados para ambos os repositórios, tornando a arquitetura legível por ferramentas (diagramas, blocos de site, integrações).  
- Use o JSON tanto para atualizar `docs/HLD.md` quanto para gerar visualizações (SVG, HTML, Mermaid, etc.) sem reescrever o conteúdo manualmente.

## Segurança e distribuição

1. Se precisar ocultar o código do terminal ou dos estilos, mantenha o repositório como privado e controle a lista de colaboradores autorizados.  
2. Documente em `README.md` ou em outro arquivo qual licença se aplica (`MIT`, `Apache 2.0`, etc.) e quais partes podem ser reutilizadas sem permissão.  
3. Para reduzir a exposição da lógica sensível, mova o terminal/daemon para um backend hospedado (API) e deixe apenas o UI mínimo no frontend público; isso evita que alguém copie o funcionamento completo só clonando o repositório.  
4. O projeto inteiro segue a Licença Pública Geral GNU versão 3; consulte [LICENSE](LICENSE) para o texto completo e os requisitos de redistribuição.

## Backend leve & Cloud Run

1. O diretório `backend/` contém um FastAPI responsável por responder comandos simples (`help`, `projects`, `contact`, `scripts`, `cat`) e expor o status via `/api/status`.  
2. Teste localmente com `pip install -r backend/requirements.txt` e `uvicorn backend.main:app --reload --port 8080`, ou use o Docker (`docker build -t meu-portfolio-terminal backend/`).  
3. Para publicar no Google Cloud Run, suba a imagem (`gcloud builds submit --tag gcr.io/<PROJECT>/terminal-api`) e rode `gcloud run deploy terminal-api --image gcr.io/<PROJECT>/terminal-api --platform managed --allow-unauthenticated --region <REGION>`.  
4. Após o deploy, ajuste `index.html` para carregar um script antes de `terminal.js`, definindo `window.TERMINAL_API_BASE = 'https://<REGION>-<PROJECT>.run.app';` ou usando `data-terminal-api-base` no `<html>` para apontar o terminal para a API hospedada.  
5. Assim que o backend estiver funcionando, os comandos que não forem manipulados localmente têm resposta do Cloud Run e o código sensível permanece fora do repositório público.

## Próximos passos

1. Decidir se o README precisa ser expandido ou se haverá uma versão hospedada (GitHub Pages).  
2. Quando quiser, posso gerar um SVG/HTML do HLD e adicionar um bloco “Arquitetura” no site.  
3. Para o conteúdo bilíngue em tempo real, podemos inserir um script que usa `navigator.language` para alternar textos ou links.

## Next Steps

1. Decide whether this repo needs a more detailed README or a hosted landing page (e.g., GitHub Pages).  
2. When ready, I can produce an SVG/HTML version of the HLD and add an “Architecture” section to the site.  
3. For live bilingual content, we can add a small script that relies on `navigator.language` to swap texts or links dynamically.
