import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Scale,
  Info,
  Link,
  RefreshCw,
  Clock,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ShippingQuoteDialog from "@/components/user/ShippingQuoteDialog";
import { useNavigate } from "react-router";
import { useApp } from "@/contexts/AppContext";

interface StorageItem {
  id: string;
  product_request_id: string;
  order_id?: string;
  order_personal_id?: string;
  product_url: string;
  item_name?: string;
  quantity: number;
  weight?: number;
  status: string;
  created_at: string;
  order_created_at: string;
  is_box?: boolean | null;
  local_tracking_number?: string | null;
  product_request: {
    item_name: string;
    quantity: number;
    product_url?: string;
  };
}

interface ShippingQuoteGroup {
  id: string;
  shipment_personal_id?: string;
  created_at: string;
  status: string;
  items: StorageItem[];
  total_weight: number;
  destination: string;
  shipping_method: string;
}

export const StoragePage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<StorageItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [shippingQuotes, setShippingQuotes] = useState<ShippingQuoteGroup[]>(
    [],
  );
  const { t } = useApp();

  const selectedItemsList = items.filter((item) => selectedItems.has(item.id));
  const totalWeight = selectedItemsList.reduce(
    (sum, item) => sum + (item.weight || 0),
    0,
  );

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchStorageItems(), fetchShippingQuotes()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchShippingQuotes = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("shipping_quotes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShippingQuotes(
        (data || []).map((q) => ({
          ...q,
          items: (q.items as any[]) || [],
        })),
      );
    } catch (error) {
      console.error("Error quotes:", error);
    }
  };

  const fetchStorageItems = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("product_requests")
        .select(
          `
          id, product_url, item_name, quantity, status, weight, is_box,
          local_tracking_number, created_at,
          order_items!left (
            id, order:orders!left (id, order_personal_id, created_at)
          )
        `,
        )
        .eq("user_id", user.id)
        .eq("status", "received")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setItems(
        data?.map((item) => ({
          id: item.order_items?.[0]?.id || item.id,
          product_request_id: item.id,
          order_id: item.order_items?.[0]?.order?.id,
          order_personal_id: item.order_items?.[0]?.order?.order_personal_id,
          product_url: item.product_url,
          item_name: item.item_name,
          quantity: item.quantity || 1,
          weight: item.weight,
          status: item.status,
          created_at: item.created_at,
          order_created_at:
            item.order_items?.[0]?.order?.created_at || item.created_at,
          is_box: item.is_box,
          local_tracking_number: item.local_tracking_number,
          product_request: {
            item_name: item.item_name || "Producto",
            quantity: item.quantity || 1,
            product_url: item.product_url,
          },
        })) || [],
      );
    } catch (error) {
      toast.error(t("errorFetchingStorage"));
    }
  };

  const availableItems = items.filter(
    (item) =>
      !shippingQuotes.some(
        (q) =>
          !["rejected", "cancelled"].includes(q.status) &&
          q.items.some((qi: any) => (qi.order_item_id || qi.id) === item.id),
      ),
  );

  const handleSelectItem = (id: string, checked: boolean) => {
    const item = items.find((i) => i.id === id);
    if (!item?.weight) return;
    const newSelected = new Set(selectedItems);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedItems(newSelected);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
        <RefreshCw className="h-8 w-8 text-orange-300 animate-spin" />
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
          {t("loading")}
        </p>
        <img src="/KapyShoppingBags.png" alt="Loading" className="w-32 h-32 object-contain opacity-60 mt-4" />
      </div>
    );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-8 pb-32">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("warehouseStorage")}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {t("selectItemsToShip")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="rounded-lg bg-white h-10 border-slate-200 shadow-sm active:scale-95 transition-all"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("refresh")}
          </Button>
          <Badge className="bg-slate-100 text-slate-600 border-none h-10 px-4 rounded-lg text-sm font-bold">
            <Package className="h-4 w-4 mr-2" /> {availableItems.length}
          </Badge>
        </div>
      </header>

      {/* TABLA */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 px-1">
          {t("availableItems")}
        </h3>
        <Card className="overflow-hidden border-slate-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="w-12 px-6">
                      <Checkbox
                        checked={
                          selectedItems.size > 0 &&
                          selectedItems.size ===
                            availableItems.filter((i) => i.weight).length
                        }
                        onCheckedChange={(c) => {
                          if (c)
                            setSelectedItems(
                              new Set(
                                availableItems
                                  .filter((i) => i.weight)
                                  .map((i) => i.id),
                              ),
                            );
                          else setSelectedItems(new Set());
                        }}
                      />
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-400">
                      {t("itemName")}
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-400 text-center">
                      {t("quantity") || "Cant."}
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-400 text-center">
                      {t("weight")}
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-400 text-center">
                      {t("orderNumberShort")}
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-400 text-right px-6">
                      {t("arrived")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-slate-400 italic"
                      >
                        {t("noContent")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    availableItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className={`${!item.weight ? "opacity-50" : ""} hover:bg-slate-50/30`}
                      >
                        <TableCell className="px-6">
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onCheckedChange={(c) =>
                              handleSelectItem(item.id, !!c)
                            }
                            disabled={!item.weight}
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-700">
                              {item.item_name}
                            </span>
                            {item.is_box && (
                              <span className="text-[10px] text-blue-600 font-bold uppercase">
                                {t("addressService")}
                              </span>
                            )}
                            <a
                              href={item.product_url}
                              target="_blank"
                              className="text-blue-500 text-[10px] truncate max-w-[180px] hover:underline"
                            >
                              {item.product_url}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-slate-600">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-xs font-bold text-slate-500">
                            {item.weight ? `${item.weight}g` : t("pending")}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-xs font-mono font-bold text-slate-400">
                          {item.order_personal_id
                            ? `#${item.order_personal_id}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right px-6 text-[11px] font-bold text-slate-400">
                          {new Date(item.order_created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECCIÓN INFERIOR LADO A LADO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="p-6 bg-white border border-slate-200 rounded-xl flex gap-4 shadow-sm min-h-[160px]">
          <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="text-[13px] text-slate-600 space-y-2 font-medium">
            <p>• {t("storageAlert1")}</p>
            <p>• {t("storageAlert2")}</p>
            <p>
              •{" "}
              {t("storageAlert3") ||
                "No hay límite de tiempo para almacenar los artículos"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 px-1">
            {t("shippingQuotesRequested")}
          </h3>
          <div className="space-y-3">
            {shippingQuotes
              .filter((q) => ["pending", "quoted"].includes(q.status))
              .map((quote) => (
                <Collapsible
                  key={quote.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-bold text-slate-700 uppercase">
                          #{quote.shipment_personal_id || quote.id.slice(0, 6)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {quote.items?.length} items • {quote.total_weight}g
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase">
                        {quote.status}
                      </Badge>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-t border-slate-100 p-4 bg-slate-50/30">
                    <div className="space-y-2">
                      {quote.items?.map((item: any, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-xs bg-white p-2 rounded border border-slate-100 font-bold"
                        >
                          <span className="text-slate-600 truncate mr-4">
                            {item.item_name}
                          </span>
                          <span className="text-slate-400 shrink-0">
                            {item.weight}g
                          </span>
                        </div>
                      ))}
                      <Button
                        variant="link"
                        size="sm"
                        className="text-orange-400 font-bold text-sm text-center p-0 h-auto mt-2"
                        onClick={() => navigate("/user-dashboard?tab=shipping")}
                      >
                        {t("viewDetails")}{" "}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </div>
        </div>
      </div>

      {/* BARRA FLOTANTE */}
      {selectedItems.size > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[500px] animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 sm:justify-between border border-white/10">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex flex-col pl-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">
                  {selectedItems.size} {t("selected")}
                </span>
                <span className="text-sm font-bold text-orange-400 italic">
                  {totalWeight}g {t("total")}
                </span>
              </div>
            </div>
            <Button
              onClick={() => setQuoteDialogOpen(true)}
              className="bg-orange-400 hover:bg-orange-500 text-white rounded-xl px-4 sm:px-6 h-10 sm:h-11 text-xs font-bold uppercase tracking-tight shadow-lg border-none active:scale-95 transition-all w-full sm:w-auto"
            >
              {t("requestShippingQuote")}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ShippingQuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        selectedItems={selectedItemsList}
        totalWeight={totalWeight}
        onSuccess={() => {
          fetchData();
          setSelectedItems(new Set());
          toast.success(t("quoteRequestedSuccess"));
        }}
      />
    </div>
  );
};
