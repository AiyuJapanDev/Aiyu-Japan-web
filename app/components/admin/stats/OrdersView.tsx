import { Card } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart, 
  PieChart, Pie, Cell, Label
} from "recharts";
import { PieWithLegend } from "./PieWithLegend";
import { useApp } from "@/contexts/AppContext";
import type { TopCountry } from "@/hooks/useStatistics";
import OrdersListTable from "@/components/admin/OrdersListTable";



interface OrdersViewProps {
  ordersByMonth: any[];
  orderStatusData: any[];
  newUsersByMonth: any[];
  itemsByCountry: any[];
  topCountriesRegistered: TopCountry[];
  topCountriesOrders: TopCountry[];
  refreshSignal: number;
}

export function OrdersView({ 
  ordersByMonth, 
  orderStatusData, 
  newUsersByMonth, 
  itemsByCountry,
  topCountriesRegistered,
  topCountriesOrders,
  refreshSignal, 
}: OrdersViewProps) {
  const { t } = useApp();

  const ordersChartConfig: ChartConfig = {
    orders: { label: t("statsOrders"), color: "#6366f1" },
    items: { label: t("statsItems"), color: "#f59e0b" },
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Pedidos por Mes - Full Width */}
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

      {/* Row 2: Estado de Cotizaciones + Items por País */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieWithLegend
          title={t("statsQuoteStatus")}
          subtitle={t("statsBasedOnQuotes")}
          data={orderStatusData}
        />

        <Card className="p-6">
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

      {/* Row 3: Tabla de Pedidos - Full Width */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <OrdersListTable refreshSignal={refreshSignal} />
      </div>

      {/* Row 3: Nuevos Usuarios - Full Width */}
      <Card className="p-6">
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

      {/* Row 4: Top 5 Países Registrados + Top 5 Pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-1">{t("statsTopCountriesRegistered")}</h3>
          <p className="text-xs text-slate-400 mb-4">{t("statsUsersByCountry")}</p>
          <ChartContainer 
            config={{ count: { label: t("statsUsers"), color: "#3b82f6" } }} 
            className="h-[280px] w-full"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={topCountriesRegistered}
                cx="50%"
                cy="50%"
                labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
                label={({ country, count, cx, cy, midAngle, innerRadius, outerRadius }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 25;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#475569"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      className="text-xs font-medium"
                    >
                      {country} ({count})
                    </text>
                  );
                }}
                outerRadius={80}
                dataKey="count"
                nameKey="country"
              >
                {topCountriesRegistered.map((_, i) => (
                  <Cell 
                    key={`cell-${i}`} 
                    fill={["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#c084fc"][i % 5]} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-1">{t("statsTopCountriesOrders")}</h3>
          <p className="text-xs text-slate-400 mb-4">{t("statsPaidOrdersByCountry")}</p>
          <ChartContainer 
            config={{ count: { label: t("statsOrders"), color: "#6366f1" } }} 
            className="h-[280px] w-full"
          >
            <BarChart data={topCountriesOrders} layout="vertical">
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
    </div>
  );
}