import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useSelector } from "react-redux";

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

type ValidatedOrdersRouteProp = RouteProp<
  ProducerTabParamList,
  "ValidatedOrders"
>;

type ValidatedOrdersNavProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "ValidatedOrders"
>;

type Props = {
  navigation: ValidatedOrdersNavProp;
  route: ValidatedOrdersRouteProp;
};

export default function ValidatedOrdersScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const [validatedOrders, setValidatedOrders] = useState<OrderData[]>([]);
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
      "validated",
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
      setValidatedOrders(pendingResponse.orders);
    } else {
      setValidatedOrders((prev) => [...prev, ...pendingResponse.orders]);
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
      from: "ValidatedOrders",
      backLabel: "Retour validées",
      screenTitle: "DETAIL\nCOMMANDE",
      orderId: order._id,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <TopBar
        backLabel={backLabel || "Retour au tableau"}
        screen={from || "BusinessCenter"}
        label={screenTitle || "COMMANDES\nVALIDEES"}
        extraClasses="mt-2 mb-5"
      />

      <View className="px-3">
        <FlatList
          data={validatedOrders}
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
