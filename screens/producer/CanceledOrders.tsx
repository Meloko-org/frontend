import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../../types/Navigation";

import { OrderData } from "../../types/API";
import businessTools from "../../modules/businessTools";

import { SheetManager } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, FlatList, View } from "react-native";

import TopBar from "../../components/TopBar";
import OrderStatus from "../../components/cards/OrderStatus";
import Spinner from "../../components/utils/Spinner";

type CanceledOrdersRouteProp = RouteProp<
  ProducerTabParamList,
  "CanceledOrders"
>;

type CanceledOrdersNavProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "CanceledOrders"
>;

type Props = {
  navigation: CanceledOrdersNavProp;
  route: CanceledOrdersRouteProp;
};

export default function CanceledOrdersScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const [canceledOrders, setCanceledOrders] = useState<OrderData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchCanceledOrders(1); // recharge la première page
    setIsRefreshing(false);
  };

  const fetchCanceledOrders = async (page = 1) => {
    setIsLoading(true);
    const token = await getToken();
    const pendingResponse = await businessTools.getOrders(
      token,
      "canceled",
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
      setCanceledOrders(pendingResponse.orders);
    } else {
      setCanceledOrders((prev) => [...prev, ...pendingResponse.orders]);
    }

    setCurrentPage(pendingResponse.page);
    setTotalPages(pendingResponse.totalPages);

    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCanceledOrders(1);
    }, []),
  );

  const loadMoreOrders = async () => {
    fetchCanceledOrders(currentPage + 1);
  };

  const handlePressCard = (order: OrderData) => {
    navigation.navigate("OrderDetails", {
      from: "CanceledOrders",
      backLabel: "Retour annulées",
      screenTitle: "DETAIL\nCOMMANDE",
      orderId: order._id,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <TopBar
        backLabel={backLabel || "Retour au tableau"}
        screen={from || "BusinessCenter"}
        label={screenTitle || "COMMANDES\nANNULEES"}
        extraClasses="mt-2 mb-5"
      />

      <View className="px-3">
        <FlatList
          data={canceledOrders}
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
