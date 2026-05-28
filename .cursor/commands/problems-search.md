# Auditoría global de problemas (`/problems-search`)

## Cuándo ejecutar

- El usuario invoca **`/problems-search`** o pide una auditoría técnica global.
- El objetivo inicial es inventariar y priorizar; no arreglar todo de una vez.

## Objetivo

Revisar `app_abitos` de forma sistemática y reportar hallazgos por prioridad (P0→P3), con evidencia de archivos o salidas de comandos.

## Qué debe hacer el asistente

1. Ejecutar comprobaciones automáticas cuando aplique:
   - `npm run lint`
   - `npm run build`
2. Revisar código y configuración según las áreas del apartado de prioridades.
3. No inventar problemas: cada hallazgo debe citar ruta concreta.
4. No commitear ni pushear salvo petición explícita.

## Factores y prioridades

| Nivel  | Criterio                                                                    |
| :----- | :-------------------------------------------------------------------------- |
| **P0** | Rompe build, CI o deja la app inutilizable.                                 |
| **P1** | Errores funcionales claros en UX, estado o integraciones (p. ej. Firebase). |
| **P2** | Lint, warnings importantes, deuda de mantenibilidad.                        |
| **P3** | Estilo, consistencia y mejoras opcionales.                                  |

### Áreas de revisión

- App shell y render principal: `src/main.jsx`, `src/App.jsx`.
- Secciones y componentes: `src/sections/`, `src/components/`.
- Estado y lógica: `src/contexts/`, `src/hooks/`.
- Integración externa: `src/lib/firebase.js`.
- Estilos/config: `src/styles/`, `tailwind.config.js`, `eslint.config.js`, `vite.config.js`, `.github/workflows/`.

## Formato del informe (obligatorio)

Responder en español con esta estructura:

```markdown
## Resumen ejecutivo

## P0 — Crítico

## P1 — Alto

## P2 — Medio

## P3 — Bajo

## Comprobaciones ejecutadas
```

Si no hay P0/P1, decirlo explícitamente.
