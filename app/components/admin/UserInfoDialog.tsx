import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { UserWithRole } from "@/types/user";
import { useNavigate } from "react-router";
import { ExternalLink } from "lucide-react";

interface UserInfoDialogProps {
  user: UserWithRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserInfoDialog({
  user,
  open,
  onOpenChange,
}: UserInfoDialogProps) {
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: open && !!user?.id,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open && !!user?.id,
  });

  const { data: shipments, isLoading: shipmentsLoading } = useQuery({
    queryKey: ["user-shipments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("shipping_quotes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: open && !!user?.id,
  });

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Information - {user.full_name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {profileLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : profile ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </p>
                    <p>{profile.full_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p>{profile.email || user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tax/VAT ID
                    </p>
                    <p>{profile.tax_vat_Id || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Phone
                    </p>
                    <p>{profile.phone_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      User ID
                    </p>
                    <p>{profile.user_personal_id || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Country
                    </p>
                    <p>{profile.country || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Postal Code
                    </p>
                    <p>{profile.postal_code || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      City
                    </p>
                    <p>{profile.city || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      State
                    </p>
                    <p>{profile.state || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Join Date
                    </p>
                    <p>{format(new Date(user.created_at), "MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <p>{profile.address || "N/A"}</p>
                  {profile.address_notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile.address_notes}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No profile information found
              </p>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {ordersLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Order #{order.order_personal_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onOpenChange(false);
                          navigate(
                            `/admin-dashboard?tab=requests&orderId=${order.id}`
                          );
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Order
                      </Button>
                    </div>
                    <p className="text-sm">
                      {order.order_items?.length || 0} item(s)
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No orders found</p>
            )}
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            {shipmentsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : shipments && shipments.length > 0 ? (
              <div className="space-y-3">
                {shipments.map((shipment: any) => (
                  <div
                    key={shipment.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Shipment #{shipment.shipment_personal_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(shipment.created_at),
                            "MMM dd, yyyy"
                          )}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onOpenChange(false);
                          navigate(
                            `/admin-dashboard?tab=shipping-requests&shipmentId=${shipment.id}`
                          );
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Shipment
                      </Button>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">
                          Destination:
                        </span>{" "}
                        {shipment.destination}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Method:</span>{" "}
                        {shipment.shipping_method}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Weight:</span>{" "}
                        {shipment.total_weight}g
                      </p>
                      {shipment.estimated_cost && (
                        <p>
                          <span className="text-muted-foreground">
                            Est. Cost:
                          </span>{" "}
                          ¥{Math.round(shipment.estimated_cost).toLocaleString()}
                        </p>
                      )}
                      {shipment.actual_cost && (
                        <p>
                          <span className="text-muted-foreground">
                            Actual Cost:
                          </span>{" "}
                          ¥{Math.round(shipment.actual_cost).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No shipping quotes found</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
