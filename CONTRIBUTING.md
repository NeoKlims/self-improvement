# Contributing

This repository contains an automated self-improvement agent. Changes should stay safe, incremental, and reversible.

## Development Setup

1. Install dependencies:
   - `npm ci`
2. Copy environment template:
   - `copy .env.example .env` (Windows)
   - `cp .env.example .env` (Linux/macOS)
3. Fill `OPENAI_API_KEY`, `OPENAI_MODEL`, and optional `OPENAI_BASE_URL`.

## Local Validation

- Run dry mode first:
  - `npm run self-improve:dry`
- Run checks:
  - `npm run lint`
  - `npm run build`

## Contribution Rules

- Keep pull requests focused and small.
- Do not disable safety limits in the agent without justification.
- Preserve behavior: refactor for readability/maintainability, do not change product semantics.
- Do not commit secrets. Use `.env.example` for configuration samples.

## Commit Style

- Human changes can use conventional commit style.
- Agent-generated commits must follow:
  - `chore(ai): improve <file_name>`
