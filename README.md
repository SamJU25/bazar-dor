# বাজার দর / BazarDor

A daily essential commodity price tracking web application for Bangladesh built with Next.js App Router, Tailwind CSS, HeroUI, and BetterAuth. Users can browse live commodity prices across categories, track daily price risers and fallers, sort products by price, and inspect market-by-market price breakdowns after signing in.

## Key Features

1. **Navbar with Bangla Date and Live Price Ticker**
   Displays the current Bangla date (updating past midnight), category navigation with active-route highlighting, user session menu, and an accessible CSS-animated marquee ticker with pause/scroll controls and reduced-motion support.
2. **Home Page Price Overview**
   Highlights the top 5 daily price risers, top 5 price fallers, and a filterable/searchable responsive grid of essential items with reduced-motion-safe anchor scrolling.
3. **Category Filtering and Bengali Price Sorting**
   Dedicated category pages (`/category/[slug]`) with static param generation, loading skeletons, empty-state handling, and numeric sorting (`Default`, `Low to High`, `High to Low`).
4. **Protected Product Details and Market Breakdown**
   Authenticated `/product/[slug]` route showing today's price, historical comparison (yesterday, last week, last month), minimum/maximum/average summary, and a division-wise market table.
5. **Authentication, Rate Limiting, and Profile Management**
   Powered by BetterAuth with MongoDB: database-backed rate limits, email/password sign up and sign in, Google and Facebook OAuth, toast notifications on auth events and protected-route redirects, and a server-gated profile & update flow.
6. **Operational Readiness & Security**
   Security response headers (`X-Frame-Options`, `CSP`, `HSTS`), `/api/health` database readiness probe, `robots.txt`, dynamic `sitemap.xml`, web `manifest.webmanifest`, and resilient error/global-error boundaries.

## Technologies Used

- **Next.js (App Router):** Server/Client components, dynamic routes, ISR, and cookie proxy middleware
- **React & TypeScript:** Strict type-safe UI components and API projections
- **Tailwind CSS v4 & HeroUI (selective styles):** Responsive layout and accessible primitives
- **BetterAuth & MongoDB:** Session management, rate limiting, email/password auth, and Google/Facebook social login
- **Lucide React:** Icons
- **React Hot Toast:** Lazy-loaded auth and redirect notifications

## Getting Started Locally

1. Ensure Node.js `>=22.6.0`, then install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example` and set `MONGO_URI`, `BETTER_AUTH_SECRET` (>= 32 chars), `BETTER_AUTH_URL`, and OAuth credentials (production Vercel deployments should set `BETTER_AUTH_URL` scoped to **Production**):
   ```bash
   cp .env.example .env.local
   ```

3. Run checks, tests, or start development:
   ```bash
   npm run typecheck
   npm test
   npm run dev
   ```

4. Build and verify production locally:
   ```bash
   npm run build
   npm start
   ```
