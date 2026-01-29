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

## Próximos passos
1. Decidir se o README precisa ser expandido ou se haverá uma versão hospedada (GitHub Pages).  
2. Quando quiser, posso gerar um SVG/HTML do HLD e adicionar um bloco “Arquitetura” no site.  
3. Para o conteúdo bilíngue em tempo real, podemos inserir um script que usa `navigator.language` para alternar textos ou links.

## Next Steps
1. Decide whether this repo needs a more detailed README or a hosted landing page (e.g., GitHub Pages).  
2. When ready, I can produce an SVG/HTML version of the HLD and add an “Architecture” section to the site.  
3. For live bilingual content, we can add a small script that relies on `navigator.language` to swap texts or links dynamically.
