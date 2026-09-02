# Security Guidelines

## Authentication & Authorization
- Passwords must be hashed using `bcryptjs` with a salt round of 10 or higher.
- Authentication utilizes JSON Web Tokens (JWT) stored in **HTTP-only**, secure cookies to prevent XSS attacks.
- Role-based authorization middleware is implemented (`protect`, `admin`) to restrict API access.

## Data Validation & Sanitization
- All incoming requests must be validated using `Zod` schemas before reaching controllers.
- Mongoose schemas include strict typing and validation.
- MongoDB ObjectIDs must be validated to prevent CastErrors.

## Application Security
- **Helmet**: Set security HTTP headers.
- **CORS**: Configure Cross-Origin Resource Sharing properly to only allow trusted origins in production.
- **Rate Limiting**: `express-rate-limit` is used on all API routes, with stricter limits on `/api/auth` to prevent brute force attacks.

## Sensitive Data
- No passwords, tokens, or PII (Personally Identifiable Information) in API responses.
- Environment variables (`.env`) contain secrets (JWT_SECRET, DB_URI, Cloudinary keys) and must NOT be committed to Git. An `.env.example` file is provided.
