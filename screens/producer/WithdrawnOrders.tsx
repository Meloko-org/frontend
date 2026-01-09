import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../../types/Navigation";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, FlatList, View } from "react-native";
import TopBar from "../../components/TopBar";
import OrderStatus from "../../components/cards/OrderStatus";
import { useSelector } from "react-redux";
import { OrdersState } from "../../reducers/orders";
import { OrderData } from "../../types/API";
import { SheetManager } from "react-native-actions-sheet";
import businessTools from "../../modules/businessTools";
import Spinner from "../../components/utils/Spinner";

type WithdrawnOrdersRouteProp = RouteProp<
  ProducerTabParamList,
  "WithdrawnOrders"
>;

type WithdrawnOrderssNavProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "WithdrawnOrders"
>;

type Props = {
  navigation: WithdrawnOrderssNavProp;
  route: WithdrawnOrdersRouteProp;
};

export default function WithdrawnOrdersScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const [withdrawnOrders, setWithdrawnOrders] = useState<OrderData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchWithdrawnOrders(1); // recharge la première page
    setIsRefreshing(false);
  };

  const fetchWithdrawnOrders = async (page = 1) => {
    setIsLoading(true);
    const token = await getToken();
    const withdrawnResponse = await businessTools.getOrders(
      token,
      "picked_up",
      page,
    );

    if (!withdrawnResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: withdrawnResponse.message,
          alertType: "warning",
        },
      });
      setIsLoading(false);
      return;
    }

    if (withdrawnResponse.orders.length === 0) {
      SheetManager.show("alert", {
        payload: {
          message: "Aucune commande retirée.",
          alertType: "warning",
        },
      });
      setIsLoading(false);
      return;
    }

    if (page === 1) {
      setWithdrawnOrders(withdrawnResponse.orders);
    } else {
      setWithdrawnOrders((prev) => [...prev, ...withdrawnResponse.orders]);
    }

    setCurrentPage(withdrawnResponse.page);
    setTotalPages(withdrawnResponse.totalPages);

    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      setWithdrawnOrders([]);
      fetchWithdrawnOrders(1);
    }, []),
  );

  const loadMoreOrders = async () => {
    fetchWithdrawnOrders(currentPage + 1);
  };

  const handlePressCard = (order: OrderData) => {
    navigation.navigate("OrderDetails", {
      from: "WithdrawnOrders",
      backLabel: "Retour retirées",
      screenTitle: "DETAIL\nCOMMANDE",
      orderId: order._id,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <TopBar
        backLabel={backLabel || "Retour au tableau"}
        screen={from || "BusinessCenter"}
        label={screenTitle || "COMMANDES\nRETIREES"}
        extraClasses="mt-2 mb-5"
      />

      <View className="px-3">
        <FlatList
          data={withdrawnOrders}
          extraData={withdrawnOrders.map((o) => o._id).join(",")}
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
          ListFooterComponent={isLoading ? <Spinner /> : null}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </View>
    </SafeAreaView>
  );
}
