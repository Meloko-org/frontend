import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

// import {  } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../types/Navigation";

import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../../types/Navigation";

import { useDispatch, useSelector } from "react-redux";
import { OrdersState, setOrders } from "../../reducers/orders";
import { ShopState } from "../../reducers/shop";

import globalTools from "../../modules/globalTools";
import businessTools from "../../modules/businessTools";

import { OrderSummary } from "../../types/API";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { SheetManager } from "react-native-actions-sheet";

import { Picker } from "@react-native-picker/picker";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isWithinInterval,
} from "date-fns";

import { View } from "react-native";
import TextHeading4 from "../../components/utils/texts/Heading4";
import TextBody1 from "../../components/utils/texts/Body1";
import TextHeading3 from "../../components/utils/texts/Heading3";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import QRCodeScannerModal from "../../components/modals/producer/QRCodeScannerModal";
import Spinner from "../../components/utils/Spinner";

type BusinessCenterRouteProp = RouteProp<
  ProducerTabParamList,
  "BusinessCenter"
>;

type BusinessCenterNavProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "BusinessCenter"
>;

type Props = {
  navigation: BusinessCenterNavProp;
  route: BusinessCenterRouteProp;
};

export default function BusinessCenterScreen({ navigation, route }: Props) {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const ordersStore = useSelector(
    (state: { orders: OrdersState }) => state.orders.value,
  );
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [isFetchLoading, setFetchLoading] = useState<boolean>(true);

  const [lastOrder, setLastOrder] = useState<OrderSummary>();

  const [pendingOrders, setPendingOrders] = useState<OrderSummary[]>([]);
  const [validatedOrders, setValidatedOrders] = useState<OrderSummary[]>([]);
  const [withdrawnOrders, setWithdrawnOrders] = useState<OrderSummary[]>([]);
  const [canceledOrders, setCanceledOrders] = useState<OrderSummary[]>([]);

  const [isScannerVisible, setScannerVisible] = useState<boolean>(false);

  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month" | "year" | "total"
  >("month");
  const [orderCount, setOrederCount] = useState(0);

  type Financials = {
    revenus: number;
    commission: number;
    tva: number;
  };

  const [financials, setFinancials] = useState<Financials>({
    revenus: 0,
    commission: 0,
    tva: 0,
  });

  const getStartDate = (period: string) => {
    const now = new Date();
    switch (period) {
      case "day":
        return startOfDay(now);
      case "week":
        return startOfWeek(now, { weekStartsOn: 1 }); // lundi
      case "month":
        return startOfMonth(now);
      case "year":
        return startOfYear(now);
      case "total":
        return shopStore?.createdAt;
      default:
        return now;
    }
  };

  const fetchOrders = async () => {
    const token = await getToken();
    const ordersResponse = await businessTools.getOrderSummary(token);

    if (!ordersResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: "Impossible de récupérer les commandes.",
          alertType: "error",
        },
      });
      return;
    }

    // console.log("result :", JSON.stringify(ordersResponse.data, null, 2));

    dispatch(setOrders(ordersResponse.data || []));

    setLastOrder(ordersResponse?.data?.[0]);
    setFetchLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, []),
  );

  useEffect(() => {
    if (!ordersStore) return;

    const grouped = {
      pending: [] as OrderSummary[],
      validated: [] as OrderSummary[],
      withdrawn: [] as OrderSummary[],
      canceled: [] as OrderSummary[],
    };

    ordersStore.forEach((order) => {
      const status = order.detail?.status;

      switch (status) {
        case "pending":
        case "partialPending":
          grouped.pending.push(order);
          break;
        case "validated":
          grouped.validated.push(order);
          break;
        case "withdrawn":
        case "partialWithdrawn":
          grouped.withdrawn.push(order);
          break;
        case "canceled":
        case "partialCanceled":
          grouped.canceled.push(order);
          break;
        default:
          console.warn(`Status inconnu: ${status}`);
          break;
      }
    });

    setPendingOrders(grouped.pending);
    setValidatedOrders(grouped.validated);
    setWithdrawnOrders(grouped.withdrawn);
    setCanceledOrders(grouped.canceled);
  }, [ordersStore]);

  useEffect(() => {
    if (!ordersStore) return;

    const startDate = getStartDate(selectedPeriod);
    const now = new Date();

    let count = 0;
    let revenus = 0;

    ordersStore.forEach((order) => {
      const orderDate = new Date(order.createdAt);

      if (
        isWithinInterval(orderDate, {
          start: startDate,
          end: now,
        })
      ) {
        const price = order.detail.shopTotalPrice || 0;

        revenus += price;
        count++;
      }
      setOrederCount(count);
    });

    const commission = revenus * 0.15;
    const tva = revenus * 0.055; // ou adapte selon ta règle TVA

    setFinancials({ revenus, commission, tva });
  }, [ordersStore, selectedPeriod]);

  const handleScan = (orderId: string) => {
    console.log("orderId : ", orderId);
    setScannerVisible(false);
    // navigation.navigate("TabNavigatorProducer", {
    //   screen: "OrderDetails",
    //   params: { orderId },
    // });
  };

  console.log("BUSINESS lastorder : ", lastOrder);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <TextHeading3
        centered
        extraClasses="mb-5 mt-2"
      >{`Tableau de bord`}</TextHeading3>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 px-3"
      >
        {isFetchLoading ? (
          <Spinner />
        ) : (
          <>
            <View className="mb-3">
              <TextBody1 centered extraClasses="mb-1">
                Dernière commande :
              </TextBody1>
              <View className="flex-row items-center rounded-lg bg-white dark:bg-tertiary py-1 px-2 space-around w-full mb-3">
                <View className="flex-none">
                  <TextBody1>
                    {lastOrder?.user.firstname + " " + lastOrder?.user.lastname}
                  </TextBody1>
                </View>
                <View className="grow">
                  <TextBody1 centered>
                    {globalTools.formatDateToFr(lastOrder?.createdAt!)}
                  </TextBody1>
                </View>
                <View className="flex-none">
                  <TextBody1>
                    {lastOrder?.detail.shopTotalPrice + " €"}
                  </TextBody1>
                </View>
              </View>
            </View>

            <View className="mb-5">
              <OpenScreenButton
                label="Commandes en attente"
                notice={pendingOrders.length.toString()}
                noticeColor="bg-warning"
                onPressFn={() =>
                  navigation.navigate("PendingOrders", {
                    from: "BusinessCenter",
                    backLabel: "Retour au tableau",
                    screenTitle: "COMMANDES\nEN ATTENTE",
                  })
                }
                extraClasses="mb-1"
              />
              <OpenScreenButton
                label="Commandes validées"
                notice={validatedOrders.length.toString()}
                noticeColor="bg-emerald-800"
                onPressFn={() =>
                  navigation.navigate("ValidatedOrders", {
                    from: "BusinessCenter",
                    backLabel: "Retour au tableau",
                    screenTitle: "COMMANDES\nVALIDÉES",
                  })
                }
                extraClasses="mb-1"
              />
              <OpenScreenButton
                label="Commandes retirées"
                notice={withdrawnOrders.length.toString()}
                noticeColor="bg-primary"
                onPressFn={() =>
                  navigation.navigate("WithdrawnOrders", {
                    from: "BusinessCenter",
                    backLabel: "Retour au tableau",
                    screenTitle: "COMMANDES\nRETIRÉES",
                  })
                }
                extraClasses="mb-1"
              />
              <OpenScreenButton
                label="Commandes annulées"
                notice={canceledOrders.length.toString()}
                noticeColor="bg-danger"
                onPressFn={() =>
                  navigation.navigate("CanceledOrders", {
                    from: "BusinessCenter",
                    backLabel: "Retour au tableau",
                    screenTitle: "COMMANDES\nANNULÉES",
                  })
                }
                extraClasses="mb-1"
              />
              {/* <OpenScreenButton
                label="Toutes les commandes"
                notice={ordersStore.length.toString()}
                onPressFn={() =>
                  navigation.navigate("AllOrders", {
                    from: "BusinessCenter",
                    backLabel: "Retour à la boutique",
                    screenTitle: "TOUTES LES\nCOMMANDES",
                  })
                }
                extraClasses="mb-1"
              /> */}
            </View>

            <View className="px-3">
              <ButtonPrimaryEnd
                label="Scanner QR Code"
                iconName="qrcode"
                onPressFn={() => setScannerVisible(true)}
                extraClasses="mb-3 h-14"
              />
            </View>

            <View className="mt-5">
              <View className="flex flex-row items-center mb-3">
                <View className="w-[40%]">
                  <TextHeading3 centered extraClasses="my-1">
                    Finances
                  </TextHeading3>
                </View>
                <View className="w-[60%]">
                  <View className="flex justify-center rounded-lg p-1 bg-gray-400 h-[40px]">
                    {/* <TextBody2 centered>7 derniers jours</TextBody2> */}
                    <Picker
                      selectedValue={selectedPeriod}
                      onValueChange={(value) => setSelectedPeriod(value)}
                    >
                      <Picker.Item label="Aujourd'hui" value="day" />
                      <Picker.Item label="Cette semaine" value="week" />
                      <Picker.Item label="Ce mois" value="month" />
                      <Picker.Item label="Cette année" value="year" />
                      <Picker.Item label="Total" value="total" />
                    </Picker>
                  </View>
                </View>
              </View>

              <View className="flex flex-row items-center px-4">
                <View className="w-[70%]">
                  <TextBody1 extraClasses="my-1">Nombre de commandes</TextBody1>
                </View>
                <View className="w-[30%]">
                  <View className="flex items-end">
                    <TextHeading4 extraClasses="text-right">
                      {orderCount}
                    </TextHeading4>
                  </View>
                </View>
              </View>

              <View className="flex flex-row items-center px-4">
                <View className="w-[50%]">
                  <TextBody1 extraClasses="my-1">
                    Chiffre d'affaire HT
                  </TextBody1>
                </View>
                <View className="w-[50%]">
                  <View className="flex items-end">
                    <TextHeading4 extraClasses="text-right">
                      {financials.revenus.toFixed(2)} €
                    </TextHeading4>
                  </View>
                </View>
              </View>

              <View className="flex flex-row items-center px-4">
                <View className="w-[50%]">
                  <TextBody1 extraClasses="my-1">Commission Meloko</TextBody1>
                </View>
                <View className="w-[50%]">
                  <View className="flex items-end">
                    <TextHeading4 extraClasses="text-right">
                      {financials.commission.toFixed(2)} €
                    </TextHeading4>
                  </View>
                </View>
              </View>

              <View className="flex flex-row items-center px-4">
                <View className="w-[50%]">
                  <TextBody1 extraClasses="my-1">TVA sur ventes</TextBody1>
                </View>
                <View className="w-[50%]">
                  <View className="flex items-end">
                    <TextHeading4 extraClasses="text-right">
                      {financials.tva.toFixed(2)} €
                    </TextHeading4>
                  </View>
                </View>
              </View>

              {/* <View className="flex flex-row items-center justify-center mb-3">
                <View>
                  <FontAwesome6Icon
                    name="clock"
                    size={30}
                    color="#FF0000"
                    className="relative"
                  />
                </View>
                <View className="pl-3">
                  <TextBody1>Prochain virement le 01/10/2025</TextBody1>
                </View>
              </View> */}
            </View>
          </>
        )}
      </ScrollView>

      <QRCodeScannerModal
        isVisible={isScannerVisible}
        onClose={() => setScannerVisible(false)}
        onScan={handleScan}
      />
    </SafeAreaView>
  );
}
