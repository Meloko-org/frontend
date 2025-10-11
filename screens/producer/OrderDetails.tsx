import React, { JSX, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../../types/Navigation";

import { useSelector, UseSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import { OrderData, ProductData, ProductDetail } from "../../types/API";

import orderTools from "../../modules/orderTools";
import globalTools from "../../modules/globalTools";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { SheetManager } from "react-native-actions-sheet";

import { Alert, View } from "react-native";
import TextHeading3 from "../../components/utils/texts/Heading3";
import OrderStatus from "../../components/cards/OrderStatus";
import TextBody1 from "../../components/utils/texts/Body1";
import OrderProductCard from "../../components/cards/OrderProductCard";
import CustomButton from "../../components/utils/buttons/Custom";
import TextBody2 from "../../components/utils/texts/Body2";
import Spinner from "../../components/utils/Spinner";
import TopBar from "../../components/TopBar";

type OrderDetailsRouteProp = RouteProp<ProducerTabParamList, "OrderDetails">;

type OrderDetailsNavProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "OrderDetails"
>;

type Props = {
  navigation: OrderDetailsNavProp;
  route: OrderDetailsRouteProp;
};

export default function OrderDetailsScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle, orderId } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { getToken } = useAuth();

  const [order, setOrder] = useState<OrderData | undefined>();
  const [products, setProducts] = useState<JSX.Element[]>([]);
  const [subOrderId, setSubOrderId] = useState<string | undefined>();
  const [withdrawMarket, setWithdrawMarket] = useState<string>();
  const [withdrawDay, setWithdrawDay] = useState<string>();

  const [status, setStatus] = useState<
    string | "pending" | "validated" | "withdrawn" | "canceled"
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
      const orderResponse = await orderTools.getOrderDetailsById(
        token,
        orderId,
      );

      console.log(
        "ORDERDETAILS :",
        JSON.stringify(orderResponse.data, null, 2),
      );

      if (!orderResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: orderResponse.message!,
            alertType: "error",
          },
        });
        navigation.navigate(from);
      } else {
        setOrder(orderResponse.data!);
        // mise à jour du status
        setStatus(orderResponse.data?.details[0].status!);
      }
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsFromOrder = (order: OrderData) => {
    const orderDetail = order.details[0];

    if (orderDetail.withdrawMode === "market") {
      setWithdrawMarket(orderDetail.withdrawMarket);
      setWithdrawDay(
        globalTools.getWeekDayLabel(Number(orderDetail.withdrawDay)),
      );
    }

    const orderProductsCards = orderDetail.products.map((product) => (
      <OrderProductCard
        key={product._id}
        orderProductData={product}
        extraClasses="mb-3"
        onPressFn={handleCanceledProducts}
        status={orderDetail.status}
      />
    ));

    setProducts(orderProductsCards);

    setSubOrderId(orderDetail._id);
  };

  useEffect(() => {
    setOrder(undefined);
    setProducts([]);
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order && shopStore) {
      getProductsFromOrder(order);
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
          <CustomButton
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
            <CustomButton
              label={`VALIDER`}
              extraClasses="bg-primary flex-1 mb-5 mx-1 rounded-lg px-2 h-[80px]"
              textClasses="text-lightbg font-bold text-lg"
              onPressFn={() =>
                handleUpdateOrder("validated", (product) => {
                  if (!canceledProducts.includes(product.product._id)) {
                    return { ...product, isConfirmed: true };
                  }
                  return product;
                })
              }
              isLoading={isLoading}
            />
            <CustomButton
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
            <CustomButton
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

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <TopBar
        backLabel={backLabel || "Retour au tableau"}
        screen={from || "businessCenter"}
        label={screenTitle || "COMMANDES\nEN ATTENTE"}
        extraClasses="mt-2 mb-5"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 pb-5"
      >
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
                      <TextBody2>Point de vente :</TextBody2>
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
