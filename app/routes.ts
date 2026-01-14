import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("/:lang?", "routes/LocaleLayout.tsx", [
    index("routes/Home.tsx"),
    route("services", "routes/Services.tsx"),
    route("auth", "routes/Auth.tsx"),
    route("forgot-password", "routes/ForgotPassword.tsx"),
    route("auth/reset-password", "routes/ResetPassword.tsx"),
    route("email-verification", "routes/EmailVerification.tsx"),
    route("calculator", "routes/Calculator.tsx"),

    /* Store Guide Routes */
    route("store-guide", "./components/Layout/StoreGuideLayout.tsx", [
      route("what-is", "./routes/WhatIsSection.tsx"),
      route("how-it-works", "./routes/HowItWorksSection.tsx"),
      route("fees", "./routes/FeesSection.tsx"),
      route("commission", "./routes/CommissionSection.tsx"),
      route("popular-markets", "./routes/PopularMarketsSection.tsx", {
        id: "markets-index",
      }),
      route(
        "popular-markets/page/:page",
        "./routes/PopularMarketsSection.tsx",
        {
          id: "markets-paginated",
        }
      ),
      route("restrictions", "./routes/RestrictionsSection.tsx"),
    ]),

    route("dashboard", "routes/Dashboard.tsx"),
    route("user-dashboard", "routes/UserDashboard.tsx"),
    route("admin-dashboard", "routes/AdminDashboard.tsx"),
    route("contact", "routes/Contact.tsx"),
    route("terms-of-service", "routes/TermsOfService.tsx"),
    route("privacy-policy", "routes/PrivacyPolicy.tsx"),
    /* Blog Routes */
    route("blog", "routes/Blog.tsx", { id: "blog-index" }),
    route("blog/page/:page", "routes/Blog.tsx", { id: "blog-paginated" }),
    route("blog/:articleSlug", "routes/ArticlePage.tsx", {
      id: "blog-article",
    }),
    /* News Routes */
    route("news/", "routes/News.tsx", { id: "news-index" }),
    route("news/page/:page", "routes/News.tsx", { id: "news-paginated" }),
    route("news/:newsSlug", "routes/NewsPage.tsx", {
      id: "news-article",
    }),

    /* Orders */
    route("edit-order/:orderId", "routes/EditOrder.tsx"),

    /* Paraguay Delivery */
    route("paraguay-delivery/:loadId", "routes/ParaguayDeliveryPage.tsx"),
  ]),
] satisfies RouteConfig;
