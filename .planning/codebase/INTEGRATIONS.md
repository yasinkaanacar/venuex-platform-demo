# External Integrations

**Analysis Date:** 2025-02-20

## Overview

VenueX Platform is currently a **prototype with mock data**. All API endpoints are stubbed and intercepted by a client-side mock data service (`client/src/lib/mockData.ts`, `client/src/lib/mock-segments-data.ts`, etc.). No real external integrations are active. This document describes the integration points designed for future production implementation.

## Advertising Platforms

**Supported integrations (designed, not yet connected):**
- **Google Ads/Google Business Profile** - Location performance, search campaigns, store visit attribution
- **Meta (Facebook/Instagram)** - Ad campaigns, audience targeting, offline conversions
- **TikTok** - Ad campaigns, creator marketplace, offline conversions

**SDK/Client packages:**
- No external SDKs currently installed; integrations will use REST API calls via `fetch` or axios-like wrapper

**Auth pattern:**
- Expected: OAuth 2.0 for platform connection
- Environment variables reserved: `GOOGLE_API_KEY`, `META_API_TOKEN`, `TIKTOK_API_TOKEN` (not implemented)

**API endpoints (stub, ready for real implementation):**
- `GET /api/overview` - Cross-platform dashboard data
- `GET /api/metrics` - Platform-specific metrics aggregation
- `GET /api/campaigns` - Campaign management (structure exists in mock data)
- `GET /api/locations` - Store/location performance across platforms
- `POST /api/offline-conversions/batches` - Batch offline conversion upload

## Point-of-Sale & CRM Integration

**Purpose:** Ingest store sales data, inventory, customer interactions for offline attribution

**No current integration:** Designed endpoints exist but all data is mocked.

**Expected connection pattern:**
- SFTP or API ingestion from POS systems (generic labels: "SFTP", "API", no brand-specific naming)
- Data pipelines to Google Conversions API, Meta Conversions API, TikTok Event API
- CSV/batch imports for testing

**Mock data structure:**
- `client/src/lib/mock-campaign-data.ts` - Campaign and conversion data
- `client/src/lib/mock-pipeline-data.ts` - Data pipeline status and uploads
- `client/src/components/offline-conversions/` - UI for offline conversion flows

## Data Storage

**Primary Database:**
- **PostgreSQL (Neon serverless)**
  - Connection: `process.env.DATABASE_URL` (required environment variable)
  - ORM: Drizzle ORM 0.39.1
  - Schema location: `shared/schema.ts`
  - Tables: `users`, `platforms`, `locations`, `campaigns`, `metrics`, `enrichmentSuggestions`, `alerts`, `notifications`
  - Type-safe insert schemas generated via `drizzle-zod`
  - Migrations tracked in `migrations/` directory (Drizzle Kit)

**Session Storage:**
- **PostgreSQL** (production): `connect-pg-simple` session store
- **Memory** (development): `memorystore` for express-session

**Caching:**
- Not detected — data flows through React Query client cache

**File Storage:**
- Not implemented — designed endpoints for file uploads exist but all data is mocked

## Authentication & Identity

**Current Implementation:**
- **Passport.js** with `passport-local` (username/password)
- Session-based auth via `express-session`
- No OAuth 2.0 integration yet

**Auth flow:**
1. Client sends credentials to Express server
2. Server validates against PostgreSQL `users` table
3. Session created and stored in PostgreSQL (production) or memory (dev)
4. Session ID sent as HTTP cookie

**Stub endpoints (ready for real implementation):**
- `POST /api/auth/login` - Authentication (not exposed in current routes.ts)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current user info

**Database integration:**
- User records stored in `shared/schema.ts` → `users` table
- Password handling ready via `InsertUser` schema (production must use bcrypt/argon2)

**Future OAuth integrations:**
- Google Business Profile auth (for location management)
- Meta/Facebook login (for ad account linking)
- TikTok creator authentication (for catalog/content management)

## Monitoring & Observability

**Error Tracking:**
- Not implemented — no Sentry, Rollbar, or similar integration
- Server logs HTTP requests to stdout via middleware in `server/index.ts`

**Logs:**
- Console logs only (`log()` utility in `server/vite.ts`)
- API request logging with duration and response size (first 79 chars)
- No persistent log aggregation

**Alerts:**
- Alert data structure exists in schema (`alerts` table)
- Mock alerts in `client/src/lib/mockData.ts`
- No real alert triggering or notification service

## Notification Delivery

**In-app notifications:**
- **notistack** - Toast/snackbar notifications for user feedback
- `client/src/lib/toast.ts` - Toast utility wrapper
- Notifications stored in PostgreSQL (`notifications` table)
- Mock notification service: `client/src/lib/mock-notifications-data.ts`

**Push notifications:**
- Not implemented
- Database schema includes `notifications` table with fields for categorization (platform, user, import, export, reviews, locations, catalog, offline_conversions)

**Email:**
- Not implemented

## Webhooks & Callbacks

**Incoming webhooks (designed, not implemented):**
- Google Merchant Center feeds → sync catalog/inventory
- Meta Conversions API webhooks → offline conversion feedback
- TikTok event webhooks → conversion tracking
- Review notification webhooks from Google Business Profile, Apple Maps, Facebook

**Outgoing webhooks:**
- Not designed yet

## Maps & Geolocation

**Mapping Library:**
- **Leaflet** 1.9.4 + **react-leaflet** 4.2.1
- Used in: `client/src/components/offline-conversions/GeographicMap.tsx`
- Tile provider: Not specified (Leaflet defaults to OpenStreetMap)

**Location Data:**
- **turkey-neighbourhoods** 4.0.3 - Turkish administrative boundaries and neighborhood data
- Used for geographic segmentation and regional reporting

**Coordinates:**
- Stored with each location in mock data (lat/lng objects)
- Ready for real location geocoding integration

## Internationalization

**Languages:**
- English (`en`)
- Turkish (`tr`)

**Implementation:**
- Custom React Context (`client/src/contexts/LanguageContext.tsx`)
- No external i18n library (custom solution)
- Translation files: `client/src/lib/translations/en.json`, `client/src/lib/translations/tr.json`
- Language preference stored in `localStorage` (`venuex-language` key)
- Fallback: English if no saved preference

**No external translation APIs** — all translations are static JSON files committed to the repo.

## Real-time Communication

**WebSocket dependency:**
- `ws` 8.18.0 included in dependencies
- No active WebSocket connections in current codebase
- Ready for real-time updates (campaign performance, review notifications, data pipeline status)

**Planned uses (not yet implemented):**
- Live metric updates from advertising platforms
- Real-time review notifications from GBP, Apple Maps, Facebook
- Data pipeline status push notifications

## CI/CD & Deployment

**Not implemented in codebase:**
- No GitHub Actions workflows
- No Docker configuration
- No deployment scripts

**Build process:**
1. TypeScript compilation: `tsc` (type-checking only)
2. Client build: Vite → `dist/public`
3. Server build: esbuild → `dist/index.js`
4. Output: Single Express server serving both API and static client

**Database migrations:**
- Manual via `npm run db:push` (Drizzle Kit command)
- Must run before server startup to initialize schema

## Configuration & Environment

**Required environment variables:**
- `DATABASE_URL` - PostgreSQL connection string (Neon format)
- `PORT` - Server port (default: 5000, overridden to 5001 in dev)
- `NODE_ENV` - `development` or `production`

**Optional environment variables:**
- Reserved but not implemented:
  - `GOOGLE_API_KEY` - Google APIs (Ads, Business Profile)
  - `META_API_TOKEN` - Meta/Facebook Graph API
  - `TIKTOK_API_TOKEN` - TikTok API
  - `NEON_DATABASE_URL_REPLICA` - Replica database for read scaling

**Secrets management:**
- `.env` file (Git-ignored, not in repo)
- Not integrated with: AWS Secrets Manager, HashiCorp Vault, GitHub Secrets
- Development typically uses local `.env` file

**Feature flags:**
- No feature flag service integrated
- Runtime environment checks (e.g., `process.env.NODE_ENV === 'production'`)

## Mock Data Architecture

**Current state:**
- All API calls intercepted by mock data service in `client/src/lib/queryClient.ts`
- Real Express endpoints exist but return stub responses
- Frontend development happens entirely with mock data

**Mock data files:**
- `client/src/lib/mockData.ts` - Main mock data service
- `client/src/lib/mock-campaign-data.ts` - Campaign and offline conversion data
- `client/src/lib/mock-reviews-data.ts` - Review and sentiment data
- `client/src/lib/mock-segments-data.ts` - Audience segment data
- `client/src/lib/mock-notifications-data.ts` - Notification data
- `client/src/lib/mock-pipeline-data.ts` - Data pipeline status and imports
- `client/src/lib/mock/locations.ts` - Location master data

**Data consistency:**
- Turkish market data (TRY currency, real city names like Istanbul, Ankara, İzmir)
- Realistic metrics: ROAS 3-5x, conversion rates 2-8%, cost-per-action 15-50 TRY
- Edge cases: empty states, partial data, error scenarios included

---

*Integration audit: 2025-02-20*
