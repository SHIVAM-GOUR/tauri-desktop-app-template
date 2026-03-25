# Project: Tauri Desktop App

## Overview
This is a cross-platform desktop application built with **Tauri (Rust + React/TypeScript)**.

---
## Frontend Project File Structure

```
loadvision/
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── main.rs          # Tauri app entry point
│   │   ├── commands/        # Tauri command handlers (IPC bridge)
│   │   ├── models/          # Rust data models / DB schemas
│   └── Cargo.toml
│
├── src/                     # React + TypeScript frontend
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Root component + router setup
│   ├── pages/               # One folder per route/page
│   ├── components/          # Shared/reusable UI components
│       ├── ui/               # shadcn generated components (do not edit)
│       ├── forms/            # React Hook Form components
│       ├── shared/           # Reusable custom components
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Global state (Zustand slices or Redux)
│   ├── services/            # Tauri invoke wrappers & API helpers
│   │   └── tauri.ts         # All `invoke()` calls go here — never inline
│   ├── types/               # Shared TypeScript interfaces & enums
│   └── utils/               # Pure utility/helper functions
│
├── CLAUDE.md                
├── tauri.conf.json
├── package.json
└── vite.config.ts
```

--- 
## Stack Layers

### Base App Layer
- **Tauri** (desktop shell) with **Rust** for backend/system logic
- **React.js** for frontend UI
- **TypeScript** — strictly typed; no `any` unless absolutely necessary

### UI Layer
- **shadcn/ui** — primary component library; always prefer shadcn primitives before writing custom components
- **Tailwind CSS** — utility-first styling; no inline styles, no separate CSS files unless required
- **Framer Motion** — all animations and transitions; use `motion.*` components
- **Lucide React** — all icons; import individually (e.g., `import { Settings } from 'lucide-react'`)

### State & Data Layer
- **Redux Toolkit (RTK)** — global state management; use `createSlice`, `createAsyncThunk`
- **Immer** — already bundled with RTK; use `produce` for complex immutable updates outside RTK if needed
- **React Hook Form** — all forms; never use uncontrolled inputs or local state for form data

### Routing Layer
- **Tauri native hash routing** — use `window.location.hash` and the `hashchange` event for navigation; no React Router or any third-party routing library
- Navigate programmatically via `window.location.hash = '#/route'`
- Listen for route changes with `window.addEventListener('hashchange', handler)`
- Current route derived from `window.location.hash` (strip leading `#/`)

---

## Coding Conventions

### TypeScript
- Prefer `interface` over `type` for object shapes
- Export types explicitly; never use implicit `any`
- Use strict null checks; always handle `undefined` cases

### React
- Functional components only — no class components
- Custom hooks in `src/hooks/` prefixed with `use`
- Keep components small and single-responsibility
- Co-locate component-specific types in the same file

### Tailwind CSS
- Use Tailwind utility classes directly on elements
- Group classes logically: layout → spacing → sizing → color → typography → effects
- Use `cn()` utility (from `shadcn/ui`) for conditional class merging

### shadcn/ui
- Do not re-style shadcn primitives with custom CSS — extend via Tailwind variants
- Keep the `components/ui/` folder intact; do not modify generated shadcn files directly
- Wrap shadcn components in a custom wrapper only if shared logic is needed

### Redux Toolkit
- One slice per feature domain (e.g., `authSlice`, `settingsSlice`)
- All async logic via `createAsyncThunk` — no raw `fetch` in components
- Selectors defined at the bottom of each slice file using `createSelector` when needed
- Store directory: `src/store/` with `store.ts` as the root

### React Hook Form
- Always use `useForm` with a TypeScript generic (e.g., `useForm<FormSchema>()`)
- Validate using Zod schemas with `zodResolver` from `@hookform/resolvers/zod`
- Form components in `src/components/forms/`

### Tauri / Rust
- Tauri commands in `src-tauri/src/commands/` — one file per domain
- Invoke Tauri commands from frontend using `@tauri-apps/api/tauri`
- Type-safe command wrappers in `src/lib/tauri/` on the frontend side
- Never expose sensitive system logic directly; always go through Tauri command layer

---


## Key Patterns

### Tauri Command Invocation (Frontend) (Tauri IPC Conventions)
All frontend ↔ backend communication goes through `src/services/tauri.ts`. Never call `invoke()` directly in components or hooks. Example: 

```typescript
// src/services/tauri.ts
import { invoke } from "@tauri-apps/api/core";

export const scanService = {
  startEmptyScan: (siteId: string) =>
    invoke<ScanResult>("start_empty_scan", { siteId }),

  startLoadedScan: (entryId: string) =>
    invoke<ScanResult>("start_loaded_scan", { entryId }),

  computeVolume: (entryId: string) =>
    invoke<VolumeResult>("compute_volume", { entryId }),
};
```
Rust command naming: `snake_case`. TypeScript wrapper naming: `camelCase`.

### RTK Slice Pattern
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchItems = createAsyncThunk('items/fetch', async () => {
  return await getSomeData('id');
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: { ... },
  extraReducers: (builder) => { ... }
});
```

### Form Pattern (React Hook Form + Zod)
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1) });
type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({ resolver: zodResolver(schema) });
```

---

## Do's and Don'ts

**Do:**
- Always type Tauri command responses on the frontend
- Use `cn()` for all conditional className logic
- Use Framer Motion for any element that enters, exits, or transitions
- Keep Rust commands small and focused; business logic in separate Rust modules

**Don't:**
- Don't use `useState` for form fields — use React Hook Form
- Don't import all of lucide-react — import icons individually
- Don't write raw SQL or file system logic in frontend; always use Tauri commands
- Don't mutate Redux state directly outside of RTK slice reducers