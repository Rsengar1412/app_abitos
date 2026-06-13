# Autocommit (Conventional Commits — app_abitos)

Usar cuando el usuario pida **hacer commit** del trabajo actual.

## Cuándo ejecutar

- El usuario invoca este comando o pide explícitamente **commit** / **autocommit**.
- **No** crear commits si el usuario no lo pidió.

## Antes de commitear (siempre)

1. `git status` para ver cambios rastreados y archivos nuevos.
2. `git diff` y, si hace falta, `git diff --staged`.
3. `git log -15 --oneline` para respetar estilo reciente.
4. **Respetar borrados:** si el diff elimina líneas o archivos, **no restaurarlos** ni "arreglar" el contenido antes del commit salvo petición explícita del usuario. Un borrado suele ser intencional.

No incluir secretos (`.env`, llaves, credenciales).

## Regla de mensajes

- Mensajes en inglés, claros, en imperativo.
- Formato preferido: `<type>(<scope>): <subject>`.
- Si toca varias áreas, usar mensaje multilínea (una línea por bloque lógico).

## Tipos recomendados

- `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, `chore`.

## Scopes habituales de este repo

- `app` (`src/App.jsx`, `src/main.jsx`)
- `sections` (`src/sections/`)
- `components` (`src/components/`)
- `hooks` (`src/hooks/`)
- `contexts` (`src/contexts/`)
- `styles` (`src/styles/`, Tailwind)
- `firebase` (`src/lib/firebase.js`)
- `cursor` (`.cursor/`)
- `claude` (`.claude/`)
- `ci` (`.github/workflows/`)

## Verificación rápida

Antes de PR, ejecutar cuando aplique:

```bash
npm run lint
npm run build
```

## Restricciones

- No usar `--no-verify` salvo petición explícita.
- Sin `Co-authored-by:` ni firmas de IA (ver `.cursor/rules/git-commits.mdc`).
