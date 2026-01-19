import {
  ApiResponse,
  FileResponse,
  OrderData,
  OrderDataForShop,
  OrderProduct,
  OrderSummary,
  PdfResult,
  StatusData,
  // ProductDetail,
  StockData,
  SubOrderIntent,
  SubOrderStatus,
} from "../types/API";
import * as FileSystem from "expo-file-system";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

const getOrdersByUser = async (
  token: string | null,
  status: StatusData,
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

/* retourne un order avec un seul élément dans details, celui qui correspond au shop */
const getOrderDetailsById = async (
  token: string | null,
  id: string,
): Promise<ApiResponse<OrderDataForShop>> => {
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

const getUserOrderById = async (
  token: string | null,
  id: string,
): Promise<ApiResponse<OrderData>> => {
  try {
    const response = await fetch(`${API_ROOT}/orders/user/${id}`, {
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

const updateSubOrder = async (
  token: string | null,
  id: string,
  values: {
    subOrderId: string;
    intent: SubOrderIntent;
    canceledProductIds?: string[];
    notPickedUpProductIds: string[];
  },
) => {
  try {
    const response = await fetch(`${API_ROOT}/orders/${id}/update-sub-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
      },
      body: JSON.stringify(values),
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
      ? {
          success: true,
          order: data.order,
          refundsPending: data.refundsPending,
          message: data.message,
        }
      : { success: false, message: data.message, error: data.error };
  } catch (error) {
    console.log(error);
    return { success: false, message: error };
  }
};

// récupère la facture pour la partager
const getInvoice = async (
  token: string | null,
  invoiceId: string,
): Promise<FileResponse> => {
  try {
    const response = await fetch(`${API_ROOT}/invoices/${invoiceId}/pdf`, {
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
        message: `Erreur ${response.status}: Impossible de télécharger la facture.`,
      };
    }

    const blob = await response.blob();

    return { success: true, blob };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
  }
};

// récupère la facture pour l'afficher
const getInvoicePdf = async (
  token: string | null,
  invoiceId: string,
): Promise<PdfResult> => {
  try {
    const fileUri = FileSystem.cacheDirectory + `invoice-${invoiceId}.pdf`;

    const result = await FileSystem.downloadAsync(
      `${API_ROOT}/invoices/${invoiceId}/pdf`,
      fileUri,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { success: true, uri: result.uri };
  } catch (e) {
    return {
      success: false,
      message: "Impossible d’afficher la facture.",
    };
  }
};

// récupère le pdf pour la partager
const getPdfToShare = async (
  token: string | null,
  id: string,
  path: "invoices" | "creditNotes",
): Promise<FileResponse> => {
  try {
    const response = await fetch(`${API_ROOT}/${path}/${id}/pdf`, {
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
        message: `Erreur ${response.status}: Impossible de télécharger la facture.`,
      };
    }

    const blob = await response.blob();

    return { success: true, blob };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Une erreur s'est produite lors de la récupération des données.",
    };
  }
};

// récupère le pdf pour l'afficher
const getPdfToDisplay = async (
  token: string | null,
  id: string,
  type: "invoice" | "creditNote",
  path: "invoices" | "creditNotes",
): Promise<PdfResult> => {
  try {
    const fileUri = FileSystem.cacheDirectory + `${type}-${id}.pdf`;
    console.log("fileuri :", fileUri);

    const result = await FileSystem.downloadAsync(
      `${API_ROOT}/${path}/${id}/pdf`,
      fileUri,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { success: true, uri: result.uri };
  } catch (e) {
    return {
      success: false,
      message: "Impossible d’afficher le document.",
    };
  }
};

function getOrderStatus(order: OrderData): StatusData {
  const subOrders = order.details;

  if (!subOrders || subOrders.length === 0) {
    return "pending";
  }

  const statuses = subOrders.map((d) => d.status);

  const isCancelled = (s: string) => s === "cancelled";
  const isPickedUp = (s: string) => s === "picked-up";
  const isPrepared = (s: string) =>
    s === "prepared" || s === "partially-prepared";

  // 1️⃣ Tout annulé
  if (statuses.every(isCancelled)) {
    return "cancelled";
  }

  // 2️⃣ Tout récupéré OU annulé
  if (statuses.every((s) => isPickedUp(s) || isCancelled(s))) {
    return "completed";
  }

  // 3️⃣ Tout prêt OU annulé
  if (statuses.every((s) => isPrepared(s) || isCancelled(s))) {
    return "ready";
  }

  // 4️⃣ Au moins un prêt
  if (statuses.some(isPrepared)) {
    return "partially-ready";
  }

  // 5️⃣ Sinon
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
  updateSubOrder,
  getOrdersByUser,
  getOrderStatus,
  getUserOrderById,
  getProductCost,
  getPriceInEuros,
  getInvoice,
  getInvoicePdf,
  getPdfToShare,
  getPdfToDisplay,
};
