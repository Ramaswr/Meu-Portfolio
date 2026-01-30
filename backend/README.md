# Backend do terminal

Este módulo FastAPI expõe uma API mínima para "executar" comandos simulados do terminal e fornecer metadados de status. A ideia é manter a lógica sensível fora do frontend e tornar o terminal mais seguro.

## Endpoints principais

| Rota | Método | Descrição |
| --- | --- | --- |
| `/api/status` | `GET` | Retorna o status atual do serviço e um carimbo de data/hora UTC. |
| `/api/terminal` | `POST` | Recebe `{ "command": "<texto>" }` e retorna linhas simuladas do terminal. Comandos permitidos: `help`, `status`, `projects`, `contact`, `scripts`, `cat <script>`. |

## Execução local

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

## Docker & Cloud Run

1. Crie a imagem Docker:

   ```bash
   docker build -t meu-portfolio-terminal:latest backend/
   ```

2. Teste localmente:

   ```bash
   docker run --rm -p 8080:8080 meu-portfolio-terminal:latest
   ```

3. Faça deploy no Google Cloud Run (ou outro host) e exponha a URL pública (`https://<region>-<project>.run.app`) ou consuma a imagem Docker Hub `jerr01/portfolio:latest`.
4. Antes de subir para o Cloud Run, crie a imagem local e envie ao Docker Hub:

   ```bash
   cd backend
   podman login docker.io  # ou docker login docker.io
   podman build -t docker.io/jerr01/portfolio:latest .
   podman push docker.io/jerr01/portfolio:latest
   ```

   Depois disso você pode usar `jerr01/portfolio:latest` como imagem no deploy ou em qualquer host que consuma imagens públicas.

   Ao usar `podman login`, digite `jerr01` quando ele pedir `Username` e cole um token válido (Settings → Security → New Access Token) quando pedir a senha. Crie/recrie o token se o login falhar (mensagens como `requested access to the resource is denied` ou `insufficient_scope` geralmente indicam credenciais inválidas ou token expirado).

5. Use o endereço `https://hub.docker.com/repository/docker/jerr01/portfolio/general` para revisar versões e ver o histórico de pushes.

Depois do deploy, defina `window.TERMINAL_API_BASE` no navegador (por exemplo, via `<script>window.TERMINAL_API_BASE = 'https://meu-run-url.run.app';</script>`) para que `terminal.js` envie comandos ao backend.
