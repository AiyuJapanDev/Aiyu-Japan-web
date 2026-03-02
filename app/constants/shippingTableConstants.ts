export const ITEMS_PER_PAGE = 7;

export const STATUS_BADGES: Record<string, { bg: string; text: string; labelKey: string }> = {
  pending:   { bg: "bg-amber-100",   text: "text-amber-600",   labelKey: "statsStatusPending" },
  paid:      { bg: "bg-emerald-100", text: "text-emerald-600", labelKey: "statusPaid" },
  sent:      { bg: "bg-cyan-100",    text: "text-cyan-600",    labelKey: "statusShipped" },
  cancelled: { bg: "bg-gray-100",    text: "text-gray-500",    labelKey: "statusCancelled" },
  rejected:  { bg: "bg-red-100",     text: "text-red-600",     labelKey: "statusRejected" },
};