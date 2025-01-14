export type StatusColors = {
  pending: string;
  confirmed: string;
  inprogress: string;
  outfordelivery: string;
  completed: string;
  cancelled: string;
  onhold: string;
  failed: string;
};

export const statusColors: StatusColors = {
  pending: "text-yellow-500",
  confirmed: "text-green-500",
  inprogress: "text-blue-400",
  outfordelivery: "text-orange",
  completed: "text-green-600",
  cancelled: "text-red",
  onhold: "text-gray-500",
  failed: "text-red",
};
