const colorMap: Record<string, Record<string, string>> = {
  payment: {
    PAID: "bg-green-50 text-green-700",
    PENDING: "bg-yellow-50 text-yellow-700",
    LATE: "bg-red-50 text-red-700",
    PARTIAL: "bg-orange-50 text-orange-700",
  },
  lease: {
    ACTIVE: "bg-green-50 text-green-700",
    EXPIRED: "bg-red-50 text-red-700",
    TERMINATED: "bg-gray-100 text-gray-600",
    PENDING: "bg-yellow-50 text-yellow-700",
  },
  ticket: {
    OPEN: "bg-blue-50 text-blue-700",
    IN_PROGRESS: "bg-yellow-50 text-yellow-700",
    RESOLVED: "bg-green-50 text-green-700",
    CLOSED: "bg-gray-100 text-gray-600",
  },
  priority: {
    LOW: "bg-gray-100 text-gray-600",
    MEDIUM: "bg-yellow-50 text-yellow-700",
    HIGH: "bg-orange-50 text-orange-700",
    EMERGENCY: "bg-red-50 text-red-700",
  },
};

const labelMap: Record<string, string> = {
  IN_PROGRESS: "In Progress",
};

export function StatusBadge({
  status,
  variant = "ticket",
}: {
  status: string;
  variant?: "payment" | "lease" | "ticket" | "priority";
}) {
  const colors = colorMap[variant]?.[status] ?? "bg-gray-100 text-gray-600";
  const label = labelMap[status] ?? status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {label}
    </span>
  );
}
