# Aiyu Japan

Web platform for purchase and shipping management from Japan to the world.

## 🛠️ Tech Stack

- **Framework**: React Router v7 + Vite
- **Runtime**: Bun
- **Backend**: Supabase (PostgreSQL + Auth)
- **CMS**: Strapi (for site content)
- **UI**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query (React Query)

## 📋 Prerequisites

Before starting the project, make sure you have:

- [Bun](https://bun.sh/) (ultra-fast JavaScript runtime)
- Access to Supabase database
- Strapi CMS running locally or on a server

## 🔧 Initial Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Strapi CMS (Required)
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_KEY=your_strapi_api_key_here
VITE_STRAPI_BASE_URL=http://localhost:1337
```

### 3. Start Strapi CMS

**This project requires Strapi to be running** to load site content (home pages, articles, categories, etc.).

Navigate to the CMS folder:

```bash
cd ../aiyu-japan-strapi-cms
npm run develop
```

Strapi will run on `http://localhost:1337`

## 🚀 Running the Project

### Development Mode

```bash
bun run dev
```

The project will open on `http://localhost:5173` (or next available port).

### Production Build

```bash
bun run build
```

### Start Production Server

```bash
bun run start
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Starts the development server |
| `bun run build` | Generates the production build |
| `bun run start` | Runs the production server |
| `bun run preview` | Preview the build |
| `bun run typecheck` | Verifies TypeScript types |
| `bun run lint` | Runs ESLint |
| `bun run test` | Runs tests with Vitest |

## 🗄️ Supabase Connection

The project connects to Supabase for:

- **User authentication** (signup, login, password recovery)
- **PostgreSQL database** with the following main tables:
  - `profiles`: User information
  - `product_requests`: Products requested by customers
  - `shipping_quotes`: Shipping quotes
  - `order_items`: Order items
  - `user_roles`: Roles and permissions

The Supabase client is initialized in:
```
app/integrations/supabase/client.ts
```

### Supabase Configuration

To connect your own Supabase instance:

1. Go to [supabase.com](https://supabase.com) and create a project
2. Get your URL and API Key (anon public)
3. Update `app/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "your-public-key-here";
```

4. Apply database migrations from the `supabase/migrations/` folder

## 🔗 Project Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│                 │      │                  │      │                 │
│  React Router   │─────▶│   Supabase DB    │      │   Strapi CMS    │
│   (Frontend)    │      │   (PostgreSQL)   │      │    (Content)    │
│                 │      │                  │      │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
         │                        │                         │
         │                        │                         │
         └───────── Authentication + Data ──────────────────┘
                   Articles + Static Pages
```

### Data Flow

1. **Frontend (React Router)**: User interface with SSR
2. **Supabase**: Handles authentication and transactional data (users, orders, products)
3. **Strapi**: Serves static content (blog articles, informational pages, images)

> ⚠️ **Important**: Without Strapi running, the site won't load content pages (Home, Blog, etc.)

## 🧪 Development

### Folder Structure

```
app/
├── components/       # Reusable components
│   ├── admin/       # Admin panel
│   ├── sections/    # Page sections
│   └── ui/          # UI components (shadcn)
├── contexts/        # Context providers (Auth, App)
├── hooks/           # Custom hooks
├── integrations/    # External integrations (Supabase, Strapi)
├── lib/             # Utilities and helpers
├── routes/          # Routes and pages
└── types/           # TypeScript types
```

## 🔐 Production Environment Variables

For production deployment, configure these variables:

```env
# Strapi
VITE_STRAPI_URL=https://your-strapi-production.com
VITE_STRAPI_API_KEY=your_api_key_production
VITE_STRAPI_BASE_URL=https://your-strapi-production.com

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_public_key
```

## 📝 License

Private project - Aiyu Japan © 2026