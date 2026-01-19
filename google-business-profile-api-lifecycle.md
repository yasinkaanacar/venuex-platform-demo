# Google Business Profile API - Location States

Google uses a **boolean flag system** instead of a single status enum. The `LocationState` object contains multiple flags that combine to determine the location's overall state.

## LocationState Flags

```json
{
  "isGoogleUpdated": boolean,
  "isDuplicate": boolean,
  "isSuspended": boolean,
  "canUpdate": boolean,
  "canDelete": boolean,
  "isVerified": boolean,
  "needsReverification": boolean,
  "isPendingReview": boolean,
  "isDisabled": boolean,
  "isPublished": boolean,
  "isDisconnected": boolean,
  "isLocalPostApiDisabled": boolean,
  "canModifyServiceList": boolean,
  "canHaveFoodMenus": boolean,
  "hasPendingEdits": boolean,
  "hasPendingVerification": boolean,
  "canOperateHealthData": boolean,
  "canOperateLodgingData": boolean
}
```

## Key Status Flags (for VenueX mapping)

| Flag | Description |
| :--- | :--- |
| **isVerified** | Location is verified by Google |
| **isPublished** | Location is live and visible on Google Maps |
| **isSuspended** | Location suspended, not visible to end users |
| **isDuplicate** | Location is a duplicate of another listing |
| **isPendingReview** | Review of the location is pending |
| **hasPendingVerification** | Location has pending verification requests |
| **needsReverification** | Location requires reverification |
| **isDisabled** | Location is disabled |
| **isDisconnected** | Location disconnected from Google Maps place |
| **hasPendingEdits** | Some properties are in "edit pending" state |
| **isGoogleUpdated** | Place ID has updates from Google |

## Verification State Enum (New API)

The newer Business Profile API also uses a `VerificationState` enum for locations:

| State | Description |
| :--- | :--- |
| **VERIFICATION_STATE_UNSPECIFIED** | Default, typically causes errors if used |
| **PENDING** | Verification initiated but not complete (under review) |
| **COMPLETED** / **VERIFICATION_STATE_VERIFIED** | Verification successful |
| **FAILED** | Verification process failed |
| **VERIFICATION_STATE_UNVERIFIED** | Location is unverified |
| **VERIFICATION_STATE_SUSPENDED_IN_GMB** | GMB listing no longer verified |

## Derived States for VenueX

Since Google uses boolean flags, the VenueX internal status should be derived by checking flags in priority order:

| Priority | Condition | VenueX Status |
| :--- | :--- | :--- |
| 1 | `isSuspended = true` | `Suspended` |
| 2 | `isDuplicate = true` | `Duplicate` |
| 3 | `isDisabled = true` | `Disabled` |
| 4 | `needsReverification = true` | `Action Required` |
| 5 | `hasPendingVerification = true` OR `isPendingReview = true` | `Pending` |
| 6 | `isVerified = true` AND `isPublished = true` | `Live` |
| 7 | `isVerified = true` AND `isPublished = false` | `Verified (Not Published)` |
| 8 | `isVerified = false` | `Unverified` |

---

**Source:** [Google My Business API Reference - LocationState](https://developers.google.com/my-business/reference/rest/v4/accounts.locations)
