import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("services", "routes/Services.tsx"),
  route("auth", "routes/Auth.tsx"),
  route("forgot-password", "routes/ForgotPassword.tsx"),
  route("auth/reset-password", "routes/ResetPassword.tsx"),
  route("email-verification", "routes/EmailVerification.tsx"),
  route("calculator", "routes/Calculator.tsx"),
  route("store-guide", "routes/StoreGuide.tsx"),
  route("dashboard", "routes/Dashboard.tsx"),
  route("user-dashboard", "routes/UserDashboard.tsx"),
  route("admin-dashboard", "routes/AdminDashboard.tsx"),
  route("contact", "routes/Contact.tsx"),
  route("terms-of-service", "routes/TermsOfService.tsx"),
  route("privacy-policy", "routes/PrivacyPolicy.tsx"),

  route("/:lang?/blog/:blogSlug", "routes/ArticlePage.tsx"),
] satisfies RouteConfig;
