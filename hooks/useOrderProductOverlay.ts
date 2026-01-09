import { useEffect, useMemo, useState } from "react";
import { OrderProduct, SubOrderStatus } from "../types/API";
import {
  getOrderProductAction,
  getOrderProductOverlay,
} from "../helpers/productHelpers";

type Overlay = {
  label: string;
  type: "error" | "warning" | "info";
};

type UseOrderProductOverlayProps = {
  product: OrderProduct;
  subOrderStatus: SubOrderStatus;
  stockIssue?: boolean;
  cancelledProducts: string[];
  notPickedUpProducts: string[];
  onToggleCancel?: (productId: string) => void;
  onToggleNotPickUp?: (productId: string) => void;
  onOpenSav?: (product: OrderProduct) => void;
};

export const useOrderProductOverlay = ({
  product,
  subOrderStatus,
  stockIssue,
  cancelledProducts,
  notPickedUpProducts,
  onToggleCancel,
  onToggleNotPickUp,
  onOpenSav,
}: UseOrderProductOverlayProps) => {
  /** 1️⃣ Overlay métier */
  const baseOverlay = useMemo(
    () =>
      getOrderProductOverlay({
        product,
        subOrderStatus,
        stockIssue,
        cancelledProducts,
        notPickedUpProducts,
      }),
    [
      product,
      subOrderStatus,
      stockIssue,
      cancelledProducts,
      notPickedUpProducts,
    ],
  );

  /** 2️⃣ Action métier */
  const action = useMemo(
    () =>
      getOrderProductAction({
        product,
        subOrderStatus,
      }),
    [product, subOrderStatus],
  );

  /** 3️⃣ Overlay d’intention utilisateur */
  const [intentOverlay, setIntentOverlay] = useState<Overlay | null>(null);

  /** 4️⃣ Overlay effectif */
  const overlay = intentOverlay ?? baseOverlay;

  /** 5️⃣ Reset quand l’état métier change */
  useEffect(() => {
    setIntentOverlay(null);
  }, [product.productStatus, product.pickedUp, subOrderStatus]);

  /** 6️⃣ Gestion du clic */
  const onPress = () => {
    if (!action) return;

    switch (action) {
      case "toggle_cancel":
        if (!intentOverlay) {
          onToggleCancel?.(product._id);
          setIntentOverlay({
            label: "Annulé",
            type: "error",
          });
        } else {
          onToggleCancel?.(product._id);
          setIntentOverlay(null);
        }
        break;

      case "toggle_not_picked_up":
        onToggleNotPickUp?.(product._id);
        break;

      case "open_sav":
        onOpenSav?.(product);
        break;
    }
  };

  return {
    overlay,
    action,
    onPress,
    isInteractive: Boolean(action),
  };
};
