import { CartData, StockData } from "../types/API";

/* retourne le prix d'un produit en centimes en fonction de la quantité */
export const getProductTotal = (
  stockData: StockData,
  quantity: number,
): number => {
  const unit = stockData.product.weight.unit;
  const qty = unit === "gr" ? quantity / 1000 : quantity;

  return Math.round(stockData.price * qty);
};

/* retourne le total d'un shop en centimes */
export const getShopSubtotal = (cartShop: CartData): number => {
  return Math.round(
    cartShop.products.reduce((acc, item) => {
      return acc + getProductTotal(item.stockData, item.quantity);
    }, 0),
  );
};

/* retourne le montant total du panier en centimes */
export const getCartTotal = (cartStore: CartData[]): number => {
  return Math.round(
    cartStore.reduce((acc, shopCart) => {
      return acc + getShopSubtotal(shopCart);
    }, 0),
  );
};

export default {
  getProductTotal,
  getShopSubtotal,
  getCartTotal,
};
