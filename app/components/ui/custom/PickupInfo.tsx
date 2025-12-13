import { motion } from 'motion/react';
import { MapPin, Truck, Clock, AlertCircle, IdCard } from 'lucide-react';

export function PickupInfo() {
  return (
    <div className="space-y-6">
      {/* Important Identification Notice */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-red-900 mb-3 flex items-center gap-2">
              <IdCard className="w-5 h-5" />
              🚨 INFORMACIÓN IMPORTANTE - RETIRO Y DELIVERY
            </h3>
            
            {/* Professional Notice about Aiyu Japan's Service */}
            

            <div className="space-y-3 text-red-800">
              <p className="leading-relaxed">
                <strong className="text-red-900">ANTES DE PODER CONSULTAR O COORDINAR SU RETIRO/DELIVERY, 
                DEBE IDENTIFICARSE:</strong>
              </p>
              
              <div className="bg-white/60 rounded-lg p-4 border border-red-200">
                <p className="text-red-900 mb-2"><strong>📋 Datos Requeridos (INDISPENSABLE):</strong></p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">1.</span>
                    <span><strong>Su Nombre</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">2.</span>
                    <span><strong>Su Aiyu ID</strong> (número de identificación de cliente)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-100 rounded-lg p-4 border border-amber-300">
                <p className="text-amber-900">
                  <strong>⚠️ ATENCIÓN:</strong> No podremos procesar su consulta, coordinar retiro 
                  ni delivery sin esta información. Es indispensable para identificar su paquete 
                  y brindarle el mejor servicio.
                </p>
              </div>

              <p className="text-sm text-red-700">
                💡 <em>Al contactarnos por cualquier medio (WhatsApp, Email, Teléfono), comience 
                presentando su <strong>Nombre</strong> y <strong>Aiyu ID</strong>.</em>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Existing Pickup and Delivery Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pickup Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#D1EBFA] p-3 rounded-full">
              <MapPin className="w-6 h-6 text-[#0077B6]" />
            </div>
            <h2 className="text-gray-900">Punto de Retiro</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-700 mb-3">
                Puede retirar su paquete personalmente en nuestra oficina:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-900">📍 <strong>Dirección:</strong></p>
                <p className="text-gray-700 mt-1">
                  A&D Import Export, Asunción, Paraguay
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <strong>Horarios de atención:</strong>
              </p>
              <p className="text-gray-700 mt-1">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
              <p className="text-gray-700">Sábados: 8:00 AM - 5:00 PM</p>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-lg overflow-hidden border border-gray-200 h-64">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.112618440613!2d-57.62547782461477!3d-25.30042007764461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945da9d2fc8a6743%3A0x99b1291ef5691548!2sA%26D%20Import%20Export!5e0!3m2!1ses!2sjp!4v1764139100627!5m2!1ses!2sjp" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </motion.div>

        {/* Delivery Option */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#D1EBFA] p-3 rounded-full">
              <Truck className="w-6 h-6 text-[#0077B6]" />
            </div>
            <h2 className="text-gray-900">Servicio de Delivery</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Prefiere que le enviemos el paquete a su domicilio? Puede coordinar 
              el delivery contactándose con nosotros.
            </p>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-green-900 mb-3">
                <strong>📱 WhatsApp para Delivery:</strong>
              </p>
              <a
                href="https://wa.me/595985511321"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#0077B6] hover:text-[#005a8c]"
              >
                📞 +595 985 511 321
              </a>
            </div>

            <div className="bg-[#E8F2F7] rounded-lg p-4 border border-[#B8D9EC]">
              <p className="text-[#0077B6] mb-3">
                <strong>💰 Precios de Delivery:</strong>
              </p>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✅</span>
                  <span>Envío dentro de Paraguay: <strong>₲30,000 - ₲60,000</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">📦</span>
                  <span>Si su caja es más grande, el costo podría ser mayor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✅</span>
                  <span><strong>Realizamos envíos a todo el país</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">🏢</span>
                  <span>Recoger en oficina: Sin costo adicional</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-yellow-900 text-sm">
                <strong>⚠️ Nota:</strong> El costo de delivery se coordina y paga por separado 
                al momento de solicitar el servicio.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}