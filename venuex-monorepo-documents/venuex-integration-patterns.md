# VenueX External Integration Patterns

Comprehensive documentation of how VenueX handles external platform integrations.

---

## Table of Contents

1. [Shared Infrastructure](#1-shared-infrastructure)
2. [Google Business Profile (GBP)](#2-google-business-profile-gbp)
3. [Google Ads](#3-google-ads)
4. [Google Merchant Center (GMC)](#4-google-merchant-center-gmc)
5. [Meta / Facebook](#5-meta--facebook)
6. [TikTok](#6-tiktok)
7. [Apple Business Connect](#7-apple-business-connect)
8. [Shopify (POS/ERP)](#8-shopify-poserp)

---

## 1. Shared Infrastructure

### 1.1 HTTP Client Patterns

| Layer | Implementation | File |
|-------|---------------|------|
| NestJS HTTP | `VenuexHttpModule` wrapping `@nestjs/axios` | `libs/modules/src/modules/venuex-http.module.ts` |
| Meta Graph | Axios instance with interceptors | `libs/meta-graph-api/src/meta-graph-api.ts` |
| Apple ABC | Native `fetch` with token injection | `libs/apple-business-connect-api/src/apple/auth.ts` |
| Google APIs | `googleapis` SDK clients | `libs/business-listing-api/src/google/auth.ts` |
| Frontend | Axios singleton with JWT & deduplication | `libs/store-widget/src/utils/ApiService.ts` |

### 1.2 Rate Limiting

All integrations use a shared `RateLimiterFactory` backed by Redis (`rate-limiter-flexible` library).

**File:** `libs/utils/src/rate-limiter/rate-limiter-factory.ts`

**Pattern:** Every API call is wrapped with `rateLimiter.limitProcess(fn, key, points)`:
```typescript
const {processResult} = await rateLimiter.limitProcess(async () => {
    return apiClient.get(url);
});
```

**Per-platform limits:**

| Platform | Limiter | Limit |
|----------|---------|-------|
| GBP - Business Info Read | `businessInformationApiRateLimiter` | 300 QPM |
| GBP - Business Info Edit | `businessInformationApiEditRateLimiter` | 10 edits/min |
| GBP - Account Mgmt | `accountManagementApiRateLimiter` | 300 QPM |
| GBP - Deprecated v4 | `deprecatedV4ApiRateLimiter` | 3000 QPM |
| Google Ads - Read | `adsRead` | 10 QPS |
| Google Ads - Offline Job | `adsOfflineJob` | 2 QPS |
| GMC - All endpoints | Various | 100 QPM each |
| Meta - Platform | `platformRateLimiter` | 200 * users/hr |
| Meta - Pages BUC | `businessUseCasePagesRateLimiter` | 4800 * engaged_users/day |
| Meta - Ad Insights BUC | `businessUseCaseAdInsightsRateLimiter` | 600 + 400 * active_ads/hr |
| TikTok - App Basic | `app_level_basic` | 10 QPS |
| TikTok - Event Track | `event_track` | 1000 QPS |
| Apple ABC | `businessConnectApiRateLimiter` | 15 QPS |

### 1.3 Retry & Error Handling

**Retry with Backoff:** `libs/utils/src/promise/retry-with-backoff.ts`
- Linear and exponential backoff strategies
- Configurable max attempts, base delay, custom predicates

**Exception Hierarchy:** `libs/exceptions/src/`
- ~93 exception classes organized by domain
- Base: `VenuexException` with `ErrorGroup` enum
- Per-platform: `GoogleAdsException`, `MetaGraphApiBaseException`, `AbcApiException`, `TiktokConversionApiException`
- Each carries error codes, HTTP status, and platform trace IDs

### 1.4 Queue Infrastructure

**Bull Queues (Redis-backed):**
- Base consumer: `libs/queue/src/base.consumer.ts` — provides NewRelic/Winston logging, distributed tracing
- SQS consumer: `libs/queue/src/base-sqs.consumer.ts` — AWS SQS message processing
- SafeQueue: `libs/queue/src/safe-queue.ts` — type-safe wrapper with class-validator payload validation

**Consumer Applications:**
| App | Purpose |
|-----|---------|
| `consumer-pusher` | Push data to external platforms (GBP, Meta, Apple, GMC) |
| `consumer-batch` | Batch processing operations |
| `consumer-insight` | Fetch analytics/metrics from platforms |
| `consumer-transformer` | Data transformation jobs |
| `consumer-kicker` | Trigger downstream jobs |
| `consumer-delete` | Handle deletion operations |

**Payload Builders** (`libs/queue/src/types/builder/`):
- Fluent API: `builder.withRequestId().withUser().withBrand().withProvider().build()`
- All payloads carry `request_id`, `user`, `brand`, `provider`, `auth_providers`, `distributed_trace_headers`

**Transaction Tracking:**
- Every queue job creates a `Transaction` document in MongoDB before execution
- Updated to SUCCESS/FAILED on completion
- Provides audit trail and retry capability

### 1.5 Concurrency Utilities

| Utility | File | Purpose |
|---------|------|---------|
| `processWithLimit` | `libs/utils/src/promise/process-with-limit.ts` | Array mapping with p-limit concurrency |
| `processInChunks` | `libs/utils/src/promise/process-in-chunks.ts` | Batch processing with Promise.all/allSettled |
| `promiseAllSettledHandler` | `libs/utils/src/promise/promise-all-settled-handler.ts` | Filter fulfilled/rejected results |
| `retryWithBackoff` | `libs/utils/src/promise/retry-with-backoff.ts` | Retry with linear/exponential backoff |

### 1.6 Data Transformation

**TransformData DSL:** `libs/utils/src/transformer/transform-data.ts`
- Declarative mapping for nested object transformations
- L1 (direct), L2 (nested objects), L3 (recursive) mapping levels
- Safe property access via `es-toolkit` get/has

### 1.7 Auth Credential Storage

All platform credentials stored in MongoDB via `ProviderAuth` model with brand-level auth:
```
libs/database/src/mongoose/schemas/provider-auth/
├── auth-google-ads.schema.ts
├── auth-google-my-business.schema.ts
├── auth-google-merchant-center.schema.ts
├── meta-graph-api-credentials.schema.ts
├── tiktok-auth.schema.ts
├── tiktok-events-api.schema.ts
├── shopify-credentials.schema.ts
└── credentials/
    ├── auth-apple-business-connect-credentials.schema.ts
    └── auth-google-credentials.schema.ts
```

---

## 2. Google Business Profile (GBP)

### 2.1 API Client

**Library:** `libs/business-listing-api/`

**Auth Builder:** `libs/business-listing-api/src/google/auth.ts`
- `GoogleAuthBuilder` extending abstract `AuthBuilder<T>`
- Supports OAuth2, JWT, GoogleAuth service account
- Method chain: `.setCredentials()` → `.setDeveloperToken()` → `.build()` → `.instance()`
- Factory methods: `.businessProfilePerformance()`, `.accountManagement()`, `.businessInformation()`, `.verifications()`, `.notifications()`, `.placeActions()`, `.lodging()`

**Paginated API:** `libs/business-listing-api/src/google/paginated-api.ts`
- `BusinessProfilePaginatedApi.setup(authBuilder, redisClient)`
- Wraps all calls with rate limiters
- Pagination via `nextPageToken` while loops
- Methods: `getAccountList()`, `getLocationList()`, `getLocationAttributesByLocationCode()`

### 2.2 Auth/Token Management

**OAuth Strategy:** `libs/modules/src/modules/auth/social/google/google-gbp.strategy.ts`
- Passport-based, client ID: `GOOGLE_CLIENT_ID`
- Scopes: email, profile, `business.manage`
- Callback: `GOOGLE_OAUTH_GBP_CALLBACK`

**Stored Credentials:**
```typescript
{
    __type: SharedAuthTypeEnum,
    scope: string[],
    client_id: string,
    refresh_token: string,
    access_token: string,
    access_token_expires_at: Date
}
```

Token refresh is transparent via `google-auth-library` — access tokens auto-refresh from stored refresh tokens.

### 2.3 Data Transformation

**Batch Update Service:** `libs/business-listing-api/src/batch/gmb-location-batch-update-service.ts`
- Groups locations by GBP account ID via `groupByDestination()`
- Address normalization with postal code validation
- Amenities → GBP attributes via `convertAmenitiesAndSocialToGbpAttributes()`
- Concurrency-limited via `pLimit()`

### 2.4 Error Handling

**Exceptions:** `libs/exceptions/src/google-ads/` (shared Google error patterns)
- `GoogleAdsRequiredAuthException`, `GoogleAdsRefreshTokenInvalidException`, etc.

**Batch errors:** Google returns HTTP 200 with errors in body — service checks `response.data.entries` for nested errors.

### 2.5 Queue Processing

**Consumer:** `apps/consumer-pusher/src/consumers/google/google-business-profile.consumer.ts`
- Queue: `QUEUE_NAME_PUSHING`, Process: `ProviderEnum.google_my_business`
- Flow: Extract auth → `GmbLocationBatchUpdateService.pushToGoogle()` → enqueue retrieve job
- Events: `@OnQueueActive` (trace start), `@OnQueueCompleted` (SUCCESS), `@OnQueueFailed` (FAILED)

---

## 3. Google Ads

### 3.1 API Client

**Library:** `libs/google-ads-api/`

**Auth Builder:** `libs/google-ads-api/src/google/auth.ts`
- Same `GoogleAuthBuilder` pattern (OAuth2, JWT, GoogleAuth)
- `.googleAds()` returns v20 API instance
- Requires developer token: `.setDeveloperToken()`

**Paginated API:** `libs/google-ads-api/src/google/paginated-api.ts`
- `GoogleAdsPaginatedApi.setup(authBuilder, redisClient)`
- Methods: `listAccessibleCustomers()`, `googleAdsSearch()` (GAQL queries), `getAccountHierarchy()` (recursive)
- All reads wrapped with `GoogleAdsRateLimitHandler.adsReadLimiter.limitProcess()`

### 3.2 Auth/Token Management

**OAuth Strategy:** `libs/modules/src/modules/auth/social/google/google-ads.strategy.ts`
- Client ID: `GOOGLE_ADS_CLIENT_ID` (separate from GBP)
- Scopes: email, profile, `adwords`
- Callback: `GOOGLE_OAUTH_ADS_CALLBACK`

### 3.3 Error Handling

**Exceptions:** `libs/exceptions/src/google-ads/`
- `GoogleAdsException` (base, ErrorGroup.GOOGLE_ADS)
- Specific: `RequiredAuth`, `DevTokenRequired`, `CannotAddOperation`, `CannotRunJob`, `RefreshTokenInvalid`, `Unknown`

---

## 4. Google Merchant Center (GMC)

### 4.1 API Client

**Library:** `libs/content-api/`

**Auth Builder:** `libs/content-api/src/google/auth.ts`
- `GoogleAuthBuilder` (OAuth2 and GoogleAuth only, no JWT)
- Factory methods: `.content()` (legacy v2.1), `.accounts()`, `.dataSources()`, `.products()`, `.reports()`, `.reviews()`, `.quota()`

**Batch Processing Base:** `libs/content-api/src/google/batch/content-api-custom-batch-base.ts`
- `ContentApiCustomBatchBase` — handles batch response checking
- Google returns HTTP 200 with errors in body
- Error mapping: flattens `entry.errors.errors[]`, preserves batch IDs

**Subclasses:**
- `ContentProductsCustomBatch` (`libs/content-api/src/google/batch/product-batch.ts`)
- `ContentLocalInventoryCustomBatch` (`libs/content-api/src/google/batch/local-inventory-batch.ts`)

### 4.2 Auth/Token Management

**OAuth Strategy:** `libs/modules/src/modules/auth/social/google/google-gmc.strategy.ts`
- Client ID: `GOOGLE_CLIENT_ID` (shared with GBP)
- Scopes: email, profile, `content`
- Callback: `GOOGLE_OAUTH_GMC_CALLBACK`

### 4.3 Data Transformation

Product batch flow:
1. Internal `GoogleLocalProduct[]` → `instanceToPlain()` serialization
2. REST ID construction: `${channel}:${contentLanguage}:${feedLabel}:${offerId}`
3. Batch entry creation with operation type (insert/update/delete)
4. Submit to `content.products.custombatch()`
5. Response parsed with status mapping

### 4.4 Queue Processing

**Consumers:**
- `apps/consumer-pusher/src/consumers/google/google-product.consumer.ts` — Products
- `apps/consumer-pusher/src/consumers/google/google-local-inventory.consumer.ts` — Local inventory
- Both: extract auth → build `GoogleAuthBuilder` → execute batch → map success/failures to push statuses

---

## 5. Meta / Facebook

### 5.1 API Client

**Library:** `libs/meta-graph-api/`

**Client:** `libs/meta-graph-api/src/meta-graph-api.ts`
```typescript
static build(redisClient: Redis, metaAuth: MetaGrapApiAuth) {
    return new MetaGraphApi(redisClient, baseUrl, version, appId, appSecret);
}
```
- Axios-based with response interceptors
- Separate token setters: `setPageAccessToken()`, `setUserAccessToken()`
- Extensive field mask for location queries (`LOCATION_FIELDS`)

**Conversions API:** `libs/meta-conversions-api/src/meta-conversions-api.ts`

### 5.2 Auth/Token Management

**Token Types:**
1. **Short-lived → Long-lived User Token:** `getLongLivedUserAccessToken()` via `fb_exchange_token` grant
2. **Page Access Tokens:** Fetched from `{userId}/accounts` endpoint, filtered by permission (CREATE_CONTENT, MANAGE, MODERATE)

**Stored Credentials:**
```typescript
{
    user_id: string,
    user_access_token: string,           // Long-lived
    permitted_page_access_tokens: [{     // Per-page tokens
        page_id: string,
        access_token: string
    }]
}
```

**Rate Limit Header Parsing:** Meta returns JSON-stringified headers:
- `x-app-usage` → platform-level (CPU/time %)
- `x-ad-account-usage` → account utilization %
- `x-business-use-case-usage` → per-business, PAGES and ADS_INSIGHTS subtypes
- `x-fb-ads-insights-throttle` → proactive throttling at 80%

### 5.3 Data Transformation

**VenueX → Meta:**
- `convertVxAddressToMetaAddress()` — Address mapping
- `convertAmenitiesToPickupOptions()` — Amenities → `IN_STORE`/`CURBSIDE`
- `convertAmenitiesToPaymentMethods()` — Card types → VISA/MASTERCARD/etc
- Business hours → `MetaHours` with `temporary_status`

**File:** `libs/modules/src/modules/meta-graph-api/meta-graph-api-update-service.ts`

### 5.4 Error Handling

**Exceptions:** `libs/exceptions/src/meta-graph-api/`
- `MetaGraphApiFailedException`, `NoResponseException`, `NotEligibleException`, `RequiredAuthException`

**Error Detection:**
- `isNotEligibleError()` — subcodes 1721047/1721048 (location pages unavailable)
- `isPageCreateLimitError()` — subcodes 1721132/1721130 (creation limits)
- Captures `fbtrace_id` and `x-fb-trace-id` for debugging

### 5.5 Queue Processing

**Consumer:** `apps/consumer-pusher/src/consumers/meta/meta-graph-api-pages.consumer.ts`
- Two-stage concurrency: data prep (concurrency: 1) → API execution (concurrency: 10)
- Sequential first stage preserves store number auto-increment

**Insights (SQS):** `libs/modules/src/modules/insight/consumer/meta-page-insight-sqs.consumer.ts`
- Daily metrics from SQS
- Fetches last 10 days of insights
- Bulk stores 100k records per batch

---

## 6. TikTok

### 6.1 API Client

**Library:** `libs/tiktok-business-api/`

**Client:** `libs/tiktok-business-api/src/tiktok-business-api.ts`
```typescript
constructor(baseUrl: string, apiVersion: string, redisClient: Redis) {
    this.api_url = `${baseUrl}/open_api/${apiVersion}`;
    this.authorization_url = `${baseUrl}/portal/auth`;
    TiktokBusinessApiRateLimitHandler.initialize(redisClient);
}
```

**Methods:** `getTiktokUserInfo()`, `getTiktokCampaigns()`, `getTiktokAdGroups()`, `getIntegratedReport()`, `postConversionEvent()`

### 6.2 Auth/Token Management

**OAuth Strategy:** `libs/modules/src/modules/auth/social/tiktok/tiktok.strategy.ts`
- Passport OAuth2
- Required scope IDs: 10, 15, 200, 210, 220, 4, etc.
- Code → access token via `tiktokBusinessAuthService.generateAccessTokenURL()`

**Auth Service:** `libs/modules/src/modules/auth/tiktok-auth.service.ts`
- Generates authorization URL with `app_id` and `redirect_uri`
- Token exchange URL: `{baseUrl}/oauth/token/`

**Setup Status:** `libs/database/src/mongoose/schemas/setup-status/tiktok-setup.schema.ts`
```typescript
{
    is_business_enabled: boolean,
    business_setup?: { advertiser_id: string },
    is_events_enabled: boolean,
    events_setup?: { access_token, event_set_id, advertiser_id }
}
```

### 6.3 Data Transformation

**Conversion DTOs:** `libs/dto/src/tiktok/tiktok-conversion.dto.ts`
- `TiktokConversionDto` — envelope with `event_source`, `event_source_id`, `data[]` (max 1000)
- Supports web, offline, app, CRM event sources
- User data: hashed email/phone/external_id/IP/user_agent
- Properties: value, currency, contents[] with price/quantity/content_id

**Sales → TikTok Transformation:**
- Flat rows → simple Purchase events with user + value
- Grouped transactions → Purchase events with contents array (items with price, quantity, content_id, category, brand)

### 6.4 Error Handling

**Exceptions:** `libs/exceptions/src/tiktok-conversion-api/`
- `TiktokConversionApiFailedException`
- Catches `axios.isAxiosError`, wraps with domain exception
- Special handling for auth errors (code 40100) — consumes all rate limit points

### 6.5 Async Processing

**Scheduler-based (not queue-based):** `libs/modules/src/modules/conversion/scheduler/conversion.scheduler.ts`
- `@Cron(EVERY_HOUR)` — batch S3 upload for conversions
- `@Cron(EVERY_3_HOURS)` — check job status

**Processing flow:**
1. Group sales data into transactions by Order ID
2. Filter by date and conversion type
3. Map to `TiktokConversionDto` structure
4. Chunk into 1000-event batches
5. Process sequentially (CONCURRENCY_LIMIT = 1)
6. Track status in `OfflineConversionLog`

Success: `code: 0`, `message: "ok"`

---

## 7. Apple Business Connect

### 7.1 API Client

**Library:** `libs/apple-business-connect-api/`

**Auth Builder:** `libs/apple-business-connect-api/src/apple/auth.ts`
- Two modes: service account (`client_credentials`) or user access (`refresh_token`)
- Native `fetch` with automatic token refresh before each request
- HTTP methods: `getRequest()`, `postRequest()`, `putRequest()`, `deleteRequest()`

**Resources:** `libs/apple-business-connect-api/src/apple/resources/`
- `Resource$Brands`, `Resource$BrandAssets`, `Resource$Locations`, `Resource$LocationAssets`
- `Resource$Showcases`, `Resource$ShowcaseCreatives`, `Resource$Insights`, `Resource$Media`

**Paginated API:** `libs/apple-business-connect-api/src/apple/paginated-abc-api.ts`
- Cursor-based pagination via `pagination.cursors.after`
- `getAllPaginatedData()` recursively fetches all pages

### 7.2 Auth/Token Management

**Token Lifecycle:**
```typescript
private async ensureValidToken(): Promise<void> {
    if (this.isTokenExpired()) {
        if (this.useUserAccessToken && this.refreshToken) {
            await this.getUserAccessToken(this.refreshToken);  // refresh_token grant
        } else {
            await this.getServiceAccountAccessToken();          // client_credentials grant
        }
    }
}
```
- Service account tokens expire in 3600s (1 hour)
- Stored: `refresh_token`, `name`, `surname` in `AuthAppleBusinessConnectCredentialsSchema`

### 7.3 Data Transformation

**File:** `libs/modules/src/modules/apple-business-connect/apple-business-connect-api-platform-service.ts`

**VenueX → Apple:**
- Location details: name, address, phone, website, hours, categories, attributes
- Amenities → Apple attributes (bool facility conditions, payment methods)
- Special hours conversion (Google format → Apple format)
- Fallback to Apple's address if more complete

**Optimistic Concurrency:** Location updates require ETag header for conflict detection.

### 7.4 Error Handling

**Exceptions:** `libs/exceptions/src/apple-business-connect-api/`
- `AbcApiFailedException` (with status code), `AbcApiRequiredAuthException`, `AbcApiNoResponseException`
- Captures `apple-request-id` header for debugging

### 7.5 Queue Processing

**Consumer:** `apps/consumer-pusher/src/consumers/apple/apple-business-connect-api-locations.consumer.ts`
- Queue: `QUEUE_NAME_PUSHING`, Process: `ProviderEnum.apple_business_connect`
- Diff-based operations: CREATED → `create()`, UPDATED → `update()` with ETag, DELETED → `delete()`
- `Promise.allSettled` for partial failure handling
- Showcase concurrency: 3, location concurrency: configurable

---

## 8. Shopify (POS/ERP)

> Note: Square, Toast, and Clover are **not** integrated in this codebase. Shopify is the only POS/ERP connector.

### 8.1 API Client

**Library:** `libs/shopify-api/`

**Auth Builder:** `libs/shopify-api/src/auth.ts`
```typescript
ShopifyAuthBuilder.initializeShopifyContext({ apiKey, secretKey, hostName });

const shopifyApi = new ShopifyAuthBuilder()
    .setCredentials({ shop: "store.myshopify.com", accessToken: "token" })
    .registerShopifyWebhooks()
    .build()
    .instance();
```

**Resources** (`libs/shopify-api/src/api/resources/`):
- `Resource$Shop`, `Resource$Products`, `Resource$Locations`, `Resource$InventoryLevels`
- Base class handles cursor-based pagination via Link headers

### 8.2 Auth/Token Management

- Static access tokens stored in MongoDB (no automatic refresh)
- Scopes: `read_products`, `read_inventory`, `read_locations`
- Webhook registration for: `PRODUCTS_DELETE/CREATE/UPDATE`, `LOCATIONS_UPDATE/CREATE/DELETE`

### 8.3 Data Transformation

**File:** `libs/modules/src/modules/webhook/shopify/webhook.service.ts`

**Shopify → VenueX:**
- Locations: Shopify locations → VenueX Location + Address documents
- Products: vendor/title/body_html/images → Product documents
- Variants: price/SKU/barcode/inventory → ProductVariant documents
- Inventory: inventory_item_id as join key between variants and locations

### 8.4 Async Processing

**Webhook-driven** (not queue-based):
- Express handler validates Shopify HMAC signature
- Routes: `products/create`, `products/update`, `products/delete`
- Concurrent API calls via `p-limit` (default: 10)
- Inventory lookups joined via `Map<number, ShopifyJoinTableMapEntry>`

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                    apps/api (NestJS)                     │
│  OAuth Strategies  │  Provider Auth Service  │  Controllers│
└────────┬────────────────────┬─────────────────┬─────────┘
         │                    │                 │
         ▼                    ▼                 ▼
┌─────────────┐    ┌──────────────┐    ┌──────────────────┐
│ libs/modules │    │ libs/queue   │    │ libs/database    │
│  Services    │    │  Payloads    │    │  ProviderAuth    │
│  Schedulers  │    │  Builders    │    │  Credentials     │
└──────┬──────┘    └──────┬───────┘    └──────────────────┘
       │                  │
       ▼                  ▼
┌──────────────────────────────────────┐
│         Consumer Apps (Bull/SQS)      │
│  consumer-pusher  │  consumer-insight │
│  consumer-batch   │  consumer-*       │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│        Integration Libraries          │
│  libs/business-listing-api  (GBP)    │
│  libs/google-ads-api        (Ads)    │
│  libs/content-api           (GMC)    │
│  libs/meta-graph-api        (Meta)   │
│  libs/meta-conversions-api  (Meta)   │
│  libs/tiktok-business-api   (TikTok) │
│  libs/apple-business-connect-api     │
│  libs/shopify-api           (POS)    │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│        Shared Utilities               │
│  libs/utils/rate-limiter (Redis)     │
│  libs/utils/promise (retry, limit)   │
│  libs/utils/transformer (mapping)    │
│  libs/exceptions (domain errors)     │
└──────────────────────────────────────┘
```

### Common Patterns Across All Integrations

| Pattern | Implementation |
|---------|---------------|
| **Auth Builder** | `AuthBuilder<T>` base class → fluent `.setCredentials().build().instance()` |
| **Rate Limiting** | Redis-backed `RateLimiterFactory` wrapping every external call |
| **Pagination** | `PaginatedApi` class per platform with `while(nextPageToken)` loops |
| **Batch Operations** | Custom batch base classes handling Google's "200 with errors" pattern |
| **Queue Consumer** | `@Processor` + `@Process` decorators, transaction tracking, distributed tracing |
| **Token Storage** | MongoDB `ProviderAuth` model with per-brand, per-platform credentials |
| **Error Hierarchy** | `VenuexException` → Platform exception → Specific error (with trace IDs) |
| **Concurrency** | `processWithLimit()` (p-limit) for controlled parallel API calls |
| **Data Mapping** | Platform-specific transform functions (address, amenities, hours, payments) |
