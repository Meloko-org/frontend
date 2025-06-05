import { useDispatch, useSelector } from "react-redux";
import { StockData } from "../../../types/API";
import {
  addProductToCart,
  CartState,
  decreaseCartQuantity,
  increaseCartQuantity,
} from "../../../reducers/cart";

import { TouchableOpacity, View, Text } from "react-native";
import BadgeGrey from "../badges/Grey";
import IconButton from "./Icon";

type CartControlButtonProps = {
  stockData: StockData;
  quantityControllable?: boolean;
  extraClasses?: string;
};

export default function CartControlButton({
  stockData,
  quantityControllable,
  extraClasses,
}: CartControlButtonProps) {
  const dispatch = useDispatch();
  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );

  const shopId = stockData.shop?._id;
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
        shop: stockData.shop,
        stockData,
        quantity: increment,
      }),
    );
  };

  const handleIncrease = () => {
    dispatch(increaseCartQuantity({ shopId, stockId, increment }));
  };

  const handleDecrease = () => {
    dispatch(decreaseCartQuantity({ shopId, stockId, decrement: increment }));
  };

  if (cartProduct) {
    return (
      <View
        className={` flex flex-column justify-center items-center ${extraClasses}`}
      >
        {quantityControllable && (
          <TouchableOpacity className="px-3 rounded" onPress={handleIncrease}>
            <Text className="text-3xl dark:text-lightbg">+</Text>
          </TouchableOpacity>
        )}
        <BadgeGrey extraClasses="px-2">{formatQuantity(quantity)}</BadgeGrey>
        {quantityControllable && (
          <TouchableOpacity className="px-4 rounded" onPress={handleDecrease}>
            <Text className="text-3xl dark:text-lightbg">-</Text>
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
