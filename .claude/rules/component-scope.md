# Alcance de código en app_abitos

Este repositorio es una app React. Coloca cada cambio en la carpeta que corresponde a su responsabilidad.

## Árbol de decisión

1. **Pantalla o bloque funcional principal** → `src/sections/`.
2. **UI reutilizable entre secciones** → `src/components/`.
3. **Estado global o de tema/autenticación** → `src/contexts/`.
4. **Lógica reutilizable sin UI** → `src/hooks/`.
5. **Integraciones externas y utilidades de infraestructura** → `src/lib/`.
6. **Estilos base y CSS global** → `src/styles/` o CSS local junto al componente.
7. **Bootstrapping de la app** → `src/main.jsx` y `src/App.jsx`.

## Reglas prácticas

- Evitar duplicar componentes: si ya existe una versión en `src/components/`, reutilizarla.
- Si una sección crece con subcomponentes privados, mantenerlos colocalizados dentro de `src/sections/`.
- Cambios de configuración (Vite, ESLint, Tailwind, Netlify) se hacen en archivos de raíz, no en `src/`.

## Antes de crear un archivo

Confirmar primero si el cambio es:

- UI de sección,
- componente compartido,
- estado/lógica reutilizable,
- o configuración del proyecto.
