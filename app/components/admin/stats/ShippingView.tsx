import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Area, AreaChart 
} from "recharts";
import { useState } from "react";
import { PieWithLegend } from "./PieWithLegend";
import { useApp } from "@/contexts/AppContext";
import ShippingListTable from "@/components/admin/ShippingListTable";



const PIE_COLORS = ["#f59e0b", "#6366f1", "#10b981", "#3b82f6", "#ef4444", "#94a3b8"];

interface ShippingViewProps {
  shippingsByMonth: any[];
  shippingStatusData: any[];
  shippingMethodData: any[];
  allDestinations: any[];
  weightByCountry: any[];
  refreshSignal: number;
}

export function ShippingView({
  shippingsByMonth,
  shippingStatusData,
  shippingMethodData,
  allDestinations,
  weightByCountry,
  refreshSignal,
}: ShippingViewProps) {
  const { t } = useApp();
  const [showAllDestinations, setShowAllDestinations] = useState(false);

  const shippingChartConfig: ChartConfig = {
    shipments: { label: t("statsShipments"), color: "#10b981" },
    weight: { label: `Peso (kg)`, color: "#8b5cf6" },
  };

  const methodChartConfig: ChartConfig = {
    count: { label: t("statsItemsCount"), color: "#6366f1" },
  };
  
  const getMethodLabel = (method: string) => {
    const lang = t('language') === 'Español' ? 'es' : 'en';
    const shortNames: Record<string, { es: string; en: string }> = {
      'economic': { es: 'Económico', en: 'Economic' },
      'express': { es: 'Express', en: 'Express' },
      'dhl': { es: 'DHL Express', en: 'DHL Express' },
      'paraguay': { es: 'Paraguay Aéreo', en: 'Paraguay Air' },
      'paraguay-maritime': { es: 'Paraguay Marítimo', en: 'Paraguay Maritime' },
      'peru-maritime': { es: 'Perú Marítimo', en: 'Peru Maritime' },
      'ups': { es: 'UPS', en: 'UPS' },
    };
    return shortNames[method]?.[lang] || method;
  };
  
  const topDestinations = showAllDestinations ? allDestinations : allDestinations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Row 1: Shipping Status + Top Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieWithLegend
          title={t("statsShippingStatus")}
          subtitle={t("statsCurrentDistribution")}
          data={shippingStatusData}
        />

        {/* Top Destinations */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-1">{t("statsTopDestinations")}</h3>
          <p className="text-xs text-slate-400 mb-4">{t("statsTop5Destinations")}</p>
          <div className="space-y-3 mt-2">
            {topDestinations.map((dest, i) => {
              const max = allDestinations[0]?.count || 1;
              const pct = Math.round((dest.count / max) * 100);
              return (
                <div key={dest.destination}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700">{dest.destination}</span>
                    <span className="text-slate-400 font-medium tabular-nums">{dest.count}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${PIE_COLORS[i % PIE_COLORS.length]}dd, ${PIE_COLORS[i % PIE_COLORS.length]}88)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {allDestinations.length > 5 && (
              <Button
                variant="link"
                size="sm"
                className="w-full text-blue-500 font-bold text-xs mt-2"
                onClick={() => setShowAllDestinations(!showAllDestinations)}
              >
                {showAllDestinations ? t("statsTop5Destinations") : `${t("statsShowing")} ${t("statsDateAll").replace("Fecha: ","")} (${allDestinations.length})`}
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Row 2: Tabla de Envíos - Full Width */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <ShippingListTable refreshSignal={refreshSignal} />
      </div>

      {/* Row 3: Envíos por Mes - Full Width */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-1">{t("statsShippingsByMonth")}</h3>
        <p className="text-xs text-slate-400 mb-4">{t("statsLast6Months")}</p>
        <ChartContainer config={shippingChartConfig} className="h-[280px] w-full">
          <AreaChart data={shippingsByMonth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="gradShipments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="shipments" stroke="var(--color-shipments)" strokeWidth={2} fill="url(#gradShipments)" />
          </AreaChart>
        </ChartContainer>
      </Card>

      {/* Row 4: Shipping Methods + Weight by Country */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-1">{t("statsShippingMethods")}</h3>
          <p className="text-xs text-slate-400 mb-4">{t("statsPopularityByMethod")}</p>
          <ChartContainer config={methodChartConfig} className="h-[280px] w-full">
            <BarChart data={shippingMethodData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="method" 
                tickLine={false} 
                axisLine={false} 
                fontSize={11} 
                width={120}
                tickFormatter={getMethodLabel}
              />
              <ChartTooltip 
                wrapperStyle={{ outline: 'none', zIndex: 1000 }}
                cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-lg">
                        <p className="text-xs font-semibold text-slate-800 mb-0.5">{getMethodLabel(data.method)}</p>
                        <p className="text-sm font-bold text-slate-900 tabular-nums">{data.count} {t("statsItemsCount").toLowerCase()}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>

        {/* Weight by Country */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-1">{t("statsWeightByCountry")}</h3>
          <p className="text-xs text-slate-400 mb-4">{t("statsInKilograms")}</p>
          <ChartContainer config={{ weight: { label: `Peso (kg)`, color: "#8b5cf6" } }} className="h-[280px] w-full">
            <BarChart data={weightByCountry} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis type="category" dataKey="country" tickLine={false} axisLine={false} fontSize={11} width={110} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="weight" fill="var(--color-weight)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
}