#!/usr/bin/env python3
"""Gera uma visão textual de alto nível da arquitetura do portfólio integrado ao projeto Big Data."""
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import List
import json


@dataclass
class Component:
    name: str
    purpose: str
    responsibilities: List[str]
    dependencies: List[str] = field(default_factory=list)


@dataclass
class Layer:
    name: str
    description: str
    components: List[Component]


@dataclass
class Project:
    name: str
    repo_url: str
    description: str
    contributions: List[str]


def build_architecture() -> List[Layer]:
    return [
        Layer(
            name="Ingestão",
            description="Captura de arquivos CSV, PDF e eventos do GitHub",
            components=[
                Component(
                    name="Watcher de repositório",
                    purpose="Sinaliza novos commits",
                    responsibilities=[
                        "Monitora branches e pastas definidas",
                        "Agenda jobs Python para baixar artefatos CSV/PDF",
                        "Gera eventos para filas internas"
                    ],
                    dependencies=["GitHub webhook", "Filas interno (Redis/RabbitMQ)"]
                ),
                Component(
                    name="Importador local",
                    purpose="Captura uploads manuais e exemplos",
                    responsibilities=[
                        "Valida conteúdo e metadados dos arquivos",
                        "Padroniza colunas usando pandas/duckdb",
                        "Armazena cópias brutas no data lake/minio"
                    ],
                    dependencies=["APIs de upload", "Sistema de arquivos local"]
                )
            ],
        ),
        Layer(
            name="Processamento",
            description="Transforma os dados em métricas/insights",
            components=[
                Component(
                    name="Jobs Python (FastAPI, pandas)",
                    purpose="Processa, limpa e reduz os datasets",
                    responsibilities=[
                        "Executa ETL com pandas ou duckdb",
                        "Cria versões materializadas e sumarizadas",
                        "Registra métricas e alertas em caso de falha"
                    ],
                    dependencies=["Data lake", "Logs"],
                ),
                Component(
                    name="Orquestrador",
                    purpose="Sequencia pipelines e testes",
                    responsibilities=[
                        "Define DAGs simples (Prefect/Airflow light)",
                        "Aciona scripts em sequência e aguarda sucesso",
                        "Emite sinais para monitoramento"
                    ],
                    dependencies=["Redis/RabbitMQ", "Observabilidade"]
                )
            ]
        ),
        Layer(
            name="Armazenamento",
            description="Fase final de leitura e cache dos resultados",
            components=[
                Component(
                    name="Data lake local",
                    purpose="Guarda cópias integrais dos datasets",
                    responsibilities=[
                        "Organiza objetos por projeto/timestamp",
                        "Serve como backup para auditoria",
                        "Fornece dados para regenerar insights"
                    ]
                ),
                Component(
                    name="Cache analítico",
                    purpose="Serve respostas rápidas ao portal",
                    responsibilities=[
                        "Mantém tabelas resumidas redis/duckdb em memória",
                        "Atualiza automaticamente ao final do ETL",
                        "Respond com baixa latência a queries REST"
                    ],
                    dependencies=["Jobs Python", "REST API"]
                )
            ]
        ),
        Layer(
            name="Portal SaaS",
            description="Interface visível e interoperável do portfólio",
            components=[
                Component(
                    name="FastAPI/Flask backend",
                    purpose="Expõe APIs que alimentam o front-end",
                    responsibilities=[
                        "Serve dados resumidos e arquivos via endpoints",
                        "Autentica usuários com tokens JWT",
                        "Integra-se ao terminal interativo existente"
                    ],
                    dependencies=["Cache analítico", "Operações de segurança"]
                ),
                Component(
                    name="Front-end do portfólio",
                    purpose="Apresenta projetos, métricas e terminal",
                    responsibilities=[
                        "Reutiliza o terminal já construído",
                        "Consome APIs Python para dashboards",
                        "Permite downloads/detalhes de CSV e PDF"
                    ],
                    dependencies=["FastAPI", "Bibliotecas de visualização (Chart.js/D3)"]
                )
            ]
        ),
        Layer(
            name="Operações transversais",
            description="Recursos de segurança, monitoramento e entrega",
            components=[
                Component(
                    name="CI/CD GitHub Actions",
                    purpose="Valida pipelines e atualiza o SaaS",
                    responsibilities=[
                        "Executa testes Python e linters",
                        "Constrói imagens ou arquivos estáticos",
                        "Desdobra o front/back nos ambientes certos"
                    ],
                    dependencies=["Repositório GitHub", "Ambiente de hospedagem"]
                ),
                Component(
                    name="Monitoramento e alertas",
                    purpose="Detecta gargalos e falhas",
                    responsibilities=[
                        "Registra tempos de execução",
                        "Monitora filas e uso de CPU",
                        "Notifica via logs/sistemas ativos"
                    ],
                    dependencies=["Jobs Python", "Operações SaaS"]
                )
            ]
        )
    ]


def render_architecture(layers: List[Layer]) -> None:
    print("Arquitetura HLD - Portfólio & Projeto Big Data")
    for layer in layers:
        print(f"\n{layer.name}")
        print(f"  {layer.description}")
        for component in layer.components:
            print(f"    • {component.name}: {component.purpose}")
            for resp in component.responsibilities:
                print(f"      - {resp}")
            if component.dependencies:
                deps = ", ".join(component.dependencies)
                print(f"      dependências: {deps}")


def gather_projects() -> List[Project]:
    return [
        Project(
            name="Meu-Portfolio",
            repo_url="https://github.com/Ramaswr/Meu-Portfolio",
            description="Portfólio estático com terminal interativo, CTA para o projeto Big Data e documentação do HLD.",
            contributions=[
                "Index.html com navegação, terminal, projeto em destaque e botões que abrem o repositório de Big Data",
                "Estilos e scripts minimalistas para manter a experiência leve e responsiva",
                "README bilíngue e docs/HLD.md que explicam a integração com o projeto Big Data"
            ]
        ),
        Project(
            name="Banco-de-teste-BIG_DATA",
            repo_url="https://github.com/Ramaswr/Banco-de-teste-BIG_DATA",
            description="Repositório com datasets CSV/PDF e scripts Python que alimentam o pipeline de dados do portfólio.",
            contributions=[
                "Coleção de arquivos CSV/PDF prontos para análise",
                "Scripts de ingestão/transformação (ETL) e exemplos de dashboards",
                "Fonte de dados oficialmente vinculada aos botões do card 'Análise de Dados'"
            ]
        )
    ]


def serialize_architecture(layers: List[Layer], projects: List[Project], output_path: Path) -> None:
    payload = {
        "projects": [asdict(project) for project in projects],
        "layers": [
            {
                "name": layer.name,
                "description": layer.description,
                "components": [
                    {
                        "name": component.name,
                        "purpose": component.purpose,
                        "responsibilities": component.responsibilities,
                        "dependencies": component.dependencies,
                    }
                    for component in layer.components
                ],
            }
            for layer in layers
        ],
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as fp:
        json.dump(payload, fp, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    architecture_layers = build_architecture()
    render_architecture(architecture_layers)
    projects = gather_projects()
    output_file = Path(__file__).resolve().parents[1] / "docs" / "architecture.json"
    serialize_architecture(architecture_layers, projects, output_file)
    print(f"Arquitetura serializada em {output_file}")
