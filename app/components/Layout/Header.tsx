import React from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "@/components/ui/button";
import { Link, NavLink, useLocation } from "react-router";
import { Globe, Menu, X, Bell, Calculator, Crown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MyAccountMenu from "../ui/custom/MyAccountMenu";
import MobileAccountMenu from "../ui/custom/MobileAccountMenu";
import LogOutBtn from "../ui/custom/LogOutBtn";
import Logo from "/aiyu-japan-logo-typography.png";
import LogoMobile from "/aiyu_logo_small.png";

const Header = () => {
  const { language, setLanguage, t } = useApp();
  const { user, isAdmin, profile } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll to top when location changes
  /*   useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]); */

  // Hide on scroll logic
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 200) {
          // if scroll down hide the navbar
          setIsVisible(false);
          setIsMobileMenuOpen(false);
        } else {
          // if scroll up show the navbar
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

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
      <header
        className={`bg-white/95 backdrop-blur-sm border-b-2 border-capybara-orange/20 sticky top-0 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {!user && (
          <div className="h-10 w-full bg-capybara-blue flex justify-center items-center text-sm">
            <p className="animate-bounce font-bold">{t("newUser")}</p>
          </div>
        )}
        <nav className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to="/">
              <img
                src={Logo}
                alt="Aiyu Japan Logo"
                className="hidden md:block h-12 w-auto"
              />
              <img
                src={LogoMobile}
                alt="Aiyu Japan Logo"
                className="md:hidden h-16 w-auto"
              />
            </Link>

            {/* Centered Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-1">
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange"
                    }`
                  }
                >
                  {t("services")}
                </NavLink>

                <NavLink
                  to="/store-guide/what-is"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange"
                    }`
                  }
                >
                  {t("storeGuide")}
                </NavLink>
                <NavLink
                  to="/calculator"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold transition-all duration-300 story-link ${
                      isActive
                        ? "text-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange"
                    }`
                  }
                >
                  {t("calculator")}
                </NavLink>
                <NavLink
                  to={"/blog/" + language}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold transition-all duration-300 story-link ${
                      isActive
                        ? "text-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange"
                    }`
                  }
                >
                  {t("blog")}
                </NavLink>
                <NavLink
                  to={`/news/${language}`}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange"
                    }`
                  }
                >
                  News
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange"
                    }`
                  }
                >
                  {t("contact")}
                </NavLink>
              </div>
            </div>

            {/* Auth Actions - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
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

                  <div className="hidden lg:flex items-center gap-2">
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
            <div className="lg:hidden flex items-center space-x-1">
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
          <div className="flex flex-col lg:hidden justify-center items-center space-y-2 pb-2">
            <div className="flex lg:hidden justify-center items-center mx-auto">
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
            <div
              className="px-4 lg:hidden animate-fade-in "
              ref={mobileMenuRef}
            >
              <div className="space-y-6 pt-4 pb-2  bg-white/95 border-t-2 border-capybara-orange/20 rounded-b-3xl min-h-screen">
                {user && (
                  <div className="flex items-center gap-2 w-full">
                    <MobileAccountMenu />
                  </div>
                )}
                {/* Information Section Title */}
                <div className=" py-2 text-base font-bold text-gray-500">
                  {t("information")}
                </div>

                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    `block   rounded-full text-base transition-all duration-300 ml-4 ${
                      isActive
                        ? "text-white bg-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("services")}
                </NavLink>

                <NavLink
                  to="/store-guide/what-is"
                  className={({ isActive }) =>
                    `block   rounded-full text-base transition-all duration-300 ml-4 ${
                      isActive
                        ? "text-white bg-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("storeGuide")}
                </NavLink>

                <NavLink
                  to={`"/news"`}
                  className={({ isActive }) =>
                    `block   rounded-full text-base transition-all duration-300 ml-4 ${
                      isActive
                        ? "text-white bg-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  News
                </NavLink>

                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block   rounded-full text-base transition-all duration-300 ml-4 ${
                      isActive
                        ? "text-white bg-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("contact")}
                </NavLink>

                <NavLink
                  to="/calculator"
                  className={({ isActive }) =>
                    `block   rounded-full text-base font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-white bg-capybara-orange"
                        : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("calculator")}
                </NavLink>

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
            dangerouslySetInnerHTML={{ __html: t("headerParagraph") }}
          ></p>
        </nav>
      </header>

      {/* Language Switcher - Bottom Left */}
      <div className="fixed bottom-4 left-3 z-50 hidden md:block mr-1">
        <div className="flex items-center space-x-2 bg-white rounded-full  py-3 shadow-lg border border-capybara-orange/20">
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
