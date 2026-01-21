# BigBox PKL - AI Coding Agent Instructions

## Project Overview
BigBox is a Next.js 16 AI & Big Data analytics platform written in TypeScript. It implements a custom session-based authentication system with a MySQL database via Prisma ORM.

**Stack**: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4 + Prisma 6.19.1 + MySQL

## Architecture

### Core Components
- **App Router Structure** (`app/`): Next.js 13+ App Router with layout-based hierarchy
  - Pages: `page.tsx` files are route endpoints
  - API Routes: `app/api/*/route.ts` handle HTTP endpoints
- **Authentication** (`lib/auth.ts`): Custom cookie-based session management with HMAC signing
  - Uses `bcryptjs` for password hashing (salt factor: 10)
  - Session TTL: 7 days, stored in `bb_session` cookie
  - Session format: `{userId}.{hmac_signature}`
- **Database** (`prisma/`): MySQL with Prisma client singleton pattern
  - User model: email (unique), password (hashed), fullName, timestamps
  - Global Prisma instance prevents connection pooling issues

### Request Flow
1. User fills form on client page (e.g., `/signup`, `/login`)
2. Form posts to `api/{signup,login}/route.ts` with FormData
3. API route validates, queries database via Prisma, creates session cookie
4. Redirect to home or error page with query params (e.g., `?error=1`)

## Key Conventions

### Authentication Pattern
- **Error Handling**: Use query params for errors (`?error=1`, `?error=exists`)
- **Session Reading**: Use `readSessionUserId()` in Server Components to check auth state
- **Redirects**: API routes redirect via `NextResponse.redirect()`, never return JSON errors to forms

### File Organization
```
lib/          → Shared utilities (auth, database)
components/   → Reusable React components
app/          → Pages and API routes (Next.js App Router)
app/api/      → Server-side endpoints
public/       → Static assets (icons, images)
prisma/       → Database schema and migrations
```

### Path Aliases
- Use `@/lib`, `@/components`, `@/app` (configured in `tsconfig.json`)
- Never use relative paths like `../../../lib/auth`

## Development Workflows

### Local Setup
```bash
pnpm install
pnpm prisma migrate dev  # Run pending migrations
pnpm dev                 # Start dev server (port 3000)
```

### Database Management
- Schema: `prisma/schema.prisma`
- Migrations: `prisma migrate dev --name <description>`
- Reset: `prisma migrate reset` (destructive)

### Build & Deployment
```bash
pnpm build   # Next.js build (runs TypeScript checks)
pnpm start   # Production server
pnpm lint    # ESLint check
```

## Critical Patterns

### Prisma Instance (Singleton Pattern)
```typescript
// lib/prisma.ts - Global instance to avoid connection pool exhaustion
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

### Session Creation
```typescript
// Always use createSessionCookie() for auth API routes
const response = NextResponse.redirect(new URL("/", request.url));
response.cookies.set(createSessionCookie(user.id));
return response;
```

### Password Handling
- **Hash**: `await hashPassword(password)` before storing
- **Verify**: `await verifyPassword(inputPassword, storedHash)`
- Never store plaintext passwords

### Error Responses in Auth APIs
Redirect with error codes, not JSON:
```typescript
// ❌ Wrong: return NextResponse.json({ error: "Invalid" })
// ✅ Right: return NextResponse.redirect(new URL("/login?error=1", request.url))
```

## UI Framework
- **Styling**: Tailwind CSS v4 with PostCSS
- **Font**: Poppins (loaded from Google Fonts in layout)
- **Language**: Indonesian (lang="id" in HTML)

## Environment Variables
- `DATABASE_URL`: MySQL connection string (Prisma)
- `AUTH_SECRET`: HMAC signing key for sessions (defaults to "change-me")
- `NODE_ENV`: Determines SSL/secure cookie behavior

## Common Gotchas
1. **Session Validation**: Check `await readSessionUserId()` returns non-null before accessing protected resources
2. **Email Normalization**: Always `.trim().toLowerCase()` on email input
3. **FormData Parsing**: Use `String(formData.get("field"))` to handle null values
4. **Redirect Logic**: POST API routes should always redirect, never render pages directly
