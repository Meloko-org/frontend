import { SubOrderStatus, SubOrderStatusGroups } from "../types/API";

const SUB_ORDER_STATUS_TO_GROUP: Record<SubOrderStatus, SubOrderStatusGroups> =
  {
    pending: "pending",
    prepared: "prepared",
    partially_prepared: "prepared",
    picked_up: "picked_up",
    partially_picked_up: "picked_up",
    cancelled: "cancelled",
  };

export const getSubOrderStatusGroup = (
  status: SubOrderStatus,
): SubOrderStatusGroups => {
  return SUB_ORDER_STATUS_TO_GROUP[status];
};

export const SUB_ORDER_GROUP_LABELS: Record<SubOrderStatusGroups, string> = {
  pending: "En attente",
  prepared: "Préparée",
  picked_up: "Récupérée",
  cancelled: "Annulée",
};

export const SUB_ORDER_GROUP_COLORS: Record<SubOrderStatusGroups, string> = {
  pending: "bg-pending",
  prepared: "bg-validated",
  picked_up: "bg-withdrawn",
  cancelled: "bg-canceled",
};
