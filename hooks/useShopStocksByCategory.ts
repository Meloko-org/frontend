import { Use } from "react-native-svg";
import { ProductCategoryData, StockData } from "../types/API";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, ShopState } from "../reducers/shop";
import { StocksState } from "../reducers/stocks";
import { useEffect, useState } from "react";
import stocksTools from "../modules/stocksTools";
import categoriesTools from "../modules/categoriesTools";

type UseShopStocksReturn = {
  isLoading: boolean;
  categoriesWithProducts: {
    category: ProductCategoryData;
    products: StockData[];
    hasZeroStock: boolean;
    hasSubFamilies: boolean;
  }[];
  refresh: () => Promise<void>;
  error: string;
};

export function useShopStocksByCategory(): UseShopStocksReturn {
  const dispatch = useDispatch();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const stocksStore = useSelector(
    (state: { stocks: StocksState }) => state.stocks.value,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<
    UseShopStocksReturn["categoriesWithProducts"]
  >([]);

  const shopId = shopStore?._id;

  const refresh = async () => {
    setIsLoading(true);

    const [stocksResponse, categoriesResponse, typesResponse] =
      await Promise.all([
        stocksTools.getStocksByShop(shopId!),
        categoriesTools.getGlobalCategories(),
        stocksTools.getProductsTypesByCategory(),
      ]);

    if (!stocksResponse.success) {
      setError(stocksResponse.message!);
    } else {
      dispatch(setProducts(stocksResponse.data!));
    }

    if (!categoriesResponse.success) return;

    // on détermine quelles sont les catégories de produit du shop en fonction de ses types
    const filteredCategories = categoriesResponse.data!.filter((cat) =>
      shopStore?.types.some((type) => type._id === cat.type),
    );

    const result = filteredCategories.map((category) => {
      const products = stocksResponse.data!.filter(
        (stock) => stock.product.family.category.name === category.name,
      );

      return {
        category,
        products,
        hasZeroStock: products.some((p) => Number(p.stock) === 0),
        hasSubFamilies: products.some(
          (p) => p.product.family.name !== category.name,
        ),
      };
    });

    setCategoriesWithProducts(result);
    setIsLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [shopId]);

  return { isLoading, categoriesWithProducts, refresh, error };
}
