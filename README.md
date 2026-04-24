# CutLog

CutLog is a mobile-first personal nutrition app for one user. This repo now contains the first Expo-native foundation for:

- photo-based food logging with editable AI macro estimates,
- weekly meal planning with curated and generated meals,
- a grounded coach chat with plan-edit suggestions,
- manual water tracking,
- Supabase-ready auth/data/storage scaffolding.

## What is implemented

### Mobile app shell
- Expo app entrypoint with a custom mobile tab shell
- Today, Plan, Log, Chat, and Profile screens
- Single-user demo mode with magic-link auth scaffolding

### Product foundations
- Normalized seed meal library based on the original curated meal plan
- Starter weekly planner service with swap/lock/regenerate flows
- Photo logging workflow with editable estimate review
- Contextual coach chat with structured plan-edit suggestion support
- Manual hydration tracking and profile target editing

### Backend scaffolding
- Supabase client bootstrap using `EXPO_PUBLIC_*` env vars
- Initial SQL migration for profiles, recipes, plans, food logs, water logs, and chat
- Local backlog file ready to turn into GitHub issues

## Project structure

- `App.js` / `index.js`: Expo entrypoints
- `src/app/CutLogApp.js`: main mobile UI and state wiring
- `src/data`: seed meal library and starter demo data
- `src/services`: planner, chat, photo-estimation, auth, and Supabase setup
- `supabase/migrations/0001_cutlog.sql`: initial schema draft
- `docs/github-issues.md`: actionable backlog for GitHub issues

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in Supabase values when you are ready for real auth/storage:

```bash
cp .env.example .env
```

3. Start Expo:

```bash
npm run start
```

4. Open in Expo Go / iOS simulator / Android emulator.

## Environment variables

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_OPENAI_API_BASE_URL`
- `EXPO_PUBLIC_OPENAI_API_KEY`

Only the Supabase variables are wired right now. The OpenAI variables are placeholders for the next backend pass.

## Current limitations

- The AI photo estimator and coach chat are local heuristics for now.
- The planner is local-first and not yet backed by Supabase or a real LLM.
- Magic link auth UI exists, but it needs real Supabase env vars plus redirect handling to become production-ready.
- Apple Watch and HealthKit are intentionally out of scope at this stage.

## Next recommended steps

1. Refresh GitHub auth and create the remote repo.
2. Install dependencies and boot the Expo app locally.
3. Turn `docs/github-issues.md` into real GitHub issues.
4. Replace demo data flows with persisted Supabase reads/writes.
