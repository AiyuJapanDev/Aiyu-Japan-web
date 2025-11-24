import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ProductRequestButton from "@/components/ProductRequestButton";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./index.css";

const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AppProvider>
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
