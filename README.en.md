# Libre - One day at a time

> **Language / Idioma:** [English](./README.en.md) - [Espanol](./README.md)

Progressive web app (PWA) focused on supporting habit recovery journeys.

## Features

- **Authentication** with Firebase Auth (sign up, sign in, password reset).
- **Onboarding** to choose habits from the first session.
- **Habit counters** with hour/day progress tracking.
- **Gratitude journal** to save three daily reflections.
- **Notifications** configurable per habit.
- **Achievements and recovery progress** with milestone visualization.
- **SOS button** with emergency actions and support resources.

## Tech stack

- React 19 + Vite 7
- Firebase (Auth + Firestore)
- Tailwind CSS
- ESLint + Prettier + markdownlint
- React Doctor

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run doctor
npm run lint:md
npm run format
```

## CI

The repository includes GitHub Actions workflows for:

- `CI` (lint + build on `push` and `pull_request`)
- `Deploy` to GitHub Pages on `main`

## License

MIT

---

_Every moment counts. Stay strong._
