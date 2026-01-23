# Meta (Facebook) Pages API - Location States

Meta Pages API uses **boolean flags** and an **enum for verification status** to determine a Page's state.

## Key Status Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| **is_published** | boolean | Page is visible to non-admins |
| **is_unclaimed** | boolean | Auto-generated page, not yet claimed by business |
| **verification_status** | enum | Verification badge status |
| **has_transitioned_to_new_page_experience** | boolean | Migrated to New Pages Experience |

## Verification Status Enum

| Value | Description |
| :--- | :--- |
| **blue_verified** | Confirmed as authentic presence of public figure/celebrity/global brand |
| **gray_verified** | Confirmed as authentic presence of a business or organization |
| **not_verified** | Page has not been verified |

## Derived States for VenueX

| Priority | Condition | VenueX Status |
| :--- | :--- | :--- |
| 1 | `is_unclaimed = true` | `Unclaimed` |
| 2 | `is_published = false` | `Unpublished` |
| 3 | `verification_status = blue_verified` | `Live (Verified)` |
| 4 | `verification_status = gray_verified` | `Live (Verified)` |
| 5 | `verification_status = not_verified` AND `is_published = true` | `Live (Unverified)` |

## Notes

- Meta doesn't have complex lifecycle states like Apple (IN_REVIEW, REJECTED, etc.)
- Pages are either published/unpublished and verified/unverified
- No "pending review" or "suspended" states exposed via API
- Unclaimed pages are auto-generated from check-ins or user mentions

---

**Source:** [Meta Pages API Reference](https://developers.facebook.com/docs/pages-api/)
