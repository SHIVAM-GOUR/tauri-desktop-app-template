# Project: Tauri Desktop App

A cross-platform desktop application built with **Tauri**, **Rust**, and **React/TypeScript**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop Shell | [Tauri](https://tauri.app/) |
| Backend | Rust |
| Frontend | React + TypeScript |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Global State | Redux Toolkit (RTK) |
| Forms | React Hook Form + Zod |
| Routing | Tauri native hash routing |

---

## Project Structure

```
loadvision/
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── main.rs          # Tauri app entry point
│   │   ├── commands/        # Tauri command handlers (IPC bridge)
│   │   └── models/          # Rust data models / DB schemas
│   └── Cargo.toml
│
├── src/                     # React + TypeScript frontend
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Root component + router setup
│   ├── pages/               # One folder per route/page
│   ├── components/
│   │   ├── ui/              # shadcn generated components (do not edit)
│   │   ├── forms/           # React Hook Form components
│   │   └── shared/          # Reusable custom components
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Global state (Zustand slices or Redux)
│   ├── services/
│   │   └── tauri.ts         # All invoke() calls go here — never inline
│   ├── types/               # Shared TypeScript interfaces & enums
│   └── utils/               # Pure utility/helper functions
│
├── CLAUDE.md
├── tauri.conf.json
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install) (stable toolchain)
- [Tauri CLI prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) for your OS

### Install & Run

```bash
# Install frontend dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

---

## Architecture

### Frontend ↔ Backend Communication (Tauri IPC)

All communication between the React frontend and the Rust backend goes through `src/services/tauri.ts`. **Never call `invoke()` directly inside components or hooks.**

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

> Rust command names use `snake_case`; TypeScript wrapper names use `camelCase`.

### Routing

This app uses **Tauri native hash routing** — no React Router or any third-party routing library.

```typescript
// Navigate programmatically
window.location.hash = '#/route';

// Listen for route changes
window.addEventListener('hashchange', handler);

// Derive current route
const route = window.location.hash.replace('#/', '');
```

### State Management (Redux Toolkit)

Global state is managed with RTK. One slice per feature domain.

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchItems = createAsyncThunk('items/fetch', async () => {
  return await getSomeData('id');
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: { /* ... */ },
  extraReducers: (builder) => { /* ... */ }
});
```

### Forms (React Hook Form + Zod)

All forms use `useForm` with Zod schema validation. No `useState` for form fields.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1) });
type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({ resolver: zodResolver(schema) });
```

---

## Coding Conventions

### TypeScript
- Prefer `interface` over `type` for object shapes
- Export types explicitly; never use implicit `any`
- Use strict null checks; always handle `undefined`

### React
- Functional components only — no class components
- Custom hooks live in `src/hooks/` and are prefixed with `use`
- Keep components small and single-responsibility
- Co-locate component-specific types in the same file

### Tailwind CSS
- Use utility classes directly on elements
- Group classes logically: `layout → spacing → sizing → color → typography → effects`
- Use `cn()` (from shadcn/ui) for conditional class merging

### shadcn/ui
- Do not re-style shadcn primitives with custom CSS — extend via Tailwind variants
- Do not modify files inside `components/ui/` directly
- Wrap shadcn components in a custom wrapper only when shared logic is needed

### Redux Toolkit
- One slice per feature domain (e.g., `authSlice`, `settingsSlice`)
- All async logic via `createAsyncThunk` — no raw `fetch` in components
- Selectors defined at the bottom of each slice file using `createSelector`

### Tauri / Rust
- Tauri commands in `src-tauri/src/commands/` — one file per domain
- Never expose sensitive system logic directly; always route through the Tauri command layer
- Keep Rust commands small and focused; business logic goes in separate Rust modules

---

## Do's and Don'ts

**✅ Do:**
- Always type Tauri command responses on the frontend
- Use `cn()` for all conditional `className` logic
- Use Framer Motion for any element that enters, exits, or transitions
- Import Lucide icons individually (e.g., `import { Settings } from 'lucide-react'`)

**❌ Don't:**
- Don't use `useState` for form fields — use React Hook Form
- Don't call `invoke()` inline in components — use `src/services/tauri.ts`
- Don't write raw SQL or file system logic in the frontend
- Don't mutate Redux state directly outside of RTK slice reducers

---

## License

MIT