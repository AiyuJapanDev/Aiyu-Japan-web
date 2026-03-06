import { AlertTriangle, Search, X, Ship, Plane } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { prohibitedItems, allCountries } from "@/constants/helpData";
import { useApp } from "@/contexts/AppContext";

interface ProhibitedItemsCardProps {
  onClick: () => void;
}

export function ProhibitedItemsCard({ onClick }: ProhibitedItemsCardProps) {
  const { language } = useApp();
  
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg p-5 hover:shadow-lg transition-all duration-200 text-left border border-gray-200 hover:border-red-300 group w-full"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base mb-1.5 text-gray-900 font-medium">
            {language === 'en' ? 'Prohibited Items by Country' : 'Objetos Prohibidos por País'}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {language === 'en' 
              ? 'Check which items cannot be shipped according to your destination country'
              : 'Consulta qué artículos no pueden ser enviados según tu país de destino'
            }
          </p>
        </div>
      </div>
    </button>
  );
}

interface ProhibitedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProhibitedItemsModal({ isOpen, onClose }: ProhibitedItemsModalProps) {
  const { language } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const filteredCountries = allCountries.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2.5 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl text-gray-900">
                {language === 'en' ? 'Prohibited Items by Country' : 'Objetos Prohibidos por País'}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'en' 
                  ? 'Select your country to see shipping restrictions'
                  : 'Selecciona tu país para ver las restricciones de envío'
                }
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-0 flex-1 overflow-hidden min-h-0">
          {/* Lista de países */}
          <div className={`w-full lg:w-2/5 flex flex-col border-r border-gray-200 bg-gray-50 min-h-0 ${selectedCountry ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={language === 'en' ? 'Search country...' : 'Buscar país...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-200 last:border-b-0 transition-all text-sm ${
                      selectedCountry === country
                        ? "bg-capybara-orange text-white font-medium"
                        : "hover:bg-white text-gray-700"
                    }`}
                  >
                    {country}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">
                    {language === 'en' ? 'No countries found' : 'No se encontraron países'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Información del país seleccionado */}
          <div className={`w-full lg:w-3/5 flex flex-col bg-white min-h-0 ${selectedCountry ? 'flex' : 'hidden lg:flex'}`}>
            {selectedCountry ? (
              <>
                {/* Botón de volver en mobile */}
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-gray-200 text-gray-700 hover:bg-gray-50 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">
                    {language === 'en' ? 'Back to countries' : 'Volver a países'}
                  </span>
                </button>
                <div className="flex-1 overflow-y-auto overscroll-contain p-6 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                  <div className="mb-6">
                    <h3 className="text-xl mb-2 text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">🚫</span>
                      {selectedCountry}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'en' 
                        ? 'Restricted or prohibited items for this destination'
                        : 'Artículos restringidos o prohibidos para este destino'
                      }
                    </p>
                  </div>

                  {/* Lista de artículos prohibidos por aéreo */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Plane className="h-4 w-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {language === 'en' ? 'Prohibited by Air Shipping:' : 'Prohibido por Envío Aéreo:'}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    {prohibitedItems[selectedCountry as keyof typeof prohibitedItems].items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3.5 bg-red-50 rounded-lg border border-red-200"
                      >
                        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Información de envío marítimo */}
                  <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                        <Ship className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 mb-1 text-sm">
                          {language === 'en' ? 'Sea Shipping - More Flexibility (Peru & Paraguay Only)' : 'Envío Marítimo - Mayor Flexibilidad (Solo Perú y Paraguay)'}
                        </h4>
                        <p className="text-xs text-green-800 mb-2">
                          {language === 'en' 
                            ? 'For Peru and Paraguay, some items prohibited by air can be shipped by sea:'
                            : 'Para Perú y Paraguay, algunos artículos prohibidos por vía aérea pueden enviarse por marítimo:'
                          }
                        </p>
                        <ul className="space-y-1.5 text-xs text-green-800">
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{language === 'en' ? 'Food products and consumables' : 'Productos alimenticios y consumibles'}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{language === 'en' ? 'Batteries and lithium items' : 'Baterías y artículos con litio'}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{language === 'en' ? 'Sprays and aerosols' : 'Sprays y aerosoles'}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>{language === 'en' ? 'Gases (non-explosive)' : 'Gases (no explosivos)'}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mt-3 pt-3 border-t border-green-200">
                      <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700">
                        {language === 'en' 
                          ? 'Note: Sea shipping is only available for Peru and Paraguay. Truly dangerous items (explosives, weapons, illegal substances) remain prohibited regardless of shipping method.'
                          : 'Nota: El envío marítimo solo está disponible para Perú y Paraguay. Artículos verdaderamente peligrosos (explosivos, armas, sustancias ilegales) permanecen prohibidos independientemente del método de envío.'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex gap-3">
                      <div className="text-xl">⚠️</div>
                      <div>
                        <p className="text-xs text-amber-900 font-medium mb-1">
                          {language === 'en' ? 'Important Note' : 'Nota Importante'}
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          {language === 'en'
                            ? 'This list is for guidance only and may change without prior notice. Always verify with your country\'s customs authorities before making a purchase. Aiyu Japan is not responsible for packages held or confiscated due to non-compliance with local regulations.'
                            : 'Esta lista es orientativa y puede cambiar sin previo aviso. Siempre verifica con las autoridades aduaneras de tu país antes de realizar una compra. Aiyu Japan no se hace responsable por paquetes retenidos o confiscados debido al incumplimiento de regulaciones locales.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    {language === 'en' ? 'Select a country from the list' : 'Selecciona un país de la lista'}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {language === 'en' ? 'to see prohibited items' : 'para ver los objetos prohibidos'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
