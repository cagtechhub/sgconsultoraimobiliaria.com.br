#!/usr/bin/env bash
# Build e sobe os containers (Docker Compose + Traefik).
# O GitHub Actions faz git pull antes de chamar este script.
set -euo pipefail

docker compose up -d --remove-orphans --build
docker compose ps
