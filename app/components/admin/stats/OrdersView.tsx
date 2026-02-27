import { Card } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart 
} from "recharts";
import { PieWithLegend } from "./PieWithLegend";
import { useApp } from "@/contexts/AppContext";



interface OrdersViewProps {
  ordersByMonth: any[];
  orderStatusData: any[];
  newUsersByMonth: any[];
  itemsByCountry: any[];
}

export function OrdersView({ 
  ordersByMonth, 
  orderStatusData, 
  newUsersByMonth, 
  itemsByCountry, 
}: OrdersViewProps) {
  const { t } = useApp();

  const ordersChartConfig: ChartConfig = {
    orders: { label: t("statsOrders"), color: "#6366f1" },
    items: { label: t("statsItems"), color: "#f59e0b" },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-1">{t("statsOrdersByMonth")}</h3>
        <p className="text-xs text-slate-400 mb-4">{t("statsLast6Months")}</p>
        <ChartContainer config={ordersChartConfig} className="h-[280px] w-full">
          <BarChart data={ordersByMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="items" fill="var(--color-items)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </Card>

      <PieWithLegend
        title={t("statsQuoteStatus")}
        subtitle={t("statsBasedOnQuotes")}
        data={orderStatusData}
      />

      <Card className="p-6 lg:col-span-2">
        <h3 className="text-sm font-bold text-slate-700 mb-1">{t("statsNewUsersByMonth")}</h3>
        <p className="text-xs text-slate-400 mb-4">{t("statsUserRegistration")}</p>
        <ChartContainer
          config={{ users: { label: t("statsUsers"), color: "#3b82f6" } }}
          className="h-[250px] w-full"
        >
          <AreaChart data={newUsersByMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} fill="url(#gradUsers)" />
          </AreaChart>
        </ChartContainer>
      </Card>

            <Card className="p-6 lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-700 mb-1">{t("statsItemsByCountry")}</h3>
              <p className="text-xs text-slate-400 mb-4">{t("statsTop5Countries")}</p>
              <ChartContainer 
                config={{ count: { label: t("statsItems"), color: "#f59e0b" } }} 
                className="h-[280px] w-full"
              >
                <BarChart data={itemsByCountry} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="country" 
                    tickLine={false} 
                    axisLine={false} 
                    fontSize={11} 
                    width={110} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer> 
                </Card>
    </div>
  );
}