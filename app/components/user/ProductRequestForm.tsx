import { useState, useEffect } from "react";
import { Plus, X, Trash2, Link as LinkIcon, ShoppingCart, CheckCircle2, Package, Store, Calculator, JapaneseYen } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyAllAdmins } from "@/lib/notificationUtils";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/useAuth";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent,
} from "@/components/ui/dialog";

interface ProductItem {
  url: string;
  name: string;
  quantity: number;
  notes: string;
}

export function ProductRequestForm() {
  const { t } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [useCredits, setUseCredits] = useState(false);

  const userCreditBalance = profile?.credit_balance ?? 0;
  const hasCredits = userCreditBalance > 0;

  const [items, setItems] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem("product_request_draft");
    return saved ? JSON.parse(saved) : [{ url: "", name: "", quantity: 1, notes: "" }];
  });

  useEffect(() => {
    localStorage.setItem("product_request_draft", JSON.stringify(items));
  }, [items]);

  const addItem = () => setItems([...items, { url: "", name: "", quantity: 1, notes: "" }]);
  
  const removeItem = (index: number) => {
    if (items.length === 1) {
      clearForm();
    } else {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const clearForm = () => {
    setItems([{ url: "", name: "", quantity: 1, notes: "" }]);
    setUseCredits(false);
    localStorage.removeItem("product_request_draft");
  };

  const updateItem = (index: number, field: keyof ProductItem, value: string | number) => {
    const newItems = [...items];
    if (field === "quantity") {
      newItems[index][field] = Number(value) || 1;
    } else {
      newItems[index][field] = value as string;
    }
    setItems(newItems);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter(item => item.url.trim());
    if (validItems.length === 0) {
      toast({ title: "Error", description: t("atLeastOneProduct"), variant: "destructive" });
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const validItems = items.filter(item => item.url.trim());
      const { data, error } = await (supabase.rpc as any)("create_order_with_product_requests", {
        p_user_id: user.id,
        p_product_requests: validItems.map(item => ({
          product_url: item.url.trim(),
          item_name: item.name.trim() || null,
          quantity: item.quantity,
          notes: item.notes.trim() || null,
        })),
        p_use_credits_request: useCredits,
      });

      if (error) throw error;

      let orderPersonalId = "new";
      if (data?.[0]?.order_id) {
        const { data: orderData } = await supabase
          .from("orders")
          .select("order_personal_id")
          .eq("id", data[0].order_id)
          .single();
        orderPersonalId = orderData?.order_personal_id || data[0].order_id.slice(0, 8);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, user_personal_id")
        .eq("id", user.id)
        .single();

      if (data?.[0]) {
        await notifyAllAdmins(
          "new_product_request",
          `New product request from ${profile?.full_name || "User"} #${profile?.user_personal_id || ""}. Order #${orderPersonalId.toUpperCase()} with ${validItems.length} items.`,
          data[0].order_id
        );
      }

      clearForm();
      setShowSuccessDialog(true);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || t("requestSubmittedError"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/store-guide/popular-markets"
          className="group flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all"
        >
          <Store className="h-4 w-4 text-orange-400 shrink-0" />
          <span className="font-semibold text-slate-600 text-xs sm:text-sm leading-tight">
            {t("seeJapaneseStores")}
          </span>
        </Link>
        <Link
          to="/calculator"
          className="group flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all"
        >
          <Calculator className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="font-semibold text-slate-600 text-xs sm:text-sm leading-tight">
            {t("calculateEstimatedCost")}
          </span>
        </Link>
      </div>

      <Card className="shadow-md border-t-4 border-t-orange-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
                <ShoppingCart className="h-5 w-5 text-orange-400" />
                {t("productRequestTitle")}
              </CardTitle>
              <CardDescription>{t("productRequestSubtitle")}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={clearForm} title="Clear all">
              <Trash2 className="h-5 w-5 text-muted-foreground hover:text-red-400" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleFormSubmit} className="space-y-8">
            {/* Use Credits Checkbox */}
            {hasCredits && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-orange-200 bg-orange-50/40">
                <Checkbox
                  id="use-credits"
                  checked={useCredits}
                  onCheckedChange={(checked) => setUseCredits(checked === true)}
                  className="mt-0.5 border-orange-300 data-[state=checked]:bg-orange-400 data-[state=checked]:border-orange-400"
                />
                <div className="space-y-1">
                  <Label htmlFor="use-credits" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Use my credits for this order
                  </Label>
                  <p className="text-xs text-gray-500">
                    By checking this option, we will apply your available credits to discount the final price.
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium text-orange-600">
                    <JapaneseYen className="h-3.5 w-3.5" />
                    <span>Available balance: ¥{userCreditBalance.toLocaleString('en-US')}</span>
                  </div>
                </div>
              </div>
            )}

            {items.map((item, index) => (
              <div key={index} className="relative p-6 rounded-xl border bg-gray-50/30 hover:bg-white hover:shadow-sm transition-all">
                <div className="absolute -left-2 -top-2 w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shadow-sm border border-orange-200">
                  {index + 1}
                </div>
                
                <div className="flex justify-end absolute right-2 top-2">
                   <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="h-7 w-7 text-muted-foreground hover:bg-red-50 hover:text-red-400">
                      <X className="h-4 w-4" />
                   </Button>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-9 space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">URL</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="https://amazon.co.jp/item-example"
                          value={item.url}
                          onChange={(e) => updateItem(index, "url", e.target.value)}
                          required
                          className="pl-10 border-gray-200 focus-visible:ring-orange-100"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-3 space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t("quantity")}</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-shadow"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                        required
                      >
                        {Array.from({ length: 100 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t("productNamePlaceholder")}
                      </Label>
                      <Input
                        placeholder="e.g. Pikachu Plushie Limited Ed."
                        value={item.name}
                        onChange={(e) => updateItem(index, "name", e.target.value)}
                        className="border-gray-200 focus-visible:ring-orange-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t("productNotesPlaceholder")}
                      </Label>
                      <Textarea
                        placeholder="Size XL, Color: Red, Gift wrap..."
                        value={item.notes}
                        onChange={(e) => updateItem(index, "notes", e.target.value)}
                        className="border-gray-200 min-h-[42px] py-2 resize-none focus-visible:ring-orange-100"
                        rows={1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={addItem} 
                className="flex-1 h-11 border-dashed border-2 border-orange-200 bg-orange-50/20 text-black hover:bg-orange-50 hover:border-orange-300 transition-all font-medium text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("addProduct")}
              </Button>

              <Button 
                type="submit" 
                className="flex-1 h-11 bg-orange-400 hover:bg-orange-500 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? t("submitting") : t("submitRequestButton")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirm Submission Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this product request? You will receive a quote once we process your order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} className="bg-orange-400 hover:bg-orange-500">
              Submit Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border-0">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-8 flex justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="p-6 text-center space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              {t("successModalTitle")}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t("successModalMessage")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                onClick={() => setShowSuccessDialog(false)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("successModalNewRequest")}
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl bg-orange-400 hover:bg-orange-500 text-white font-semibold"
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate("/user-dashboard?tab=orders");
                }}
              >
                <Package className="h-4 w-4 mr-2" />
                {t("successModalGoToOrders")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}