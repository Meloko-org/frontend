import React, { useEffect, useState } from "react";
import { useSelector, UseSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, View, ActivityIndicator } from "react-native";
import TextHeading3 from "../components/utils/texts/Heading3";
import ButtonBack from "../components/utils/buttons/Back";
import { OrderData, ProductData, ProductDetail } from "../types/API";

import { useNavigation } from "@react-navigation/native";
import TextHeading4 from "../components/utils/texts/Heading4";
import OrderStatus from "../components/cards/OrderStatus";
import TextBody1 from "../components/utils/texts/Body1";
import CardProduct from "../components/cards/Product";

import productsTools from "../modules/productsTools";
import orderTools from "../modules/orderTools";
import OrderProductCard from "../components/cards/OrderProductCard";
import Custom from "../components/utils/buttons/Custom";
import { ShopState } from "../reducers/shop";
import TextBody2 from "../components/utils/texts/Body2";
import Spinner from "../components/utils/Spinner";
import BackLabelButton from "../components/utils/buttons/BackLabel";

type OrderDetailsProps = {
  route: Route;
};

type Route = {
  params: Params;
};

type Params = {
  orderId: string;
};

export default function OrderDetailsScreen({ route }: OrderDetailsProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const navigation = useNavigation();
  const orderId = route.params.orderId;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { getToken } = useAuth();

  const [order, setOrder] = useState<OrderData | undefined>();
  const [products, setProducts] = useState<string[]>([]);
  const [subOrderId, setSubOrderId] = useState<string | undefined>();
  const [withdrawMarket, setWithdrawMarket] = useState<string>();
  const [withdrawDay, setWithdrawDay] = useState<string>();

  const [status, setStatus] = useState<
    "pending" | "validated" | "withdrawn" | "canceled"
  >("pending");
  const [canceledProducts, setCanceledProducts] = useState<string[]>([]);

  const weekDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const orderPromise = await orderTools.getOrderDetailsById(token, orderId);
      setOrder(orderPromise);
      // mise à jour du status
      const shopDetails = orderPromise.details.find(
        (detail: string) => detail.shop === shopStore._id,
      );
      setStatus(shopDetails.status);
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsFromOrder = (order: string, shopId: string) => {
    const shopDetails = order.details.find((detail) => detail.shop === shopId);

    if (!shopDetails) {
      console.warn(`no details found for shop ID: ${shopId}`);
      setProducts([]);
      return;
    }

    if (shopDetails.withdrawMode === "market") {
      setWithdrawMarket(shopDetails.withdrawMarket);
      setWithdrawDay(weekDays[shopDetails.withdrawDay]);
    }

    console.log("      --> FONCTION getproduct");
    console.log("      -->  status :", shopDetails.status);

    const orderProductsCards = shopDetails.products.map((product) => (
      <OrderProductCard
        key={product._id}
        orderProductData={product}
        extraClasses="mb-3"
        onPressFn={handleCanceledProducts}
        status={shopDetails.status}
      />
    ));

    setProducts(orderProductsCards);

    setSubOrderId(shopDetails._id);
    console.log(`   -->  subOrderId for shop ${shopId} - ${shopDetails._id}`);
  };

  useEffect(() => {
    setOrder(undefined);
    setProducts([]);
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order && shopStore) {
      getProductsFromOrder(order, shopStore._id);
    }
  }, [order, shopStore]);

  const handleUpdateOrder = async (
    newStatus: "canceled" | "pending" | "validated" | "withdrawn",
    callback?: (product: ProductDetail) => ProductDetail,
  ) => {
    try {
      setIsLoading(true);
      const updatedOrder = orderTools.buildUpdatedOrder({
        order,
        shopId: shopStore?._id,
        newStatus: newStatus,
        updateProductCallback: callback,
      });

      setOrder(updatedOrder);

      const token = await getToken();
      const values = { order: updatedOrder, status: newStatus };
      const response = await orderTools.validateOrder(token, values, orderId);

      Alert.alert("Status de la commande", response.message);

      if (response.result) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCanceledProducts = (id: string) => {
    setCanceledProducts((prevState) => {
      const existingProduct = prevState?.find((product) => product === id);
      if (existingProduct) {
        return prevState?.filter((p) => p !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  const renderButtons = () => {
    switch (status) {
      case "canceled":
        return (
          <Custom
            label={`REMETTRE LA COMMANDE\nEN ATTENTE`}
            extraClasses="border border-primary bg-lightbg/90 dark:bg-transparent flex-1 mt-5 mx-1 rounded-lg px-2 h-[60px]"
            textClasses="text-lightbg font-bold text-sm"
            onPressFn={() =>
              handleUpdateOrder("pending", (product) => ({
                ...product,
                isConfirmed: false,
              }))
            }
            isLoading={isLoading}
          />
        );
      case "pending":
        return (
          <>
            <Custom
              label={`VALIDER`}
              extraClasses="bg-primary flex-1 mb-5 mx-1 rounded-lg px-2 h-[80px]"
              textClasses="text-lightbg font-bold text-lg"
              onPressFn={() =>
                handleUpdateOrder("validated", (product) => {
                  if (!canceledProducts.includes(product.product._id)) {
                    console.log("   -->  canceled :", canceledProducts);
                    console.log("   -->  id :", product.product._id);
                    return { ...product, isConfirmed: true };
                  }
                  return product;
                })
              }
              isLoading={isLoading}
            />
            <Custom
              label={`ANNULER LA COMMANDE`}
              extraClasses="bg-danger flex-1 mt-5 mx-1 rounded-lg px-2 h-[60px]"
              textClasses="text-lightbg font-bold text-sm"
              onPressFn={() =>
                handleUpdateOrder("canceled", (product) => ({
                  ...product,
                  isConfirmed: false,
                }))
              }
              isLoading={isLoading}
            />
          </>
        );
      case "validated":
        return (
          <>
            <Custom
              label={`VALIDER LE RETRAIT`}
              extraClasses="bg-primary flex-1 mx-1 mb-5 rounded-lg px-2 h-[80px]"
              textClasses="text-lightbg font-bold text-lg"
              onPressFn={() => handleUpdateOrder("withdrawn")}
              isLoading={isLoading}
            />
            {/* <Custom
              label={`REMETTRE LA COMMANDE\nEN ATTENTE`}
              extraClasses="border border-primary bg-lightbg/90 dark:bg-transparent flex-1 mt-5 mx-1 rounded-lg px-2 h-[60px]"
              textClasses="text-lightbg font-bold text-sm"
              onPressFn={() => handleUpdateOrder("pending", (product) => ({...product,isConfirmed: false}))}
              isLoading={isLoading}
            /> */}
          </>
        );
      case "withdrawn":
        return null;

      default:
        return null;
    }
  };

  console.log("   --> ORDERDETAILS");
  console.log("   -->  canceled :", canceledProducts);

  console.log("-----------------------------------------------------------");

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 pb-5"
      >
        <View className="flex flex-row mb-5 mt-3">
          <BackLabelButton
            onPressFn={() =>
              navigation.navigate("TabNavigatorProducer", { screen: "Sales" })
            }
            extraClasses="ml-5"
          >
            Retour aux commandes
          </BackLabelButton>
        </View>

        <View className="mb-3">
          <TextHeading3 centered>Détail commande</TextHeading3>
        </View>

        {isLoading ? (
          <Spinner />
        ) : (
          order && (
            <View className="px-3">
              <OrderStatus orderData={order} status={status} />

              {withdrawMarket && withdrawDay && (
                <View className="rounded-lg border bg-white dark:bg-tertiary p-2">
                  <View className="flex flex-row w-full items-center">
                    <View className="w-2/6">
                      <TextBody2>Place de marché :</TextBody2>
                    </View>
                    <View className="w-4/6">
                      <TextBody1>{withdrawMarket}</TextBody1>
                    </View>
                  </View>
                  <View className="flex flex-row w-full items-center">
                    <View className="w-2/6">
                      <TextBody2>Jour de retrait :</TextBody2>
                    </View>
                    <View className="w-4/6">
                      <TextBody1>{withdrawDay}</TextBody1>
                    </View>
                  </View>
                </View>
              )}

              <View className="mt-5 mb-2">
                <TextBody1 centered>Détail</TextBody1>
                <TextBody2 centered>
                  (Cliquez sur un produit pour l'annuler avant de valider)
                </TextBody2>
              </View>
              {products}

              <View className="mt-5 mb-4">{renderButtons()}</View>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
