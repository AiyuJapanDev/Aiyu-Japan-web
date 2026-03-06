import { useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface InfoTooltipProps {
  title: string;
  content: string;
  iconClassName?: string;
}

export function InfoTooltip({ title, content, iconClassName = "h-4 w-4" }: InfoTooltipProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // En mobile, usar Dialog clickable
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-1 hover:bg-muted transition-colors ml-2 flex-shrink-0"
            aria-label="Más información"
          >
            <Info className={`${iconClassName} text-capybara-orange`} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Info className="h-5 w-5 text-capybara-orange flex-shrink-0" />
              <span className="break-words">{title}</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 leading-relaxed pt-2 break-words whitespace-normal">
              {content}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // En desktop, usar Tooltip con hover
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-1 hover:bg-muted transition-colors ml-2 flex-shrink-0"
            aria-label="Más información"
          >
            <Info className={`${iconClassName} text-capybara-orange`} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-md p-4 bg-white border-2 border-orange-100 shadow-lg">
          <div className="space-y-2">
            <p className="font-semibold text-gray-900 break-words">{title}</p>
            <p className="text-sm text-gray-600 leading-relaxed break-words whitespace-normal">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
