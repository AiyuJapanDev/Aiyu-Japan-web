import { useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import ReactGA from 'react-ga4';

interface TopQuestion {
  question: string;
  answer: string;
}

export function TopQuestions() {
  const { language } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const topQuestionsEN: TopQuestion[] = [
    {
      question: "How much does registration cost?",
      answer: "Registration is completely FREE. There are no membership costs or monthly fees. You only pay when you use the service."
    },
    {
      question: "What are the service fees?",
      answer: "Shopping Agent Service: ¥500 per item (up to ¥10,000) or ¥1,000 per item (over ¥10,000). Japanese Address/Locker Service: ¥1,000 per box received."
    },
    {
      question: "How long does shipping take?",
      answer: "Economy: 15-21 days\nEMS Express: 4-10 days\nDHL Express: 2-5 days\nSea Shipping (Paraguay/Peru): 3 business months"
    },
    {
      question: "Can I use my credits?",
      answer: "Yes! Credits from cancellations or refunds can be used for Shopping Agent orders and international shipping. They never expire and can be used partially or in full."
    },
    {
      question: "What is consolidation?",
      answer: "Consolidation combines multiple packages into one shipment, saving significantly on international shipping costs. It's FREE and available for all packages in your warehouse."
    },
    {
      question: "Will I pay customs taxes?",
      answer: "It depends on your country's import regulations and the package value. Most countries have a minimum threshold before taxes apply. Always declare the real value."
    }
  ];

  const topQuestionsES: TopQuestion[] = [
    {
      question: "¿Cuánto cuesta el registro?",
      answer: "El registro es completamente GRATUITO. No hay costos de membresía ni tarifas mensuales. Solo pagas cuando usas el servicio."
    },
    {
      question: "¿Cuáles son las tarifas de servicio?",
      answer: "Servicio Shopping Agent: ¥500 por artículo (hasta ¥10,000) o ¥1,000 por artículo (sobre ¥10,000). Servicio de Dirección Japonesa/Casillero: ¥1,000 por caja recibida."
    },
    {
      question: "¿Cuánto tiempo tarda el envío?",
      answer: "Económico: 15-21 días\nEMS Express: 4-10 días\nDHL Express: 2-5 días\nEnvío Marítimo (Paraguay/Perú): 3 meses hábiles"
    },
    {
      question: "¿Puedo usar mis créditos?",
      answer: "¡Sí! Los créditos de cancelaciones o devoluciones pueden usarse para pedidos Shopping Agent y envíos internacionales. Nunca expiran y pueden usarse parcial o totalmente."
    },
    {
      question: "¿Qué es la consolidación?",
      answer: "La consolidación combina múltiples paquetes en un solo envío, ahorrando significativamente en costos de envío internacional. Es GRATIS y está disponible para todos los paquetes en tu almacén."
    },
    {
      question: "¿Tendré que pagar impuestos?",
      answer: "Depende de las regulaciones de importación de tu país y el valor del paquete. La mayoría de países tienen un umbral mínimo antes de aplicar impuestos. Siempre declara el valor real."
    }
  ];

  const topQuestions = language === 'en' ? topQuestionsEN : topQuestionsES;

  const toggleQuestion = (index: number) => {
    const isOpening = openIndex !== index;
    if (isOpening) {
      ReactGA.event({
        category: 'Help Center',
        action: 'Expand Top Question',
        label: topQuestions[index].question
      });
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-capybara-orange/10 to-orange-500/10 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-capybara-orange" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {language === 'en' ? 'Top Questions' : 'Top Dudas'}
        </h3>
      </div>

      <div className="space-y-2">
        {topQuestions.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start justify-between gap-3"
            >
              <span className="text-sm font-medium text-gray-900 flex-1">
                {item.question}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 flex-shrink-0 transition-transform mt-0.5 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-4 pb-3 pt-1 text-sm text-gray-700 leading-relaxed border-t border-gray-100">
                {item.answer.split('\n').map((line, i) => (
                  <p key={i} className={line.trim() !== '' ? 'mb-2' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {language === 'en' 
            ? 'Can\'t find what you need? Browse all topics above.' 
            : '¿No encuentras lo que buscas? Explora todos los temas arriba.'
          }
        </p>
      </div>
    </div>
  );
}
