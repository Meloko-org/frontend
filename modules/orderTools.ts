import {
  ApiResponse,
  OrderData,
  OrderSummary,
  ProductDetail,
  StockData,
} from "../types/API";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getOrdersByUser = async (
  token: string | null,
  status:
    | "pending"
    | "partialValidated"
    | "validated"
    | "partialWithdrawn"
    | "withdrawn"
    | "partialCanceled"
    | "canceled"
    | "all",
  page = 1,
  limit = 10,
) => {
  try {
    const response = await fetch(
      `${API_ROOT}/orders/user?status=${status}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return {
        success: false,
        message: `Erreur ${response.status}: Impossible de récupérer les données.`,
      };
    }

    const data = await response.json();

    return data.success
      ? {
          success: true,
          orders: data.orders,
          total: data.total,
          page: data.page,
          totalPages: data.totalPages,
        }
      : { success: false, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
  }
};

const getOrderDetailsById = async (
  token: string | null,
  id: string,
): Promise<ApiResponse<OrderData>> => {
  try {
    const response = await fetch(`${API_ROOT}/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: `Erreur ${response.status}: Impossible de récupérer les données.`,
      };
    }

    const data = await response.json();

    return data.success
      ? { success: true, data: data.order }
      : { success: false, data: null, message: data.message };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
  }
};

const validateOrder = async (
  token: string | null,
  values: {
    order: OrderData;
    status: "pending" | "withdrawn" | "canceled" | "validated";
  },
  id: string,
) => {
  try {
    const response = await fetch(`${API_ROOT}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// construit le nouvel order pour valider, annuler ou restaurer

const buildUpdatedOrder = ({
  order,
  shopId,
  newStatus,
  updateProductCallback,
}: {
  order: OrderData | undefined;
  shopId: string | undefined;
  newStatus: string;
  updateProductCallback?: (product: ProductDetail) => ProductDetail;
}): OrderData => {
  const updatedDetails = order?.details.map((detail) => {
    if (detail.shop === shopId) {
      const updatedProducts = updateProductCallback
        ? detail.products.map(updateProductCallback)
        : [...detail.products];

      return {
        ...detail,
        products: updatedProducts,
        status: newStatus,
      };
    }
    return detail;
  });
  return {
    ...order,
    details: updatedDetails,
  };
};

// gestion des status

type GlobalOrderStatus =
  | "pending"
  | "partialValidated"
  | "validated"
  | "partialWithdrawn"
  | "withdrawn"
  | "partialCanceled"
  | "canceled";

function getOrderStatus(order: OrderData): GlobalOrderStatus {
  const subOrderStatuses = order.details.map((detail) => detail.status);

  // console.log(subOrderStatuses)

  // Utiliser un Set pour obtenir les statuts uniques
  const uniqueStatuses = new Set(subOrderStatuses);

  // Cas 1 : Tous les suborders ont le même statut
  if (uniqueStatuses.size === 1) {
    const singleStatus = uniqueStatuses.values().next().value;
    switch (singleStatus) {
      case "pending":
        return "pending";
      case "validated":
        return "validated";
      case "withdrawn":
        return "withdrawn";
      case "canceled":
        return "canceled";
    }
  }

  // Cas 2 : Combinaisons de statuts
  if (uniqueStatuses.has("withdrawn")) {
    if (uniqueStatuses.size === 2 && uniqueStatuses.has("validated")) {
      return "partialWithdrawn"; // Validé + Retiré
    }
    if (uniqueStatuses.size === 1) {
      return "withdrawn"; // Tous retirés
    }
  }

  if (uniqueStatuses.has("validated")) {
    return "partialPending"; // Combinaison de validé et en attente
  }

  if (uniqueStatuses.has("canceled")) {
    if (uniqueStatuses.size === 1) {
      return "canceled"; // Tous annulés
    }
    return "partialCanceled"; // Combinaison d'annulés et autres
  }

  // Par défaut, on retourne "pending" si aucune autre logique ne s'applique
  return "pending";
}

// retourne le prix en euros du produit commandé en fonction de unit
const getProductCost = (
  priceInCents: number,
  quantity: number,
  unit: string | undefined,
) => {
  if (unit === "gr") {
    const kg = quantity / 1000;
    return (priceInCents * kg) / 100;
  }
  return (priceInCents * quantity) / 100;
};

const getPriceInEuros = (price: number) => {
  return price / 100;
};

export default {
  getOrderDetailsById,
  validateOrder,
  getOrdersByUser,
  getOrderStatus,
  buildUpdatedOrder,
  getProductCost,
  getPriceInEuros,
};
