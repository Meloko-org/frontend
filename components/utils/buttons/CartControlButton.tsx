import { useDispatch, useSelector } from "react-redux";
import { LightShopData, ShopData, StockData } from "../../../types/API";
import {
  addProductToCart,
  CartState,
  decreaseCartQuantity,
  increaseCartQuantity,
} from "../../../reducers/cart";

import { TouchableOpacity, View, Text } from "react-native";
import BadgeGrey from "../badges/Grey";
import IconButton from "./Icon";
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import shopTools from "../../../modules/shopTools";

type CartControlButtonProps = {
  stockData: StockData;
  shopData: LightShopData;
  quantityControllable?: boolean;
  extraClasses?: string;
};

export default function CartControlButton({
  stockData,
  shopData,
  quantityControllable,
  extraClasses,
}: CartControlButtonProps) {
  const dispatch = useDispatch();
  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );

  const shopId = shopData?._id;
  const stockId = stockData._id;
  const unit = stockData.product.weight.unit;
  const increment = unit === "gr" ? 100 : 1;

  const cart = cartStore.find((c) => c.shop?._id === shopId);
  const cartProduct = cart?.products.find((p) => p.stockData._id === stockId);
  const quantity = cartProduct?.quantity || 0;

  const formatQuantity = (quantity: number) => {
    if (unit === "gr") {
      return quantity < 1000
        ? `${quantity} gr`
        : `${(quantity / 1000).toFixed(1)} kg`;
    }
    return `${quantity}`;
  };

  const handleAddToCart = () => {
    dispatch(
      addProductToCart({
        shop: shopData,
        stockData,
        quantity: increment,
      }),
    );
  };

  const handleIncrease = () => {
    if (shopId) {
      dispatch(increaseCartQuantity({ shopId, stockId, increment }));
    }
  };

  const handleDecrease = () => {
    if (shopId) {
      dispatch(decreaseCartQuantity({ shopId, stockId, decrement: increment }));
    }
  };

  if (cartProduct) {
    return (
      <View
        className={` flex flex-column justify-center items-center ${extraClasses}`}
      >
        {quantityControllable && (
          <TouchableOpacity className="px-3 rounded" onPress={handleIncrease}>
            <FontAwesome5Icon name="plus" size={25} color="#98B66E" />
          </TouchableOpacity>
        )}
        <BadgeGrey extraClasses="px-2">{formatQuantity(quantity)}</BadgeGrey>
        {quantityControllable && (
          <TouchableOpacity className="px-4 rounded" onPress={handleDecrease}>
            <FontAwesome5Icon name="minus" size={25} color="#98B66E" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <IconButton
      iconName="cart-plus"
      onPressFn={handleAddToCart}
      extraClasses={`h-20 w-full bg-primary ${extraClasses}`}
    />
  );
}
