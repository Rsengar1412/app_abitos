# Actualizar documentación (`/update-docs`)

Comando para sincronizar y mejorar documentación de `app_abitos` (README, notas técnicas y guías internas si existen).

## Cuándo ejecutar

- El usuario invoca `/update-docs` o pide actualizar documentación.
- Tras cambios de comportamiento que impactan instrucciones de uso o setup.

## Prioridad de fuentes

1. `README.md`
2. `package.json` (scripts/dependencias)
3. Código real en `src/`
4. Configuración de build/deploy (`vite.config.js`, `netlify.toml`, workflows)

Si hay conflicto, prevalece el código.

## Qué hacer

1. Identificar qué docs están desactualizadas frente al código.
2. Actualizar texto con foco en:
   - instalación y scripts,
   - estructura del proyecto,
   - comportamiento funcional visible.
3. Evitar inventar features o comandos.
4. Mantener redacción clara y concisa.

## Si el usuario pasa una ruta

- Tratar ese archivo como fuente de actualización.
- Ajustar otros docs relacionados solo si ayuda a evitar contradicciones.

## Commits (solo si el usuario lo pide)

Aplicar `.cursor/commands/auto-commit.md` y `.cursor/rules/git-commits.mdc`.

## Resumen para el agente

- Actualizar documentación basada en el estado real del repo.
- No tocar código salvo petición explícita.
- Responder en español.
