.PHONY: help install dev build preview lint lint-fix format typecheck test test-watch check clean graphify gitnexus

help:
	@echo "Available targets:"
	@echo "  install      - Install dependencies using bun"
	@echo "  dev          - Start development server"
	@echo "  build        - Build application for production"
	@echo "  preview      - Preview production build locally"
	@echo "  lint         - Run Biome linter check"
	@echo "  lint-fix     - Run Biome check and fix issues"
	@echo "  format       - Format codebase with Biome"
	@echo "  typecheck    - Run TypeScript type check"
	@echo "  test         - Run unit tests once (Vitest)"
	@echo "  test-watch   - Run unit tests in watch mode (Vitest)"
	@echo "  check        - Run full quality gate (lint, typecheck, test)"
	@echo "  clean        - Remove build artifacts and node_modules"
	@echo "  graphify     - Update graphify visualization"
	@echo "  gitnexus     - Run GitNexus analysis"

install:
	bun install

dev:
	bun run dev

build:
	bun run build

preview:
	bun run preview

lint:
	bun run lint

lint-fix:
	bun x biome check --write .

format:
	bun x biome format --write .

typecheck:
	bun x tsc --noEmit

test:
	bun run test --run

test-watch:
	bun x vitest

check: lint typecheck test

clean:
	rm -rf dist node_modules .vite

graphify:
	graphify update .

gitnexus:
	node .gitnexus/run.cjs analyze
