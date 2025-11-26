import React, { JSX, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useFocusEffect } from "@react-navigation/native";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { OrderData, StatusData } from "../../types/API";

import orderTools from "../../modules/orderTools";

import { View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CardOrder from "../../components/cards/Order";
import Spinner from "../../components/utils/Spinner";
import TopBar from "../../components/TopBar";
import { SheetManager } from "react-native-actions-sheet";
import OrderFilters from "../../components/utils/OrderFilters";
import OrderDetailsModal from "../../components/modals/user/OrderDetails";

type OrdersRouteProp = RouteProp<UserTabParamList, "OrdersCustomer">;

type OrdersNavProp = BottomTabNavigationProp<
  UserTabParamList,
  "OrdersCustomer"
>;

type Props = {
  navigation: OrdersNavProp;
  route: OrdersRouteProp;
};

export default function OrdersCustomerScreen({
  navigation,
  route,
}: Props): JSX.Element {
  const { backLabel, from, screenTitle } = route.params;

  const { getToken } = useAuth();

  const [status, setStatus] = useState<StatusData>("all");
  const limit = 10;

  const [fetchedOrders, setFetchedOrders] = useState<OrderData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] =
    useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | undefined>(
    undefined,
  );

  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const ordersResponse = await orderTools.getOrdersByUser(
        token,
        status,
        page,
        limit,
      );

      if (!ordersResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: ordersResponse?.orders.message,
            alertType: "error",
          },
        });
        setIsLoading(false);
        return;
      }

      if (ordersResponse.orders.length === 0) {
        let message;
        switch (status) {
          case "pending":
            message = "Aucune commande en attende.";
            break;
          case "partialValidated":
            message = "Aucune commande partiellement validée.";
            break;
          case "validated":
            message = "Aucune commande validée.";
            break;
          case "partialWithdrawn":
            message = "Aucune commande partiellement retirée.";
            break;
          case "withdrawn":
            message = "Aucune commande retirée.";
            break;
          case "partialCanceled":
            message = "Aucune commande partiellement annulée.";
            break;
          case "canceled":
            message = "Aucune commande annulée.";
            break;
          case "all":
            message = "Aucune commande.";
            break;
        }
        setFetchedOrders([]);
        SheetManager.show("alert", {
          payload: {
            message,
            alertType: "warning",
          },
        });
        setIsLoading(false);
        return;
      }

      if (page === 1) {
        setFetchedOrders(ordersResponse.orders);
      } else {
        setFetchedOrders((prev) => [...prev, ...ordersResponse.orders]);
      }

      setCurrentPage(ordersResponse.page);
      setTotalPages(ordersResponse.totalPages);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes.");

      SheetManager.show("alert", {
        payload: {
          message:
            "Une erreur est survenue. Impossible de contacter le serveur.",
          alertType: "error",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleOrderDetailPress = (order: OrderData) => {
  //   console.log(order._id)
  //   setSelectedOrder(order);
  //   setIsOrderDetailModalVisible(true);
  // };

  const handleOrderDetailPress = (order: OrderData) => {
    console.log("youpi");
    SheetManager.show("order-details", {
      payload: {
        order,
      },
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders(1);
    }, [status]),
  );

  const loadMoreOrders = async () => {
    fetchOrders(currentPage + 1);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders(1); // recharge la première page
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au compte"}
          screen={from || "UserProfile"}
          label={screenTitle || "MES COMMANDES"}
          extraClasses="mt-2 mb-5"
        />
      </View>

      <View style={{ flex: 1 }} className="flex flex-row justify-center px-3">
        <OrderFilters
          status={status}
          size={30}
          onChange={(s) => setStatus(s)}
        />
      </View>

      <View style={{ flex: 8 }} className="px-3">
        <FlatList
          data={fetchedOrders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CardOrder
              key={item._id}
              orderData={item}
              extraClasses="mb-2"
              onPressFn={() => handleOrderDetailPress(item)}
            />
          )}
          onEndReached={() => {
            if (currentPage < totalPages) {
              loadMoreOrders();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading ? <Spinner /> : null}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </View>

      {/* <OrderDetailsModal
        isVisible={isOrderDetailModalVisible}
        order={selectedOrder!}
        navigation={navigation}
        onClose={() => {
          setIsOrderDetailModalVisible(false)
          setSelectedOrder(undefined)
        }}
      /> */}
    </SafeAreaView>
  );
}
