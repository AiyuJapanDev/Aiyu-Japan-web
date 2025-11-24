import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface IdDisplayProps {
  personalId?: string;
  uuid: string;
  type: "order" | "shipment";
  size?: "sm" | "md";
}

export const IdDisplay = ({ personalId, uuid, type, size = "md" }: IdDisplayProps) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(uuid);
    toast.success("UUID copied to clipboard");
  };

  return (
    <div>
      <p className={size === "sm" ? "font-medium text-sm" : "font-medium"}>
        {type === "order" ? "Order" : "Shipment"} #{personalId || uuid.slice(0, 8)}
      </p>
      <div className="flex items-center gap-1 mt-1">
        <p className="text-xs font-mono text-muted-foreground">
          UUID: {uuid.slice(0, 13)}...
        </p>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-4 w-4 p-0" 
          onClick={handleCopy}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
