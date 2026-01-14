import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ProductRequestButton from "@/components/ProductRequestButton";
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
} from "react-router";
import "./index.css";
import NotFound from "./routes/NotFound";
import { Route } from ".react-router/types/app/+types/root";
import { Language } from "./lib/i18n";

const queryClient = new QueryClient();

export async function loader({ params }: Route.LoaderArgs) {
  const locale = params.lang;

  if (!locale) {
    throw data("Language not supported", { status: 404 });
  }

  return { locale };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
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
                  <ProductRequestButton />
                </div>
              </AuthProvider>
            </AppProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default function App() {
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
