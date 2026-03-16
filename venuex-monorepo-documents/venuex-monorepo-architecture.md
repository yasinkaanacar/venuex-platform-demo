# VenueX Monorepo Architecture Analysis

## 1. Top-Level Folder Structure

```
venuex-monorepo/
├── apps/                          # Runnable applications
│   ├── api/                       # Main NestJS REST API server (MongoDB, Redis, Swagger)
│   ├── storefront/                # React frontend (MUI, CRA-based)
│   ├── chat-bot/                  # AI-powered chatbot service
│   ├── consumer-batch/            # SQS consumer for batch processing jobs
│   ├── consumer-delete/           # SQS consumer for deletion operations
│   ├── consumer-insight/          # SQS consumer for analytics/insight ingestion
│   ├── consumer-kicker/           # SQS consumer for triggering/scheduling tasks
│   ├── consumer-pusher/           # SQS consumer for push notifications/events
│   ├── consumer-transformer/      # SQS consumer for data transformation pipelines
│   ├── directions/                # Directions microservice
│   ├── scheduler/                 # Cron/scheduled job runner (NestJS Schedule)
│   ├── vms/                       # Venue management system (excluded from workspace)
│   └── book/                      # Documentation/book (excluded from workspace)
│
├── libs/                          # Shared libraries (consumed by apps)
│   ├── acl/                       # CASL-based attribute-level access control (abilities, guards, interceptors)
│   ├── atomic-components/         # Shared React UI kit: auth context, theme, layouts, guards, axios, API config
│   ├── database/                  # Typegoose/Mongoose schemas and DB utilities
│   ├── dto/                       # Shared Data Transfer Objects (class-validator)
│   ├── modules/                   # Shared NestJS modules (auth, location, brand, product, etc.)
│   ├── constants/                 # Shared enums and constant values
│   ├── interfaces/                # Shared TypeScript interfaces
│   ├── exceptions/                # Custom exception classes
│   ├── validations/               # Shared validation utilities
│   ├── utils/                     # General utility functions
│   ├── queue/                     # Bull/SQS queue definitions and DTOs
│   ├── export/                    # Data export utilities
│   ├── notification/              # Notification service helpers
│   ├── novu/                      # Novu notification platform integration
│   ├── swagger/                   # Swagger/OpenAPI utilities
│   ├── unified-logger/            # Winston-based logging across apps
│   ├── newrelic/                  # New Relic APM integration
│   ├── product/                   # Product domain logic
│   ├── indoor-map/                # Indoor map functionality
│   ├── content-api/               # Content management API client
│   ├── business-listing-api/      # Business listing aggregation API
│   ├── google-ads-api/            # Google Ads API integration
│   ├── apple-maps-api/            # Apple Maps API integration
│   ├── apple-business-connect-api/# Apple Business Connect integration
│   ├── meta-graph-api/            # Meta/Facebook Graph API integration
│   ├── meta-conversions-api/      # Meta Conversions API (CAPI) integration
│   ├── shopify-api/               # Shopify e-commerce integration
│   ├── tiktok-business-api/       # TikTok Business API integration
│   ├── map-sdk/                   # Map SDK (excluded from workspace)
│   ├── store-widget/              # Store widget (excluded from workspace)
│   └── tech-ops-cli/              # Internal CLI tooling (excluded from workspace)
│
├── cypress/                       # E2E test suite (Cypress)
├── mail/                          # Email templates and messaging service
├── nginx/                         # NGINX reverse proxy configuration
├── local_packages/                # Local development packages
├── .github/                       # GitHub Actions CI/CD workflows
├── .husky/                        # Git hooks for linting/testing automation
│
├── turbo.json                     # Turborepo task pipeline configuration
├── pnpm-workspace.yaml            # PNPM workspace + dependency catalog
├── package.json                   # Root scripts, engine constraints, husky
├── docker-compose.yml             # Local dev services (MongoDB, Redis)
├── Dockerfile                     # Root Docker build (for libs)
├── .syncpackrc                    # Cross-package dependency version enforcement
├── nest-cli.json                  # NestJS CLI configuration
├── jest.config.js                 # Jest root config
├── cypress.config.js              # Cypress E2E config
└── nodeVersionSwitch.sh           # Node version management helper
```

## 2. Routing Strategy

**Centralized config-based routing** using React Router v6 (`react-router-dom`).

- **Router definition**: `apps/storefront/src/routes/index.tsx` — single `useRoutes()` call with a nested route config object
- **Path constants**: `apps/storefront/src/routes/paths.ts` — centralized `PATHS` object with all route paths as strings/functions
- **Page imports**: `apps/storefront/src/routes/elements.tsx` — page component imports (lazy loading commented out, direct imports used)

Route structure:
```
/auth/*              → GuestGuard-wrapped (login, register, password reset)
/invite/:token       → Invitation confirmation
/                    → AuthGuard + SetupGuard + AbilityGuard + DashboardLayout
  /dashboard         → Main dashboard
  /locations/*       → Location CRUD, import, bulk, posts
  /reviews           → Review management
  /catalog/*         → Product catalog
  /settings          → Account settings
  /setup/*           → Onboarding/platform setup flows (Google, Meta, Apple)
  /demo-onboarding/* → Demo onboarding flow
/404                 → Not found
```

**Not file-based routing** — all routes are explicitly defined in a single config object.

## 3. State Management Approach

**Multi-layer strategy** — primarily React Query, with Easy Peasy and React Context:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Server state** | `@tanstack/react-query` v5 | Primary data fetching, caching, mutations. ~48 custom hooks in `hooks/` |
| **Global store** | `easy-peasy` (Redux wrapper) | Legacy store — currently **empty** (`StoreModel` has all models commented out). Wired but unused. |
| **Auth state** | React Context (`JwtContext`) | User session, JWT tokens, login/logout, 2FA, setup status |
| **Brand state** | React Context (`BrandProvider`) | Current brand selection and brand details |
| **Settings state** | React Context (`SettingsProvider`) | UI settings (theme mode, layout preferences) |
| **ACL/Abilities** | React Context (`AbilityContext`) | CASL MongoAbility instance for permission checks |
| **Forms** | React Hook Form + Yup | Form state management and validation |
| **Query keys** | `hooks/query-keys.ts` | ~184 string constants for React Query cache keys |
| **Stale times** | `hooks/staleTimes.ts` | Per-domain cache durations (locations: 24h, reviews: 15m, insights: 1h, default: 2h) |

**UI framework note**: MUI 5 is the primary component library, with Radix UI (`@radix-ui/*`) for headless primitives (accordion, dropdown, popover, tabs, tooltips). Tailwind CSS is also integrated alongside Emotion styling.

**Pattern**: Custom hooks (`useApi*`) wrap `useQuery`/`useMutation` calls, using `ApiConfig` for endpoint definitions and `getQuery` as the fetch function. This is the dominant data management pattern.

## 4. API Layer Pattern

### Frontend → Backend Communication

```
Component
  → useApi* hook (apps/storefront/src/hooks/)
    → useQuery/useMutation (@tanstack/react-query)
      → getQuery() (libs/atomic-components/src/services/get-query.ts)
        → makeRequest() (libs/atomic-components/src/utils/axios.ts)
          → axiosInstance (configured with baseURL, interceptors)
            → NestJS API
```

**Key components**:

- **Axios instance** (`libs/atomic-components/src/utils/axios.ts`):
  - `baseURL` from `window.__RUNTIME_CONFIG__?.REACT_APP_API_BASEURL` (runtime config)
  - Response interceptor handles errors by status code (400, 401, 403, 404, 408, 409, timeout)
  - `makeRequest()` utility adds `Accept-Language` header from i18next
  - Auth header (`Bearer <token>`) set globally via `axios.defaults.headers.common.Authorization`

- **API Config** (`libs/atomic-components/src/services/api-config.ts`):
  - ~600+ line centralized config mapping every API endpoint
  - Each entry defines: URL, HTTP method, payload mapping, data extraction path
  - Pattern: `ApiConfig.GET_LOCATIONS({brandId})` returns a config object

- **getQuery** (`libs/atomic-components/src/services/get-query.ts`):
  - Thin wrapper over `makeRequest()` that extracts nested data via `dataPath`
  - Adds 1s artificial delay in development for loading state testing

- **Error handling**: Axios interceptor converts all errors to human-readable `Error` messages. No retry logic on frontend (retry disabled in QueryClient defaults).

### Backend API Structure (NestJS)

```
Controller (HTTP layer, decorators, Swagger docs)
  → Service (business logic, ACL checks)
    → Typegoose Model (MongoDB via Mongoose)
```

- **Modules**: `libs/modules/src/modules/` contains ~45+ feature modules (location, brand, product, auth, etc.)
- **Each module** typically has: `.module.ts`, `.controller.ts`, `.service.ts`, and optionally platform-specific services (e.g., `google-location.service.ts`, `meta-location.service.ts`)
- **DTOs**: Shared via `@libs/dto` using `class-validator` + `class-transformer`
- **Guards**: JWT auth guard, 2FA guard, optional auth guard, HMAC guard (Shopify webhooks)
- **Pipes**: `ParseObjectIdPipe`, `ParseUuidV4Pipe`, `ParseRefIdPipe` for parameter validation
- **ACL Interceptor**: `libs/acl/src/interceptors/acl-interceptor.service.ts` — builds CASL abilities per request
- **Exception filter**: Global `AllExceptionsFilter` returns standardized error responses with `requestId`, `statusCode`, `message`, `internalCode`, `errorGroup`

## 5. Auth Flow

### Backend (NestJS)

- **Strategy**: JWT with ES512 algorithm (ECDSA P-521)
- **Implementation**: Passport.js via `@nestjs/passport`
  - `JwtEs512Strategy` — validates Bearer token from `Authorization` header
  - `Jwt2FaStrategy` — handles 2FA-required tokens
  - Token validated against `JWT_PUBLIC` key; signed with `JWT_PRIVATE` key
  - User validated by `sub` (userId) + `email` from JWT payload
  - Session invalidation: if `lastLoginAt > token.iat`, token is rejected (single-session enforcement)
- **Two-Factor Auth (2FA)**: TOTP via `otpauth` library
  - AES256-encrypted TOTP secrets stored in DB (`JWT_2FA_ENCRYPTION_IV`, `JWT_ENCRYPTION_KEY`)
  - Endpoints: `POST /auth/generate-qr-code`, `POST /auth/enable-2fa`, `POST /auth/login-2fa`, `POST /auth/disable-2fa`, `POST /auth/recover-2fa`
  - QR code generation for authenticator app scanning (issuer: "VenueX")
- **Token renewal**: `POST /auth/token/renew` — accepts refresh token + userId, validates, returns new access token
- **Social OAuth**: Google (GBP, GMC, Ads), Apple Business Connect, TikTok — each with dedicated Passport strategies
- **Dynamic module**: `AuthModule.forRoot({googleStrategy, tiktokStrategy, appleStrategy})` — conditionally loads OAuth strategies per app
- **Auth decorators**: `@JwtAuth()`, `@Jwt2FaAuth()`, `@JwtOptionalAuth()`, `@CurrentUser()`
- **ACL**: CASL-based attribute-level permissions
  - `@libs/acl` provides `AbilityBuilder`, `isAbleToCreate/Update/Delete/Read` helpers
  - Decorators: `@CurrentAbilities()`, `@DefineAccess()`, `@DefineRole()`
  - `AclInterceptor` builds abilities per request and injects into service layer
  - ACL rules cached in Redis (1-minute TTL), cleared on login/logout

### Frontend (React)

- **Auth Context** (`libs/atomic-components/src/auth/JwtContext.tsx`):
  - `useReducer` for auth state (isAuthenticated, user, setupCompleted, require2FA)
  - On init: checks localStorage for `accessToken`, validates with `/auth/profile` API call
  - Login: `POST /auth/login` → receives JWT → stored in localStorage → set on axios headers
  - 2FA: `POST /auth/login-2fa` for two-factor verification
  - Demo login: `POST /demo/login` for demo accounts
  - Registration: `POST /users/register` via invitation token
  - Password reset: `POST /password/forget`, `PUT /password/reset`
- **Route guards**:
  - `AuthGuard` — redirects unauthenticated users to login; loads CASL abilities from user rules
  - `GuestGuard` — redirects authenticated users away from login/register
  - `SetupGuard` — ensures onboarding/setup is completed
  - `AbilityGuard` — provides CASL ability context to child components

### Token Flow
```
Login → JWT (ES512) → localStorage + axios default header → Auto-attach on every request
                    → /auth/profile on page load to verify/refresh session
                    → CASL rules unpacked from user profile for frontend ACL
```

## 6. Environment/Config Management

- **Doppler CLI** — primary secret management for all backend apps
  - Each app has `doppler.yaml` in its root (11 apps configured)
  - Secrets injected at runtime via `doppler run -- <command>`
  - NestJS `@nestjs/config` ConfigService reads from process.env (populated by Doppler)

- **Frontend runtime config**: `window.__RUNTIME_CONFIG__` object
  - `REACT_APP_API_BASEURL` — API base URL
  - `REACT_APP_BUGSNAG_API_KEY` — Bugsnag error tracking
  - Injected at deploy time (not build time), allowing per-environment deployment

- **Backend config pattern**: `ConfigService<TypedEnvInterface, true>` with typed interfaces from `@libs/interfaces`
  - Joi validation schema in `app.module.ts` validates all required env vars at startup
  - `ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true })` — no `.env` files, Doppler only
  - Typed interfaces: `ApiEnvironmentVariables`, `JwtEnvironmentVariables`, `HttpBaseEnvironmentVariables`
  - Key categories: JWT/Auth, Database (MONGO_URI), Redis, AWS (S3, SQS, Lambda, SFN), Google/Meta/Apple/TikTok credentials, Logging, Monitoring (Sentry)

- **No `.env` files committed** — Doppler is the single source of truth for secrets

## 7. Shared vs Feature-Specific Code Boundaries

### Shared Code (`libs/`)

| Library | Consumers | Scope |
|---------|-----------|-------|
| `@libs/database` | All backend apps | Typegoose schemas, DB models |
| `@libs/dto` | Backend + Frontend | DTOs with class-validator, shared types |
| `@libs/modules` | API + Consumers + Scheduler | NestJS feature modules (auth, location, brand, etc.) |
| `@libs/acl` | Backend (+ rules sent to frontend) | CASL abilities, guards, interceptors |
| `@libs/atomic-components` (`@libs/atomic`) | Storefront | React UI kit, auth context, theme, axios, API config |
| `@libs/constants` | All apps | Enums, constant values |
| `@libs/interfaces` | Backend apps | TypeScript interfaces for config, models |
| `@libs/queue` | API + Consumers | Bull/SQS queue definitions and DTOs |
| `@libs/utils` | All apps | General utilities |
| `@libs/validations` | All apps | Shared validation helpers |
| Platform APIs | Backend apps | Google, Apple, Meta, TikTok, Shopify integrations |

### Feature-Specific Code (in `apps/`)

- **Storefront**: Pages (`pages/`), Sections (`sections/`), Hooks (`hooks/`), Guards, Routes — feature-organized
  - `pages/` — route-level components organized by domain (locations, reviews, dashboard, etc.)
  - `sections/` — feature sections/complex UI blocks (reused across pages)
  - `hooks/` — 48 custom hooks, mostly `useApi*` for data fetching per domain
- **API**: Modules registered in `app.module.ts`, delegates to `@libs/modules`
- **Consumers**: Each consumer is a thin NestJS app importing shared modules

### Boundary Pattern
```
libs/database       → Schema definitions (shared across ALL backend apps)
libs/modules        → Business logic modules (shared across backend apps)
libs/atomic         → UI components + auth + API client (shared across frontend apps)
libs/dto            → Types cross both frontend and backend
apps/storefront     → Feature-specific pages, sections, hooks
apps/api            → App-specific config, main module wiring
apps/consumer-*     → Queue-specific handlers, thin wrappers over shared modules
```

## 8. Monorepo Tooling

### PNPM Workspaces (v10.25.0+)

- **Workspace config**: `pnpm-workspace.yaml` — includes `apps/**`, `libs/**`, `cypress`
- **Exclusions**: `apps/book`, `apps/vms`, `apps/legacy-vms`, `libs/tech-ops-cli`, `libs/store-widget`, `libs/map-sdk`
- **Dependency catalogs**: Two catalogs in `pnpm-workspace.yaml`:
  - `catalog:` — production dependencies (NestJS 11, Mongoose 8, Axios, etc.)
  - `catalogs.dev:` — dev dependencies (TypeScript 5.9, Jest 29, ESLint 8, Prettier 3)
  - `catalogs.frontend:` — frontend-specific (React 18, MUI 5, React Query 5, React Router 6)
- **Filter commands**: `pnpm --filter @apps/api`, `pnpm --filter @libs/*`, `pnpm --filter @apps/consumer-*`
- **Engine enforcement**: `"npm": "USE-PNPM"`, `"yarn": "USE-PNPM"` + `preinstall: npx only-allow pnpm`

### Turborepo (v2.0.3+)

- **Pipeline**: `turbo.json` defines task dependency graph
  - `build` depends on `^build` (topological)
  - `build:libs` → `build:libs:backend` (adds `@libs/modules`) → `build:api`, `build:consumers`, etc.
  - `build:libs:frontend` → `build:sf`
  - `test` depends on `^build`; `lint` has no dependencies; `dev` is uncached
- **Caching**: File-based cache for `dist/**` and `build/**` outputs
- **Not using**: Nx, Lerna, or Changesets

### Syncpack

- Enforces consistent dependency versions across all packages
- Commands: `syncpack:lint`, `syncpack:fix`, `syncpack:format`

### Husky + Lint-Staged

- Pre-commit hooks via Husky v9
- `lint-staged` for incremental linting on staged files

### OxLint

- Fast alternative linter (`oxlint` v0.3.5) available via `pnpm oxlint`

### Build Order

```
@libs/* (parallel)
  → @libs/modules (depends on other libs)
    → @apps/api, @apps/consumer-*, @apps/scheduler (depend on backend libs)
  → @libs/atomic (depends on other libs)
    → @apps/storefront (depends on frontend libs)
```

---

*Generated: 2026-03-11*
