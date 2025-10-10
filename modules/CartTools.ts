import { CartData } from "../types/API";

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
      allShopCost += cartTotalCost;
    });
    return allShopCost;
  }
};

export default {
  getTotalCost,
};
