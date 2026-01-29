# Documentação dos Scripts — Portfólio Jerr

Este documento descreve brevemente os scripts usados no projeto e como configurá-los.

## Localização
- `terminal.js` — contém toda a lógica do terminal interativo, animações, detecção de idioma e controles de som.
- `index.html` — estrutura da página; o arquivo HTML referencia `terminal.js`.

## `terminal.js`
- Responsabilidades:
  - Inicializar e controlar o terminal (abrir/fechar, prompt interativo).
  - Implementar comandos simulados: `ls`, `cd`, `ifconfig`/`ipconfig`, `clear`/`cls`, `exit`, `curl`, `cmatrix`.
  - Animar o efeito Matrix em `canvas` (horizontal), com som curto sincronizado.
  - Detectar idioma por IP (fallback para `navigator.language`) para mostrar uma saudação localizada.
  - Persistir preferências (terminal oculto e configurações de som) usando `localStorage`.

- Configurações importantes (no topo do arquivo):
  - `soundVolume` e `soundIntensity` — controlam o volume e a probabilidade de som por coluna.
  - `ENABLE_WHATS` — por padrão `false`. Quando `true`, a função `enviarWhats` será anexada ao formulário de contato para enviar mensagens via WhatsApp.

## `enviarWhats` (formulário de contato)
- A função foi movida para `terminal.js` e está desativada por padrão (controle via `ENABLE_WHATS`).
- Comportamento:
  - Valida que `nome` ou `mensagem` não estejam vazios.
  - Abre `https://wa.me/<telefone>?text=<mensagem codificada>` em nova aba.
- Segurança & Privacidade: por ser uma ação que abre um link externo, a função é acionada apenas quando habilitada explicitamente.

## Como habilitar o envio de WhatsApp
1. Abra `terminal.js` e altere `const ENABLE_WHATS = false;` para `true`.
2. Opcional: ajuste `telefone` na função `enviarWhats` para o número desejado (formato internacional, sem `+`).

## README no GitHub
- Este arquivo `docs/README.md` também pode ser copiado para a raiz do repositório como `README.md` para aparecer diretamente na página do GitHub.

---
Se quiser, posso:
- Mover `docs/README.md` para `README.md` na raiz (visível na página do repo), ou
- Adicionar mais detalhes e exemplos de uso e configuração.

Diga se prefere que eu faça isso (mover para raiz / expandir a documentação).