# Technology Stack

**Analysis Date:** 2025-02-20

## Languages

**Primary:**
- TypeScript 5.6.3 - Full codebase (client, server, shared)
- JavaScript (ES Modules) - Configuration files

**Build target:**
- ESNext for client, Node.js for server

## Runtime

**Environment:**
- Node.js (server runtime)
- Browser (React 18 client)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (standard npm)

## Frameworks

**Core Frontend:**
- React 18.3.1 - UI component library
- Vite 5.4.19 - Build tool and dev server

**Routing:**
- Wouter 3.3.5 - Client-side routing (lightweight alternative to React Router)

**UI Component Libraries:**
- shadcn/ui (new-york style) - Premade Radix-based components
- Material-UI (MUI) v7.3.2 - Theme provider, base component primitives
- Radix UI (@radix-ui/*) - Unstyled, accessible component primitives (dialog, select, popover, etc.)
- Lucide React 0.453.0 - Icon library

**Data Management:**
- TanStack React Query (React-Query) v5.60.5 - Server state management
- React Hook Form 7.55.0 - Form state management
- Zod 3.24.2 - Runtime schema validation

**Styling:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- Tailwind Merge 2.6.0 - Smart Tailwind class merging
- Emotion (@emotion/react, @emotion/styled) 11.14.x - CSS-in-JS (MUI dependency)
- Framer Motion 11.13.1 - Animation library
- `next-themes` 0.4.6 - Theme switching (included but not active; light mode only)

**Backend Server:**
- Express.js 4.21.2 - HTTP server framework
- TypeScript + tsx 4.19.1 - Server-side TypeScript execution

**Database:**
- PostgreSQL (Neon serverless) - Primary database
- Drizzle ORM 0.39.1 - Type-safe ORM
- drizzle-kit 0.30.4 - Schema migration tooling
- drizzle-zod 0.7.0 - Zod schema generation from Drizzle tables

**Authentication:**
- Passport.js 0.7.0 - Authentication middleware
- passport-local 1.0.0 - Local username/password strategy
- express-session 1.18.1 - Session management
- connect-pg-simple 10.0.0 - PostgreSQL session store
- memorystore 1.6.7 - In-memory session store (development)

**Visualization:**
- Recharts 2.15.2 - React charts library (bar, line, pie, area charts)
- D3 7.9.0 - Data visualization utilities
- Leaflet 1.9.4 - Map library
- react-leaflet 4.2.1 - React wrapper for Leaflet
- react-simple-maps 3.0.0 - SVG maps
- turkey-neighbourhoods 4.0.3 - Turkish administrative boundaries data

**Real-time Communication:**
- WebSocket (ws 8.18.0) - Native WebSocket support (dependency present but not actively used in current codebase)

**Utilities:**
- date-fns 3.6.0 - Date manipulation
- clsx 2.1.1 - Conditional className utility
- class-variance-authority 0.7.1 - Type-safe variant composition
- vaul 1.1.2 - Drawer/sheet component library
- embla-carousel-react 8.6.0 - Carousel component
- react-virtual 3.13.18 - Virtualization for large lists
- notistack 3.0.2 - Toast/snackbar notifications
- zod-validation-error 3.4.0 - Human-friendly Zod error formatting
- input-otp 1.4.2 - OTP input component
- react-day-picker 8.10.1 - Date picker component
- react-resizable-panels 2.1.7 - Resizable panel layout
- cmdk 1.1.1 - Command menu component
- @jridgewell/trace-mapping 0.3.25 - Source map utilities

**Internationalization (i18n):**
- Custom context-based system (no external library)
- Translation files: `client/src/lib/translations/en.json`, `client/src/lib/translations/tr.json`
- Languages: English (`en`), Turkish (`tr`)

## Configuration

**Environment:**
- `.env` - Environment variables (not in repo, required for DATABASE_URL)
- `DATABASE_URL` - PostgreSQL connection string (required for migrations and runtime)
- `PORT` - Server port (default: 5000, set to 5001 in dev script)
- `NODE_ENV` - `development` or `production`

**Build configuration:**
- `vite.config.ts` - Vite build and dev server config
- Path aliases: `@/*` → `client/src/*`, `@shared/*` → `shared/*`, `@assets` → `attached_assets/`
- Root: `client/` (client is the Vite root)

**Type checking:**
- `tsconfig.json` - Strict mode enabled, includes client/server/shared
- Type targets: ESNext module, DOM + Node types

**Code quality:**
- `eslint.config.mjs` - ESLint configuration (flat config format)
- `.prettierrc` - Prettier configuration (100 char line width, 2-space tabs, trailing commas)
- Linting targets: `.ts`, `.tsx` files

## Build & Dev

**Dev script:**
```bash
npm run dev  # PORT=5001 NODE_ENV=development tsx server/index.ts
```

**Build script:**
```bash
npm run build  # vite build (client) && esbuild server/index.ts (server)
```

**Production script:**
```bash
npm run start  # NODE_ENV=production node dist/index.js
```

**Database:**
```bash
npm run db:push  # Apply Drizzle schema migrations
```

**Code checks:**
```bash
npm run check      # TypeScript type checking (tsc)
npm run lint       # ESLint
npm run lint:fix   # ESLint with auto-fix
npm run format     # Prettier
```

## Hosting & Platform

**Development:**
- Served on `localhost:5001`
- Vite dev server with hot module replacement
- Replit integration: `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-runtime-error-modal` (dev-only)

**Production:**
- Runs on port specified in `PORT` environment variable (default 5000)
- Both API and client served from same Express server
- Static assets served from `dist/public` (Vite build output)

**Database:**
- Neon serverless PostgreSQL
- Schema migrations via Drizzle Kit (`migrations/` directory)
- Connection via `DATABASE_URL` environment variable

## Architecture

**Monorepo Structure:**
```
├── client/          # React SPA (Vite root)
├── server/          # Express API
├── shared/          # Database schema and shared types
└── migrations/      # Database schema history (Drizzle Kit)
```

**Client Architecture:**
- Single-Page Application (SPA) with Wouter client-side routing
- Mock data service intercepts all API calls (no real backend integration yet)
- All state managed via React Context (language) and TanStack Query (server state)
- Component library: shadcn/ui + MUI theme provider

**Server Architecture:**
- Express.js with minimal stub endpoints (frontend uses mock data)
- Stub routes: `/api/overview`, `/api/metrics`, `/api/enrichment-suggestions`, `/api/alerts`, `/api/enrichment-suggestions/:id`
- Ready to accept production implementations behind the same endpoint signatures

---

*Stack analysis: 2025-02-20*
