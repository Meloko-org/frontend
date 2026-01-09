import {
  GetOrderProductOverlayParams,
  OrderProduct,
  OrderProductAction,
  ProductOverlay,
  StockData,
  SubOrderStatus,
} from "../types/API";

export const getOrderProductOverlay = ({
  product,
  subOrderStatus,
  stockIssue = false,
  cancelledProducts = [],
  notPickedUpProducts = [],
}: GetOrderProductOverlayParams): {
  label: string;
  type: "error" | "warning" | "info";
} | null => {
  // 1️⃣ Produit supprimé
  if (product.product.isDeleted === true) {
    return {
      label: "Ce produit n'est plus en vente",
      type: "warning",
    };
  }

  // 2️⃣ Produit annulé
  if (
    product.productStatus === "cancelled" ||
    cancelledProducts.includes(product._id)
  ) {
    return {
      label: "Annulé",
      type: "error",
    };
  }

  // 3️⃣ Hors stock
  const stockAvailable =
    product.product.stockTotal - product.product.stockReserved;

  if (
    stockIssue &&
    product.productStatus === "pending" &&
    product.quantity > (stockAvailable ?? Infinity)
  ) {
    return {
      label: `Hors stock -> annulez`,
      type: "warning",
    };
  }

  // 4️⃣ Produit retiré
  if (
    ["picked_up", "partially_picked_up"].includes(subOrderStatus) &&
    product.pickedUp === true
  ) {
    return {
      label: "Retiré",
      type: "info",
    };
  }

  if (notPickedUpProducts.includes(product._id) || product.pickedUp === false) {
    return {
      label: "Non retiré",
      type: "warning",
    };
  }

  // 5️⃣ Aucun overlay
  return null;
};

export const getOrderProductAction = ({
  product,
  subOrderStatus,
}: {
  product: OrderProduct;
  subOrderStatus: SubOrderStatus;
}): OrderProductAction => {
  // console.log("GETORDERPRODUCTACTION")
  // console.log("product :", product)
  // console.log("subOrderstatus :", subOrderStatus)

  // ❌ Produits définitivement non interactifs
  if (product.product.isDeleted === true) {
    return null;
  }

  // 🧺 Préparation → toggle annulation
  if (
    ["pending"].includes(subOrderStatus) &&
    product.productStatus === "pending"
  ) {
    return "toggle_cancel";
  }

  if (
    ["prepared", "partially_prepared"].includes(subOrderStatus) &&
    product.productStatus === "confirmed"
  ) {
    return "toggle_not_picked_up";
  }

  // 🧾 Après retrait → SAV
  if (["picked_up", "partially_picked_up"].includes(subOrderStatus)) {
    return "open_sav";
  }

  if (
    ["picked_up", "partially_picked_up"].includes(subOrderStatus) &&
    product.productStatus === "cancelled"
  ) {
    return null;
  }

  return null;
};

export const getProductName = (product: StockData) => {
  if (!product) return;

  return product.productCustomName
    ? product.productCustomName
    : product.product.family.name + " " + product.product.name;
};
