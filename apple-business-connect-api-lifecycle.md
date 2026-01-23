# 1. Basic Lifecycle States

When a location is submitted, it falls into one of the following states:

### `INCOMPLETE`
* **Meaning:** Data was submitted but does not meet Apple's minimum requirements.
* **Reason:** Usually, mandatory fields are missing (incorrect Category ID, coordinates do not match the address, or invalid phone number format).
* **Action:** You must correct the validation errors and resubmit.

### `IN_REVIEW`
* **Meaning:** The data is technically valid and has entered the Apple operations team's queue.
* **Duration:** This stage can take anywhere from 24 hours to a week. Apple may perform manual checks or call the business to verify the address and authenticity.
* **Warning:** Sending updates during this stage may reset the process to the beginning.

### `VERIFIED` / `PUBLISHED`
* **Meaning:** The happy ending. The business is live and searchable on Apple Maps.
* **Note:** Even after being `Verified`, certain updates (e.g., Category changes) can trigger the `In Review` process again.

### `NOT_APPROVED` / `REJECTED`
* **Meaning:** Apple has refused to publish this record.
* **Reason:** Usually due to suspicion of being a "Duplicate" (record already exists), "Prohibited Category" (Weapons, Adult content, etc.), or a "Ghost Business" (no signage at the address).
* **The Harsh Reality:** The API rarely provides a detailed reason for rejection (often just citing "Policy Violation"). You may need to open a manual support ticket.

### `ISSUE` / `NEEDS_ATTENTION`
* **Meaning:** There is a data conflict. For example, the address you submitted does not match Apple's land/cadastral data, or a user has reported "this place is closed."
* **Action:** If you do not intervene, the location's visibility will drop, or it will be removed from publication.

### `PERMANENTLY_CLOSED`
* **Meaning:** It is confirmed that the business no longer operates at that address.
* **Critical:** If you set this accidentally, reversal is extremely difficult; you will likely need to start from scratch with a new `Place ID`.