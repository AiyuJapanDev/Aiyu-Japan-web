import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  icon: LucideIcon;
  iconBg: string;
  value: number;
  label: string;
  subtitle: string;
}

export function KPICard({
  icon: Icon,
  iconBg,
  value,
  label,
  subtitle,
}: KPICardProps) {
  return (
    <Card className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-800 tabular-nums">
          {value ? value.toLocaleString() : 0}
        </p>
        <p className="text-sm font-bold text-blue-600">{label}</p>
        <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
      </div>
    </Card>
  );
}