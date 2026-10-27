# 🛠️ LetsVisit: Comprehensive Development Guide

Welcome to the development guide for **LetsVisit**. This document is designed to walk you through *how* this platform was built from the ground up. Whether you are learning full-stack development, Next.js, or modern web architecture, this guide will serve as a complete reference to the concepts and decisions made during development.

---

## 1. The Foundation: Next.js App Router

The core architecture of LetsVisit is built on the **Next.js App Router** (Next.js 15+).

### Server Components vs. Client Components
By default, every component in Next.js is a **Server Component**. This means the component runs on the backend, fetches data directly from the database, and sends pure HTML to the browser. This is incredible for performance and SEO.
- **Example**: `src/app/page.tsx` (Homepage). It directly calls `prisma.place.findMany()` securely without exposing an API endpoint.

However, some components need interactivity (like buttons, state, or hooks like `useState`). These are marked as **Client Components** using the `'use client'` directive at the very top of the file.
- **Example**: `ExploreClient.tsx` manages search filters, toggles, and state. 

**Learning Tip**: Keep your Client Components as small as possible. Fetch data in the Server Component parent, and pass only the data needed down to the Client Component as props.

---

## 2. Database Design: Prisma & SQLite

We used **Prisma**, a modern Object-Relational Mapper (ORM), to interact with our SQLite database. SQLite is perfect for local development because it stores the entire database in a single file (`dev.db`).

### The Schema (`prisma/schema.prisma`)
Our database is deeply relational. We defined several models:
- **User**: Stores authentication details and roles (`ADMIN`, `TOURIST`, `PROPERTY_OWNER`).
- **Place**: Global tourist destinations.
- **Property**: Local homestays tied to an Owner (User).
- **Favorite**: A join table linking a User to either a Place or a Property.

### Seeding (`prisma/seed.ts`)
Instead of manually typing data into the database, we wrote a script (`seed.ts`) that runs a series of Prisma `create` commands. This allows us to instantly destroy and recreate the database with rich, globally iconic data (like the Taj Mahal or the Eiffel Tower) in seconds using `npm run seed`.

---

## 3. Authentication: NextAuth v5 (Auth.js)

Authentication is notoriously difficult, but we handled it using **Auth.js** (`src/lib/auth.ts`).

### The Credentials Provider
We allowed users to log in with an email and password. When a user submits the login form:
1. We search for the user in Prisma by email.
2. We use `bcryptjs` to securely compare the hashed password.
3. If it matches, we return the user object.

### The Power of Callbacks (JWT & Session)
By default, NextAuth only stores the user's name and email in the browser session. We needed to know the user's `id`, `role`, and `phone` to make authorization decisions (like allowing an Owner to add a property).
We utilized the `jwt` and `session` callbacks in `auth.ts` to manually inject the `id`, `role`, and `phone` into the secure token. We also handled the `trigger === 'update'` logic so that when a user updates their profile, the session token instantly reflects the new data without requiring a page reload!

---

## 4. Modern Data Fetching: Server Actions

Instead of building traditional REST APIs (like `/api/update-profile`) and using `fetch()` in the frontend, we used **Server Actions** (`src/actions/`).

Server Actions are asynchronous functions that run securely on the server but can be called directly from Client Components.
- **Example**: `src/actions/favorites.ts` contains `toggleFavorite()`. 
- In `PlaceDetailClient.tsx`, when the user clicks the "Save" button, it simply calls `await toggleFavorite(id)`. Next.js handles the complex network requests behind the scenes!

---

## 5. Handling Maps (React-Leaflet)

Implementing interactive maps in Next.js presents a unique challenge: **Hydration Errors**.
The `react-leaflet` library relies on the browser's `window` object to render. Because Next.js tries to render everything on the server first (where `window` does not exist), the app will crash.

**The Solution**: Dynamic Imports.
Whenever we needed a map (like `GlobalMapSection.tsx`), we imported it using Next.js `dynamic()` and explicitly disabled Server-Side Rendering (SSR):
```tsx
const ExploreMap = dynamic(() => import('@/components/maps/ExploreMap'), { ssr: false });
```
This forces Next.js to only load and render the map once the HTML has safely reached the user's browser.

---

## 6. Advanced Search & Filtering

The Explore Page (`/explore`) features a robust filtering system. 
When a user selects "France" from the Country filter:
1. The Client Component updates the React state.
2. A `fetch` request is sent to our custom API route (`/api/places/search?countries=France`).
3. The Backend API parses the URL parameters.
4. Prisma dynamically constructs a query using the `{ in: [...] }` operator to find any places located in those selected countries.
5. The UI updates instantly.

---

## 7. UI / UX: Glassmorphism & Aesthetics

To make the platform feel premium, we avoided generic UI libraries and relied heavily on custom CSS variables (`src/app/globals.css`).
- **Glassmorphism**: We created a class `.glass-card` that uses semi-transparent backgrounds with `backdrop-filter: blur(12px)`. This makes cards look like frosted glass layered over the background.
- **Gradients**: We defined complex linear gradients (`--gradient-primary`) to give buttons and text a dynamic, vibrant feel.
- **Typography**: We imported Google Fonts (`Outfit` for bold, modern headings and `Inter` for highly readable body text).

---

## Summary of Best Practices Learned

1. **Secure your routes**: Always check `session?.user` in Server Actions to prevent unauthorized database modifications.
2. **Handle Loading States**: Always provide visual feedback (like a loading spinner or skeleton UI) while fetching data, as seen in our Client Components.
3. **Graceful Error Handling**: Use `react-hot-toast` to notify users if a Server Action fails, rather than letting the app crash silently.
4. **Relational Integrity**: Use Prisma's relational queries to easily fetch deeply nested data (e.g., fetching a user's favorite places *and* the images associated with those places in one go).

Happy coding, and enjoy expanding LetsVisit!
