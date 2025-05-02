import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";

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

type WithdrawnOrdersScreenRouteProp = RouteProp<
  RootStackParamList,
  "WithdrawnOrders"
>;

type WithdrawnOrdersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "WithdrawnOrders"
>;

type Props = {
  navigation: WithdrawnOrdersScreenNavigationProp;
};

export default function WithdrawnOrdersScreen({ navigation }: Props) {
  const route = useRoute<WithdrawnOrdersScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const [withdrawnOrders, setWithdrawnOrders] = useState<OrderData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPendingOrders = async (page = 1) => {
    setIsLoading(true);
    const token = await getToken();
    const pendingResponse = await businessTools.getOrders(
      token,
      "withdrawn",
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
      setWithdrawnOrders(pendingResponse.orders);
    } else {
      setWithdrawnOrders((prev) => [...prev, ...pendingResponse.orders]);
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
        extraClasses="mt-2"
      />

      <View className="px-3">
        <FlatList
          data={withdrawnOrders}
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
          ListFooterComponent={isLoading && <ActivityIndicator />}
        />
      </View>
    </SafeAreaView>
  );
}
