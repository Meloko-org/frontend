import React, { JSX } from "react";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { UserTabParamList } from "../../types/Navigation";
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
  ValidatePostData,
} from "../../types/API";
import EditProductSheet from "./EditProductSheet";
import ProductFamiliesSheet from "./ProductFamilies";
import ConfirmSheet from "./Confirm";
import ImageUploaderSheet from "./ImageUploader";
import MapEmptySearchResults from "./MapEmptySearchResults";
import ShopDetails from "./ShopDetails";
import EditPostText from "./EditPostText";
import ProgrammedPostPreview from "./ProgrammedPostPreview";
import PublishedPost from "./PublishedPost";
import CircuitShop from "./CircuitShop";

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
registerSheet("edit-post-text", EditPostText);
registerSheet("programmed-post-preview", ProgrammedPostPreview);
registerSheet("published-post", PublishedPost);
registerSheet("circuit-shop", CircuitShop);

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
        shopData: ShopData;
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
        navigation: BottomTabNavigationProp<UserTabParamList>;
        // onBackFn?: () => void;
        backButton?: boolean;
        mapSearchBoxRef: React.RefObject<{
          toggleSearch: () => void;
          openSearch: () => void;
        } | null>;
      };
    }>;
    "map-market-results": SheetDefinition<{
      payload: {
        resultsList: MarketResultData[];
        navigation: BottomTabNavigationProp<UserTabParamList>;
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
    "edit-post-text": SheetDefinition<{
      payload: {
        text: string;
      };
      returnValue: string;
    }>;
    "programmed-post-preview": SheetDefinition<{
      payload: {
        post: ValidatePostData;
      };
      returnValue: string;
    }>;
    "published-post": SheetDefinition<{
      payload: {
        post: ValidatePostData;
      };
    }>;
    "circuit-shop": SheetDefinition<{
      payload: {
        shop: ShopData;
      };
      returnValue: ShopData;
    }>;
  }
}

export {};
