import { ChevronDown, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpArticle } from "@/constants/helpData";
import ReactGA from 'react-ga4';

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Function to render text with HTML links
function renderTextWithLinks(text: string) {
  // Check if text contains HTML anchor tags
  if (text.includes('<a href')) {
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }
  return text;
}

// Function to colorize order status
function colorizeOrderStatus(text: string) {
  const statusColors: Record<string, string> = {
    // Proceso Inicial / Neutro
    'Solicitado': '#6B7280',          // gray-500
    'Requested': '#6B7280',

    // Atención / Pendiente
    'Esperando Pago': '#F59E0B',      // amber-500
    'Awaiting Payment': '#F59E0B',

    // Confirmación / Acción
    'Pagado': '#3B82F6',              // blue-500 (Cambiado a azul, el estándar para "pago ok")
    'Paid': '#3B82F6',

    // Logística y Compras (Violetas/Cianes para distinguir del resto)
    'Algunos Comprados': '#8B5CF6',    // violet-500
    'Some Purchased': '#8B5CF6',
    
    'Todos Comprados': '#A855F7',      // purple-500
    'All Purchased': '#A855F7',

    // Movimiento
    'En Tránsito': '#06B6D4',         // cyan-500
    'In Transit': '#06B6D4',

    'Todos en Almacén': '#0EA5E9',     // sky-500
    'All at Warehouse': '#0EA5E9',

    'Enviado': '#6366F1',             // indigo-500 (Más profesional que el rojo para un envío)
    'Shipped': '#6366F1',

    // Éxito / Finalizado
    'Entregado': '#10B981',           // emerald-500 (El verde final de "tarea cumplida")
    'Delivered': '#10B981'
};

  let result = text;
  Object.keys(statusColors).forEach(status => {
    const color = statusColors[status];
    const regex = new RegExp(`(\\b${status}\\b)`, 'gi');
    result = result.replace(regex, `<strong style="color: ${color}; font-weight: 600;">$1</strong>`);
  });

  if (result !== text) {
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  }
  
  return renderTextWithLinks(text);
}

interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  matchCount?: number;
}

function HelpCard({ icon, title, description, onClick, matchCount }: HelpCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg p-5 hover:shadow-lg transition-all duration-200 text-left border border-gray-200 hover:border-capybara-orange/50 group w-full relative"
    >
      {matchCount && matchCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-capybara-orange text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md z-10">
          {matchCount}
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-capybara-orange/10 to-capybara-orange/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base mb-1.5 text-gray-900 font-medium">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{description}</p>
        </div>
        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-capybara-orange transition-colors flex-shrink-0 -rotate-90" />
      </div>
    </button>
  );
}

interface HelpArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: HelpArticle | null;
  searchQuery?: string;
}

function highlightText(text: string, searchQuery: string) {
  if (!searchQuery) return text;
  
  const normalizedQuery = normalizeText(searchQuery);
  const normalizedText = normalizeText(text);
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let index = normalizedText.indexOf(normalizedQuery);
  
  while (index !== -1) {
    if (index > lastIndex) {
      parts.push(text.substring(lastIndex, index));
    }
    
    const matchEnd = index + searchQuery.length;
    parts.push(
      <mark key={`${index}-${matchEnd}`} className="bg-capybara-yellow/60 px-0.5 rounded">
        {text.substring(index, matchEnd)}
      </mark>
    );
    
    lastIndex = matchEnd;
    index = normalizedText.indexOf(normalizedQuery, lastIndex);
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

function HelpArticleModal({ isOpen, onClose, article, searchQuery = '' }: HelpArticleModalProps) {
  if (!article) return null;

  const filteredFaqs = searchQuery 
    ? article.faqs.filter(faq => {
        const normalizedQuery = normalizeText(searchQuery);
        return normalizeText(faq.question).includes(normalizedQuery) || 
               normalizeText(faq.answer).includes(normalizedQuery);
      })
    : article.faqs;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl text-gray-900">{article.title}</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">{article.description}</p>
          {searchQuery && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <Search className="h-4 w-4 text-capybara-orange" />
              <span>
                {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </span>
            </div>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Accordion type="single" collapsible className="space-y-2">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg px-4 bg-white hover:border-capybara-orange/30 transition-colors"
              >
                <AccordionTrigger className="text-left py-4 hover:no-underline">
                  <span className="text-sm font-medium text-gray-900 pr-4">
                    {searchQuery ? highlightText(faq.question, searchQuery) : faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-700 leading-relaxed pb-4">
                  {faq.answer.split('\n').map((line, i) => {
                    if (line.trim() === '') return null;
                    
                    if (line.startsWith('•') || line.startsWith('-')) {
                      const text = line.substring(1).trim();
                      const content = searchQuery ? highlightText(text, searchQuery) : colorizeOrderStatus(text);
                      return (
                        <div key={i} className="flex gap-2 mb-2 ml-2">
                          <span className="text-capybara-orange mt-1.5 flex-shrink-0">•</span>
                          <span>{content}</span>
                        </div>
                      );
                    }
                    
                    const content = searchQuery ? highlightText(line, searchQuery) : colorizeOrderStatus(line);
                    
                    if (/^\d+\)/.test(line)) {
                      return (
                        <div key={i} className="mb-2 ml-2">
                          {content}
                        </div>
                      );
                    }
                    
                    if (line.includes('✓') || line.includes('✗') || line.includes('❌') || line.includes('⚠️')) {
                      return (
                        <div key={i} className="mb-2">
                          {content}
                        </div>
                      );
                    }
                    
                    return (
                      <p key={i} className="mb-3">
                        {content}
                      </p>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface HelpCategoriesProps {
  categories: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
    article: HelpArticle;
  }>;
  searchQuery?: string;
}

export function HelpCategories({ categories, searchQuery = '' }: HelpCategoriesProps) {
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  const getCategoryMatchCount = (article: HelpArticle) => {
    if (!searchQuery) return 0;
    
    const normalizedQuery = normalizeText(searchQuery);
    let count = 0;
    
    article.faqs.forEach(faq => {
      if (normalizeText(faq.question).includes(normalizedQuery) || 
          normalizeText(faq.answer).includes(normalizedQuery)) {
        count++;
      }
    });
    
    return count;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2 w-full">
        {categories.map((category, index) => (
          <HelpCard
            key={index}
            icon={category.icon}
            title={category.title}
            description={category.description}
            onClick={() => {
              ReactGA.event({
                category: 'Help Center',
                action: 'Open Help Article',
                label: category.title
              });
              setSelectedArticle(category.article);
            }}
            matchCount={searchQuery ? getCategoryMatchCount(category.article) : undefined}
          />
        ))}
      </div>

      <HelpArticleModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
        searchQuery={searchQuery}
      />
    </>
  );
}
