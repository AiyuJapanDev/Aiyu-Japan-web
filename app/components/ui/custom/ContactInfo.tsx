import { motion } from 'motion/react';
import { MessageCircle, Mail, Instagram } from 'lucide-react';

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
    >
      <h2 className="text-gray-800 mb-6 text-center">
        ¿Tiene Consultas? ¡Contáctenos!
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        {/* WhatsApp */}
        <motion.a
          href="https://wa.me/819072380062"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#E3F2FD] rounded-lg p-4 hover:bg-[#BBDEFB] transition-colors border border-[#90CAF9]/30"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="bg-[#0099CC] p-3 rounded-full">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-700">WhatsApp Aiyu Japan</p>
              <p className="text-xs mt-1 text-gray-600">+81 90 7238 0062</p>
            </div>
          </div>
        </motion.a>

        {/* Email */}
        <motion.a
          href="mailto:info@aiyujapan.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#E3F2FD] rounded-lg p-4 hover:bg-[#BBDEFB] transition-colors border border-[#90CAF9]/30"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="bg-[#0099CC] p-3 rounded-full">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-700">Email</p>
              <p className="text-xs mt-1 text-gray-600">info@aiyujapan.com</p>
            </div>
          </div>
        </motion.a>

        {/* Instagram */}
        <motion.a
          href="https://instagram.com/aiyu.japan"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#E3F2FD] rounded-lg p-4 hover:bg-[#BBDEFB] transition-colors border border-[#90CAF9]/30"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="bg-[#0099CC] p-3 rounded-full">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-700">Instagram</p>
              <p className="text-xs mt-1 text-gray-600">@aiyu.japan</p>
            </div>
          </div>
        </motion.a>
      </div>

      <div className="mt-6 text-center bg-[#E3F2FD] rounded-lg p-4 border border-[#90CAF9]/30">
        <p className="text-sm text-gray-700">
          💬 Nuestro equipo está disponible para ayudarle en cualquier momento.
          <br />
          Responderemos su consulta lo más pronto posible.
        </p>
      </div>
    </motion.div>
  );
}