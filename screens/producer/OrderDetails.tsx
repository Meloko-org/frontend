import React, { JSX, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../../types/Navigation";

import { useSelector, UseSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import {
  OrderData,
  OrderDataForShop,
  OrderProduct,
  ProductData,
} from "../../types/API";

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
import TextHeading4 from "../../components/utils/texts/Heading4";

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
  const [isCanceling, setIsCanceling] = useState<boolean>(false);

  const { getToken } = useAuth();

  const [order, setOrder] = useState<OrderDataForShop | undefined>();
  // const [products, setProducts] = useState<JSX.Element[]>([]);
  const [subOrderId, setSubOrderId] = useState<string | undefined>();
  const [canceledProducts, setCanceledProducts] = useState<string[]>([]);
  const [status, setStatus] = useState<
    string | "pending" | "validated" | "withdrawn" | "canceled"
  >("pending");

  // const weekDays = [
  //   "Lundi",
  //   "Mardi",
  //   "Mercredi",
  //   "Jeudi",
  //   "Vendredi",
  //   "Samedi",
  //   "Dimanche",
  // ];

  // récupère un order avec un seul élément dans détails
  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const orderResponse = await orderTools.getOrderDetailsById(
        token,
        orderId,
      );

      if (!orderResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: orderResponse.message!,
            alertType: "error",
          },
        });

        navigation.navigate(from as never);
      } else if (orderResponse.success && orderResponse.data) {
        setOrder(orderResponse.data);
        setSubOrderId(orderResponse.data?.details[0]._id);
        // mise à jour du status
        setStatus(orderResponse.data?.details[0].status);
      }
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const getProductsFromOrder = (order: OrderDataForShop) => {
  //   const orderDetail = order.details[0];

  //   const orderProductsCards = orderDetail.products.map((product) => (
  //     <OrderProductCard
  //       key={product._id}
  //       orderProductData={product}
  //       extraClasses="mb-3"
  //       onPressFn={handleCanceledProducts}
  //       status={orderDetail.status}
  //     />
  //   ));

  //   setProducts(orderProductsCards);
  //   setSubOrderId(orderDetail._id);
  // };

  useEffect(() => {
    setOrder(undefined);
    setCanceledProducts([]);
    // setProducts([]);
    fetchOrder();
  }, [orderId]);

  // useEffect(() => {
  //   if (order && shopStore) {
  //     getProductsFromOrder(order);
  //   }
  // }, [order, shopStore]);

  console.log("subOrderId :", subOrderId);

  const handleUpdateSubOrder = async (
    newStatus: "canceled" | "pending" | "validated" | "withdrawn",
    callback?: (product: OrderProduct) => OrderProduct,
  ) => {
    try {
      if (!order || !shopStore || !subOrderId) return;

      if (newStatus !== "canceled") {
        setIsLoading(true);
      } else {
        setIsCanceling(true);
      }

      const updatedOrder = orderTools.buildUpdatedOrder({
        order,
        newStatus: newStatus,
        updateProductCallback: callback,
      });

      setOrder(updatedOrder);

      const token = await getToken();
      const values = {
        subOrderId,
        status: newStatus,
        canceledProducts,
      };

      console.log("values :", values);

      const response = await orderTools.updateSubOrder(token, orderId, values);

      // Alert.alert("Status de la commande", response?.message);

      SheetManager.show("alert", {
        payload: {
          message: response.message,
          error: response.error ? response.error : undefined,
          alertType: response.success ? "success" : "error",
        },
      });

      if (response?.success) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (newStatus !== "canceled") {
        setIsLoading(false);
      } else {
        setIsCanceling(false);
      }
    }
  };

  const handleCanceledProducts = (id: string) => {
    setCanceledProducts((prevState) => {
      const existingProduct = prevState?.find((product) => product === id);
      if (existingProduct) {
        return prevState?.filter((p) => p !== id);
      } else {
        return prevState ? [...prevState, id] : [id];
      }
    });
  };

  const renderButtons = () => {
    switch (status) {
      case "canceled":
        return (
          <View className="flex flex-row mx-3">
            <CustomButton
              label={`REMETTRE LA COMMANDE\nEN ATTENTE`}
              extraClasses="border border-primary bg-lightbg/90 dark:bg-transparent flex-1 mx-1 rounded-lg px-2 h-[60px]"
              textClasses="text-night dark:text-lightbg font-bold text-sm"
              onPressFn={() =>
                handleUpdateSubOrder("pending", (product) => ({
                  ...product,
                  isConfirmed: false,
                }))
              }
              isLoading={isCanceling}
            />
          </View>
        );
      case "pending":
        return (
          <>
            <View className="flex flex-row mx-3">
              <CustomButton
                label={`ANNULER LA COMMANDE`}
                extraClasses="bg-danger flex-1 mx-1 rounded-lg px-2 h-[80px]"
                textClasses="text-lightbg font-bold text-sm"
                onPressFn={() =>
                  handleUpdateSubOrder("canceled", (product) => ({
                    ...product,
                    isConfirmed: false,
                  }))
                }
                isLoading={isLoading}
              />
              <CustomButton
                label={`VALIDER`}
                extraClasses="bg-primary flex-1 mx-1 rounded-lg px-2 h-[80px]"
                textClasses="text-lightbg font-bold text-lg"
                onPressFn={() =>
                  handleUpdateSubOrder("validated", (product) => {
                    if (!canceledProducts.includes(product.product._id)) {
                      return { ...product, isConfirmed: true };
                    }
                    return product;
                  })
                }
                isLoading={isLoading}
              />
            </View>
          </>
        );
      case "validated":
        return (
          <>
            <View className="flex flex-row mx-3">
              <CustomButton
                label={`VALIDER LE RETRAIT`}
                extraClasses="bg-primary flex-1 mx-1 rounded-lg px-2 h-[80px]"
                textClasses="text-lightbg font-bold text-lg"
                onPressFn={() => handleUpdateSubOrder("withdrawn")}
                isLoading={isLoading}
              />
              {/* <Custom
                label={`REMETTRE LA COMMANDE\nEN ATTENTE`}
                extraClasses="border border-primary bg-lightbg/90 dark:bg-transparent flex-1 mt-5 mx-1 rounded-lg px-2 h-[60px]"
                textClasses="text-lightbg font-bold text-sm"
                onPressFn={() => handleUpdateOrder("pending", (product) => ({...product,isConfirmed: false}))}
                isLoading={isLoading}
              /> */}
            </View>
          </>
        );
      case "withdrawn":
        return null;

      default:
        return null;
    }
  };

  console.log("canceledProducts :", canceledProducts);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au tableau"}
          screen={from || "businessCenter"}
          label={screenTitle || "COMMANDES\nEN ATTENTE"}
          extraClasses="mt-2 mb-5"
        />
      </View>

      <View style={{ flex: 9 }}>
        {isLoading ? (
          <View className="w-full h-full flex items-center justify-center">
            <Spinner />
          </View>
        ) : (
          order && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="w-full flex-1 pb-5"
            >
              <View className="p-3">
                <OrderStatus orderData={order} status={status} />

                <View className="mt-5 mb-2">
                  <TextHeading4 centered>Détail</TextHeading4>
                  <TextBody2 centered>
                    (Cliquez sur un produit pour l'annuler avant de valider)
                  </TextBody2>
                </View>
                {/* {products} */}
                {order.details[0].products.map((p) => {
                  const productStatus = p.product.isDeleted
                    ? "deleted"
                    : !p.isConfirmed || canceledProducts.includes(p._id)
                      ? "canceled"
                      : "confirmed";

                  return (
                    <OrderProductCard
                      key={p._id}
                      orderProductData={p}
                      productStatus={productStatus}
                      extraClasses="mb-3"
                      onPressFn={handleCanceledProducts}
                      status={status}
                    />
                  );
                })}
              </View>
            </ScrollView>
          )
        )}
      </View>

      {status !== "withdrawn" && (
        <View style={{ flex: 1.5 }} className="pt-2">
          {renderButtons()}
        </View>
      )}
    </SafeAreaView>
  );
}
