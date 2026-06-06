# Copilot instructions for this repository

Purpose: quick reference for Copilot sessions to understand how to build, test, lint, and the high-level layout and conventions of this monorepo.

---

## 1) Build / test / lint (commands)

Top-level (runs across workspaces via Turborepo):
- Install: npm install (Node >= 20, npm v10.9.2 specified in package.json)
- Start dev for all: npm run dev
- Build all: npm run build
- Run unit tests for all: npm run test:unit
- Run e2e tests for all: npm run test:e2e
- Lint all: npm run lint
- Format: npm run format
- Type-check all: npm run check-types

Per-app/package (recommended for single-package work):
- cd apps/main && npm run dev  # starts Next.js on port 3031
- cd apps/dejban && npm run dev  # starts Next.js on port 3032
- cd packages/ui && npm run lint
- Run a single unit test (vitest):
  - cd apps/main && npm run test:unit -- -t "<test name or pattern>"
  - or: npx vitest tests/unitTest/path/to/file.test.jsx
- Run a single Playwright e2e test:
  - cd apps/main && npm run test:e2e -- tests/e2e/home.spec.ts
  - or: npx playwright test tests/e2e/home.spec.ts -g "<test name>"
- Lint a single file: cd <package-or-app> && npm run lint -- <path/to/file>

Notes: The root scripts delegate to turbo (turbo run ...). Running package-local scripts from the package directory is the simplest and most reliable approach.

Dev reverse-proxy (recommended for single sign-on testing):
- Start local dev servers for each app (e.g., apps/main, apps/dejban, apps/access-control) using their normal `npm run dev` scripts.
- Run the dev reverse-proxy which mounts all apps under one origin and rewrites cookies so HttpOnly refresh cookies issued by the backend are usable across apps:
  - npm run dev:proxy
  - The proxy listens on http://localhost:3000 and uses these defaults:
    - / -> main (https://localhost:3031)
    - /dejban/* -> https://localhost:3032
    - /access-control/* -> http://localhost:5173
  - To let frontend reach the backend via the proxy set: NEXT_PUBLIC_SERVER_URL=http://localhost:3000
  - The proxy ignores upstream TLS validation (dev only).

---

## 2) High-level architecture

- Monorepo managed by Turborepo + npm workspaces (workspaces: apps/*, packages/*). Root uses turbo to orchestrate tasks.
- apps/ : multiple Next.js applications (e.g., `main`, `dejban`, `access-control`). Each app contains its own package.json, dev/build/test scripts and may use different Next.js versions and ports (see app package.json files).
- packages/ : shared libraries consumed by apps. Notable packages:
  - @repo/ui — component library with an explicit `exports` map (many named entrypoints)
  - @repo/shared-state — shared state utilities
  - @repo/api — shared api helpers
  - @repo/eslint-config / @repo/typescript-config — central ESLint and TS configs used across workspaces
- Testing stack: Vitest for unit tests (configured in apps/*), Playwright for e2e tests (apps/*), plus some jsdom/testing-library dev deps at root.
- Build flow: `npm run build` at root runs `turbo run build`, which builds each app/package according to its own scripts.

---

## 3) Key conventions and repository-specific patterns

- Workspace refs: packages depend on each other using workspace references (e.g., "@repo/ui": "*"). Resolve and test by running package-local scripts or using turbo at root.
- Exports map: packages/ui exposes many specific entrypoints via `exports` in package.json. Import only via documented entrypoints (e.g., `import theme from '@repo/ui/theme'`) rather than deep-importing internals.
- Per-package lint/format scripts: prefer running lint/format from the package folder for targeted work; root `npm run lint` runs turborepo to execute per-package scripts.
- Ports & dev flags: apps use explicit ports in their dev scripts (main: 3031, dejban: 3032) and experimental turbopack/https flags in `next dev`.
- TypeScript & ESLint config packages: central configs live in packages/typescript-config and packages/eslint-config — prefer extending these rather than adding ad-hoc rules in apps.
- Tests location: unit tests live under `tests/unitTest` (per app), e2e under `tests/e2e`. Vitest and Playwright are configured per-app; use the per-app configs when debugging test failures.
- Clean/build helpers: apps include convenience scripts like `clean`, `re:dev`, `re:build` that remove node_modules/.next and reinstall — useful when workspace state is inconsistent.
- Node/npm versions: Root package.json lists engines node >=20 and packageManager npm@10.9.2. CI should honor these.

---

## 4) AI / assistant config files found

No Claude/Cursor/Aider/Cline/Windsurf agent config files were detected (CLAUDE.md, .cursorrules, AGENTS.md, CONVENTIONS.md, etc.).

---

If this file should include more granular per-package notes (e.g., Next.js custom server patterns, SSR/i18n details, or deployment targets), say which package(s) to document and Copilot sessions will include them.
