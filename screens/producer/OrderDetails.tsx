import React, { JSX, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { RouteProp } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// ✅ Import de tes types centralisés
import {
  RootStackParamList,
  ProducerTabParamList,
} from "../../types/Navigation";

import { useSelector, UseSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import {
  OrderData,
  OrderDataForShop,
  OrderProduct,
  ProductData,
  SavContextData,
  SubOrderIntent,
  SubOrderStatus,
  SubOrderStatusGroups,
} from "../../types/API";

import orderTools from "../../modules/orderTools";
import {
  getSubOrderStatusGroup,
  SUB_ORDER_GROUP_LABELS,
} from "../../helpers/orderHelpers";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { SheetManager } from "react-native-actions-sheet";

import { Alert, View, Text } from "react-native";
import TextHeading3 from "../../components/utils/texts/Heading3";
import OrderStatus from "../../components/cards/OrderStatus";
import TextBody1 from "../../components/utils/texts/Body1";
import OrderProductCard from "../../components/cards/OrderProductCard";
import CustomButton from "../../components/utils/buttons/Custom";
import TextBody2 from "../../components/utils/texts/Body2";
import Spinner from "../../components/utils/Spinner";
import TopBar from "../../components/TopBar";
import TextHeading4 from "../../components/utils/texts/Heading4";
import IconButton from "../../components/utils/buttons/Icon";
import MainButton from "../../components/utils/buttons/MainButton";

type OrderDetailsNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<ProducerTabParamList, "OrderDetails">,
  NativeStackNavigationProp<RootStackParamList>
>;

type OrderDetailsRouteProp = RouteProp<ProducerTabParamList, "OrderDetails">;

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
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const { getToken } = useAuth();

  const [order, setOrder] = useState<OrderDataForShop | undefined>();
  const [subOrderId, setSubOrderId] = useState<string | undefined>();
  const [cancelledProducts, setCancelledProducts] = useState<string[]>([]);
  const [notPickedUpProducts, setNotPickedUpProducts] = useState<string[]>([]);
  // const [status, setStatus] = useState<SubOrderStatus>("pending");
  const subOrder = order?.details[0];
  const status = subOrder?.status;

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
      }
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOrder(undefined);
    setCancelledProducts([]);
    fetchOrder();
  }, [orderId]);

  const hasInvoice = order && !!order.details[0].invoice;
  const hasCreditNote = order && !!order.details[0].creditNotes.length;

  // permet de désactiver le bouton "valider" en cas de stockIssue
  const hasBlockingStockIssue = useMemo(() => {
    if (!order) return false;
    if (!order.details[0].stockIssue) return false;

    return order.details[0].products.some((product) => {
      const available =
        product.product.stockTotal - product.product.stockReserved;

      const isOutOfStock = product.quantity > available;
      const isCancelled = cancelledProducts.includes(product._id);

      return isOutOfStock && !isCancelled;
    });
  }, [order, cancelledProducts]);

  // console.log("subOrderId :", subOrderId);
  // console.log("order :", JSON.stringify(order, null, 2));
  // console.log("shopStore :", shopStore);
  console.log("blocking :", hasBlockingStockIssue);

  const handleUpdateSubOrder = async (
    intent: SubOrderIntent,
    productIds?: string[],
  ) => {
    console.log("youpi");

    try {
      if (!order || !subOrderId) {
        // console.log("order :", Object.keys(order).length > 0)
        return;
      }

      if (intent === "cancel") {
        setIsCancelling(true);
      } else {
        setIsLoading(true);
      }

      const token = await getToken();
      const values = {
        subOrderId,
        intent,
        cancelledProductIds: productIds ?? cancelledProducts,
        notPickedUpProductIds: notPickedUpProducts,
      };

      console.log("values :", values);

      const response = await orderTools.updateSubOrder(token, orderId, values);

      const sheetMessage =
        response.refundsPending.length > 0
          ? response.message + `\nUn remboursement est en cours.`
          : response.message;

      SheetManager.show("alert", {
        payload: {
          message: sheetMessage,
          error: response.error ? response.error : undefined,
          alertType: response.success ? "success" : "error",
        },
      });

      if (response?.success) {
        console.log("updated status :", response.order.details[0].status);
        setOrder(response.order);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (intent !== "cancel") {
        setIsLoading(false);
      } else {
        setIsCancelling(false);
      }
    }
  };

  const handleCancelledProducts = (id: string) => {
    setCancelledProducts((prevState) => {
      const existingProduct = prevState?.find((product) => product === id);
      if (existingProduct) {
        return prevState?.filter((p) => p !== id);
      } else {
        return prevState ? [...prevState, id] : [id];
      }
    });
  };

  const handleNotPickUp = (id: string) => {
    setNotPickedUpProducts((prevState) => {
      const existingProducts = prevState.find((p) => p === id);
      if (existingProducts) {
        return prevState?.filter((p) => p !== id);
      } else {
        return prevState ? [...prevState, id] : [id];
      }
    });
  };

  const handleOpenSav = (context: SavContextData) => {
    console.log("context :", context);
    SheetManager.show("sav", {
      payload: {
        savContext: context,
      },
    });
  };

  const handleCancelSubOrder = async () => {
    const canCancel = await SheetManager.show("confirm", {
      payload: {
        message: "Etes vous sûr de vouloir annuler cette commande ?",
        alertType: "warning",
        buttonLabel: "Oui",
      },
    });

    if (canCancel) {
      console.log("youpi");
      if (!order) return;

      const subOrder = order.details[0];
      if (!subOrder) return;

      const allProductIds = subOrder.products.map((p) => p.product._id);

      const nextCancelledProducts = Array.from(
        new Set([...cancelledProducts, ...allProductIds]),
      );
      setCancelledProducts(nextCancelledProducts);
      handleUpdateSubOrder("cancel", nextCancelledProducts);
    }
  };

  const renderButtons = () => {
    switch (status) {
      case "pending":
        return (
          <>
            <View className="flex flex-row mx-3">
              <CustomButton
                label={`ANNULER LA COMMANDE`}
                extraClasses="bg-danger flex-1 mx-1 rounded-lg px-2 h-[80px]"
                textClasses="text-lightbg font-bold text-sm"
                onPressFn={handleCancelSubOrder}
                isLoading={isCancelling}
              />
              <CustomButton
                disabled={hasBlockingStockIssue}
                label={`VALIDER`}
                extraClasses={`
                  ${hasBlockingStockIssue ? "bg-primary/50" : "bg-primary"}
                  flex-1 mx-1 rounded-lg px-2 h-[80px]
                `}
                textClasses="text-lightbg font-bold text-lg"
                onPressFn={() => handleUpdateSubOrder("prepare")}
                isLoading={isLoading}
              />
            </View>
          </>
        );
      case "prepared":
      case "partially_prepared":
        return (
          <>
            <View className="flex flex-row mx-3">
              <CustomButton
                label={`VALIDER LE RETRAIT`}
                extraClasses="bg-primary flex-1 mx-1 rounded-lg px-2 h-[80px]"
                textClasses="text-lightbg font-bold text-lg"
                onPressFn={() => handleUpdateSubOrder("pick_up")}
                isLoading={isLoading}
              />
            </View>
          </>
        );
      case "picked_up":
      case "partially_picked_up":
        return (
          <>
            <View className="flex flex-row mx-3">
              <CustomButton
                label={`REMBOURSER LA COMMANDE`}
                extraClasses="bg-primary flex-1 mx-1 rounded-lg px-2 h-[80px]"
                textClasses="text-lightbg font-bold text-lg"
                onPressFn={() => {
                  if (order && subOrderId) {
                    handleOpenSav({
                      type: "order",
                      orderId: order._id,
                      subOrderId: subOrderId,
                    });
                  }
                }}
                isLoading={isLoading}
              />
            </View>
          </>
        );

      default:
        return null;
    }
  };

  const downloadPdf = async (id: string, path: "invoices" | "creditNotes") => {
    console.log("id :", id);
    console.log("path :", path);
    const token = await getToken();
    const pdfResponse = await orderTools.getPdfToShare(token, id, path);

    if (!pdfResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: pdfResponse.message,
          alertType: "error",
        },
      });
      return;
    }

    try {
      const filename =
        path === "invoices" ? `facture-${id}.pdf` : `avoir-${id}.pdf`;
      const fileUri = FileSystem.documentDirectory + filename;

      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(",")[1];

        if (!base64Data) return;

        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(fileUri);
      };

      reader.readAsDataURL(pdfResponse.blob);
    } catch (error) {
      console.error(error);
      SheetManager.show("alert", {
        payload: {
          message: "Impossible d’ouvrir le document.",
          alertType: "error",
        },
      });
    }
  };

  const displayPdf = (
    id: string,
    type: "invoice" | "creditNote",
    path: "invoices" | "creditNotes",
  ) => {
    console.log("id :", id);
    console.log("type :", type);
    console.log("path :", path);

    navigation.navigate("DisplayPdf", {
      from: "OrderDetails",
      backLabel: "Retour facture",
      screenTitle: "FACTURE",
      id: id,
      type,
      path,
    });
  };

  console.log("cancelledProducts :", cancelledProducts);
  console.log("notPickedUpProducts :", notPickedUpProducts);
  console.log("hasInvoice :", hasInvoice);

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
                <OrderStatus
                  orderData={order}
                  status={status}
                  extraClasses="mb-3"
                />

                <View className="flex flex-row justify-center">
                  {hasCreditNote && (
                    <View className="flex flex-row flex-shrink justify-center mr-2">
                      <View className="rounded-lg bg-tertiary/30 dark:bg-tertiary p-2 mb-3">
                        <Text className="text-white font-bold text-sm text-center mb-2">
                          AVOIR
                        </Text>
                        <View className="flex flex-row justify-around">
                          <MainButton
                            label="Partager"
                            buttonType="label-icon-top"
                            iconName="file-pdf"
                            iconColor="white"
                            iconFamily="FontAwesome6Icon"
                            bgColor="bg-withdrawn"
                            iconSize={25}
                            extraClasses="p-2 w-18 mr-2"
                            onPressFn={() =>
                              downloadPdf(
                                order.details[0].creditNotes[0],
                                "creditNotes",
                              )
                            }
                          />
                          <MainButton
                            label="Afficher"
                            buttonType="label-icon-top"
                            iconName="file-pdf"
                            iconColor="white"
                            iconFamily="FontAwesome6Icon"
                            bgColor="bg-partialWithdrawn"
                            iconSize={25}
                            extraClasses="p-2 w-18"
                            onPressFn={() =>
                              displayPdf(
                                order.details[0].creditNotes[0],
                                "creditNote",
                                "creditNotes",
                              )
                            }
                          />
                        </View>
                      </View>
                    </View>
                  )}
                  {hasInvoice && (
                    <View className="flex flex-row flex-shrink justify-center">
                      <View className="rounded-lg bg-tertiary/30 dark:bg-tertiary p-2 mb-3">
                        <Text className="text-white font-bold text-sm text-center mb-2">
                          FACTURE
                        </Text>
                        <View className="flex flex-row justify-around">
                          <MainButton
                            label="Partager"
                            buttonType="label-icon-top"
                            iconName="file-pdf"
                            iconColor="white"
                            iconFamily="FontAwesome6Icon"
                            bgColor="bg-validated"
                            iconSize={25}
                            extraClasses="p-2 w-18 mr-2"
                            onPressFn={() =>
                              downloadPdf(order.details[0].invoice, "invoices")
                            }
                          />
                          <MainButton
                            label="Afficher"
                            buttonType="label-icon-top"
                            iconName="file-pdf"
                            iconColor="white"
                            iconFamily="FontAwesome6Icon"
                            bgColor="bg-partialValidated"
                            iconSize={25}
                            extraClasses="p-2 w-18"
                            onPressFn={() =>
                              displayPdf(
                                order.details[0].invoice,
                                "invoice",
                                "invoices",
                              )
                            }
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <View className="mt-5 mb-2">
                  <TextHeading4 centered>Détail</TextHeading4>
                  <TextBody2 centered>
                    (Cliquez sur un produit pour l'annuler avant de valider)
                  </TextBody2>
                </View>
                {order &&
                  status &&
                  order.details[0].products.map((p) => {
                    return (
                      <OrderProductCard
                        key={p._id}
                        product={p}
                        subOrderStatus={status}
                        stockIssue={order.details[0].stockIssue}
                        cancelledProducts={cancelledProducts}
                        notPickedUpProducts={notPickedUpProducts}
                        extraClasses="mb-3"
                        onToggleNotPickUp={handleNotPickUp}
                        onToggleCancel={handleCancelledProducts}
                        onOpenSav={() => {
                          if (order && subOrderId) {
                            handleOpenSav({
                              type: "product",
                              orderId: order._id,
                              subOrderId: subOrderId,
                              productId: p._id,
                            });
                          }
                        }}
                      />
                    );
                  })}
              </View>
            </ScrollView>
          )
        )}
      </View>

      {renderButtons() !== null && (
        <View
          style={{ flex: 1.5 }}
          className="flex justify-center bg-darkbg dark:bg-lightbg"
        >
          {renderButtons()}
        </View>
      )}
    </SafeAreaView>
  );
}
