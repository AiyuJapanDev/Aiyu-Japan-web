export const ITEMS_PER_PAGE = 7;

export const STATUS_BADGES: Record<string, { bg: string; text: string; labelKey: string }> = {
  "New": { bg: "bg-amber-100", text: "text-red-500", labelKey: "statusRequested" },
  "Quoted": { bg: "bg-yellow-100", text: "text-yellow-600", labelKey: "statusQuoted" },
  "Paid": { bg: "bg-emerald-100", text: "text-emerald-600", labelKey: "statusPaid" },
  "Purchased": { bg: "bg-orange-100", text: "text-orange-600", labelKey: "statusAllPurchased" },
  "Partially Purchased": { bg: "bg-orange-100", text: "text-orange-600", labelKey: "statusSomePurchased" },
  "Partial Processing": { bg: "bg-indigo-100", text: "text-indigo-600", labelKey: "statusSomePurchased" },
  "Preparing": { bg: "bg-purple-100", text: "text-purple-600", labelKey: "inTransit" },
  "Stored": { bg: "bg-sky-100", text: "text-sky-600", labelKey: "inStorage" },
  "Awaiting Shipping Payment": { bg: "bg-amber-100", text: "text-amber-600", labelKey: "statsStatusAwaitingShipping" },
  "Ready to Ship": { bg: "bg-teal-100", text: "text-teal-600", labelKey: "statusAllAtWarehouse" },
  "Shipped": { bg: "bg-cyan-100", text: "text-cyan-600", labelKey: "statusShipped" },
  "Rejected": { bg: "bg-red-100", text: "text-red-600", labelKey: "statusRejected" },
  "Cancelled": { bg: "bg-gray-100", text: "text-gray-500", labelKey: "statusCancelled" },
};