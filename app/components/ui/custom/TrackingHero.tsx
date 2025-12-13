import { motion } from "motion/react";
import { Package, Plane } from "lucide-react";
import bannerImage from "/paraguay-env-int.jpg";
import capybaraPlaneImage from "/KapyPlane.png";

import { formatDate } from "date-fns";
import { es } from "date-fns/locale";

interface TrackingHeroProps {
  showContent: boolean;
  date: string;
}

export function TrackingHero({ showContent, date }: TrackingHeroProps) {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="w-full relative z-10">
        {!showContent ? (
          // Initial Animation - Sky with clouds
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative text-center py-20 px-4 bg-gradient-to-b from-[#87CEEB] via-[#B0D8E8] to-white min-h-[500px] flex flex-col items-center justify-center"
          >
            {/* Animated Clouds */}
            <motion.div
              animate={{ x: [0, 100, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 left-10 w-32 h-16 bg-white rounded-full opacity-70 blur-sm"
            />
            <motion.div
              animate={{ x: [0, -80, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-32 right-20 w-40 h-20 bg-white rounded-full opacity-60 blur-sm"
            />
            <motion.div
              animate={{ x: [0, 120, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-32 left-32 w-36 h-16 bg-white rounded-full opacity-50 blur-sm"
            />
            <motion.div
              animate={{ x: [0, -100, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute top-40 right-40 w-28 h-14 bg-white rounded-full opacity-80 blur-sm"
            />

            {/* Capybara on airplane */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                y: [0, -25, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                x: { duration: 1 },
                opacity: { duration: 1 },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="relative inline-block mb-6 z-10"
            >
              <motion.img
                src={capybaraPlaneImage}
                alt="Capybara enviando paquete"
                className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] object-contain drop-shadow-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl text-[#0077B6] relative z-10"
            >
              Verificando su envío...
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 relative z-10"
            >
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex justify-center gap-2"
              >
                <div className="w-3 h-3 bg-[#0077B6] rounded-full"></div>
                <div className="w-3 h-3 bg-[#0077B6] rounded-full"></div>
                <div className="w-3 h-3 bg-[#0077B6] rounded-full"></div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          // Header Content with Banner
          <div>
            {/* Banner Image */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <img
                src={bannerImage}
                alt="Envío Aéreo Japón - Paraguay"
                className="w-full h-auto object-cover"
              />
            </motion.div>

            {/* Text Content Below Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center py-8 px-4 bg-white"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <motion.div
                    animate={{
                      x: [0, 10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Plane className="w-8 h-8 text-[#0077B6]" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-2xl md:text-3xl text-[#0099CC] font-semibold tracking-tight"
                >
                  <strong className="font-bold">Aiyu Japan</strong> - Envío
                  internacional{" "}
                  <strong className="font-bold">Japón - Paraguay</strong>
                </motion.h1>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <motion.div
                    animate={{
                      x: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Plane className="w-8 h-8 text-[#0077B6] transform rotate-180" />
                  </motion.div>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg md:text-xl text-gray-700 font-medium"
              >
                Carga despachada:
                <strong className="text-[#0077B6]"> {date}</strong>
              </motion.p>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.9 }}
                className="h-1 bg-gray-200 mt-6 max-w-md mx-auto rounded-full"
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1, delay: 1.1 }}
                  className="h-full bg-[#FDB813] rounded-full shadow-lg"
                />
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
