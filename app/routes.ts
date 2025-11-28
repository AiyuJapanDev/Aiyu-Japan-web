import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
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
    route("popular-markets", "./routes/PopularMarketsSection.tsx"),
    route("restrictions", "./routes/RestrictionsSection.tsx"),
  ]),

  route("dashboard", "routes/Dashboard.tsx"),
  route("user-dashboard", "routes/UserDashboard.tsx"),
  route("admin-dashboard", "routes/AdminDashboard.tsx"),
  route("contact", "routes/Contact.tsx"),
  route("terms-of-service", "routes/TermsOfService.tsx"),
  route("privacy-policy", "routes/PrivacyPolicy.tsx"),
  /* Blog Routes */
  route("blog/:lang/page/:page", "routes/Blog.tsx", { id: "blog-paginated" }),
  route("blog/:lang/:articleSlug", "routes/ArticlePage.tsx"),
  route("blog/:lang", "routes/Blog.tsx", { id: "blog-index" }),
  /* News Routes */
  route("news/:lang/page/:page", "routes/News.tsx", { id: "news-paginated" }),
  route("news/:lang/:newsSlug", "routes/NewsPage.tsx"),
  route("news/:lang", "routes/News.tsx", { id: "news-index" }),
] satisfies RouteConfig;
