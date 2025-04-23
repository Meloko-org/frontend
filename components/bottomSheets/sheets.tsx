import React from "react";
import {
  registerSheet,
  RouteDefinition,
  SheetDefinition,
} from "react-native-actions-sheet";
import CustomAlert from "./CustomAlert";
import ProductDetails from "./ProductDetails";
import MapSearchResults from "./MapSearchResults";
import BecomePremium from "./BecomePremium";
import { ProductData, StockData } from "../../types/API";
import EditProductSheet from "./EditProductSheet";
import ProductFamiliesSheet from "./ProductFamilies";
import ConfirmSheet from "./Confirm";
import ImageUploaderSheet from "./ImageUploader";

registerSheet("alert", CustomAlert);
registerSheet("product-details", ProductDetails);
registerSheet("map-search-results", MapSearchResults);
registerSheet("become-premium", BecomePremium);
registerSheet("edit-product", EditProductSheet);
registerSheet("product-families", ProductFamiliesSheet);
registerSheet("confirm", ConfirmSheet);
registerSheet("image-uploader", ImageUploaderSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    alert: SheetDefinition<{
      payload: {
        message: string;
        alertType: "info" | "success" | "error" | "warning";
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
        stock?: StockData | null;
        product?: ProductData | null;
      };
    }>;
    "product-families": SheetDefinition<{
      payload: {
        category: string;
        onFamilySelected: (name: string) => void;
      };
    }>;
    confirm: SheetDefinition<{
      payload: {
        message: string;
        alertType: "info" | "success" | "error" | "warning";
      };
      returnedValue: boolean;
    }>;
    "image-uploader": SheetDefinition<{
      payload: {
        message: string;
      };
      returnedValue: string;
    }>;
  }
}

export {};
