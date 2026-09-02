# Clothing Exchange & Swap Marketplace Implementation Plan

This project aims to build a production-ready clothing exchange and swap marketplace where users can trade clothing items, negotiate via real-time chat, and manage swaps. The platform will also feature an Admin panel.

## User Review Required

> [!IMPORTANT]
> The project has been outlined into 17 comprehensive phases. Please review the planned phases below. Once approved, I will immediately begin executing Phase 1 (Project Foundation) which includes setting up the monorepo, generating the documentation, and scaffolding the frontend and backend.

## Proposed Changes

We will create a clean monorepo structure with `client/`, `server/`, and `docs/` directories.

---

### Phase 1 — Project Foundation
- Create `docs/` and generate `IMPLEMENTATION_PLAN.md`, `PRD.md`, `DATABASE_SCHEMA.md`, `API_DOCUMENTATION.md`, `TEST_CASES.md`, `SECURITY.md`, `DEPLOYMENT.md`.
- Set up root `package.json` for monorepo scripts.
- Scaffold `server/` with Node.js, Express, MongoDB, Socket.io, JWT, and other dependencies.
- Scaffold `client/` with React, Vite, Tailwind CSS, React Router, Axios, React Hook Form, Zod, Lucide React, Recharts.
- Set up testing (Vitest, React Testing Library, Supertest).

### Phase 2 — UI and Routing
- Implement global sustainable-fashion design system using provided colors.
- Setup routing in `client`: `/auth`, `/marketplace`, `/items/:id`, `/list-item`, `/items/:id/edit`, `/swaps`, `/chat/:swapId`, `/dashboard`, `/admin`.
- Ensure mobile, tablet, desktop responsiveness.

### Phase 3 — Authentication
- Build Register, Login, Logout, and Profile Update endpoints.
- Set up JWT authentication via HTTP-only cookies and bcryptjs password hashing.
- Implement Authentication and Role Authorization middleware (guest, user, admin).

### Phase 4 — Database Models
- Define Mongoose schemas for `User`, `ClothingItem`, `SwapRequest`, `Conversation`, `Message`, `Notification`, and `Dispute`.

### Phase 5 — Clothing Listing System
- Implement CRUD APIs for listings.
- Image upload integration with Cloudinary (and local fallback).
- Add specific fields: condition, brand, size, category, location, and status.

### Phase 6 — Marketplace Core
- Implement Marketplace API with search, filtering (category, size, brand, condition, location, distance, swap points), and sorting.
- Client-side integration for marketplace browsing.

### Phase 7 — Swap Value Calculator
- Implement point logic: base value × brand multiplier × condition multiplier × age multiplier.
- Integrate "Fair Match" logic (within 20% difference).

### Phase 8 — Swap Workflow
- Implement backend state machine for Swap Requests (pending, accepted, rejected, cancelled, completed, disputed).
- Add validation rules: no self-swap, ensure items available, unique requests, confirm by both parties.

### Phase 9 — Real-Time Chat
- Setup Socket.io for messaging within a Swap context.
- Implement typing indicators, online state, unread counts, and auto-scroll.

### Phase 10 — Location Matching
- Implement distance calculation (Haversine formula).
- Filter items by distance (Same city, 10km, 25km, 50km).

### Phase 11 — User Dashboard
- Build UI for Profile, My Listings, Saved Items, Swap History, and Account Settings.

### Phase 12 — Admin Panel
- Create KPI Dashboard and real-data Charts (Recharts).
- Build tables and actions to manage users, listings, monitor swaps, and resolve disputes.

### Phase 13 — Notifications
- Add real-time and persistent notifications for swap updates, messages, and admin actions.

### Phase 14 — Security
- Implement CORS, Helmet, Rate Limiting, input validation (Zod), and robust error handling.

### Phase 15 — Seed Data
- Create a comprehensive seed script populating 1 admin, 6 users, 20+ listings, swaps, chats, and disputes.
- Include static credentials for easy login (`admin@rewear.test`, `user@rewear.test`).

### Phase 16 — Testing
- Write automated tests (unit and integration tests) for authentication, listings, swap flows, calculator, and UI components.
- Outline manual test cases.

### Phase 17 — Final QA
- End-to-end verification of all flows, responsive testing, and bug fixing.
- Ensure production build passes seamlessly.

## Verification Plan

### Automated Tests
- `npm run test` (Vitest/Supertest for backend, React Testing Library for frontend).

### Manual Verification
- Seed database and walk through the main user journey: Register -> Create Listing -> Browse -> Send Swap Request -> Accept -> Chat -> Complete Swap.
- Log in as admin to verify KPI charts and moderation actions.
