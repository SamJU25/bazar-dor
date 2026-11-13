# বাজার দর / BazarDor

A daily essential commodity price tracking web application for Bangladesh built with Next.js App Router, Tailwind CSS, HeroUI, and BetterAuth. Users can browse live commodity prices across categories, track daily price risers and fallers, sort products by price, and inspect market-by-market price breakdowns after signing in.

## Key Features

1. **Navbar with Bangla Date and Live Price Ticker**
   Displays the current Bangla date, category navigation with active-route highlighting, user session menu, and an infinite scrolling marquee ticker showing live price changes.
2. **Home Page Price Overview**
   Highlights the top 6 daily price risers, top 6 price fallers, and a responsive grid of all essential items with smooth anchor scrolling from the hero CTA.
3. **Category Filtering and Bengali Price Sorting**
   Dedicated category pages (`/category/[slug]`) with loading skeletons, empty-state handling, and numeric sorting (`Default`, `Low to High`, `High to Low`).
4. **Protected Product Details and Market Breakdown**
   Authenticated `/product/[slug]` route showing today's price, historical comparison (yesterday, last week, last month), minimum/maximum/average summary, and a division-wise market table.
5. **Authentication and Profile Management**
   Powered by BetterAuth with MongoDB: email/password sign up and sign in, Google and Facebook OAuth, toast notifications on auth events and protected-route redirects, and a profile update page to edit user information.
6. **Responsive Layout and Error Handling**
   Adapts cleanly across mobile, tablet, and desktop screens, with segment loading skeletons, an error boundary, and a custom 404 page.

## Technologies Used

- **Next.js (App Router):** Server/Client components, dynamic routes, and request proxy middleware
- **React & TypeScript:** Type-safe UI components and API models
- **Tailwind CSS v4 & HeroUI:** Responsive layout and UI primitives
- **BetterAuth & MongoDB:** Session management, email/password auth, and Google/Facebook social login
- **Lucide React:** Icons
- **React Hot Toast:** Auth and redirect notifications
- **React Fast Marquee:** Live price ticker strip

## Getting Started Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example` and add your MongoDB URI, BetterAuth secret/URL, and OAuth credentials:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```
