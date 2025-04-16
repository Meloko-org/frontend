import React from "react";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import CustomAlert from "./CustomAlert";
import ProductDetails from "./ProductDetails";
import MapSearchResults from "./MapSearchResults";
import BecomePremium from "./BecomePremium";
import { StockData } from "../../types/API";
import EditProductSheet from "./EditProductSheet";
import ProductFamiliesSheet from "./ProductFamilies";

registerSheet("alert", CustomAlert);
registerSheet("product-details", ProductDetails);
registerSheet("map-search-results", MapSearchResults);
registerSheet("become-premium", BecomePremium);
registerSheet("edit-product", EditProductSheet);
registerSheet("product-families", ProductFamiliesSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    alert: SheetDefinition<{
      payload: {
        message: string;
        alertType: "success" | "error" | "warning";
      };
    }>;
    "product-details": SheetDefinition<{
      payload: {
        stockData?: StockData;
        cartButton: React.ReactNode;
        unit: string;
      };
    }>;
    "map-search-results": SheetDefinition<{
      payload: {
        producersList: React.ReactNode[];
      };
    }>;
    "become-premium": SheetDefinition;
    "edit-product": SheetDefinition<{
      payload: {
        stock: StockData | null;
      };
    }>;
    "product-families": SheetDefinition<{
      payload: {
        category: string;
        onFamilySelected: (name: string) => void;
      };
    }>;
  }
}

export {};
