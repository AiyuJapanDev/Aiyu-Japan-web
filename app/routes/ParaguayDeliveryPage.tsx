import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import type { Route } from ".react-router/types/app/routes/+types/ParaguayDeliveryPage"; // Auto-generated types if enabled
import { getParaguayDeliveryData } from "@/lib/strapi.server";
import backgroundPattern from "/tile_background.png";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ContactInfo } from "@/components/ui/custom/ContactInfo";
import { PickupInfo } from "@/components/ui/custom/PickupInfo";
import { ShipmentStatus } from "@/components/ui/custom/ShipmentStatus";
import { TrackingHero } from "@/components/ui/custom/TrackingHero";
import ProtectedRoute from "@/components/ProtectedRoute";
import { paraguayDeliveries } from "@/lib/data.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await paraguayDeliveries.find(
    (deliery) => deliery.loadNumber === params.loadId
  );

  if (!data) {
    throw new Response("Not Found", { status: 404 });
  }

  return data;
}

export default function EnvioParaguay() {
  const data = useLoaderData<typeof loader>();

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after initial animation
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-white"
        style={{
          backgroundImage: `url(${backgroundPattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          backgroundPosition: "0 0",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Animated Hero Section */}
        <TrackingHero showContent={showContent} date={data.dispatchDate} />

        {/* Main Content */}
        {showContent && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto px-4 py-8 space-y-8"
            >
              {/* Shipment Status */}
              <ShipmentStatus data={data} />

              {/* Pickup Information */}
              <PickupInfo />

              {/* Contact Information */}
              <ContactInfo />

              {/* Important Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-amber-900 mb-2">
                      📦 Información Importante
                    </h3>
                    <p className="text-amber-900 leading-relaxed">
                      Una vez que su paquete llegue a Paraguay,{" "}
                      <strong>A&D IMPORT EXPORT</strong> se comunicará con usted
                      por correo electrónico o teléfono para coordinar el envío
                      a su ciudad dentro de Paraguay.
                    </p>
                    <p className="text-amber-900 mt-3">
                      Si tiene alguna consulta, no dude en contactarnos a través
                      de nuestros canales de atención al cliente disponibles
                      24/7.
                    </p>

                    <div className="mt-4 pt-4 border-t border-amber-300">
                      <p className="text-amber-900 leading-relaxed">
                        <strong>Compromiso Aiyu Japan:</strong> Trabajamos
                        arduamente para que sus pedidos lleguen de Japón a
                        Paraguay de la manera más eficaz, rápida y segura
                        posible. Sin embargo, debido a que no tenemos
                        jurisdicción sobre los controles aduaneros de Paraguay
                        estando en Japón, existe la posibilidad de que su pedido
                        pueda sufrir algún tipo de apertura o inspección durante
                        el control aduanero. Lamentablemente, no podemos evitar
                        esto al 100%, ya que son procedimientos regulatorios de
                        Paraguay. Agradecemos su comprensión.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
