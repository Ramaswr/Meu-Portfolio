from datetime import datetime, timezone
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class TerminalRequest(BaseModel):
    command: str


class TerminalResponse(BaseModel):
    lines: List[str]
    status: str = "ok"


app = FastAPI(
    title="Meu Portfolio Terminal API",
    description="API leve para retornar respostas de terminal simulado e metadados de status",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COMMAND_LIBRARY: Dict[str, List[str]] = {
    "help": [
        "Comandos disponíveis:",
        "- help/ajuda", "- status", "- projects/projetos", "- contact/contato", "- scripts", "- cat <script>",
    ],
    "status": [
        "Status do terminal: operacional",
        "Logs habilitados: chama `contact` para receber o WhatsApp",
        f"Atualizado em {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}",
    ],
    "projects": [
        "Projetos em destaque:",
        "• Análise de Dados (Banco-de-teste-BIG_DATA): pipelines CSV/PDF, análises e dashboards",
        "• Portfólio (Meu-Portfolio): terminal interativo, documentação e automação do HLD",
    ],
    "contact": [
        "Entre em contato:",
        "• WhatsApp: +55 92 98516-2222",
        "• GitHub: @Ramaswr",
    ],
}

SCRIPT_LIBRARY: Dict[str, Dict[str, str]] = {
    "forensics-linux": {
        "title": "collect_forensics_linux.sh",
        "description": "Script de coleta forense Linux (saída somente leitura)",
        "content": "echo \"Script protegido. Execute esse coletor apenas em ambientes controlados.\"",
    }
}

ALIASES: Dict[str, str] = {
    "ajuda": "help",
    "projects": "projects",
    "projetos": "projects",
    "contact": "contact",
    "contato": "contact",
    "status": "status",
    "scripts": "scripts",
    "cat": "cat",
}


def resolve_command(cmd: str) -> str:
    normalized = cmd.strip().lower()
    parts = normalized.split()
    if not parts:
        return ""
    base = parts[0]
    if base in ALIASES:
        return ALIASES[base]
    return base


@app.get("/api/status")
def status() -> Dict[str, str]:
    return {
        "status": "ok",
        "service": "terminal",
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


@app.post("/api/terminal", response_model=TerminalResponse)
def run_terminal(req: TerminalRequest) -> TerminalResponse:
    command = req.command or ""
    normalized = resolve_command(command)

    if not normalized:
        raise HTTPException(status_code=400, detail="Comando vazio")

    if normalized == "scripts":
        lines = [
            "Scripts disponíveis:",
        ]
        for key, entry in SCRIPT_LIBRARY.items():
            lines.append(f"• {key}: {entry['title']} ({entry['description']})")
        lines.append("Use cat <script> para o conteúdo")
        return TerminalResponse(lines=lines)

    if normalized == "cat":
        parts = command.strip().split()
        if len(parts) < 2:
            raise HTTPException(status_code=400, detail="Informe o script desejado: cat <script>")
        target = parts[1]
        entry = SCRIPT_LIBRARY.get(target)
        if not entry:
            raise HTTPException(status_code=404, detail=f"Script '{target}' não encontrado")
        lines = [f"--- {entry['title']} ---"]
        lines.extend(entry["content"].split("\n"))
        lines.append(f"--- fim {entry['title']} ---")
        return TerminalResponse(lines=lines)

    if normalized in COMMAND_LIBRARY:
        return TerminalResponse(lines=COMMAND_LIBRARY[normalized])

    raise HTTPException(status_code=404, detail=f"Comando '{command}' não reconhecido")
