# Libre - One day at a time

> **Language / Idioma:** [English](./README.en.md) | [Español](./README.md)

Progressive web app (PWA) focused on supporting habit recovery journeys.

![Libre app screenshot](./screenshot.png)

## Key features

- **Authentication** with Firebase Auth (sign up, sign in, password reset).
- **Demo mode** to try the app without creating an account.
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

## Information

| | |
| --- | --- |
| **Repository** | [github.com/Rsengar1412/app_abitos](https://github.com/Rsengar1412/app_abitos) |
| **License** | [MIT](./LICENSE) |

## 👑 Contributors

<a href="https://github.com/Rsengar1412/app_abitos/graphs/contributors">
  <img
    src="https://contrib.rocks/image?repo=Rsengar1412/app_abitos"
    alt="Contributors"
  />
</a>

---

_Every moment counts. Stay strong._
