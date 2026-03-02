# Feature Landscape: Settings & Sub-Page Redesigns

**Domain:** SaaS platform settings — multi-location brand management / omnichannel attribution
**Researched:** 2026-03-02
**Confidence:** HIGH (based on direct codebase analysis + domain expertise on platforms like Yext, Uberall, Birdeye, Semrush, HubSpot, Klaviyo, Mixpanel)

---

## Context: What "Settings" Means for VenueX

VenueX settings spans multiple pages, not just one. The milestone covers:

1. **Settings page** — 4 tabs today: Edit Business, Activity Feed, Store Sets, Data Source & Mapping
2. **Edit Location page** — individual location detail/edit
3. **Add Location page** — new location creation flow
4. **Import Locations page** — bulk CSV/SFTP import
5. **Profile page** — user account settings
6. **Onboarding/Setup page** — Kurulum (setup wizard)

The current `settings.tsx` is actually a "Notification Preferences" page. The OLD settings with the 4-tab structure (Edit Business, Activity Feed, Store Sets, Data Source & Mapping) described in PROJECT.md is the reference target for the redesign.

Research below covers what features each of these areas should contain based on what similar platforms (Yext, Uberall, Semrush Local, Birdeye, Klaviyo, HubSpot) include — and what VenueX specifically needs given its omnichannel / multi-location / ad platform focus.

---

## Table Stakes

Features users expect in any platform of this type. Missing = product feels incomplete or unprofessional.

### Settings Page (Brand / Account Level)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Brand name + logo upload | Every SaaS platform shows the brand's identity at the org level | Low | Currently in "Edit Business" tab |
| Primary business category | Required for platform sync accuracy (GBP, Apple, Meta need it) | Low | Dropdown from standard taxonomy |
| Business contact info (phone, email, website) | Needed for platform listings as fallback/master data | Low | Already in Edit Business |
| Business hours (default) | Default hours template that propagates to locations | Medium | Master template, location-level overrides |
| Connected platforms status panel | Users need to know which platforms are linked (Google, Meta, TikTok, Apple) | Medium | Reconnect / revoke tokens — this is high-value real estate |
| Activity feed / audit log | Who changed what, when — critical for multi-user accounts | Low-Med | Already in Activity Feed tab. Filter by user, module, date |
| Store Sets management (CRUD) | Grouping stores for bulk operations — non-negotiable for 20+ location brands | Medium | Already in Store Sets tab |
| Data Source & Mapping config | SFTP credentials, field mapping for offline conversions — core to VenueX's value | High | Already in Data Source & Mapping tab |
| Notification preferences | In-app alert rules per module (platform, reviews, locations, catalog, conversions) | Medium | Already built in current settings.tsx |
| Language / locale setting | EN/TR toggle is already live — it needs to be surfaced in settings | Low | Just a UI preference control |

### Profile Page (User Level)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Display name edit | Standard in every SaaS | Low | |
| Email address display (read-only until verified) | Users need to see the login email | Low | |
| Role / permission level display | Tells user what they can/cannot do | Low | Read-only for non-admins |
| Password change form | Standard auth feature | Low | Currently missing entirely per CONCERNS.md |
| Language preference toggle | EN/TR — user-level, not org-level | Low | |
| Avatar / initials display | Visual identity in sidebar/header | Low | |

### Edit Location Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Store code (read-only identifier) | Immutable anchor — must always show | Low | |
| Business name field | Core listing data | Low | |
| Address fields (structured) | Street, district, city, postal, country | Low | Turkey address format |
| Phone number | Per-location contact | Low | |
| Website URL | Per-location link (can differ from brand) | Low | |
| Business hours (weekly schedule) | Including special hours / holiday overrides | Medium | Day-by-day toggle + time picker |
| Categories (primary + secondary) | GBP / Apple / Meta all need business category | Medium | Multi-select with taxonomy |
| Location description | Free text field (160 chars max for GBP compat) | Low | Character counter |
| Platform sync status panel | Shows which platforms this location is live on and last sync time | Medium | Inline mini-status badges |
| Save & Sync button | Persist AND push to platforms — matches existing `saveAndSync` translation key | Low | CTA pattern already in i18n |

### Add Location Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Same fields as Edit Location | Creating requires all the same data | Low | Reuse form components |
| Store code generator / input | Enforce consistent naming on creation | Low | Auto-suggest from name pattern |
| Platform selection (where to publish) | Choose which platforms to push the new location to | Medium | Checkbox list: GBP, Apple, Meta |
| Validation before save | Required fields highlighted, format checks | Low | |
| Success state with next steps | What happens after adding — guides user | Low | Toast + redirect |

### Import Locations Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| CSV template download | Users need to know the expected format | Low | |
| Drag-and-drop file upload | Standard UX for bulk imports | Low | |
| Column mapping step | Map CSV columns to VenueX fields | Medium | Required when header names differ |
| Pre-import validation / preview | Show errors before committing — critical to prevent data corruption | High | Row-by-row error list |
| Import history log | What was imported, when, by whom, result | Medium | Links to Activity Feed |
| Duplicate detection | Alert when store codes or addresses already exist | Medium | Conflict resolution UI |

### Onboarding / Setup Page

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Step-by-step progress tracker | Multi-step onboarding is standard — users need to know where they are | Low | Already partially built in onboarding-unified.tsx |
| Brand info step | Company name, industry, locations count | Low | |
| Platform connection step | OAuth flows for Google, Meta, TikTok, Apple | High | Currently stubbed |
| Data source step | SFTP config, CSV upload, field mapping | High | Matches Data Source & Mapping tab |
| Completion summary | What's done, what's still optional, CTA to dashboard | Low | |
| Resumable state | User can close and come back — progress saved | Medium | |

---

## Differentiators

Features that go beyond table stakes and distinguish great settings UX from mediocre ones.

### Settings Page

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Brand completion score / progress bar | Yext's "Knowledge Score" equivalent — shows % of data fields populated. Currently noted as 63% tracker in sidebar. Makes brand completeness actionable. | Medium | Visual progress bar with per-field breakdown in sidebar |
| Platform health panel with reconnect CTAs | Don't just show status — show what's broken and a one-click fix. Uberall does this well. | Medium | Each platform: last sync time, error if any, Reconnect button inline |
| Store Set visual hierarchy | Show store count per set, ability to preview members inline without navigating away | Medium | Expandable row pattern |
| Data source connection wizard inside settings | Inline mini-wizard (not separate page) to configure a new SFTP/API source with live field validation | High | |
| Audit log with diff view | Not just "John changed location name" but "John changed location name from 'Koçtaş Kadıköy' to 'Koçtaş Kadıköy Bağdat'" | High | Backend dependent — prototype shows the UI shape |
| Notification digest preview | Show a sample of what the daily/weekly email digest will look like | Medium | Static preview card |

### Edit Location Page

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Cross-platform diff view | Show which fields differ across platforms (GBP says X, Apple says Y) — highlight mismatches inline | High | This is VenueX's core differentiation vs manual management |
| Completeness score per location | % of recommended fields filled. Lower score = lower likelihood of ranking | Medium | Progress ring or bar at top of edit form |
| Change history (per field) | See what changed on this location over time, who changed it | Medium | Expandable history drawer |
| Bulk apply to similar locations | "Apply these hours to all Istanbul stores" — saves massive time for chains | High | |

### Add Location Page

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Address autocomplete | Google Maps or similar — prevents typos in addresses | Medium | |
| Duplicate detection before create | "This address already exists as Koçtaş Kadıköy" — prevent duplicates before they happen | Medium | Real-time check on address/name input |

### Import Locations Page

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Smart column auto-mapping | Detect common column names automatically (e.g., "Store Name" → name, "Zip" → postal_code) | Medium | Saves manual mapping step |
| Partial import with skipped rows report | Import 95 of 100 rows, show exactly which 5 failed and why | Medium | Downloadable error report |

### Onboarding

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Setup guide visible from Settings | After onboarding, the setup checklist stays accessible in Settings as a "Getting Started" panel until 100% complete. Klaviyo does this. | Low | Makes it non-disposable |
| Estimated time per step | "~5 minutes" per step label reduces abandonment | Low | |

### Profile Page

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Session list (where you're logged in) | Show active sessions with device/browser info + revoke option | High | Security feature — Notion/GitHub pattern |
| API key management | For enterprise users who want programmatic access | High | Out of scope for now, flag as future |

---

## Anti-Features

Features to deliberately NOT build in this milestone.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Multi-user / team management in Settings | Inviting team members, role assignment, permission matrices — this is a full module, not a settings tab. Common mistake is cramming it into settings. | Stub an empty "Team" tab labeled "Coming Soon" with planned fields visible but locked |
| Billing / plan management | Separate module entirely — payment flows, invoices, upgrade/downgrade require dedicated product thinking | If shown, show read-only "Current Plan: Enterprise" card with "Contact Sales" CTA — never build the full billing UI in a prototype |
| Custom domain / white-label settings | Not relevant for VenueX's current scope (B2B, managed-brand product) | Skip entirely |
| Advanced security settings (SSO/SAML/2FA) | Enterprise feature that requires auth infrastructure — not a prototype concern | Show a "Security" section as read-only stub with "Contact your admin" note |
| Webhook builder / API integrations hub | Too broad — this is a developer portal, not a settings page | Data Source & Mapping tab covers the VenueX-specific integration needs |
| Dark mode toggle | Light mode only per CLAUDE.md — explicitly out of scope | Do not add |
| Granular per-user notification overrides | The notification preferences page handles per-category settings. Per-event AND per-user matrix is over-engineered for this stage. | Keep the existing per-category toggle system |
| CSV export of settings / configuration | Low-value admin feature that creates complexity | Skip |

---

## Feature Dependencies

```
Brand completeness score → all Settings tabs (needs data from all modules)
Platform health panel → Connected platforms (needs OAuth status)
Store Sets → Edit Location (Sets reference location IDs)
Import Locations → Duplicate detection → Location data (needs existing location list)
Onboarding steps → Platform connections (OAuth step depends on connection infrastructure)
Data Source & Mapping → Offline Conversions module (field mapping feeds conversion pipeline)
Edit Location: Cross-platform diff → Platform sync status per location
Add Location: Address autocomplete → External geocoding service (optional in prototype)
```

**Critical path for Settings redesign:**
```
1. Edit Business form (brand info) — standalone, no deps
2. Activity Feed — standalone, uses audit log data
3. Store Sets CRUD — depends on location list
4. Data Source & Mapping — depends on platform connection status
5. Notification Preferences — standalone (already done, needs design update)
```

---

## MVP Recommendation

For the redesign milestone specifically (not new feature development):

**Prioritize visual consistency over new feature addition.** The goal is redesign, not feature expansion.

**Must have in redesign:**
1. Edit Business tab — brand info form in vx-card hierarchy
2. Activity Feed tab — log list in vx-card hierarchy, filter controls
3. Store Sets tab — CRUD list with vx-card hierarchy
4. Data Source & Mapping tab — connection cards in vx-card hierarchy
5. Notification Preferences — update existing layout to match vx-card system
6. Edit Location page — full form with platform sync status panel
7. Add Location page — same form as Edit, stripped of existing-data fields
8. Import Locations page — upload + mapping + validation preview
9. Profile page — user info + notification preferences link
10. Onboarding — step progress + resumable state + completion summary

**New feature additions that are LOW EFFORT, HIGH VALUE, and fit inside redesign scope:**
- Brand completion score (sidebar tracker — already referenced in PROJECT.md at 63%)
- Platform health panel with inline Reconnect buttons (in Data Source & Mapping tab)
- Store code shown prominently in Edit Location header (currently buried)

**Defer to next milestone:**
- Cross-platform diff view in Edit Location (requires data infra)
- Audit log diff view (requires richer audit log data structure)
- Bulk apply hours to multiple locations (requires multi-select flow)
- Duplicate detection on import (requires comparison query against location list)
- Session management in Profile
- Team management

---

## Scope Notes for VenueX Specifically

1. **Settings ≠ one page.** In the codebase, `settings.tsx` currently only renders notification preferences. The 4-tab structure (Edit Business, Activity Feed, Store Sets, Data Source & Mapping) described in PROJECT.md is the reference. The redesign needs to reconcile these into a coherent Settings architecture — likely a tabbed layout where Notification Preferences becomes a 5th tab.

2. **The "Edit Location" page is the most data-rich page in this milestone.** It sits at the intersection of location data, platform sync, completeness scoring, and business hours. Allocate more design/implementation time here than any other sub-page.

3. **Import Locations is the most complex flow.** Validation + column mapping + conflict detection + history is 4 distinct interaction patterns in one flow. The prototype needs to show all 4 states even if the logic is mocked.

4. **Onboarding must be resumable.** The current `onboarding-unified.tsx` has a step reducer pattern — good foundation. The redesign should persist step state in mock data so refreshing doesn't lose progress.

5. **Turkish market data for forms.** Address fields, phone format (+90), postal codes (5 digits), and city names should use Turkish conventions. The codebase already does this in other mock data — maintain the same standard.

---

## Sources

- Direct codebase analysis: `settings.tsx`, `onboarding-unified.tsx`, `setup3.tsx`, `en.json`, mock data files
- Domain expertise: Yext Knowledge Graph (completeness scoring, platform sync), Uberall (location management), Birdeye (review + settings UX), HubSpot (audit log + account settings), Klaviyo (notification preference UI), Semrush Local (import flows)
- Project context: `.planning/PROJECT.md`, `CLAUDE.md`, `.planning/codebase/INTEGRATIONS.md`, `.planning/codebase/CONCERNS.md`
- Confidence: HIGH — analysis grounded in existing codebase + well-established SaaS patterns. No web search required; patterns are stable and well-understood across the domain.
