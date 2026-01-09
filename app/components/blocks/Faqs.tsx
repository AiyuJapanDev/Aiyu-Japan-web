import { useApp } from "@/contexts/AppContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "../ui/card";
import { FaqsBlock } from "@/types/blocks";

interface FaqsProps {
  data: FaqsBlock;
}

function Faqs({ data }: FaqsProps) {
  const { t } = useApp();
  const faqItems = data.faq || [];

  return (
    <div className="mt-10 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {t("faqTitle")}
        </h2>
      </div>
      <div className="mb-12">
        <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg max-w-4xl mx-auto">
          <CardContent className="p-8 space-y-4">
            <Accordion type="single" collapsible>
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.id || index}
                  value={`item-${index}`}
                  className="border-b border-blue-200"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 space-y-2">
                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Faqs;
