# Self-Improving GitHub Repository

Production-ready repository with an autonomous LLM agent that safely improves codebase quality every 2 hours through GitHub Actions.

## What This System Does

- Scans repository files and selects up to 3 candidates per run
- Sends selected file content to OpenAI-compatible API
- Applies safe, incremental full-file improvements
- Enforces strict constraints before writing any change
- Commits each accepted file as `chore(ai): improve <file_name>`
- Runs in CI every 2 hours and can be started manually

## Safety Guardrails

Hard limits (enforced in runtime):

- `MAX_FILES_PER_RUN = 3`
- `MAX_FILE_SIZE_BYTES = 50000`
- `MAX_TOTAL_CHANGED_LINES = 120`
- `DRY_RUN` support
- Meaningful-diff filter (skip trivial edits)
- Test-awareness prompt mode for files with companion tests

Additional CI protection:

- Build verification runs after the agent and before push
- If build fails, workflow fails and no push happens

## Project Structure

```text
.
├─ .github/
│  └─ workflows/
│     └─ self-improve.yml
├─ agent/
│  ├─ config.js
│  ├─ diffSafety.js
│  ├─ fileSelector.js
│  ├─ gitAutomation.js
│  ├─ index.js
│  ├─ llmClient.js
│  ├─ logger.js
│  └─ prompt.js
├─ src/                       # Existing frontend application
├─ .env.example
├─ CONTRIBUTING.md
├─ package.json
└─ README.md
```

## Environment Variables

Required:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

Optional:

- `OPENAI_BASE_URL` (default `https://api.openai.com/v1`)
- `DRY_RUN` (default `false`)
- `MAX_FILES_PER_RUN` (default `3`, cannot exceed 3)
- `MAX_FILE_SIZE_BYTES` (default `50000`, cannot exceed 50000)
- `MAX_TOTAL_CHANGED_LINES` (default `120`, cannot exceed 120)
- `AUTO_PUSH` (default `true` in GitHub Actions, otherwise `false`)

Copy `.env.example` to `.env` and fill the required values.

## Local Usage

Install dependencies:

```bash
npm ci
```

Run dry mode (recommended first):

```bash
npm run self-improve:dry
```

Run normal mode:

```bash
npm run self-improve
```

## GitHub Actions Automation

Workflow file: `.github/workflows/self-improve.yml`

Triggers:

- Scheduled every 2 hours (`17 */2 * * *`, UTC)
- Manual (`workflow_dispatch`)

Pipeline:

1. Checkout repo with full history
2. Setup Node 20 and install deps
3. Run agent in non-dry mode
4. Run project build verification
5. Push created commits

## Observability

The agent logs:

- Selected files
- Accepted/skipped files and reasons
- Changed line counts
- Improvement score (0-100)
- OpenAI token usage
- Commit and push activity
- Fatal and per-file errors

## Prompt Contract

Each file is sent with repository context and strict rules:

- preserve behavior and public API
- do not break functionality
- return full file replacement only
- output must be wrapped in `<IMPROVED_FILE_START>` and `<IMPROVED_FILE_END>`

## Notes on Clean Architecture

The automation is split by responsibility:

- `config.js`: env parsing and constraints
- `fileSelector.js`: candidate discovery and scoring
- `prompt.js`: prompt generation and response parsing
- `llmClient.js`: OpenAI-compatible client
- `diffSafety.js`: diff validation and scoring
- `gitAutomation.js`: commit/push operations
- `index.js`: orchestration and error boundaries
