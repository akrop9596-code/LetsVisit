# 🌍 LetsVisit

**LetsVisit** (formerly WanderLocal) is a modern, premium full-stack travel discovery and local stays platform. It allows users to explore iconic tourist destinations across the globe, discover hidden gems, and book local stays. 

With interactive maps, country-based filtering, and a comprehensive user authentication system, LetsVisit provides a stunning and dynamic user experience built on cutting-edge web technologies.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Language**: TypeScript
- **Database**: SQLite (via [Prisma ORM](https://www.prisma.io/))
- **Authentication**: [Auth.js](https://authjs.dev/) (NextAuth v5) with Credentials Provider
- **Mapping**: React Leaflet (`react-leaflet`) for interactive global and localized maps
- **Styling**: Vanilla CSS (with modern variables and glassmorphism) & Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

---

## ✨ Core Features

1. **Interactive Global Map**: A stunning homepage and explore map powered by Leaflet, plotting real-world coordinates of iconic landmarks (e.g., Eiffel Tower, Taj Mahal, Grand Canyon).
2. **Advanced Filtering System**: Discover places by specific categories (Monuments, Nature, Religious) or filter by **Country** with multi-select tags.
3. **User Authentication & Roles**:
   - Secure credential-based login with hashed passwords (`bcryptjs`).
   - Three distinct roles: `ADMIN`, `PROPERTY_OWNER`, and `TOURIST`.
4. **Interactive User Profiles**: Real-time profile editing (Name and Phone Number) seamlessly integrated with NextAuth session updates.
5. **Favorites System**: Users can save places and properties to their personal favorites dashboard, visually indicated by interactive heart icons.
6. **Property Listings**: Property owners can list and manage their local stays and homestays.

---

## 🛠️ Getting Started

Follow these steps to run the LetsVisit platform locally.

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Setup
Ensure you have a `.env` file in the root of your project. For local development with SQLite, you need:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-super-secret-auth-key-generate-one"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
```

### 4. Database Seeding
LetsVisit comes with a robust seeding script that populates the database with users, global tourist destinations, and sample properties.

Run the seed script to initialize your database:
```bash
npm run seed
```

**Default Credentials provided by the seed:**
- **Admin**: `admin@letsvisit.in` / `password123`
- **Owner**: `rajesh@example.com` / `password123`
- **Tourist**: `priya@example.com` / `password123`

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```text
├── prisma/
│   ├── schema.prisma       # Database schema (User, Place, Property, Favorite, etc.)
│   └── seed.ts             # Script to populate the DB with global places
├── src/
│   ├── actions/            # Next.js Server Actions (users, favorites, places, auth)
│   ├── app/                # Next.js App Router pages (Home, Explore, Profile, Place Details)
│   ├── components/         # Reusable React components (Cards, Maps, Layouts)
│   ├── lib/                # Utilities (Prisma client, Auth config, Geo distance calculation)
│   ├── store/              # Zustand global state stores
│   └── types/              # TypeScript type definitions
└── next.config.ts          # Next.js configuration (Remote image domains)
```

---

## 🤝 Contributing
When contributing to LetsVisit, please ensure all new server interactions use **Server Actions** (`use server`), and client-side interactivity is clearly delineated with `'use client'`. 

Maintain the premium aesthetic by adhering to the established CSS variables and glassmorphism styling found in `globals.css`.
