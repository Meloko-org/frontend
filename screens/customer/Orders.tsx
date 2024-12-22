import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";

import { UserState } from "../../reducers/user";
import { OrderData } from "../../types/API";

import orderTools from "../../modules/orderTools";

import { View, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import CardOrder from "../../components/cards/Order";
import CardProduct from "../../components/cards/Product";
import CardProducer from "../../components/cards/ProducerSearchResult";
import ButtonBack from "../../components/utils/buttons/Back";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import BadgeWithdrawStatus from "../../components/utils/badges/WithdrawStatus";
import BackLabelButton from "../../components/utils/buttons/BackLabel";
import Spinner from "../../components/utils/Spinner";

type OrdersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TabNavigatorUser"
>;

type Props = {
  navigation: OrdersScreenNavigationProp;
};

export default function OrdersCustomerScreen({
  navigation,
}: Props): JSX.Element {
  const { getToken } = useAuth();
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] =
    useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchedOrders, setFetchedOrders] = useState();

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const ordersPromise = await orderTools.getOrdersByUser(
        token,
        userStore._id,
      );
      const orderCards = ordersPromise.map((o: OrderData) => {
        return (
          <CardOrder
            key={o._id}
            orderData={o}
            extraClasses="mb-2"
            onPressFn={() => handleOrderDetailPress(o)}
          />
        );
      });
      setFetchedOrders(orderCards);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderDetailPress = (order: OrderData) => {
    // console.log("click :", order)
    setIsOrderDetailModalVisible(true);
    setSelectedOrder(order);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, []),
  );

  let clickCollectOrdersDisplay = <></>;
  let marketOrdersDisplay = <></>;

  if (selectedOrder) {
    const clickCollectOrders = selectedOrder.details.filter(
      (d) => d.withdrawMode === "clickCollect",
    );
    const marketOrders = selectedOrder.details.filter(
      (d) => d.withdrawMode === "market",
    );

    console.log("clickcollectOrders :", clickCollectOrders.length);
    console.log("marketOrders :", marketOrders.length);

    clickCollectOrdersDisplay = clickCollectOrders.map((cco) => {
      console.log("cco :", cco);
      const productList = cco.products.map((p) => {
        console.log("p :", p);
        return (
          <CardProduct
            stockData={{
              ...p.product,
              notes: cco.shop.notes,
              quantity: p.quantity,
            }}
            key={p.product._id}
            extraClasses="mb-1"
            displayMode="cart"
          />
        );
      });

      return (
        <View key={cco._id} className="my-2 flex items-center">
          <CardProducer
            shopData={cco.shop}
            withdrawData={cco.products}
            key={cco.shop._id}
            extraClasses="mb-1"
            displayMode="order"
            showDirectionButton
            onPressFn={() => {
              setIsOrderDetailModalVisible(false);
              navigation.navigate("TabNavigatorUser", {
                screen: "ShopUser",
                params: {
                  shopId: cco.shop._id,
                  distance: null,
                  relevantProducts: [],
                },
              });
            }}
          />
          {productList}
        </View>
      );
    });

    marketOrdersDisplay = marketOrders.map((mo) => {
      console.log("mo :", mo);
      const productList = mo.products.map((p) => {
        return (
          <CardProduct
            stockData={{
              ...p.product,
              notes: mo.shop.notes,
              quantity: p.quantity,
            }}
            key={p.product._id}
            extraClasses="mb-1"
            displayMode="cart"
          />
        );
      });
      return (
        <View key={mo._id} className="my-2">
          <CardProducer
            shopData={mo.shop}
            withdrawData={mo.products}
            key={mo.shop._id}
            extraClasses="mb-1"
            displayMode="order"
            showDirectionButton
            onPressFn={() => {
              setIsOrderDetailModalVisible(false);
              navigation.navigate("TabNavigatorUser", {
                screen: "ShopUser",
                params: {
                  shopId: mo.shop._id,
                  distance: null,
                  relevantProducts: [],
                },
              });
            }}
          />
          {productList}
        </View>
      );
    });
  }

  const orders =
    userStore.orders && userStore.orders.length > 0 ? (
      userStore.orders.map((o) => {
        return (
          <View key={o._id}>
            <CardOrder
              orderData={o}
              extraClasses="mb-2"
              onPressFn={() => handleOrderDetailPress(o)}
            />
          </View>
        );
      })
    ) : (
      <>
        <TextHeading2>Vous n'avez pas de commande :(</TextHeading2>
      </>
    );

  console.log("orders :", JSON.stringify(fetchedOrders, null, 2));

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="flex-1">
        <TextHeading2 centered extraClasses="mt-2 mb-2">
          Mes commandes
        </TextHeading2>

        <ScrollView className="flex-1">
          <View className="p-3">
            {isLoading ? <Spinner /> : fetchedOrders}

            {/* {orders} */}
          </View>
        </ScrollView>

        <Modal
          visible={isOrderDetailModalVisible}
          animationType="slide"
          onRequestClose={() => setIsOrderDetailModalVisible(false)}
          className="p-3"
        >
          <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
            <View className="flex flex-row mb-5 mt-3">
              <BackLabelButton
                onPressFn={() => setIsOrderDetailModalVisible(false)}
                extraClasses="ml-5"
              >
                Retour aux commandes
              </BackLabelButton>
            </View>
            <View className="flex-1 p-3 justify-center items-center">
              {selectedOrder && (
                <>
                  <TextHeading2 extraClasses="mb-1">{`Commande n° ${selectedOrder._id.slice(0, 7)}`}</TextHeading2>
                  <TextHeading3 extraClasses="mb-1" centered>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </TextHeading3>
                  <BadgeWithdrawStatus
                    type={selectedOrder.isWithdrawn ? "full" : "none"}
                    extraClasses="w-[100px] mb-4"
                  />
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="items-center">
                      {clickCollectOrdersDisplay.length > 0 && (
                        <>
                          <TextHeading2 centered extraClasses="mb-2">
                            Click & Collect
                          </TextHeading2>
                          <ButtonPrimaryEnd
                            label="Itinéraire optimal"
                            iconName="location-arrow"
                            onPressFn={() => console.log("open google map")}
                            extraClasses="w-80 mb-3"
                          />
                        </>
                      )}
                      {clickCollectOrdersDisplay}
                      {marketOrdersDisplay.length > 0 && (
                        <TextHeading2 centered extraClasses="mb-2">
                          Marchés locaux
                        </TextHeading2>
                      )}
                      {marketOrdersDisplay}
                    </View>
                  </ScrollView>
                </>
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
