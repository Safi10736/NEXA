# Nexa Luxury Store - Security Specification

## Data Invariants
1. **Product Integrity**: Price and slug are immutable once a product is published to prevent price hijacking.
2. **Review Authenticity**: A review must be linked to a valid `userId` (the author) and `productId`. Users cannot edit someone else's review.
3. **Cart Isolation**: A user's cart is private. Only the owner can read or write to their specific cart document.
4. **PII Isolation**: Private PII in `/users/{userId}/private/info` is strictly restricted to the owner.
5. **Verified Identity**: Write operations for user-owned content (reviews, carts) require `email_verified == true`.

## The "Dirty Dozen" (Attack Payloads)
1. **Identity Spoofing**: Attempting to create a review with someone else's `userId`.
2. **Price Manipulation**: An unauthorized user attempting to update the `price` field of a product.
3. **Ghost Fields**: Attempting to add an `isAdmin: true` field to a user profile.
4. **ID Poisoning**: Attempting to use a 1MB string as a `productId`.
5. **Unauthorized Cart Reading**: User A attempting to read User B's cart.
6. **PII Leakage**: Attempting to read `/users/{userId}/private/info` as a non-owner.
7. **Unverified Write**: An authenticated user with an unverified email attempting to post a review.
8. **Shadow Review**: Creating a review for a non-existent `productId`.
9. **Role Escalation**: Attempting to modify the `isAdmin` state (if it were in the blueprint).
10. **State Corruption**: Updating a review's `date` to a future timestamp from the client.
11. **Orphaned Writes**: Writing to `/carts/{userId}` where `{userId}` doesn't match the auth UID.
12. **Resource Exhaustion**: Sending a 1MB string in the `comment` field of a review.

## Red Team Strategy
- All write operations MUST use `affectedKeys().hasOnly()` during updates.
- All `create` operations MUST be strictly validated against a schema helper.
- All `list` operations MUST evaluate `resource.data` to prevent scraping.
