# Xheton Demo — Developer Handbook (Beginner-Friendly)

Welcome! This handbook is a complete, tutorial-style guide to help a junior developer maintain and extend the Xheton demo system. We use simple language and examples, explain concepts step by step, and show you what files to touch and why. If you know basic JavaScript, you can learn everything you need here.

---

## 1. Introduction & System Overview

### What this system does
Xheton Demo is a modern web application built with Next.js that demonstrates a multi-module business platform: accounts, analytics, inventory, sales, projects, suppliers, and much more. It includes a frontend (React + Next.js), a backend API (Node.js/Express), and a database layer (PostgreSQL + SQL scripts). The goal is to provide a structured foundation for building real business features.

### Why it exists
- To showcase a scalable, modular architecture for a business platform.
- To provide a training-friendly codebase for junior developers.
- To demonstrate best practices for a Next.js + Node/Express + Postgres stack.

### Core features (examples)
- Modular app structure under `src/app/` for many domains (accounts, inventory, sales…).
- API endpoints under `src/app/api/` (Next.js Route Handlers) and an optional external Express server in `api/server.js`.
- Database schema scripts and seeds in `database/`.
- Centralized auth helpers in `src/lib/auth.js`.
- UI components in `src/components/` with shared, core, and ui subfolders.
- Global state stores in `src/stores/` for auth, theme, sidebar, POS.

### Target users
- Developers learning full‑stack development.
- Teams building business modules quickly.
- Stakeholders wanting a demo of domain coverage (finance, inventory, CRM…).

### High-level architecture
```
[ Browser ]
    |
    v
[ Next.js Frontend (src/app/*) ]
    |  (fetch via HTTP)
    v
[ API Layer ]
  - Next.js Route Handlers (src/app/api/*)
  - Optional Express API (api/server.js)
    |
    v
[ PostgreSQL Database ]
  - SQL schema & seeds (database/*)
```
- Frontend pages render UI and call APIs.
- APIs validate, handle business logic, and read/write the database.
- Shared libraries (`src/lib/*`) provide auth, DB, utilities.

---

## 2. Technology Breakdown

### Next.js (React framework)
- What: A React framework for building server-rendered and static web apps.
- Why: File-based routing, excellent dev experience, easy APIs, performance.
- When: Use for modern web apps with React, SSR/SSG needs.
- Problems solved: Routing, data fetching, build optimizations, deployment simplicity.
- How (internally) simplified: Next.js compiles your React pages, creates a server (or serverless handlers), and optimizes static assets. Route handlers in `src/app/api` run on the server side.
- Pairing: Works with `src/lib/db.js` for DB access, `src/lib/auth.js` for auth. Components in `src/components/*` build UI.

### React
- What: UI library for building component-based interfaces.
- Why: Declarative, reusable components, hooks for state and effects.
- When: For interactive web UIs.
- Problems solved: Manage UI complexity with components and state.
- How: React tracks state and re-renders components when state changes.
- Pairing: Used in all pages/components and with hooks in `src/hooks/`.

### Node.js + Express (optional API)
- What: JavaScript runtime (Node.js) with Express framework for HTTP APIs.
- Why: Simple, flexible, excellent ecosystem.
- When: For standalone API services or microservices.
- Problems solved: Routing, middleware, request handling.
- How: Express creates an HTTP server with route handlers.
- Pairing: Complements Next.js APIs for specialized backends. Located in `api/server.js`.

### PostgreSQL
- What: Open-source relational database.
- Why: Strong SQL features, reliability, ACID transactions.
- When: For structured data (accounts, inventory, users).
- Problems solved: Data persistence, complex queries, referential integrity.
- How: Data is stored in tables defined by SQL scripts, accessed via drivers/pools.
- Pairing: Database scripts in `database/`, accessed by `src/lib/db.js` and APIs.

### Neon (Hosted Postgres)
- What: Cloud-hosted Postgres provider.
- Why: Easy setup, serverless-friendly connections.
- When: For quick DB provisioning in cloud environments.
- Problems solved: Hosting, scaling, connection management.
- How: Provide a connection string; app connects via `PG*` env vars. `test-neon-connection.js` verifies connectivity.

### Tailwind CSS / PostCSS
- What: Utility-first CSS framework; PostCSS processes CSS.
- Why: Fast styling, consistent design tokens.
- When: For rapid UI development.
- Problems solved: CSS management, responsiveness.
- How: Tailwind compiles utilities into CSS via PostCSS.
- Pairing: Global styles in `src/app/globals.css`, tokens in `src/theme/tokens.js`.

### Zustand (stores)
- What: Lightweight state management library.
- Why: Simple global state across components.
- When: For app-wide state like auth, theme, sidebar.
- Problems solved: Avoid prop drilling, simple state containers.
- How: Create stores in `src/stores/*.js`, use hooks to read/update.
- Pairing: Used by components and pages to manage UI state.

### Environment Variables
- What: Values set outside code (e.g., in `.env`).
- Why: Keep secrets and environment-specific configs.
- When: For DB URLs, API keys, feature flags.
- Problems solved: Separate config from code, secure secrets.
- How: `process.env.*` in Node/Next; configure in `next.config.mjs` if needed.

---

## 3. Folder & File Structure (Very Detailed)

At the repository root:

- `components.json`: Configuration for components (often for UI tooling).
- `jsconfig.json`: JavaScript project config (path aliases, IntelliSense).
- `middleware.js`: Next.js middleware; runs on every request (auth/redirects).
- `next.config.mjs`: Next.js configuration (images, headers, env).
- `package.json`: Project dependencies and scripts.
- `postcss.config.mjs`: PostCSS/Tailwind config for processing CSS.
- `prompts.txt`: Misc notes or prompts used during development.
- `QUICK_REFERENCE.js`: Quick helper or documentation.
- `README.md`: Overview of the project.
- `SETUP_COMPLETE.js`: Script or flag indicating setup completion.
- `test-db-connection.js`: Node script to test DB connection.
- `test-neon-connection.js`: Node script to test Neon connection.
- `version.json`: Version tracking for releases.

Folders:
- `api/`
  - `package.json`: Dependencies for Express backend.
  - `server.js`: Express server (routes/middleware) — optional standalone API.

- `database/`
  - `config.js`: DB config (connection details, helpers).
  - `install.sql`: Initial setup script.
  - `schema_core.sql`: Core tables (users, roles, accounts, products...).
  - `schema_additional.sql`: Extra tables for extended features.
  - `schema_future_landing.sql`: Future landing or placeholder schemas.
  - `migrations/`: SQL or migration files to evolve schema.
  - `seeds/`: Seed data for testing/dev.
  - `README.md`: Database setup guide.

- `Documentation/`
  - Multiple guides and summaries for setup, releases, modules.
  - This handbook: `Developer_Handbook.md`.

- `public/`: Static assets (images, icons, etc.).
- `scripts/`: Helper scripts for automation.

- `src/`
  - `app/`: Next.js App Router pages and APIs
    - UI pages: `page.js`, `error.jsx`, `loading.jsx`, `not-found.jsx`, `layout.js`.
    - Domain modules: `accounts/`, `analytics/`, `inventory/`, etc. Each contains pages/components for that domain.
    - API routes: `src/app/api/*` contain server-side handlers.
  - `components/`: Reusable UI components
    - `DashboardLayout.jsx`: Main layout for dashboard screens.
    - `LandingPage.jsx`: Marketing/landing view for home.
    - `XhetonLogo.jsx`: Logo component.
    - `core/`, `shared/`, `ui/`: Categorized components.
  - `hooks/`
    - `use-mobile.js`: Hook for mobile detection/responsive behavior.
  - `lib/`
    - `auth.js`: Authentication helpers.
    - `constants.js`: Shared constants.
    - `db.js`: Database connection/query helpers.
    - `store.js`: Cross-cutting store utilities.
    - `subscription.js`: Subscription logic.
    - `utils.js`: General utilities.
    - `utils/`: Extra utility functions.
  - `stores/`
    - `authStore.js`: Global auth state.
    - `loadingStore.js`: Global loading state.
    - `posStore.js`: POS-related state.
    - `sidebarStore.js`: Sidebar open/close state.
    - `themeStore.js`: Theme toggles.
  - `theme/`
    - `tokens.js`: Design tokens (colors, spacing, typography).

### What belongs where & naming conventions
- Put feature-specific UI in `src/app/<feature>/`.
- Put cross-feature UI components in `src/components/shared/`.
- Put core building blocks (buttons, inputs) in `src/components/ui/`.
- Business logic helpers go in `src/lib/*`.
- Global state stores in `src/stores/*` named by domain (e.g., `authStore.js`).
- API endpoints under `src/app/api/<resource>/route.js` or nested structures.
- SQL lives in `database/*.sql`; migrations/seeds in their folders.

### Beginner-friendly diagram
```
root
├─ api/               # Optional Express API
├─ database/          # SQL schemas, config, seeds
├─ Documentation/     # Guides and docs
├─ public/            # Static assets
├─ src/
│  ├─ app/            # Next.js App Router (pages + api)
│  ├─ components/     # Reusable UI components
│  ├─ hooks/          # React hooks
│  ├─ lib/            # Auth, DB, utilities
│  ├─ stores/         # Zustand global stores
│  └─ theme/          # Design tokens/styles
└─ package.json       # Scripts & dependencies
```

---

## 4. Backend Documentation

There are two backend entry points:
1) Next.js Route Handlers in `src/app/api/*`.
2) Optional Express server in `api/server.js`.

### Routes & Endpoints (patterns)
- Next.js API routes live under `src/app/api/<route>/route.js`.
- Each route file exports HTTP methods: `GET`, `POST`, `PUT`, `DELETE`.
- Example path: `/api/users` corresponds to `src/app/api/users/route.js`.

If using Express:
- Routes defined via `app.get('/users', handler)`, etc., in `api/server.js`.

### Controllers
- In Next.js Route Handlers, the functions act like controllers.
- For Express, you may separate into controller modules (not shown here) or inline handlers in `server.js`.

### Middleware
- Next.js `middleware.js` at root runs for all requests (auth checks, redirects, headers).
- Express middleware in `api/server.js` with `app.use(...)`.

### Database schema
- Core tables defined in `database/schema_core.sql`.
- Additional tables in `schema_additional.sql`.
- Seeds populate initial data in `database/seeds/`.
- Use `database/install.sql` to bootstrap.

### Models
- This codebase uses a query-based approach via `src/lib/db.js` rather than ORMs.
- You’ll write SQL queries or use a driver (e.g., `pg`) to interact with tables.

### Validation
- Validate request bodies in route handlers (e.g., check required fields).
- Consider adding a schema validation tool (like Zod or Joi) to formalize.

### Business logic
- Lives inside route handlers or in `src/lib/*` helpers.
- Example: `src/lib/auth.js` includes login, token checks.

### Example: Next.js Route Handler
```js
// src/app/api/users/route.js
import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';

export async function GET() {
  try {
    const users = await db.query('SELECT id, email, name FROM users');
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // basic validation
    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    await db.query('INSERT INTO users(email, name) VALUES($1, $2)', [body.email, body.name]);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
```

### Why this structure
- Route handlers are colocated with the app, simple to reason about.
- Using `src/lib/db.js` centralizes database operations and connection handling.

### What could be improved
- Add schema validation (Zod/Joi).
- Implement a service layer to separate business logic from route handlers.
- Add error logging with structured logs.
- Use transactions for multi-step writes.

---

## 5. Frontend Documentation

### Pages
- Stored in `src/app/` using Next.js App Router.
- `src/app/page.js`: Root landing/dashboard.
- Each domain has its own folder, e.g., `src/app/accounts/`.
- Special pages: `error.jsx` (error boundary UI), `loading.jsx` (pending states), `not-found.jsx` (404), `layout.js` (shared layout).

### Components
- `src/components/` contains shared UI pieces.
- `DashboardLayout.jsx`: Wraps pages with sidebar, header, content area.
- `LandingPage.jsx`: Marketing-style entry page.
- `XhetonLogo.jsx`: Brand component.
- `core/`: Foundational components.
- `ui/`: Buttons, inputs, modals, dropdowns.
- `shared/`: Cross-module components.

### Layouts
- App-level layout in `src/app/layout.js` sets global providers, theme, and main structure.
- Module-level layouts can be added in subfolders for domain-specific UI.

### State management
- Zustand stores in `src/stores/*.js`.
- Example pattern:
```js
// src/stores/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null })
}));
```
- Use in components: `const { user, setUser } = useAuthStore();`

### Forms
- Use controlled components with React state.
- Post to APIs using `fetch`.
- Validate inputs before sending; show errors to users.

### Context/hooks
- Custom hooks in `src/hooks/` like `use-mobile.js` to detect viewport size or features.
- React context can be added for theming or auth, but Zustand covers global state.

### Data flow from backend to frontend
1. Component triggers `fetch('/api/...')`.
2. Route handler runs on server, reads/writes DB via `src/lib/db.js`.
3. Response returns JSON.
4. Component updates UI state with returned data.

### UI/UX decisions
- Use a dashboard layout for consistency.
- Tailwind utilities for fast styling.
- Design tokens in `src/theme/tokens.js` for consistent colors/spaces.
- Loading and error states handled via `loading.jsx` and `error.jsx`.

---

## 6. Step-by-Step “How This Module Works”

We’ll describe the general workflow of a typical feature, like “Users”.

### Workflow overview
```
User clicks "Users" page → Component loads → Fetch /api/users → Server queries DB → Return JSON → UI renders list
```

### How data enters
- User opens page; `useEffect` or server-side load triggers fetch.
- For create operations, user submits a form (`POST /api/users`).

### How it’s processed
- Backend validates request body.
- Business logic runs (e.g., check duplicates).
- DB query executes.

### How it’s saved
- Insert/update in Postgres.
- Return a success JSON response.

### How errors are handled
- Try/catch in route handlers.
- Return `4xx` for client issues, `5xx` for server failures.
- Frontend catches and shows error messages.

### How user interacts
- Views lists, clicks to view details, fills forms to add/edit.

### Sequence diagram (simplified)
```
Component → API (GET /api/users) → DB
   |             |→ runs query
   |← JSON users ←
UI renders table
```

### Example: Create user flow
1. User fills form (name, email).
2. Frontend `fetch('/api/users', { method: 'POST', body: JSON.stringify(form) })`).
3. API validates, inserts into `users` table.
4. Returns `{ ok: true }`.
5. UI shows success and refreshes list.

---

## 7. Concepts & Best Practices

### REST APIs
- Style of web services using HTTP methods: `GET`, `POST`, `PUT`, `DELETE`.
- Use clear resource paths: `/api/users`, `/api/products`.

### CRUD
- Create, Read, Update, Delete – basic DB operations.
- Map to HTTP: POST(create), GET(read), PUT/PATCH(update), DELETE(delete).

### async/await
- Handle asynchronous code cleanly.
- Always `await` `fetch`/DB calls inside `try/catch`.

### Authentication & Authorization
- Authentication: verify identity (login).
- Authorization: check permissions (can user access resource?).
- Store tokens securely; validate on each request.
- Helpers in `src/lib/auth.js` can centralize session handling.

### Error handling
- Backend: try/catch, return appropriate status codes.
- Frontend: display friendly messages; avoid crashing UIs.

### File uploads
- Use Next.js API route `POST` with `FormData`.
- Validate file size/type; store location (S3, etc.).

### Environment variables
- Use `.env.local` for dev secrets.
- Read via `process.env.NAME`; configure in `next.config.mjs` if needed.

### Optimization techniques
- Cache frequent reads.
- Use pagination for long lists.
- Debounce search inputs.
- Avoid unnecessary re-renders (memoize components).

---

## 8. Mistakes to Avoid

- Wrong folder placement: Keep API in `src/app/api`, not `src/lib`.
- API misuse: Don’t return HTML from JSON endpoints.
- Bad naming: Use clear names (`users`, not `x1`).
- Poor state management: Avoid duplicating state across components; use stores.
- Forgetting async/await: Always `await` DB/API calls to avoid race issues.
- Missing validation: Validate request bodies before DB writes.
- Hardcoding secrets: Use environment variables, not constants in code.

How to avoid:
- Follow this handbook’s structure.
- Add linters and validation libraries.
- Use descriptive names.

---

## 9. How to Extend or Modify This System

### Add a new module (e.g., "vendors")
1. Create folder: `src/app/vendors/`.
2. Add `page.jsx` to list vendors and a `new/` subfolder for a creation form.
3. Create API route: `src/app/api/vendors/route.js` with `GET`/`POST`.
4. Add DB table via `database/schema_additional.sql` or a new migration.
5. Implement UI components in `src/components/shared/` if reusable.
6. Add Zustand store if you need global state `src/stores/vendorsStore.js`.

### Change the UI
- Update `src/components/ui/*` for generic components.
- Update `src/components/DashboardLayout.jsx` for layout changes.
- Update theme tokens in `src/theme/tokens.js` for colors and spacing.

### Add a setting or feature
- Add a config option in `src/lib/constants.js`.
- Build UI in appropriate `src/app/<module>/settings/`.
- Add API endpoints under `src/app/api/settings/`.
- Persist setting in DB; add a column/table in `database/schema_additional.sql`.

Step-by-step example: Add “Account Status” field
1. DB: Add `status` column to `accounts` table (migration).
2. API: Update `src/app/api/accounts/route.js` to accept/read `status`.
3. Frontend: Update account form to include `status` dropdown.
4. Test: Create an account and verify `status` saved.

---

## 10. Rebuild Guide (From Scratch)

### 1) Setup project
```bash
# Clone the repo
git clone <your-repo-url>
cd xheton-demo

# Install dependencies
npm install
```

### 2) Environment variables
Create `.env.local` with your values:
```
DATABASE_URL=postgres://user:pass@host:port/db
NEON_DATABASE_URL=...
JWT_SECRET=supersecret
NEXT_PUBLIC_API_BASE=/api
```

### 3) Database
```bash
# Optionally use psql to run scripts
psql "$DATABASE_URL" -f database/install.sql
psql "$DATABASE_URL" -f database/schema_core.sql
psql "$DATABASE_URL" -f database/schema_additional.sql
# Add seeds as needed
```
Test DB connection:
```bash
node test-db-connection.js
node test-neon-connection.js
```

### 4) Run backend
- Next.js API routes are part of the app; just run the dev server:
```bash
npm run dev
```
- Optional Express API:
```bash
cd api
npm install
node server.js
```

### 5) Build frontend
```bash
npm run dev         # Development
npm run build       # Production build
npm start           # Serve production build
```

### 6) Connect everything
- Frontend calls `/api/*`.
- APIs use `src/lib/db.js` to query the database.
- Ensure env vars are set.

---

## 11. Final Notes

### Development tips
- Start small: build one API route and one page.
- Use Postman or curl to test endpoints.
- Log clearly on server; show friendly messages in UI.

### Coding style rules
- Use descriptive names and consistent casing.
- Keep components small and focused.
- Use stores for global state; props for local state.

### Security reminders
- Never commit secrets.
- Validate and sanitize all inputs.
- Use HTTPS in production.

### Performance notes
- Paginate lists; lazy-load heavy components.
- Cache common reads when safe.

### Future upgrade ideas
- Add schema validation (Zod/Joi).
- Introduce role-based authorization.
- Add testing: unit (Jest), integration (Playwright).
- Add ORM (Prisma/Drizzle) for typed models.

---

## Appendix: Quick Reference

- Frontend page lives in `src/app/<module>/page.jsx`.
- API lives in `src/app/api/<resource>/route.js`.
- Shared UI in `src/components/ui/*`.
- Global state in `src/stores/*`.
- DB scripts in `database/*.sql`.

This handbook is your starting point. As you explore the repo, keep this open, and update it as the system grows. Happy building!