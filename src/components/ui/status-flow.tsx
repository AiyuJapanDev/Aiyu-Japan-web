import { cn } from "@/lib/utils";
import {
  Check,
  X,
  Clock,
  Package,
  Truck,
  CreditCard,
  AlertCircle,
  ChevronRight,
  FileText,
} from "lucide-react";

interface StatusStep {
  label: string;
  status: "completed" | "current" | "upcoming" | "rejected";
  icon: React.ReactNode;
}

interface StatusFlowProps {
  steps: StatusStep[];
  className?: string;
}

export function StatusFlow({ steps, className }: StatusFlowProps) {
  return (
    <div className={cn("w-full overflow-x-auto mt-5", className)}>
      {/* Keep all circles and arrows perfectly center-aligned */}
      <div className="flex items-center min-w-fit px-2 py-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {/* Step + Label */}
            <div className="flex flex-col items-center min-h-[90px] sm:min-h-[100px]">
              {/* Circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs font-semibold transition-all shrink-0",
                  step.status === "completed" && "bg-primary text-primary-foreground",
                  step.status === "current" &&
                    "bg-primary/20 text-primary border-2 border-primary",
                  step.status === "upcoming" &&
                    "bg-muted text-muted-foreground border-2 border-border",
                  step.status === "rejected" &&
                    "bg-destructive text-destructive-foreground"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : step.status === "rejected" ? (
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                    {step.icon}
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] sm:text-xs mt-2 text-center max-w-[60px] sm:max-w-[80px] leading-tight min-h-[2.5em]",
                  step.status === "completed" && "text-primary font-medium",
                  step.status === "current" && "text-foreground font-medium",
                  step.status === "upcoming" && "text-muted-foreground",
                  step.status === "rejected" && "text-destructive font-medium"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector (arrow line) */}
            {index < steps.length - 1 && (
              <div className="flex items-center mx-1 sm:mx-2">
                <div
                  className={cn(
                    "w-8 sm:w-12 h-[2px] relative top-[1px]",
                    steps[index + 1].status === "completed" ||
                      steps[index + 1].status === "current" ||
                      steps[index + 1].status === "rejected"
                      ? "bg-primary"
                      : "bg-border"
                  )}
                >
                  <ChevronRight
                    className={cn(
                      "absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4",
                      steps[index + 1].status === "completed" ||
                        steps[index + 1].status === "current" ||
                        steps[index + 1].status === "rejected"
                        ? "text-primary"
                        : "text-border"
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
