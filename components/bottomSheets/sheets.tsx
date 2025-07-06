import React, { JSX } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types/Navigation";
import {
  registerSheet,
  RouteDefinition,
  SheetDefinition,
} from "react-native-actions-sheet";
import CustomAlert from "./CustomAlert";
import ProductDetails from "./ProductDetails";
import MapSearchResults from "./MapSearchResults";
import MapShopResults from "./MapShopResults";
import MapMarketResults from "./MapMarketResults";
import BecomePremium from "./BecomePremium";
import {
  MarketData,
  MarketResultData,
  ProductData,
  ShopData,
  ShopResultData,
  StockData,
} from "../../types/API";
import EditProductSheet from "./EditProductSheet";
import ProductFamiliesSheet from "./ProductFamilies";
import ConfirmSheet from "./Confirm";
import ImageUploaderSheet from "./ImageUploader";
import MapEmptySearchResults from "./MapEmptySearchResults";
import ShopDetails from "./ShopDetails";

registerSheet("alert", CustomAlert);
registerSheet("product-details", ProductDetails);
registerSheet("map-shop-results", MapShopResults);
registerSheet("map-market-results", MapMarketResults);
registerSheet("map-search-results", MapSearchResults);
registerSheet("map-empty-search-results", MapEmptySearchResults);
registerSheet("become-premium", BecomePremium);
registerSheet("edit-product", EditProductSheet);
registerSheet("product-families", ProductFamiliesSheet);
registerSheet("confirm", ConfirmSheet);
registerSheet("image-uploader", ImageUploaderSheet);
registerSheet("shop-details", ShopDetails);

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
        unit: string;
      };
    }>;
    "shop-details": SheetDefinition<{
      payload: {
        shop?: ShopData;
        showButtons: boolean;
      };
    }>;
    "map-shop-results": SheetDefinition<{
      payload: {
        resultsList: ShopResultData[];
        navigation: NativeStackNavigationProp<RootStackParamList>;
        onBackFn?: () => void;
        mapSearchBoxRef: React.RefObject<{
          toggleSearch: () => void;
          openSearch: () => void;
        } | null>;
      };
    }>;
    "map-market-results": SheetDefinition<{
      payload: {
        resultsList: MarketResultData[];
        navigation: NativeStackNavigationProp<RootStackParamList>;
        mapSearchBoxRef: React.RefObject<{
          toggleSearch: () => void;
          openSearch: () => void;
        } | null>;
      };
    }>;
    "map-empty-search-results": SheetDefinition<{
      payload: {
        searchType: "producteur" | "point de vente";
        onRetry: () => void;
      };
    }>;
    "map-search-results": SheetDefinition<{
      payload: {
        resultsList: React.ReactNode[];
        searchType: "shop" | "market";
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
        type: string[] | string;
      };
      returnedValue: string;
    }>;
  }
}

export {};
