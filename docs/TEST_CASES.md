# Test Cases

## Automated Tests (Backend)
- `[ ]` **Auth:** Successful registration, duplicate email rejection, successful login, incorrect password login, logout, protected route access with and without token.
- `[ ]` **Authorization:** Admin route access by user (should fail), Admin route access by admin (should succeed).
- `[ ]` **Listings:** Create listing with valid data, create listing with missing fields, edit listing (owner), edit listing (non-owner - should fail), delete listing.
- `[ ]` **Swap Workflow:**
  - Create valid swap request.
  - Attempt to swap own item (should fail).
  - Attempt to offer unowned item (should fail).
  - Attempt to offer unavailable item (should fail).
  - Accept request (both items become reserved).
  - Both-user confirmation (items become swapped).
- `[ ]` **Marketplace:** Search by keyword, filter by category/brand, pagination.

## Manual QA Journey
1. **Desktop/Mobile Responsiveness**: Test main marketplace grid, listing details, and chat interface on different screen sizes.
2. **Registration & Login**: Create test user, login, upload avatar.
3. **Item Creation**: Upload 3 clothing items with images. Verify points calculation.
4. **Swap Negotiation**:
   - User A requests User B's item offering their own.
   - User B receives notification, views request.
   - User B counteroffers.
   - User A accepts.
   - Both users open real-time chat and exchange messages.
5. **Completion**: Both users click "Confirm Completion", items are marked swapped, added to history.
6. **Admin Panel**: Login as Admin, view KPIs, block test user, verify test user cannot login, unblock test user.
