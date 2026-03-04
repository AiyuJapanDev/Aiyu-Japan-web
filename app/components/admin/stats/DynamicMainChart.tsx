import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip 
} from "recharts";
import { ShoppingCart, Package, Truck } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface ChartDataPoint {
  date: string;
  orders: number;
  items: number;
  shippings: number;
}

interface DynamicMainChartProps {
  data: ChartDataPoint[];
}

type MetricType = "orders" | "items" | "shippings";

interface MetricConfig {
  key: MetricType;
  label: string;
  labelKey: string;
  color: string;
  icon: React.ElementType;
  gradientId: string;
  formatValue: (value: number) => string;
}

const METRIC_CONFIGS: Record<MetricType, MetricConfig> = {
  orders: {
    key: "orders",
    label: "Pedidos",
    labelKey: "statsOrders",
    color: "#10b981",
    icon: ShoppingCart,
    gradientId: "ordersGradient",
    formatValue: (value: number) => value.toLocaleString(),
  },
  items: {
    key: "items",
    label: "Ítems Vendidos",
    labelKey: "statsItems",
    color: "#8b5cf6",
    icon: Package,
    gradientId: "itemsGradient",
    formatValue: (value: number) => value.toLocaleString(),
  },
  shippings: {
    key: "shippings",
    label: "Envíos Realizados",
    labelKey: "statsShippings",
    color: "#f97316",
    icon: Truck,
    gradientId: "shippingsGradient",
    formatValue: (value: number) => value.toLocaleString(),
  },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
  metricConfig: MetricConfig;
}

const CustomTooltip = ({ active, payload, label, metricConfig }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const value = payload[0].value;
  // label ya viene formateado del eje X
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ backgroundColor: metricConfig.color }}
        />
        <p className="text-sm font-semibold text-slate-800">
          {metricConfig.formatValue(value)}
        </p>
      </div>
    </div>
  );
};

export function DynamicMainChart({ data }: DynamicMainChartProps) {
  const { t } = useApp();
  const [activeMetric, setActiveMetric] = useState<MetricType>("orders");

  const currentConfig = METRIC_CONFIGS[activeMetric];
  const Icon = currentConfig.icon;

  // Format date for X-axis
  const formattedData = data.map(item => {
    const [year, month, day] = item.date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return {
      ...item,
      formattedDate: dateObj.toLocaleDateString(
        t("language") === "es" ? "es-ES" : "en-US",
        { day: "2-digit", month: "short" }
      ),
    };
  });

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" style={{ color: currentConfig.color }} />
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {t(currentConfig.labelKey as keyof typeof t) || currentConfig.label}
            </h3>
            <p className="text-xs text-slate-400">
              {t("statsLast12Months")}
            </p>
          </div>
        </div>

        <Tabs 
          value={activeMetric} 
          onValueChange={(value) => setActiveMetric(value as MetricType)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            {Object.values(METRIC_CONFIGS).map((config) => {
              const TabIcon = config.icon;
              return (
                <TabsTrigger 
                  key={config.key} 
                  value={config.key}
                  className="gap-1.5 data-[state=active]:bg-white"
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">{config.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <div style={{ minWidth: data.length > 6 ? `${data.length * 80}px` : '100%' }}>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart 
              data={formattedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                {Object.values(METRIC_CONFIGS).map((config) => (
                  <linearGradient 
                    key={config.gradientId}
                    id={config.gradientId} 
                    x1="0" 
                    y1="0" 
                    x2="0" 
                    y2="1"
                  >
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#64748b" }}
              />
              
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#64748b" }}
                tickFormatter={(value) => 
                  activeMetric === "orders" 
                    ? `$${(value / 1000).toFixed(0)}k` 
                    : value.toLocaleString()
                }
              />
              
              <Tooltip 
                content={<CustomTooltip metricConfig={currentConfig} />}
                cursor={{ stroke: currentConfig.color, strokeWidth: 1, opacity: 0.3 }}
              />
              
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={currentConfig.color}
                strokeWidth={2.5}
                fill={`url(#${currentConfig.gradientId})`}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
