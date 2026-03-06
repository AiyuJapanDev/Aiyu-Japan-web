import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const PIE_COLORS = ["#f59e0b", "#6366f1", "#10b981", "#3b82f6", "#ef4444", "#94a3b8"];

const SPECIFIC_COLORS: Record<string, string> = {
  "Pagados": "#10b981", 
  "No pagado": "#ef4444",
};

export function PieWithLegend({ title, subtitle, data }: { title: string; subtitle: string; data: any[] }) {
  const getColor = (name: string, index: number) => {
    return SPECIFIC_COLORS[name] || PIE_COLORS[index % PIE_COLORS.length];
  };

  return (
    <Card className="p-6">
      <h3 className="text-sm font-bold text-slate-700 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 mb-4">{subtitle}</p>
      <ChartContainer config={{}} className="h-[280px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={getColor(entry.name, i)} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getColor(entry.name, i) }}
            />
            <span className="text-slate-600 font-medium capitalize">
              {entry.name} ({entry.value.toLocaleString()})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}