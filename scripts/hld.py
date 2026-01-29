#!/usr/bin/env python3
"""Gera uma visão textual de alto nível da arquitetura do portfólio integrado ao projeto Big Data."""
from dataclasses import dataclass, field
from typing import List


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


def build_architecture() -> List[Layer]:
    return [
        Layer(
            name="Ingestão",
            description="Captura de arquivos CSV, PDF e eventos do GitHub",
            components=[
                Component(
                    name="Watcher de repositório",
                    purpose="Sinaliza novos commits" ,
                    responsibilities=[
                        "Monitora branches e pastas definidas",
                        "Agenda jobs Python para baixar artefatos CSV/PDF",
                        "Gera eventos para filas internas"
                    ],
                    dependencies=["GitHub webhook", "Filas interno (Redis/RabbitMQ)"]
                ),
                Component(
                    name="Importador local",
                    purpose="Captura uploads manuais e exemplos" ,
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


if __name__ == "__main__":
    architecture_layers = build_architecture()
    render_architecture(architecture_layers)
