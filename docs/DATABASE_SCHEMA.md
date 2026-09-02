# Database Schema

This document details the MongoDB/Mongoose collections.

## Collections

### User
| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name |
| email | String | Unique email |
| passwordHash | String | bcrypt hash |
| avatar | String | URL to Cloudinary image |
| phone | String | Phone number |
| bio | String | Short bio |
| city | String | City name |
| state | String | State |
| postalCode | String | ZIP/Postal code |
| location | Point (GeoJSON) | For Haversine queries |
| role | Enum | 'user', 'admin' |
| rating | Number | Average user rating |
| completedSwaps | Number | Count of completed swaps |
| isBlocked | Boolean | Admin block status |
| timestamps | Date | createdAt, updatedAt |

### ClothingItem
| Field | Type | Description |
|-------|------|-------------|
| owner | ObjectId | Ref to User |
| title | String | Listing title |
| description | String | Listing description |
| category | String | T-Shirt, Jeans, etc. |
| clothingType | String | Men, Women, Unisex, Kids |
| brand | String | Premium, Popular, Standard, Budget, Unknown |
| size | String | S, M, L, XL, etc. |
| color | String | Main color |
| condition | String | New with tags, Like new, Good, Fair |
| originalPrice | Number | Original purchase price (optional) |
| estimatedSwapPoints | Number | Calculated points |
| images | Array[String] | Max 5 Cloudinary URLs |
| tags | Array[String] | Search tags |
| city, state, postalCode, location | - | Copied from user or specific |
| deliveryOptions | Array[String] | Local meetup, courier |
| status | Enum | 'available', 'reserved', 'swapped' |
| isReported | Boolean | Report status |
| timestamps | Date | - |

### SwapRequest
| Field | Type | Description |
|-------|------|-------------|
| requester | ObjectId | Ref to User (sender) |
| receiver | ObjectId | Ref to User (owner of requestedItem) |
| requestedItem | ObjectId | Ref to ClothingItem |
| offeredItem | ObjectId | Ref to ClothingItem |
| counterOfferItem | ObjectId | Ref to ClothingItem |
| initialMessage | String | First message |
| status | Enum | 'pending', 'accepted', 'rejected', 'cancelled', 'completed', 'disputed' |
| deliveryMethod | String | agreed delivery method |
| meetingLocation | String | agreed location |
| requesterConfirmed | Boolean | End of swap confirmation |
| receiverConfirmed | Boolean | End of swap confirmation |
| timestamps | Date | - |

### Conversation & Message
**Conversation**:
- `swapRequest` (ObjectId)
- `participants` (Array[ObjectId])
- `lastMessage` (ObjectId)
- `lastMessageAt` (Date)

**Message**:
- `conversation` (ObjectId)
- `sender` (ObjectId)
- `text` (String)
- `messageType` (String)
- `readBy` (Array[ObjectId])
- `createdAt` (Date)

### Notification
| Field | Type | Description |
|-------|------|-------------|
| user | ObjectId | Recipient |
| type | String | new_swap_request, message, etc. |
| title | String | Notification title |
| message | String | Detail |
| relatedItem | ObjectId | Ref to ClothingItem |
| relatedSwap | ObjectId | Ref to SwapRequest |
| isRead | Boolean | Read status |
| createdAt | Date | - |

### Dispute
| Field | Type | Description |
|-------|------|-------------|
| swapRequest | ObjectId | Ref to SwapRequest |
| raisedBy | ObjectId | Ref to User |
| againstUser | ObjectId | Ref to User |
| reason | String | e.g. "Item not as described" |
| description | String | Details |
| evidenceImages | Array[String] | URLs |
| status | Enum | 'open', 'resolved' |
| adminNote | String | Resolution notes |
| resolvedBy | ObjectId | Ref to Admin User |
| resolvedAt | Date | - |
| createdAt | Date | - |
