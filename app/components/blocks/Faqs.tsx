import { useApp } from "@/contexts/AppContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "../ui/card";

function Faqs() {
  const { t } = useApp();
  return (
    <div className="mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {t("faqTitle")}
        </h2>
      </div>
      <div className="mb-12">
        <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg max-w-4xl mx-auto">
          <CardContent className="p-8 space-y-4">
            <Accordion type="single" collapsible>
              {[
                [t("faq1Question"), t("faq1Answer")],
                [t("faq2Question"), t("faq2Answer")],
                [t("faq3Question"), t("faq3Answer")],
                [t("faq4Question"), t("faq4Answer")],
                [t("faq5Question"), t("faq5Answer")],
                [t("faq6Question"), t("faq6Answer")],
                [t("faq7Question"), t("faq7Answer")],
                [t("faq8Question"), t("faq8Answer")],
                [t("faq9Question"), t("faq9Answer")],
              ].map(([question, answer], index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-blue-200"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 whitespace-pre-line">
                    {answer}
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
