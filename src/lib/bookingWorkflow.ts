export type BookingStatus =
  | "pending"
  | "confirmed"
  | "on_the_way"
  | "arrived"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "refunded";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Accepted",
  on_the_way: "On The Way",
  arrived: "Arrived",
  in_progress: "Service Started",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["on_the_way", "cancelled"],
  on_the_way: ["arrived", "cancelled"],
  arrived: ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed: ["refunded"],
  cancelled: ["refunded"],
  refunded: [],
};

export function canTransitionBooking(from: BookingStatus, to: BookingStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getBookingStatusColor(status: BookingStatus): { background: string; color: string } {
  if (status === "completed") return { background: "#dcfce7", color: "#166534" };
  if (status === "cancelled" || status === "refunded") return { background: "#fee2e2", color: "#991b1b" };
  if (status === "pending") return { background: "#fef3c7", color: "#92400e" };
  if (status === "in_progress") return { background: "#dbeafe", color: "#1d4ed8" };
  return { background: "#e0f2fe", color: "#0369a1" };
}