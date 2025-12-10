import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/useAuth";
import { Button } from "@/components/ui/button";
import { Link, NavLink, useLocation } from "react-router";
import {
  Globe,
  Menu,
  X,
  Bell,
  Calculator,
  Crown,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import MyAccountMenu from "../ui/custom/MyAccountMenu";
import MobileAccountMenu from "../ui/custom/MobileAccountMenu";
import LogOutBtn from "../ui/custom/LogOutBtn";
import Logo from "/aiyu-japan-logo-typography.png";
import LogoMobile from "/aiyu_logo_small.png";

const Header = () => {
  const { language, setLanguage, t } = useApp();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/store-guide/what-is", label: t("storeGuide") },
    { to: "/store-guide/popular-markets", label: t("stores") },
    [
      { to: `/news/`, label: t("newsLinkTitle") },
      { to: `/blog/`, label: t("blog") },
    ],
    { to: "/contact", label: t("contact") },
    { to: "/calculator", label: t("calculator") },
  ];

  const Navlink = ({
    to,
    label,
    className,
  }: {
    to: string;
    label: string;
    className?: string;
  }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `max-w-xs  block rounded-full text-base transition-all duration-300 ml-4 ${className} ${
            isActive
              ? "text-white bg-capybara-orange py-2 px-4"
              : "text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream py-2 hover:px-4"
          }`
        }
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {label}
      </NavLink>
    );
  };

  return (
    <>
      <header
        className={`pb-2 bg-white/95 backdrop-blur-sm border-b-2 border-capybara-orange/20 sticky top-0 z-50 transition-transform duration-300`}
      >
        {/*
         *
         *
         * NEW USER BANNER
         *
         *
         * */}
        {!location.pathname.includes("dashboard") && (
          <div className="relative h-10 w-full">
            <div className="w-full h-full bg-black/80 flex justify-center items-center text-sm z-2 gap-4">
              <p className="font-bold text-white">{t("newUser")}</p>
              <Link to="/store-guide/what-is">
                <Button className="text-white" variant="breadcrumb" size="xs">
                  {t("moreInfo")}
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/*
         *
         *
         * NAVIGATION
         *
         *
         * */}
        <nav className="px-2 pt-2 max-w-7xl mx-auto  sm:px-6 lg:px-8">
          {/*
           *
           * Centered Desktop Navigation
           *
           * */}
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

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <NavigationMenu>
                <NavigationMenuList className="space-x-4">
                  {navLinks.map((link, index) => {
                    if (Array.isArray(link)) {
                      return (
                        <NavigationMenuItem
                          key={link[0].to}
                          className="relative"
                        >
                          <NavigationMenuTrigger className="px-0">
                            <div
                              className={` py-2 text-sm font-semibold transition-all duration-300 text-gray-700 hover:text-capybara-orange`}
                            >
                              {link[0].label} & {link[1].label}
                            </div>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid gap-2 p-4">
                              {link.map((subLink) => (
                                <li key={subLink.to}>
                                  <NavigationMenuLink asChild>
                                    <NavLink
                                      to={subLink.to}
                                      className={({ isActive }) =>
                                        cn(
                                          "select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-capybara-orange focus:bg-accent focus:text-capybara-orange",
                                          isActive
                                            ? "text-capybara-orange"
                                            : "text-gray-700"
                                        )
                                      }
                                    >
                                      {subLink.label}
                                    </NavLink>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    if (link.to === "/") return null;

                    return (
                      <NavigationMenuItem key={link.to}>
                        <NavigationMenuLink>
                          <NavLink
                            to={link.to}
                            className={({ isActive }) =>
                              `px-3 py-2 text-sm font-semibold transition-all duration-300 text-gray-700 hover:text-capybara-orange ${
                                isActive ? "text-capybara-orange" : ""
                              }`
                            }
                          >
                            {link.label}
                          </NavLink>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Auth Actions - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {isAdmin && (
                      <Link
                        to="/admin-dashboard"
                        className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                      >
                        <Crown className="w-3 h-3" />
                        <span>Admin</span>
                      </Link>
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

          {/*
           *
           *
           * Mobile Navigation
           *
           * */}
          {isMobileMenuOpen && (
            <div
              className="px-4 lg:hidden animate-fade-in "
              ref={mobileMenuRef}
            >
              <div className="space-y-4 pt-4 pb-2  bg-white/95 border-t-2 border-capybara-orange/20 rounded-b-3xl min-h-screen">
                {/* Information Section Title */}
                <div className=" py-2 text-base font-bold text-gray-500">
                  {t("information")}
                </div>

                {navLinks.map((link, i) => {
                  if (Array.isArray(link)) {
                    return link.map((subLink) => (
                      <Navlink
                        key={subLink.to}
                        to={subLink.to}
                        label={subLink.label}
                      />
                    ));
                  }
                  if (link.to !== "/" && link.to !== "/calculator") {
                    return (
                      <Navlink key={link.to} to={link.to} label={link.label} />
                    );
                  }
                })}

                <Navlink
                  to="/calculator"
                  className={"font-semibold"}
                  label={t("calculator")}
                />

                {user && (
                  <div className="flex items-center gap-2 w-full">
                    <MobileAccountMenu />
                  </div>
                )}

                {/* Mobile auth actions */}
                <div className="flex flex-col lg:hidden justify-center items-center space-y-2 ">
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

                {/* language selector & logout button */}
                <div className="relative flex items-center justify-center gap-2 px-1  border-b-2 border-capybara-orange/20">
                  {/* <Select value={language} onValueChange={setLanguage}>
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
                  </Select> */}
                  {user && <LogOutBtn />}
                </div>
              </div>
            </div>
          )}

          {/* 
          
          Header Paragraph 
          
          */}
          {!location.pathname.includes("dashboard") && (
            <p
              className="font-bold text-center max-w-[600px] mx-auto"
              dangerouslySetInnerHTML={{ __html: t("headerParagraph") }}
            ></p>
          )}
        </nav>
      </header>

      {/*
       *
       *
       * LANGUAGE SWITCHER - BOTTOM LEFT
       *
       *
       * */}
      {/*  <div className="fixed bottom-4 left-3 z-50 hidden md:block mr-1 ">
        <div className=" px-3 flex items-center space-x-2 bg-white rounded-full  py-3 shadow-lg border border-capybara-orange/20">
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
      </div> */}
    </>
  );
};

export default Header;
