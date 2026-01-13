import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";

import savTools from "../../modules/savTools";
import { getProductName } from "../../helpers/productHelpers";
import { formatCentsToEuros } from "../../modules/globalTools";
import orderTools from "../../modules/orderTools";
import { OrderData } from "../../types/API";

import { Text, View } from "react-native";
import Spinner from "../utils/Spinner";
import TextHeading3 from "../utils/texts/Heading3";
import CloseSheetButton from "../utils/buttons/CloseSheet";
import TextHeading4 from "../utils/texts/Heading4";
import { Picker } from "@react-native-picker/picker";
import SecondaryButton from "../utils/buttons/Secondary";
import PrimaryButton from "../utils/buttons/Primary";
import TextBody1 from "../utils/texts/Body1";

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
  const snapPoint = props.payload?.savContext.type === "order" ? [65] : [85];

  const { getToken } = useAuth();

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isRefunding, setIsRefunding] = useState<boolean>(false);

  const [order, setOrder] = useState<OrderData | null>(null);
  const [selectedOrderReason, setSelectedOrderReason] = useState<RefundReason>(
    RefundReason.ORDER_ERROR,
  );
  const [selectedProductReason, setSelectedProductReason] =
    useState<RefundReason>(RefundReason.PRODUCT_BAD);

  const subOrder = useMemo(() => order?.details?.[0], [order]);

  // const productIds: string[] = [];

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
            <View
              style={{ shadowColor: "#000" }}
              className="rounded-lg shadow-lg bg-white dark:bg-tertiary p-2 mb-5"
            >
              <TextHeading4 extraClasses="ml-3 mb-3">
                Remboursement commande
              </TextHeading4>
              <TextBody1 centered extraClasses="mb-2">
                Le client demande un remboursement total de la commande.
              </TextBody1>
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
              {renderButtons()}
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
            {!savContext.pickedUp && (
              <View
                style={{ shadowColor: "#000" }}
                className="rounded-lg shadow-lg bg-white dark:bg-tertiary p-2 mb-5"
              >
                <TextHeading4 extraClasses="ml-3 mb-3">
                  Mise à jour produit
                </TextHeading4>
                <TextBody1 centered extraClasses="mb-2">
                  Le produit a finalement été retiré
                </TextBody1>
                <View className="px-5">
                  <PrimaryButton
                    label="Indiquer comme retiré"
                    onPressFn={handleUpdatePickUpProduct}
                    isLoading={isUpdating}
                    extraClasses="h-14"
                  />
                </View>
              </View>
            )}

            <View
              style={{ shadowColor: "#000" }}
              className="rounded-lg shadow-lg bg-white dark:bg-tertiary p-2 mt-5"
            >
              <TextHeading4 extraClasses="ml-3 mb-3">
                Remboursement produit
              </TextHeading4>
              <TextBody1 centered extraClasses="mb-2">
                Le client demande un remboursement.
              </TextBody1>
              <View className="p-3 bg-darkbg/20 dark:bg-lightbg/20 rounded-lg mb-5">
                <View className="flex flex-row justify-around mb-5">
                  <Text className="font-bold text-lg text-black dark:text-white">
                    {`${productName?.toUpperCase()}`}
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

              {renderButtons()}
            </View>
          </>
        );
      default:
        return null;
    }
  };

  const renderButtons = () => {
    return (
      <View className="flex flex-row w-[50%] justify-around mt-5 w-full">
        <SecondaryButton
          label="Annuler"
          onPressFn={() => {
            SheetManager.hide(props.sheetId, {
              payload: null,
            });
          }}
          extraClasses="h-12 px-2"
        />
        <PrimaryButton
          label="Confirmer"
          onPressFn={handleRefund}
          isLoading={isRefunding}
        />
      </View>
    );
  };

  const handleUpdatePickUpProduct = async () => {
    if (savContext.type !== "product" || !order) return;

    setIsUpdating(true);

    const token = await getToken();
    const values = {
      subOrderId: savContext.subOrderId,
      productId: savContext.productId,
      pickedUp: true,
    };
    console.log(values);
    const productResponse = await savTools.updateOrderProductPickedUp(
      token,
      order._id,
      values,
    );

    setIsUpdating(false);

    if (!productResponse.success && productResponse.message) {
      SheetManager.show("alert", {
        payload: {
          message: productResponse.message,
          alertType: "error",
        },
      });
      return;
    }

    SheetManager.hide(props.sheetId, {
      payload: {
        order: productResponse.data,
        message: productResponse.message,
      },
    });
  };

  const handleRefund = async () => {
    if (!savContext.type || !subOrder || !order) return;

    setIsRefunding(true);

    const token = await getToken();
    let refundableProductIds = [];
    let values;

    switch (savContext.type) {
      case "order":
        const refundableProducts = subOrder.products.filter(
          (p) => p.productStatus === "confirmed" && !p.refunded,
        );
        refundableProductIds = refundableProducts.map((p) => p._id);

        values = {
          subOrderId: savContext.subOrderId,
          productIds: refundableProductIds,
          reason: selectedOrderReason,
          scope: "order",
        };
        break;

      case "product":
        refundableProductIds.push(savContext.productId);

        values = {
          subOrderId: savContext.subOrderId,
          productIds: refundableProductIds,
          reason: selectedProductReason,
          scope: "product",
        };
        break;
    }

    console.log("values: ", values);
    const refundResponse = await savTools.refundOrderProducts(
      token,
      order._id,
      values,
    );
    setIsRefunding(false);

    if (!refundResponse?.success && refundResponse.message) {
      SheetManager.show("alert", {
        payload: {
          message: refundResponse?.message,
          alertType: "error",
        },
      });
      return;
    }

    if (refundResponse.refundsPending.length > 0)
      SheetManager.hide(props.sheetId, {
        payload: {
          order: refundResponse.data,
          message:
            refundResponse.refundsPending.length > 0
              ? "Un remboursement est en cours."
              : refundResponse.message,
        },
      });
  };

  return (
    <ActionSheet
      ref={sheetRef}
      snapPoints={snapPoint}
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
            <View className="flex flex-row w-full items-center my-2 mb-5">
              <View className="w-1/6"></View>
              <View className="w-4/6">
                <TextHeading3 extraClasses="mb-3" centered>
                  SAV Produit
                </TextHeading3>
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
          </>
        )}
      </View>
    </ActionSheet>
  );
}
