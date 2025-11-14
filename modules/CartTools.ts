import { CartData, StockData } from "../types/API";

const getProductTotal = (stockData: StockData, quantity: number) => {
  const unit = stockData.product.weight.unit;
  const priceInCents = Number(stockData.price);

  const qty = unit === "gr" ? quantity / 1000 : quantity;

  return (priceInCents * qty) / 100;
};

const getShopSubtotal = (cartShop: CartData) => {
  return cartShop.products.reduce((acc, item) => {
    return acc + getProductTotal(item.stockData, item.quantity);
  }, 0);
};

const getCartTotal = (cartStore: CartData[]) => {
  return cartStore.reduce((acc, shopCart) => {
    return acc + getShopSubtotal(shopCart);
  }, 0);
};

const getTotalCost = (cartStore: CartData[]) => {
  if (cartStore.length > 0) {
    let allShopCost = 0;
    cartStore.forEach((c) => {
      const cartTotalCost = c.products.reduce((accumulator, currentValue) => {
        // définit la quantité selon que le produit est vendu au kilo ou à la pièce
        const quantity =
          currentValue.stockData.product.weight.unit === "gr"
            ? currentValue.quantity / 1000
            : currentValue.quantity;

        return quantity * Number(currentValue.stockData.price) + accumulator;
      }, 0);
      allShopCost += cartTotalCost / 100;
    });
    return allShopCost;
  }
};

export default {
  getProductTotal,
  getShopSubtotal,
  getCartTotal,
  getTotalCost,
};
