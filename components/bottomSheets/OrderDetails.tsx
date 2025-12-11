import { useRef } from "react";

import globalTools, {
  formatCentsToEuros,
  formatQuantity,
} from "../../modules/globalTools";
import { getProductTotal } from "../../modules/CartTools";
import orderTools from "../../modules/orderTools";

import ActionSheet, {
  SheetManager,
  SheetProps,
  ScrollView,
  ActionSheetRef,
} from "react-native-actions-sheet";

import { View, Text, Linking } from "react-native";
import TextBody1 from "../utils/texts/Body1";
import TextBody2 from "../utils/texts/Body2";
import CardProducer from "../cards/ProducerSearchResult";
import TextHeading4 from "../utils/texts/Heading4";
import TextHeading3 from "../utils/texts/Heading3";
import OrderStatusBadge from "../utils/badges/OrderStatus";
import CustomButton from "../utils/buttons/Custom";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackLabelButton from "../utils/buttons/BackLabel";
import PriceBadge from "../utils/badges/Price";
import BadgeWithdrawStatus from "../../components/utils/badges/WithdrawStatus";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";
import Spinner from "../utils/Spinner";
import CloseSheetButton from "../utils/buttons/CloseSheet";
import IconButton from "../utils/buttons/Icon";

export default function OrderDetails(props: SheetProps<"order-details">) {
  const sheetRef = useRef<ActionSheetRef>(null);

  const order = props.payload?.order;

  const dayLabels = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  let clickCollectOrders = null;
  let marketOrders = null;
  let clickCollectOrdersDisplay: React.ReactNode = null;
  let marketOrdersDisplay: React.ReactNode = null;

  if (order) {
    clickCollectOrders = order.details.filter(
      (d) => d.withdrawMode === "clickCollect",
    );
    marketOrders = order.details.filter((d) => d.withdrawMode === "market");

    clickCollectOrdersDisplay = clickCollectOrders.map((cco) => {
      const productList = cco.products.map((p) => {
        return (
          <View
            key={p._id}
            className="flex flex-row justify-between items-center px-2"
          >
            <View className="w-4/6">
              <TextBody1>
                {p.product.product.family.name} {p.product.product.name}
              </TextBody1>
            </View>
            <View className="w-1/6">
              <TextBody2 centered>
                {formatQuantity(p.quantity, p.product.product.weight.unit)}
              </TextBody2>
            </View>
            <View className="w-1/6">
              <TextBody1 centered>
                {formatCentsToEuros(getProductTotal(p.product, p.quantity))}
              </TextBody1>
            </View>
          </View>
        );
      });

      return (
        <View key={cco._id} className="mb-5 flex items-center">
          <CardProducer
            shopData={cco.shop}
            withdrawData={cco.products}
            extraClasses="mb-1"
            displayMode="order"
            showDirectionButton
            onPressFn={() => {
              SheetManager.show("shop-details", {
                payload: {
                  shop: cco.shop,
                  showButtons: true,
                },
              });
            }}
          />

          <View className="w-full divide-y divide-dashed divide-black dark:divide-white mt-1">
            <View className="mb-1">{productList}</View>

            <View className="flex flex-row justify-between w-full px-1 pt-1">
              <View>
                <TextHeading4>Total :</TextHeading4>
              </View>
              <View className="pr-2">
                <TextHeading3>
                  {formatCentsToEuros(cco.shopTotalTTC)}
                </TextHeading3>
              </View>
            </View>
          </View>

          <View className="flex flex-row w-full justify-between mt-2">
            <View className="flex flex-row items-center rounded-lg bg-white dark:bg-tertiary py-2 px-5 mb-2">
              <Text className="text-black dark:text-white">Status : </Text>
              <OrderStatusBadge
                status={cco.status}
                extraClasses="ml-2 px-2 py-1"
              />
            </View>
            <View>
              {cco.status === "validated" && (
                <CustomButton
                  extraClasses="rounded-lg p-2 h-[40px] bg-success"
                  textClasses="text-white"
                  label="Afficher QR code"
                  onPressFn={() => handleQRCodePress(order._id)}
                />
              )}
            </View>
          </View>
        </View>
      );
    });

    marketOrdersDisplay = marketOrders.map((mo) => {
      const market = mo.shop?.markets.find(
        (m) => m.market.name === mo.withdrawMarket,
      );
      const marketLat = market?.market.address.latitude;
      const marketLon = market?.market.address.longitude;

      const productList = mo.products.map((p) => {
        return (
          <View
            key={p._id}
            className="flex flex-row justify-between items-center w-full px-2"
          >
            <View className="w-4/6">
              <TextBody1>
                {p.product.product.family.name} {p.product.product.name}
              </TextBody1>
            </View>
            <View className="w-1/6">
              <TextBody2 centered>
                {formatQuantity(p.quantity, p.product.product.weight.unit)}
              </TextBody2>
            </View>
            <View className="w-1/6">
              <TextBody1 centered>
                {formatCentsToEuros(getProductTotal(p.product, p.quantity))}
              </TextBody1>
            </View>
          </View>
        );
      });
      return (
        <View key={mo._id} className="my-2">
          <CardProducer
            shopData={mo.shop}
            withdrawData={mo.products}
            extraClasses="mb-1"
            displayMode="order"
            showDirectionButton={false}
            onPressFn={() => {
              SheetManager.show("shop-details", {
                payload: {
                  shop: mo.shop,
                  showButtons: true,
                },
              });
            }}
          />

          <View className="flex flex-row items-center rounded-lg px-3 py-1 bg-premiumbg mb-1">
            <View className="w-5/6">
              <View className="flex flex-row items-center">
                <View className="">
                  <Text className="text-[12px] text-lightbt">
                    Point de vente :{" "}
                  </Text>
                </View>
                <View className="w-auto">
                  <Text className="font-bold text-[14px] text-white">
                    {mo.withdrawMarket}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-center">
                <View className="">
                  <Text className="text-[12px] text-lightbt">
                    Jour de retrait :{" "}
                  </Text>
                </View>
                <View className="">
                  <Text className="font-bold text-[14px] text-white">
                    {dayLabels[mo.withdrawDay - 1]}
                  </Text>
                </View>
              </View>
            </View>
            <View className="w-1/6">
              <IconButton
                iconName="location-arrow"
                onPressFn={() => handleGoogleMap(marketLat, marketLon)}
                extraClasses="w-[50px] h-[50px] bg-primary"
              />
            </View>
          </View>

          <View className="w-full divide-y divide-dashed divide-black dark:divide-white mt-1">
            <View className="mb-1">{productList}</View>
            <View className="flex flex-row justify-between w-full px-1 pt-1">
              <View>
                <TextHeading4>Total :</TextHeading4>
              </View>
              <View className="pr-1">
                <TextHeading3>
                  {formatCentsToEuros(mo.shopTotalTTC)}
                </TextHeading3>
              </View>
            </View>
          </View>

          <View className="flex flex-row w-full justify-between mb-2">
            <View className="flex flex-row items-center rounded-lg bg-white dark:bg-tertiary py-2 px-5 mb-2">
              <Text className="text-black dark:text-white">Status : </Text>
              <OrderStatusBadge
                status={mo.status}
                extraClasses="ml-2 px-2 py-1"
              />
            </View>
            <View>
              {mo.status === "validated" && (
                <CustomButton
                  extraClasses="rounded-lg p-2 h-[40px] bg-success"
                  textClasses="text-white"
                  label="Afficher QR code"
                  onPressFn={() => handleQRCodePress(order._id)}
                />
              )}
            </View>
          </View>
        </View>
      );
    });
  }

  const handleQRCodePress = (id: string) => {
    SheetManager.show("qr-code", {
      payload: {
        orderId: id,
      },
    });
  };

  const handleOptimalRoute = () => {
    if (!order) return;

    const coords = order.details.map(
      (d) => `${d.shop?.address.latitude},${d.shop?.address.longitude}`,
    );

    let url = "";

    if (coords.length === 1) {
      url = `https.//www.google.com/maps/dir/.api=1&destination=${coords[0]}$travelmode=driving`;
    } else {
      const destination = coords[coords.length - 1];
      const waypoints = coords.slice(0, -1).join("|");

      url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    }
    console.log("Generated Maps URL:", url);
    Linking.openURL(url);
  };

  const handleGoogleMap = (
    lat: number | undefined,
    lon: number | undefined,
  ) => {
    if (!lat || !lon) {
      SheetManager.show("alert", {
        payload: {
          message: `Impossible d'utiliser Google Maps:\ndes coordonnées sont manquantes.`,
          alertType: "error",
        },
      });
    }
    const destination = `${lat},${lon}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <ActionSheet
      ref={sheetRef}
      snapPoints={[100]}
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
                >{`Commande\nn° ${order.invoiceNumber}`}</TextHeading3>
              </View>
              <View className="w-1/6">
                <CloseSheetButton
                  onPressFn={() => {
                    sheetRef.current?.hide();
                  }}
                />
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="px-3">
              <View className="flex flex-row w-full items-center justify-around mb-5">
                <View>
                  <TextHeading4 extraClasses="" centered>
                    {new Date(order.createdAt).toLocaleString()}
                  </TextHeading4>
                </View>
                <View>
                  <PriceBadge
                    colour="bg-tertiary"
                    extraClasses="px-3 py-1"
                    textClasses="font-bold text-lg"
                  >
                    {formatCentsToEuros(order.totalTTC)}
                  </PriceBadge>
                </View>
              </View>

              <View className="flex flex-row justify-center">
                <BadgeWithdrawStatus
                  type={orderTools.getOrderStatus(order)}
                  extraClasses="mb-5 flex-shrink"
                />
              </View>

              <View className="items-center">
                {clickCollectOrders &&
                  clickCollectOrders.length > 0 &&
                  clickCollectOrdersDisplay && (
                    <>
                      <TextHeading4 centered extraClasses="mb-2">
                        Retrait en Click & Collect
                      </TextHeading4>
                      {clickCollectOrdersDisplay}
                    </>
                  )}

                {marketOrders &&
                  marketOrders.length > 0 &&
                  marketOrdersDisplay && (
                    <>
                      <TextHeading4 centered extraClasses="mb-2">
                        Retrait en Points de vente
                      </TextHeading4>
                      {marketOrdersDisplay}
                    </>
                  )}
              </View>
              <View>
                {order.details.length > 1 && (
                  <View className="flex flex-row justify-center items-center w-full my-5">
                    <View className="p-2 rounded-lg border border-darkbg dark:border-lightbg">
                      <TextBody1 extraClasses="px-3 mb-2">
                        Optimisez vos trajets et calculez un itinéraire optimal
                        pour récupérer tous vos achats.
                      </TextBody1>
                      <ButtonPrimaryEnd
                        label="Itinéraire optimal"
                        iconName="location-arrow"
                        onPressFn={handleOptimalRoute}
                        extraClasses="mb-2"
                      />
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </ActionSheet>
  );
}
