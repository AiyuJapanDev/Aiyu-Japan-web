# Implementation Guide: Migrating to React Router v7 (SSR/Hybrid) with CMS & i18n

## 1. Background & Architecture Overview

**Goal:** Migrate the current Single Page Application (SPA) built with React Router v6 to a Server-Side Rendered (SSR) or Hybrid architecture using **React Router v7**. The end state will include a fully integrated CMS (Strapi) for blog capabilities and Internationalization (i18n).

**Current State:**
- **Framework:** Vite + React
- **Routing:** `react-router` v6 (`BrowserRouter`, `Routes`, `Route`)
- **State:** `react-query`, Context API (`AuthProvider`, `AppProvider`)
- **UI:** Tailwind CSS, Shadcn UI
- **Rendering:** Client-Side Rendering (CSR)

**Target Architecture (RR7):**
- **Framework:** React Router v7 (formerly Remix features merged back)
- **Routing:** Framework-agnostic routing (File-based or Config-based). We will use **Config-based** initially for easier migration, then transition to File-based if desired.
- **Data Loading:** `loader` and `action` functions (runs on server/client depending on setup).
- **Rendering:** SSR for SEO-critical pages (Blog, Landing), CSR for Dashboard/Auth.
- **CMS:** Strapi (Headless CMS) for content management.
- **i18n:** `i18next` with URL-based routing (e.g., `/en/about`, `/ja/about`).

---

## 2. Milestones & Implementation Steps

### Milestone 1: Preparation & Dependency Updates
**Objective:** Prepare the environment for React Router v7.

1.  **Update Dependencies:**
    Remove `react-router` and install `react-router` v7.
    ```bash
    npm uninstall react-router
    npm install react-router@latest @react-router/node @react-router/fs-routes isbot
    npm install -D @react-router/dev
    ```

2.  **Update `vite.config.ts`:**
    Replace the standard React plugin with the React Router plugin.
    ```typescript
    // vite.config.ts
    import { reactRouter } from "@react-router/dev/vite";
    import { defineConfig } from "vite";
    import tsconfigPaths from "vite-tsconfig-paths";

    export default defineConfig({
      plugins: [reactRouter(), tsconfigPaths()],
    });
    ```

3.  **Move Entry Point:**
    Rename `src/main.tsx` to `app/entry.client.tsx` (RR7 convention uses an `app` directory).
    *Create `app/routes.ts` for route configuration.*

    **Verification:** Run `npm run dev`. The app should fail to start because the structure changed. This is expected.

### Milestone 2: Routing Migration (SPA Mode first)
**Objective:** Get the app running as a React Router v7 app, initially in SPA mode to ensure stability.

1.  **Create `app/root.tsx`:**
    This replaces `App.tsx` as the main layout.
    ```tsx
    // app/root.tsx
    import {
      Links,
      Meta,
      Outlet,
      Scripts,
      ScrollRestoration,
    } from "react-router";
    import "./app.css"; // Move index.css here

    export function Layout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body>
            {children}
            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      );
    }

    export default function App() {
      return <Outlet />;
    }
    ```

2.  **Migrate Routes:**
    Move your `Routes` from `src/App.tsx` to `app/routes.ts`.
    ```typescript
    // app/routes.ts
    import { type RouteConfig, index, route } from "@react-router/dev/routes";

    export default [
      index("routes/home.tsx"),
      route("about", "routes/about.tsx"),
      // ... map all your existing routes here
    ] satisfies RouteConfig;
    ```

3.  **Move Pages:**
    Move files from `src/pages` to `app/routes`.
    *   `src/pages/Home.tsx` -> `app/routes/home.tsx`
    *   `src/pages/Dashboard.tsx` -> `app/routes/dashboard.tsx`

    **Verification:** Run `npm run dev`. You should see your app rendering. Navigation should work.

### Milestone 3: Data Loading & SSR
**Objective:** Leverage RR7's data loading capabilities to replace `useEffect` fetching.

1.  **Implement Loaders:**
    In `app/routes/dashboard.tsx` (example):
    ```tsx
    import { useLoaderData } from "react-router";
    import type { Route } from "./+types/dashboard"; // Type generation

    export async function loader({ request }: Route.LoaderArgs) {
      // This runs on the server (if SSR) or client (if SPA)
      const data = await fetchDashboardData();
      return data;
    }

    export default function Dashboard() {
      const data = useLoaderData<typeof loader>();
      return <div>{data.title}</div>;
    }
    ```

2.  **Enable SSR:**
    Create `app/entry.server.tsx` to handle server-side rendering requests.
    (RR7 provides a default, but you can customize it for streaming).

    **Verification:** Disable JavaScript in your browser. The initial HTML should still render content (if SSR is working correctly).

### Milestone 4: CMS Integration (Strapi)
**Objective:** Connect a headless CMS for the blog.

1.  **Setup Strapi:**
    Deploy a Strapi instance (or run locally).
    Create a Collection Type: `Article` (Title, Content, Slug, Locale).

2.  **Create Blog Routes:**
    *   `app/routes/blog.tsx` (List of articles)
    *   `app/routes/blog.$slug.tsx` (Single article)

3.  **Fetch Data in Loaders:**
    ```tsx
    // app/routes/blog.$slug.tsx
    export async function loader({ params }: Route.LoaderArgs) {
      const { slug } = params;
      const article = await fetch(`STRAPI_URL/api/articles?filters[slug][$eq]=${slug}`);
      return article.json();
    }
    ```

    **Verification:** Create a post in Strapi. Navigate to `/blog/my-post`. It should render.

### Milestone 5: Internationalization (i18n)
**Objective:** Add multi-language support.

1.  **Install i18next:**
    `npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend`

2.  **URL Structure:**
    Wrap routes in a dynamic segment for locale: `app/routes/($lang)._index.tsx`.
    Or use a route prefix in `routes.ts`.

3.  **i18n Instance:**
    Initialize i18n in `entry.client.tsx` (for client) and `entry.server.tsx` (for server).

4.  **Usage:**
    ```tsx
    import { useTranslation } from "react-i18next";

    export default function Home() {
      const { t } = useTranslation();
      return <h1>{t('welcome')}</h1>;
    }
    ```

    **Verification:** Visit `/en/` and `/ja/`. Text should change.

---

## 3. Detailed File Structure (Target)

```
my-app/
├── app/
│   ├── components/     # Shared components
│   ├── routes/         # Route modules
│   │   ├── _index.tsx  # Home page
│   │   ├── blog.tsx    # Blog index
│   │   └── blog.$slug.tsx # Blog post
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── root.tsx        # Root layout
│   └── routes.ts       # Route config
├── public/
├── vite.config.ts
└── package.json
```

## 4. Best Practices & Advice

*   **Incremental Migration:** Don't try to rewrite everything at once. Use the "SPA Mode" of RR7 first to get the routing working, then opt-in to SSR page by page.
*   **Type Safety:** Use RR7's new `Route` type helpers for strict typing of loaders and actions.
*   **SEO:** Use the `meta` function in each route to define dynamic titles and descriptions based on loader data.
*   **Error Handling:** Export an `ErrorBoundary` component in your routes to handle 404s and 500s gracefully without crashing the whole app.
*   **State Management:** With `loader` and `action`, you need less global state (Redux/Zustand). Rely on URL state and server state.

## 5. Testing Strategy

*   **Unit Tests:** Test your `loader` and `action` functions in isolation. They are just pure functions!
*   **E2E Tests:** Use Playwright/Cypress to verify user flows (Login -> Dashboard).
*   **Visual Regression:** Check that the layout didn't break during the migration.

---
**Next Steps for Developer:**
1.  Create a new branch `feature/rr7-migration`.
2.  Follow Milestone 1.
3.  Report back on any dependency conflicts.
