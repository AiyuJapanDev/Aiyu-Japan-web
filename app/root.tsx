import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ProductRequestButton from "@/components/ProductRequestButton";
import HelpButton from "@/components/HelpButton";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useLocation,
} from "react-router";
import "./index.css";
import NotFound from "./routes/NotFound";
import { Route } from ".react-router/types/app/+types/root";
import { Language } from "./lib/i18n";
import ReactGA from "react-ga4";
import { useEffect, useRef } from "react";

const queryClient = new QueryClient();

export async function loader({ params }: Route.LoaderArgs) {
  const locale = params.lang || "es";

  return { locale };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        <Meta />
        <Links />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Aiyu Japan",
              url: "https://www.aiyujapan.com",
              logo: "https://www.aiyujapan.com/Logo.png",
              description:
                "Japanese proxy shopping service. We buy products from Japan and ship them to your country.",
              sameAs: [
                "https://www.instagram.com/aiyu.japan/",
                "https://www.facebook.com/profile.php?id=61566577742246",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "info@aiyujapan.com",
                contactType: "customer service",
                availableLanguage: ["Spanish", "English", "Japanese"],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Aiyu Japan",
              url: "https://www.aiyujapan.com",
            }),
          }}
        />
      </head>
      <body>
        {/* <div className='fixed z-99 w-[200px] h-[2px] bg-green-500 bottom-[100px] left-[25%]'></div> */}
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AppProvider language={locale as Language}>
              <AuthProvider>
                <Toaster />
                <Sonner />
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="grow">
                    {children}
                    <ScrollRestoration />
                    <Scripts />
                  </main>
                  <Footer />
                  <HelpButton />
                </div>
              </AuthProvider>
            </AppProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

export default function App() {
  const location = useLocation();
  const gaInitialized = useRef(false);

  // Inicializar GA4 una sola vez dentro del ciclo de vida de React
  useEffect(() => {
    if (!gaInitialized.current && typeof window !== 'undefined') {
      ReactGA.initialize(GA4_MEASUREMENT_ID, {
        gaOptions: {
          send_page_view: false, // Evitar pageview duplicado — lo enviamos manualmente abajo
        },
      });
      gaInitialized.current = true;
    }
  }, []);

  // Rastrear pageviews cuando cambia la ruta
  useEffect(() => {
    if (gaInitialized.current) {
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [location]);

  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />;
    }
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">{message}</h1>
      <p className="text-xl mb-4">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-gray-100 rounded text-left">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
