import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList, UserTabParamList } from "../../types/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import globalTools, {
  formatCentsToEuros,
  formatQuantity,
} from "../../modules/globalTools";
import { getProductTotal } from "../../modules/CartTools";

import { OrderData } from "../../types/API";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { SheetManager } from "react-native-actions-sheet";

import Spinner from "../../components/utils/Spinner";
import { View, Text, Linking } from "react-native";
import TopBar from "../../components/TopBar";
import orderTools from "../../modules/orderTools";
import TextBody1 from "../../components/utils/texts/Body1";
import TextBody2 from "../../components/utils/texts/Body2";
import CardProducer from "../../components/cards/ProducerSearchResult";
import TextHeading4 from "../../components/utils/texts/Heading4";
import TextHeading3 from "../../components/utils/texts/Heading3";
import OrderStatusBadge from "../../components/utils/badges/OrderStatus";
import IconButton from "../../components/utils/buttons/Icon";
import PriceBadge from "../../components/utils/badges/Price";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import BadgeWithdrawStatus from "../../components/utils/badges/WithdrawStatus";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InvoiceSection from "../../components/InvoiceSection";

type OrderDetailsRouteProp = RouteProp<UserTabParamList, "UserOrderDetails">;

type OrderDetailsNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList, "UserOrderDetails">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: OrderDetailsNavProp;
  route: OrderDetailsRouteProp;
};

export default function UserOrderDetailsScreen({ navigation, route }: Props) {
  console.log("route params: ", route.params);
  const { backLabel, from, screenTitle, orderId } = route.params || {};

  const { getToken } = useAuth();

  const [order, setOrder] = useState<OrderData | null>();

  const fetchOrder = async (orderId: string) => {
    const token = await getToken();
    const OrderResponse = await orderTools.getUserOrderById(token, orderId);

    if (!OrderResponse.success && OrderResponse.message) {
      SheetManager.show("alert", {
        payload: {
          message: OrderResponse.message,
          alertType: "error",
        },
      });
    }

    setOrder(OrderResponse.data);
  };

  useEffect(() => {
    (async () => {
      await fetchOrder(orderId);
    })();
  }, [orderId]);

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
      const hasInvoice = cco.invoice;

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
            <View className="w-1/6 items-end">
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

          {/* Product list & total */}
          <View className="w-full divide-y divide-dashed divide-black dark:divide-white my-3">
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

          {/* status & QR code */}
          <View
            style={{ shadowColor: "#000" }}
            className="flex flex-row shadow-md rounded-lg bg-white dark:bg-tertiary justify-between mb-3 py-1 mx-2"
          >
            <View className="flex flex-row px-3 mb-2 h-full items-center">
              <Text className="text-black dark:text-white">Status : </Text>
              <OrderStatusBadge
                status={cco.status}
                extraClasses="ml-2 px-2 py-1"
              />
            </View>

            <View className="flex flex-row items-center justify-around flex-grow">
              {hasInvoice && (
                <>
                  <Text className="text-black text-center dark:text-white">{`QR code`}</Text>
                  <IconButton
                    iconName="qrcode"
                    iconColor="white"
                    iconFamily="FontAwesomeIcon"
                    buttonColor="bg-success"
                    size={30}
                    extraClasses="p-2 w-12"
                    onPressFn={() => handleQRCodePress(order._id)}
                  />
                </>
              )}
            </View>
          </View>

          <InvoiceSection
            subOrder={cco}
            from="UserOrderDetails"
            backLabel="Retour à la commande"
            screenTitle="Facture"
          />
        </View>
      );
    });

    marketOrdersDisplay = marketOrders.map((mo) => {
      const market = mo.shop?.markets.find(
        (m) => m.market.name === mo.withdrawMarket,
      );
      const marketLat = market?.market.address.latitude;
      const marketLon = market?.market.address.longitude;

      const hasInvoice = mo.invoice;

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
            <View className="w-1/6 items-end">
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
            extraClasses="mb-3"
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

          <View className="flex flex-row items-center rounded-lg px-3 py-1 bg-premiumbg mb-3">
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

          {/* Product list & total */}
          <View className="w-full divide-y divide-dashed divide-black dark:divide-white mb-2">
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

          {/* status & QR code */}
          <View
            style={{ shadowColor: "#000" }}
            className="flex flex-row shadow-md rounded-lg bg-white dark:bg-tertiary justify-between mb-3 py-1 mx-2"
          >
            <View className="flex flex-row px-3 mb-2 h-full items-center">
              <Text className="text-black dark:text-white">Status : </Text>
              <OrderStatusBadge
                status={mo.status}
                extraClasses="ml-2 px-2 py-1"
              />
            </View>

            <View className="flex flex-row items-center justify-around flex-grow">
              {hasInvoice && (
                <>
                  <Text className="text-black text-center dark:text-white">{`QR code`}</Text>
                  <IconButton
                    iconName="qrcode"
                    iconColor="white"
                    iconFamily="FontAwesomeIcon"
                    buttonColor="bg-success"
                    size={30}
                    extraClasses="p-2 w-12"
                    onPressFn={() => handleQRCodePress(order._id)}
                  />
                </>
              )}
            </View>
          </View>

          <InvoiceSection
            subOrder={mo}
            from="UserOrderDetails"
            backLabel="Retour à la commande"
          />
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

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
        <View className="flex items-center justify-center h-full w-full">
          <Spinner />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour aux commandes"}
          screen={from || "OrdersCustomer"}
          label={screenTitle || "DETAIL\nCOMMANDE"}
          extraClasses="mt-2 mb-5"
        />
      </View>

      <View style={{ flex: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false} className="px-5">
          <View className="">
            <TextHeading3 extraClasses="mb-3" centered>
              {`Commande\nn° ${order.orderNumber}`}
            </TextHeading3>
          </View>

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

            {marketOrders && marketOrders.length > 0 && marketOrdersDisplay && (
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
                    Optimisez vos trajets et calculez un itinéraire optimal pour
                    récupérer tous vos achats.
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
      </View>
    </SafeAreaView>
  );
}
