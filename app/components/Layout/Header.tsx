import React from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "@/components/ui/button";
import { Link, NavLink, useLocation } from "react-router";
import {
  Globe,
  Menu,
  X,
  LogOut,
  Crown,
  ChevronDown,
  Bell,
  Calculator,
  CloudCog,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MyAccountMenu from "../ui/custom/MyAccountMenu";
import LogOutBtn from "../ui/custom/LogOutBtn";
import AiyuLogoSmall from "/aiyu_logo_small.png";

const Header = () => {
  const { language, setLanguage, t } = useApp();
  const { user, signOut, isAdmin, userRole, profile } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Utility for display name
  const displayName = profile?.full_name?.trim()
    ? profile?.full_name
    : (user?.email ?? "");

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const targetElement = target as HTMLElement;

      // Ignore clicks on:
      // 1. The toggle button itself
      // 2. Radix UI Select dropdown (rendered in portal)
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !targetElement.closest("#mobileMenuToggle") &&
        !targetElement.closest('[role="listbox"]') &&
        !targetElement.closest("[data-radix-select-viewport]") &&
        !targetElement.closest("[data-radix-select-content]")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b-2 border-capybara-orange/20 sticky top-0 z-50 transition-all duration-300">
        {!user && (
          <div className="h-12 w-full bg-capybara-blue flex justify-center items-center ">
            <p className="animate-bounce font-bold">{t("newUser")}</p>
          </div>
        )}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 hover-bounce transition-all duration-300 flex-shrink-0"
            >
              <img
                src={AiyuLogoSmall}
                alt="Capybara Logo"
                className="h-16 sm:h-16"
              />
              {isMobileMenuOpen && (
                <span className="font-paytone text-3xl text-[#3b434d] ">
                  Aiyu Japan
                </span>
              )}
            </Link>

            {/* Centered Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-2">
                {/* Information Dropdown */}
                {/*                 <DropdownMenu>
                  <DropdownMenuTrigger className="px-4 py-2 text-sm font-semibold transition-all duration-300 text-gray-700 hover:text-capybara-orange flex items-center space-x-1">
                    <span>{t("information")}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-capybara-orange/20 shadow-lg rounded-lg">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/services"
                        className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                          location.pathname === "/services"
                            ? "text-capybara-orange"
                            : "text-gray-700 hover:text-capybara-orange"
                        }`}
                      >
                        {t("services")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/store-guide"
                        className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                          location.pathname === "/store-guide"
                            ? "text-capybara-orange"
                            : "text-gray-700 hover:text-capybara-orange"
                        }`}
                      >
                        {t("storeGuide")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/contact"
                        className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                          location.pathname === "/contact"
                            ? "text-capybara-orange"
                            : "text-gray-700 hover:text-capybara-orange"
                        }`}
                      >
                        {t("contact")}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <Link
                  to="/services"
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    location.pathname === "/services"
                      ? "text-capybara-orange"
                      : "text-gray-700 hover:text-capybara-orange"
                  }`}
                >
                  {t("services")}
                </Link>

                <Link
                  to="/store-guide/what-is"
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    location.pathname === "/store-guide"
                      ? "text-capybara-orange"
                      : "text-gray-700 hover:text-capybara-orange"
                  }`}
                >
                  {t("storeGuide")}
                </Link>
                <Link
                  to="/calculator"
                  className={` px-4 py-2 text-sm font-semibold transition-all duration-300 story-link ${
                    location.pathname === "/calculator"
                      ? "text-capybara-orange"
                      : "text-gray-700 hover:text-capybara-orange"
                  }`}
                >
                  {t("calculator")}
                </Link>
                <NavLink
                  to={"/blog/" + language}
                  className={` px-4 py-2 text-sm font-semibold transition-all duration-300 story-link ${
                    location.pathname === "/blog/" + language
                      ? "text-capybara-orange"
                      : "text-gray-700 hover:text-capybara-orange"
                  }`}
                >
                  {t("blog")}
                </NavLink>
                <Link
                  to="/contact"
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    location.pathname === "/contact"
                      ? "text-capybara-orange"
                      : "text-gray-700 hover:text-capybara-orange"
                  }`}
                >
                  {t("contact")}
                </Link>
              </div>
            </div>

            {/* Auth Actions - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {isAdmin && (
                      <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        <Crown className="w-3 h-3" />
                        <span>Admin</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-0">
                    <Link to="/calculator">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300"
                      >
                        <Calculator className="h-5 w-5 text-grey-600" />
                      </Button>
                    </Link>

                    <Link
                      to={
                        isAdmin
                          ? "/admin-dashboard?tab=notifications"
                          : "/user-dashboard?tab=notifications"
                      }
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300 relative"
                      >
                        <Bell className="h-5 w-5 text-grey-600" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </div>

                  <div className="hidden md:flex items-center gap-2">
                    {isAdmin && (
                      <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        <Crown className="w-3 h-3" />
                        <span>Admin</span>
                      </div>
                    )}

                    <MyAccountMenu />
                  </div>
                </div>
              ) : (
                <Link to="/auth">
                  <Button className="bubble-btn-primary hover-bounce">
                    {t("login")}
                  </Button>
                </Link>
              )}
            </div>

            {/* Easy Access Action Icons */}
            <div className="md:hidden flex items-center space-x-1">
              {/* Calculator icon */}
              <Link to="/calculator">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300"
                >
                  <Calculator className="h-5 w-5 text-gray-600" />
                </Button>
              </Link>

              {/* Notifications bell */}
              {user && (
                <Link
                  to={
                    isAdmin
                      ? "/admin-dashboard?tab=notifications"
                      : "/user-dashboard?tab=notifications"
                  }
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300 relative"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <Button
                id="mobileMenuToggle"
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile auth actions */}
          <div className="flex flex-col md:hidden justify-center items-center space-y-2 pb-2">
            <div className="flex md:hidden justify-center items-center mx-auto">
              {!user && (
                <div className="flex gap-2 justify-center items-center flex-wrap">
                  <Link to="/auth" reloadDocument>
                    <Button className="bubble-btn-primary hover-bounce">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link to="/auth?mode=signup" reloadDocument>
                    <Button className="bubble-btn-secondary-blue hover-bounce">
                      {t("register")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden animate-fade-in" ref={mobileMenuRef}>
              <div className="px-2 pt-2 pb-2 space-y-2 sm:px-3 bg-white/95 border-t-2 border-capybara-orange/20 rounded-b-3xl min-h-screen">
                {/* Information Section Title */}
                <div className="px-4 py-2 text-base font-bold text-gray-500">
                  {t("information")}
                </div>

                <Link
                  to="/services"
                  className={`block px-4 py-3 rounded-full text-base transition-all duration-300 ml-4 ${
                    location.pathname === "/services"
                      ? "text-white bg-capybara-orange"
                      : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("services")}
                </Link>

                <Link
                  to="/store-guide"
                  className={`block px-4 py-3 rounded-full text-base transition-all duration-300 ml-4 ${
                    location.pathname === "/store-guide"
                      ? "text-white bg-capybara-orange"
                      : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("storeGuide")}
                </Link>

                <Link
                  to="/contact"
                  className={`block px-4 py-3 rounded-full text-base transition-all duration-300 ml-4 ${
                    location.pathname === "/contact"
                      ? "text-white bg-capybara-orange"
                      : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("contact")}
                </Link>

                <Link
                  to="/calculator"
                  className={`block px-4 py-3 rounded-full text-base font-semibold transition-all duration-300 ${
                    location.pathname === "/calculator"
                      ? "text-white bg-capybara-orange"
                      : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("calculator")}
                </Link>

                {/* language selector & logout button */}
                <div className="relative flex items-center justify-center gap-2 px-1 py-3 border-b-2 border-capybara-orange/20">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger
                      aria-label="Language"
                      className=" relative flex items-center justify-normal gap-2 w-auto border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <Globe className="w-4 h-4" />
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                  {user && <LogOutBtn />}
                </div>
              </div>
            </div>
          )}
          <p
            className="font-bold text-center"
            dangerouslySetInnerHTML={{ __html: t("headerParagraph") }} //uses dangerouslySetInnerHTML to render custom html element in translation
          ></p>
        </nav>
      </header>

      {/* Language Switcher - Bottom Left */}
      <div className="fixed bottom-4 left-3 z-50 hidden md:block mr-1">
        <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-3 shadow-lg border border-capybara-orange/20">
          <Globe className="w-5 h-5 text-capybara-orange" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "es")}
            className="bg-transparent text-sm text-gray-700 border-none focus:outline-none cursor-pointer font-body"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Header;
