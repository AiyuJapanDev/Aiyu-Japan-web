import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const footerLinks = {
  "Sobre AIYU JAPAN": [
    "¿Qué es AIYU JAPAN?",
    "Cómo funciona",
    "Blog",
    "Términos de servicio",
    "Política de privacidad"
  ],
  "Ayuda": [
    "Preguntas frecuentes",
    "Guía de usuario",
    "Contactar soporte",
    "Estado del servicio",
    "Reportar problema"
  ],
  "Servicios": [
    "Compra simple",
    "Comisionado",
    "Consolidación de paquetes",
    "Opciones de envío",
    "Almacenamiento"
  ],
  "Mercados": [
    "Yahoo! Auctions",
    "Mercari",
    "Rakuten",
    "Amazon Japan",
    "Ver todos los mercados"
  ]
};

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" }
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo and description */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="figma:asset/57769f402b316722531437f958332937fec32eda.png" 
                alt="AIYU JAPAN" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="text-white">AIYU JAPAN</h3>
                <p className="text-xs text-gray-400">Tu proxy de compras en Japón</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Conectamos a compradores de todo el mundo con los mejores productos de Japón. 
              Compra fácil, envío seguro, satisfacción garantizada.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <div key={index}>
              <h4 className="text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="text-white mb-3">Suscríbete a nuestro boletín</h4>
            <p className="text-sm text-gray-400 mb-4">
              Recibe ofertas exclusivas, noticias y actualizaciones de productos japoneses.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors whitespace-nowrap">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2024 AIYU JAPAN. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
              Términos
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
              Privacidad
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
              Cookies
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
              Ayuda
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}