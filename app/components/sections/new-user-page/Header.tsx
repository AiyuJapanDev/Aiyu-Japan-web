import image_57769f402b316722531437f958332937fec32eda from "figma:asset/57769f402b316722531437f958332937fec32eda.png";
import {
  ChevronDown,
  Globe,
  DollarSign,
  Clock,
  Search,
  ShoppingCart,
  User,
  Menu,
} from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <img
                src={image_57769f402b316722531437f958332937fec32eda}
                alt="AIYU JAPAN"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-gray-900">AIYU JAPAN</h1>
                <p className="text-xs text-gray-500">
                  Compra en tiendas online japonesas
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 flex items-center gap-1 transition-colors"
            >
              ¿Nuevo usuario? <ChevronDown className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Categorías
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Blog
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Ayuda
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-cyan-600 transition-colors"
            >
              Contactar
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search icon (mobile) */}
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Language selector */}
            <button className="hidden md:flex items-center gap-1 text-cyan-600 hover:text-cyan-700 px-2 py-1 rounded hover:bg-cyan-50 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm">ES</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Currency selector */}
            <button className="hidden md:flex items-center gap-1 text-gray-700 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">USD</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Time */}
            <div className="hidden md:flex items-center gap-1 text-gray-700 px-2 py-1 bg-gray-50 rounded">
              <Clock className="w-4 h-4" />
              <span className="text-sm">00:09 JST</span>
            </div>

            {/* Cart */}
            <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-full relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* Auth buttons */}
            <button className="hidden md:flex items-center gap-1 px-4 py-2 text-cyan-600 border border-cyan-600 rounded hover:bg-cyan-50 transition-colors">
              <User className="w-4 h-4" />
              Iniciar sesión
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-sm">
              Registrarse
            </button>

            {/* Mobile menu */}
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
