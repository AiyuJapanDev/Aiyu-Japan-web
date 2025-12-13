import { motion } from "motion/react";
import {
  Package,
  Plane,
  Ship,
  CheckCircle,
  Clock,
  PackageCheck,
  PackageOpen,
} from "lucide-react";

export function ShipmentStatus({ data }) {
  const statusSteps = [
    {
      icon: PackageOpen,
      label: "La carga está siendo despachada.",
      completed: true,
    },
    { icon: Plane, label: "En tránsito a Paraguay", completed: false },
    { icon: Plane, label: "Llegando a Asunción", completed: false },
    { icon: PackageCheck, label: "Carga Completada!", completed: false },
  ];

  if (data.deliveryStatus === "EN-TRANSITO") {
    statusSteps[0].completed = true;
    statusSteps[1].completed = true;
  } else if (data.deliveryStatus === "LLEGANDO-A-ASU") {
    statusSteps[0].completed = true;
    statusSteps[1].completed = true;
    statusSteps[2].completed = true;
  } else if (data.deliveryStatus === "CARGA-COMPLETADA") {
    statusSteps[0].completed = true;
    statusSteps[1].completed = true;
    statusSteps[2].completed = true;
    statusSteps[3].completed = true;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#D1EBFA] p-3 rounded-full">
          <Package className="w-6 h-6 text-[#0077B6]" />
        </div>
        <div>
          <h2 className="text-gray-900">Estado de su Envío</h2>
          <p className="text-gray-600 text-sm">
            Número de carga: #{data.loadNumber}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {statusSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div
              className={`p-3 rounded-full ${
                step.completed
                  ? "bg-[#D1EBFA] text-[#0077B6]"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className={step.completed ? "text-gray-900" : "text-gray-500"}>
                {step.label}
              </p>
            </div>
            {step.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-5 h-5 text-[#0077B6]" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {data.deliveryStatus !== "CARGA-COMPLETADA" && (
        <div className="mt-6 bg-[#E8F2F7] rounded-lg p-4 border border-[#B8D9EC]">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#0077B6] mt-0.5" />
            <div>
              <p className="text-gray-900">
                <strong className="text-[#0077B6]">
                  Fecha estimada de disponibilidad:
                </strong>{" "}
                {data.estimatedDeliveryDate}
              </p>
              <p className="text-gray-700 text-sm mt-1">
                Le notificaremos inmediatamente cuando su paquete esté listo
                para retirar o coordinar delivery.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
