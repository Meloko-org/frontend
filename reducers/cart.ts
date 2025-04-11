import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartData, ShopData, StockData } from "../types/API";
export type CartState = {
  value: CartData[];
};

type CartPayload = {
  shopId: string;
  stockId: string;
  increment?: number;
  decrement?: number;
  withdrawMode?: "market" | "clickCollect" | null | undefined;
  withdrawMarket?: string | null;
  withdrawDay?: string | null;
};

type addProductToCartPayload = {
  shop: ShopData;
  stockData: StockData;
  quantity: number;
};

const initialState: CartState = {
  value: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToCart: (
      state: CartState,
      action: PayloadAction<addProductToCartPayload>,
    ) => {
      const shop = state.value.find(
        (c) => c.shop?._id === action.payload?.shop?._id,
      );
      console.log("adding to cart", action.payload);
      if (shop) {
        shop.products.push({
          stockData: action.payload.stockData,
          quantity: action.payload.quantity,
        });
      } else {
        state.value.push({
          shop: action.payload.shop,
          products: [
            {
              stockData: action.payload.stockData,
              quantity: action.payload.quantity,
            },
          ],
          withdrawMode: null,
        });
      }
    },
    increaseCartQuantity: (
      state: CartState,
      action: PayloadAction<CartPayload>,
    ) => {
      const { shopId, stockId, increment = 1 } = action.payload;

      const shop = state.value.find((c) => c.shop?._id === shopId);

      if (shop) {
        const product = shop.products.find((p) => p.stockData._id === stockId);

        if (product) {
          product.quantity += increment;
        }
      }
    },
    decreaseCartQuantity: (
      state: CartState,
      action: PayloadAction<CartPayload>,
    ) => {
      const { shopId, stockId, decrement = 1 } = action.payload;

      const shop = state.value.find((c) => c.shop?._id === shopId);

      if (shop) {
        const product = shop.products.find((p) => p.stockData._id === stockId);

        if (product) {
          product.quantity -= decrement;
          // on supprime le produit si la quantité tombe à 0
          if (product.quantity <= 0) {
            shop.products = shop.products.filter(
              (p) => p.stockData._id !== stockId,
            );
          }
        }

        // on supprime le shop si tous les produits du shop sont retirés
        if (shop.products.length === 0) {
          state.value = state.value.filter((c) => c.shop?._id !== shopId);
        }
      }
    },
    updateWithdrawMode: (
      state: CartState,
      action: PayloadAction<CartPayload>,
    ) => {
      const shop = state.value.find(
        (c) => c.shop?._id === action.payload.shopId,
      );
      if (shop) {
        shop.withdrawMode = action.payload.withdrawMode;
        if (!action.payload.withdrawMarket) shop.withdrawMarket = null;
        if (!action.payload.withdrawDay) shop.withdrawDay = null;
      }
      // if (action.payload.market) {
      //   shop.market = action.payload.market;
      //   if(action.payload.daySelected) shop.market.day = action.payload.daySelected
      // }
    },
    setWithdrawMarket: (
      state: CartState,
      action: PayloadAction<CartPayload>,
    ) => {
      const shop = state.value.find(
        (c) => c.shop?._id === action.payload.shopId,
      );
      if (shop) {
        if (shop.withdrawMode === "market") {
          shop.withdrawMarket = action.payload.withdrawMarket;
          shop.withdrawDay = action.payload.withdrawDay;
        }
      }
    },
    emptyCart: (state: CartState) => {
      state.value = [];
    },
  },
});

export const {
  addProductToCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  updateWithdrawMode,
  setWithdrawMarket,
  emptyCart,
} = cartSlice.actions;
export default cartSlice.reducer;
