# API Documentation

## Auth Routes (`/api/auth`)
- `POST /register`: Register a new user
- `POST /login`: Login user and set JWT cookie
- `POST /logout`: Clear JWT cookie
- `GET /me`: Get current logged-in user details
- `PUT /profile`: Update profile
- `PUT /password`: Change password

## Items Routes (`/api/items`)
- `GET /`: Get marketplace items (with search, filter, sort, pagination)
- `GET /:id`: Get item by ID
- `POST /`: Create a new item listing (requires auth, max 5 images)
- `PUT /:id`: Edit a listing (owner only)
- `DELETE /:id`: Delete a listing (owner only)
- `GET /user/:userId`: Get all listings by a specific user

## Swaps Routes (`/api/swaps`)
- `GET /`: Get all active/completed swaps for the current user
- `POST /`: Send a swap request (requires `offeredItemId` and `requestedItemId`)
- `PUT /:id/accept`: Accept a swap request
- `PUT /:id/reject`: Reject a swap request
- `PUT /:id/cancel`: Cancel a pending request
- `PUT /:id/counter`: Make a counteroffer
- `PUT /:id/confirm`: Confirm completion of swap (requires both users)

## Chat/Messages Routes (`/api/conversations`)
- `GET /`: Get all conversations
- `GET /:id/messages`: Get messages for a specific conversation

## Admin Routes (`/api/admin`)
- `GET /stats`: Dashboard KPIs
- `GET /users`: List all users (with search and filters)
- `PUT /users/:id/block`: Block/Unblock user
- `GET /items`: List all items for moderation
- `DELETE /items/:id`: Admin remove listing
- `GET /swaps`: Monitor all swaps
- `GET /disputes`: List all disputes
- `PUT /disputes/:id/resolve`: Resolve dispute
