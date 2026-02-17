import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyAllAdmins } from "@/lib/notificationUtils";
import { useApp } from "@/contexts/AppContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductItem {
  url: string;
  name: string;
  quantity: number;
  notes: string;
}

export function ProductRequestForm() {
  const { t } = useApp();
  const [items, setItems] = useState<ProductItem[]>([
    { url: "", name: "", quantity: 1, notes: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const addItem = () => {
    setItems([...items, { url: "", name: "", quantity: 1, notes: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof ProductItem,
    value: string | number
  ) => {
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

    // Validate before showing dialog
    const validItems = items.filter((item) => item.url.trim());
    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: t("atLeastOneProduct"),
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const validItems = items.filter((item) => item.url.trim());

      // Create order with product requests
      const { data, error } = await supabase.rpc(
        "create_order_with_product_requests",
        {
          p_user_id: user.id,
          p_product_requests: validItems.map((item) => ({
            product_url: item.url.trim(),
            item_name: item.name.trim() || null,
            quantity: item.quantity,
            notes: item.notes.trim() || null,
          })),
        }
      );

      if (error) throw error;

      // Fetch order_personal_id for display
      let orderPersonalId = "new";
      if (data?.[0]?.order_id) {
        const { data: orderData } = await supabase
          .from("orders")
          .select("order_personal_id")
          .eq("id", data[0].order_id)
          .single();
        orderPersonalId =
          orderData?.order_personal_id || data[0].order_id.slice(0, 8);
      }

      // Create short readable ID
      let shortOrderId = orderPersonalId;
      if (data?.[0]?.order_id) {
        shortOrderId =
          typeof data[0].order_id === "string"
            ? data[0].order_id.slice(0, 8).toUpperCase()
            : "";
      }

      // 🟢 Fetch the user's profile (for name & personal ID)
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, user_personal_id")
        .eq("id", user.id)
        .single();

      const customerName = profile?.full_name || "Unknown User";
      const customerId = profile?.user_personal_id
        ? `#${profile.user_personal_id}`
        : "";

      // 📨 Notify all admins with detailed message
      if (data?.[0]) {
        await notifyAllAdmins(
          "new_product_request",
          `New product request from ${customerName} ${customerId}. Order #${shortOrderId} with ${validItems.length} item${validItems.length > 1 ? "s" : ""}.`,
          data[0].order_id
        );
      }

      toast({
        title: "Success",
        description: t("requestSubmittedSuccess"),
      });

      setItems([{ url: "", name: "", quantity: 1, notes: "" }]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || t("requestSubmittedError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between items-center gap-2 sm:gap-3 mb-2">
        <Button
          variant="default"
          asChild
          className="flex-1 min-w-0 text-center w-full border-2 border-black-800 text-black bg-white hover:bg-capybara-orange hover:text-white transition-colors px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium whitespace-normal"
        >
          <Link to="/store-guide/popular-markets">
            {t("seeJapaneseStores")}
          </Link>
        </Button>

        <Button
          variant="default"
          asChild
          className="flex-1 min-w-0 text-center w-full border-2 border-black-800 text-black bg-white hover:bg-capybara-orange hover:text-white transition-colors px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium whitespace-normal"
        >
          <Link to="/calculator">{t("calculateEstimatedCost")}</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("productRequestTitle")}</CardTitle>
          <CardDescription>{t("productRequestSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Label>
                    {t("products")} {index + 1}
                  </Label>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    placeholder={t("productUrlPlaceholder")}
                    value={item.url}
                    onChange={(e) => updateItem(index, "url", e.target.value)}
                    required
                    className="md:col-span-2"
                  />
                  <select
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                    required
                    style={{ maxHeight: "150px", overflowY: "auto" }}
                  >
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder={t("productNamePlaceholder")}
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                  />

                  <Textarea
                    placeholder={t("productNotesPlaceholder")}
                    value={item.notes}
                    onChange={(e) => updateItem(index, "notes", e.target.value)}
                    className="md:col-span-2"
                    rows={2}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("addProduct")}
            </Button>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("submitRequestButton")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this product request? You will
              receive a quote once we process your order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Submit Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
