import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";

import { Text, View } from "react-native";
import Spinner from "../utils/Spinner";
import { OrderData } from "../../types/API";
import orderTools from "../../modules/orderTools";
import TextHeading3 from "../utils/texts/Heading3";
import CloseSheetButton from "../utils/buttons/CloseSheet";
import TextHeading4 from "../utils/texts/Heading4";
import { formatCentsToEuros } from "../../modules/globalTools";
import { Picker } from "@react-native-picker/picker";
import SecondaryButton from "../utils/buttons/Secondary";
import PrimaryButton from "../utils/buttons/Primary";
import { getProductName } from "../../helpers/productHelpers";

export enum RefundReason {
  ORDER_ERROR = "order_error",
  NON_CONFORM = "non_conform",
  COMMERCIAL = "commercial",
  PRODUCT_BAD = "product_bad",
  PRODUCT_MISSING = "product_missing",
  OTHER = "other",
}

export default function SAV(props: SheetProps<"sav">) {
  const sheetRef = useRef<ActionSheetRef>(null);

  const { getToken } = useAuth();

  const [order, setOrder] = useState<OrderData | null>(null);
  const [selectedOrderReason, setSelectedOrderReason] = useState<RefundReason>(
    RefundReason.ORDER_ERROR,
  );
  const [selectedProductReason, setSelectedProductReason] =
    useState<RefundReason>(RefundReason.PRODUCT_BAD);

  const fetchOrder = async () => {
    try {
      if (!props.payload) return;

      const token = await getToken();
      const orderResponse = await orderTools.getOrderDetailsById(
        token,
        props.payload.savContext.orderId,
      );

      if (!orderResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: orderResponse.message
              ? orderResponse.message
              : "Impossible de récupérer la commande",
            alertType: "error",
          },
        });
        return;
      }

      setOrder(orderResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const savContext = props.payload?.savContext;
  if (!savContext) return null;

  const renderContent = () => {
    if (!order) return;

    const subOrder = order.details.find((d) => d._id === savContext.subOrderId);

    if (!subOrder) return;

    switch (savContext.type) {
      case "order":
        return (
          <>
            <TextHeading4 centered>
              Remboursement total de la commande
            </TextHeading4>
            <View className="p-3 bg-darkbg/20 dark:bg-lightbg/20 rounded-lg my-5">
              <View className="flex flex-row justify-around">
                <Text className="font-bold text-lg text-black dark:text-white">
                  Montant à rembourser
                </Text>
                <Text className="font-bold text-xl text-black dark:text-white">
                  {formatCentsToEuros(subOrder.shopTotalTTC)}
                </Text>
              </View>
              <Text className="text-center text-black dark:text-white">
                Ce remboursement concerne tous les produits non encore
                remboursés.
              </Text>
            </View>
            <TextHeading4 centered>Raison du remboursement</TextHeading4>
            <View className="flex justify-center rounded-lg p-1 bg-darkbg/20 dark:bg-lightbg/20 h-[40px]">
              <Picker
                selectedValue={selectedOrderReason}
                onValueChange={(value) => setSelectedOrderReason(value)}
              >
                <Picker.Item
                  label="Erreur de commande"
                  value={RefundReason.ORDER_ERROR}
                />
                <Picker.Item
                  label="Produit non conforme"
                  value={RefundReason.NON_CONFORM}
                />
                <Picker.Item
                  label="Geste commercial"
                  value={RefundReason.COMMERCIAL}
                />
                <Picker.Item label="Autre" value={RefundReason.OTHER} />
              </Picker>
            </View>
          </>
        );
      case "product":
        const productDetail = subOrder.products.find(
          (p) => p._id === savContext.productId,
        );
        if (!productDetail) return;

        const productName = getProductName(productDetail.product);

        return (
          <>
            <TextHeading4 centered>Remboursement d'un produit</TextHeading4>
            <View className="p-3 bg-darkbg/20 dark:bg-lightbg/20 rounded-lg my-5">
              <View className="flex flex-row justify-around">
                <Text className="font-bold text-lg text-black dark:text-white">
                  {`${productName}`}
                </Text>
                <Text className="font-bold text-lg text-black dark:text-white">
                  {`${productDetail.quantity} ${productDetail.unit}`}
                </Text>
              </View>
              <View className="flex flex-row justify-around">
                <Text className="font-bold text-lg text-black dark:text-white">
                  Montant à rembourser
                </Text>
                <Text className="font-bold text-xl text-black dark:text-white">
                  {formatCentsToEuros(productDetail.totalPriceTTC)}
                </Text>
              </View>
            </View>
            <TextHeading4 centered>Raison du remboursement</TextHeading4>
            <View className="flex justify-center rounded-lg p-1 bg-darkbg/20 dark:bg-lightbg/20 h-[40px]">
              <Picker
                selectedValue={selectedProductReason}
                onValueChange={(value) => setSelectedProductReason(value)}
              >
                <Picker.Item
                  label="Produit abîmé"
                  value={RefundReason.PRODUCT_BAD}
                />
                <Picker.Item
                  label="Produit manquant"
                  value={RefundReason.PRODUCT_MISSING}
                />
                <Picker.Item
                  label="erreur de qualité"
                  value={RefundReason.NON_CONFORM}
                />
                <Picker.Item
                  label="Geste commercial"
                  value={RefundReason.COMMERCIAL}
                />
                <Picker.Item label="Autre" value={RefundReason.OTHER} />
              </Picker>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ActionSheet
      ref={sheetRef}
      snapPoints={[65]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="bg-lightbg dark:bg-darkbg w-full h-full">
        {!order ? (
          <View className="flex items-center justify-center w-full h-full">
            <Spinner />
          </View>
        ) : (
          <>
            <View className="flex flex-row w-full items-center mb-5">
              <View className="w-1/6"></View>
              <View className="w-4/6">
                <TextHeading3
                  extraClasses="mb-3"
                  centered
                >{`Commande\nn° ${order.orderNumber}`}</TextHeading3>
              </View>
              <View className="w-1/6 flex content-start h-full">
                <CloseSheetButton
                  onPressFn={() => {
                    sheetRef.current?.hide();
                  }}
                />
              </View>
            </View>

            <View className="w-full px-3 mb-5">{renderContent()}</View>

            <View className="flex flex-row w-[50%] justify-around mt-5 w-full">
              <SecondaryButton
                label="Annuler"
                onPressFn={() => {
                  SheetManager.hide(props.sheetId, {
                    payload: false,
                  });
                }}
                extraClasses="h-12 px-2"
              />
              <PrimaryButton
                label="Confirmer"
                onPressFn={() => {
                  SheetManager.hide(props.sheetId, {
                    payload: true,
                  });
                }}
              />
            </View>
          </>
        )}
      </View>
    </ActionSheet>
  );
}
