import { useState } from "react";
import { HelpCategories } from "@/components/user/HelpCategories";
import { ProhibitedItemsCard, ProhibitedItemsModal } from "@/components/user/ProhibitedItems";
import { TopQuestions } from "@/components/user/TopQuestions";
import { Search, HelpCircle, Mail, Instagram, MessageSquare } from "lucide-react";
import ReactGA from 'react-ga4';
import { Input } from "@/components/ui/input";
import { helpArticlesEN, helpArticlesES } from "@/constants/helpData";
import { useApp } from "@/contexts/AppContext";
import { 
  BookOpen, 
  ShoppingCart, 
  DollarSign, 
  ListChecks, 
  Package, 
  Rocket,
  ShoppingBag,
  Warehouse,
  Wallet,
  FileText
} from "lucide-react";

export default function PublicHelpCenter() {
  const { language } = useApp();
  const [isProhibitedItemsOpen, setIsProhibitedItemsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const helpArticles = language === 'en' ? helpArticlesEN : helpArticlesES;

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const categories = [
    {
      icon: <BookOpen className="h-5 w-5 text-capybara-orange" />,
      title: helpArticles.howItWorks.title,
      description: helpArticles.howItWorks.description,
      article: helpArticles.howItWorks
    },
    {
      icon: <ShoppingCart className="h-5 w-5 text-blue-600" />,
      title: helpArticles.whereToBuy.title,
      description: helpArticles.whereToBuy.description,
      article: helpArticles.whereToBuy
    },
    {
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      title: helpArticles.pricing.title,
      description: helpArticles.pricing.description,
      article: helpArticles.pricing
    },
    {
      icon: <ListChecks className="h-5 w-5 text-purple-600" />,
      title: helpArticles.steps.title,
      description: helpArticles.steps.description,
      article: helpArticles.steps
    },
    {
      icon: <Package className="h-5 w-5 text-amber-600" />,
      title: helpArticles.services.title,
      description: helpArticles.services.description,
      article: helpArticles.services
    },
    {
      icon: <Rocket className="h-5 w-5 text-pink-600" />,
      title: helpArticles.firstSteps.title,
      description: helpArticles.firstSteps.description,
      article: helpArticles.firstSteps
    },
    {
      icon: <ShoppingBag className="h-5 w-5 text-indigo-600" />,
      title: helpArticles.orders.title,
      description: helpArticles.orders.description,
      article: helpArticles.orders
    },
    {
      icon: <Warehouse className="h-5 w-5 text-cyan-600" />,
      title: helpArticles.warehouse.title,
      description: helpArticles.warehouse.description,
      article: helpArticles.warehouse
    },
    {
      icon: <Wallet className="h-5 w-5 text-emerald-600" />,
      title: helpArticles.credits.title,
      description: helpArticles.credits.description,
      article: helpArticles.credits
    },
    {
      icon: <FileText className="h-5 w-5 text-orange-600" />,
      title: helpArticles.customs.title,
      description: helpArticles.customs.description,
      article: helpArticles.customs
    },
  ];

  const filteredCategories = categories.filter(category => {
    if (!searchQuery.trim()) return true;
    
    const normalizedQuery = normalizeText(searchQuery);
    
    if (normalizeText(category.title).includes(normalizedQuery)) return true;
    if (normalizeText(category.description).includes(normalizedQuery)) return true;
    
    const hasMatchInFaqs = category.article.faqs.some(faq => 
      normalizeText(faq.question).includes(normalizedQuery) || 
      normalizeText(faq.answer).includes(normalizedQuery)
    );
    
    return hasMatchInFaqs;
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-capybara-orange/10 to-orange-500/10 rounded-full mb-4">
            <HelpCircle className="h-7 w-7 text-capybara-orange" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            {language === 'en' ? 'How can we help you?' : '¿Cómo podemos ayudarte?'}
          </h1>
          <p className="text-gray-600 text-base mb-6">
            {language === 'en' 
              ? 'Find answers to your questions about our service' 
              : 'Encuentra respuestas a tus preguntas sobre nuestro servicio'
            }
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={language === 'en' ? 'Search help center...' : 'Buscar en el centro de ayuda...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-base bg-white border-gray-300 shadow-sm focus:border-capybara-orange focus:ring-capybara-orange"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
          <div className="lg:col-span-9">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                {language === 'en' ? 'Help Topics' : 'Temas de Ayuda'}
                {searchQuery && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredCategories.length} {language === 'en' ? 'results' : 'resultados'})
                  </span>
                )}
              </h2>
              
              {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                  <HelpCategories categories={filteredCategories} searchQuery={searchQuery} />
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'en' ? 'No results found' : 'No se encontraron resultados'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'en' 
                      ? `No articles match "${searchQuery}". Try different keywords.` 
                      : `No hay artículos que coincidan con "${searchQuery}". Prueba con otras palabras.`
                    }
                  </p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-capybara-orange hover:text-orange-600 font-medium"
                  >
                    {language === 'en' ? 'Clear search' : 'Limpiar búsqueda'}
                  </button>
                </div>
              )}
            </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {language === 'en' ? 'Shipping Restrictions' : 'Restricciones de Envío'}
          </h2>
          <ProhibitedItemsCard onClick={() => setIsProhibitedItemsOpen(true)} />
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'Still have questions?' : '¿Aún tienes preguntas?'}
            </h3>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Our team is available to help you' 
                : 'Nuestro equipo está disponible para ayudarte'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="mailto:support@aiyujapan.com"
              onClick={() => ReactGA.event({ category: 'Help Center', action: 'Click Contact', label: 'Email' })}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 px-5 py-4 rounded-lg transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <Mail className="h-5 w-5 text-capybara-orange" />
              <div className="text-left">
                <div className="text-sm font-medium">Email</div>
                <div className="text-xs text-gray-500">support@aiyujapan.com</div>
              </div>
            </a>
            <a 
              href="https://instagram.com/aiyu.japan"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ReactGA.event({ category: 'Help Center', action: 'Click Contact', label: 'Instagram' })}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 px-5 py-4 rounded-lg transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <Instagram className="h-5 w-5 text-pink-600" />
              <div className="text-left">
                <div className="text-sm font-medium">Instagram</div>
                <div className="text-xs text-gray-500">@aiyu.japan</div>
              </div>
            </a>
            <a 
              href="https://wa.me/819072380362"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => ReactGA.event({ category: 'Help Center', action: 'Click Contact', label: 'WhatsApp' })}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 px-5 py-4 rounded-lg transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <MessageSquare className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="text-sm font-medium">WhatsApp</div>
                <div className="text-xs text-gray-500">+81 90 7238 0362</div>
              </div>
            </a>
          </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <TopQuestions />
          </div>
        </div>
      </div>

      <ProhibitedItemsModal
        isOpen={isProhibitedItemsOpen}
        onClose={() => setIsProhibitedItemsOpen(false)}
      />
    </div>
  );
}
