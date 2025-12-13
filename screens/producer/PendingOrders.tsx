import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../../types/Navigation";

import { useSelector } from "react-redux";
import { OrdersState } from "../../reducers/orders";

import { OrderData } from "../../types/API";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, FlatList, View } from "react-native";
import TopBar from "../../components/TopBar";
import OrderStatus from "../../components/cards/OrderStatus";
import { SheetManager } from "react-native-actions-sheet";
import businessTools from "../../modules/businessTools";
import Spinner from "../../components/utils/Spinner";

type PendingOrdersRouteProp = RouteProp<ProducerTabParamList, "PendingOrders">;

type PendingOrdersNavProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "PendingOrders"
>;

type Props = {
  navigation: PendingOrdersNavProp;
  route: PendingOrdersRouteProp;
};

export default function PendingOrdersScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const [pendingOrders, setPendingOrders] = useState<OrderData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchPendingOrders(1); // recharge la première page
    setIsRefreshing(false);
  };

  const fetchPendingOrders = async (page = 1) => {
    setIsLoading(true);
    const token = await getToken();
    const pendingResponse = await businessTools.getOrders(
      token,
      "pending",
      page,
    );

    if (!pendingResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: "Aucune commande en attente.",
          alertType: "warning",
        },
      });
      setIsLoading(false);
      return;
    }

    if (page === 1) {
      setPendingOrders(pendingResponse.orders);
    } else {
      setPendingOrders((prev) => [...prev, ...pendingResponse.orders]);
    }

    setCurrentPage(pendingResponse.page);
    setTotalPages(pendingResponse.totalPages);

    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPendingOrders(1);
    }, []),
  );

  const loadMoreOrders = async () => {
    fetchPendingOrders(currentPage + 1);
  };

  const handlePressCard = (order: OrderData) => {
    navigation.navigate("OrderDetails", {
      from: "PendingOrders",
      backLabel: "Retour en attente",
      screenTitle: "DETAIL\nCOMMANDE",
      orderId: order._id,
    });
  };

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au tableau"}
          screen={from || "BusinessCenter"}
          label={screenTitle || "COMMANDES\nEN ATTENTE"}
          extraClasses="mt-2 mb-5"
        />
      </View>

      <View style={{ flex: 10 }} className="">
        {/* <View className="w-full"> */}
        <FlatList
          data={pendingOrders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <OrderStatus
              orderData={item}
              extraClasses="mb-2"
              onPressFn={() => {
                console.log("clicked order: ", item?._id);
                handlePressCard(item);
              }}
            />
          )}
          onEndReached={() => {
            if (currentPage < totalPages) {
              loadMoreOrders(); // fonction pour fetch page suivante
            }
          }}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
          ListFooterComponent={isLoading ? <Spinner /> : null}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
        {/* </View> */}
      </View>
    </SafeAreaView>
  );
}
