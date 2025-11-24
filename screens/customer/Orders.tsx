import React, { JSX, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { UserState } from "../../reducers/user";
import { OrderData, StatusData } from "../../types/API";

import orderTools from "../../modules/orderTools";
import globalTools from "../../modules/globalTools";

import { View, Modal, Alert, Text, TextBase, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import CardOrder from "../../components/cards/Order";
import CardProduct from "../../components/cards/Product";
import CardProducer from "../../components/cards/ProducerSearchResult";
import ButtonBack from "../../components/utils/buttons/Back";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import TextHeading4 from "../../components/utils/texts/Heading4";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import BadgeWithdrawStatus from "../../components/utils/badges/WithdrawStatus";
import BackLabelButton from "../../components/utils/buttons/BackLabel";
import Spinner from "../../components/utils/Spinner";
import OrderStatusBadge from "../../components/utils/badges/OrderStatus";
import CustomButton from "../../components/utils/buttons/Custom";
import TextBody1 from "../../components/utils/texts/Body1";
import QRCodeModal from "../../components/modals/user/QRCodeModal";
import TextBody2 from "../../components/utils/texts/Body2";
import PriceBadge from "../../components/utils/badges/Price";
import TopBar from "../../components/TopBar";
import { SheetManager } from "react-native-actions-sheet";
import SquareButton from "../../components/utils/buttons/SquareButton";
import OrderFilters from "../../components/utils/OrderFilters";

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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>();
  const [isQRCodeModalVisible, setQRCodeModalVisible] =
    useState<boolean>(false);

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

  const handleOrderDetailPress = (order: OrderData) => {
    console.log("click :", JSON.stringify(order, null, 2));
    setIsOrderDetailModalVisible(true);
    setSelectedOrder(order);
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

  const handleQRCodePress = (id: string) => {
    setSelectedOrderId(id);
    setQRCodeModalVisible(true);
  };

  const closeQRCodeModal = () => {
    setQRCodeModalVisible(false);
    setSelectedOrderId(null);
  };

  let clickCollectOrdersDisplay: React.ReactNode = null;
  let marketOrdersDisplay: React.ReactNode = null;

  if (selectedOrder) {
    const clickCollectOrders = selectedOrder.details.filter(
      (d) => d.withdrawMode === "clickCollect",
    );
    const marketOrders = selectedOrder.details.filter(
      (d) => d.withdrawMode === "market",
    );

    clickCollectOrdersDisplay = clickCollectOrders.map((cco) => {
      const productList = cco.products.map((p) => {
        return (
          <View className="flex flex-row justify-between items-center w-full px-2">
            <View className="w-4/6">
              <TextBody1>
                {p.product.product.family.name} {p.product.product.name}
              </TextBody1>
            </View>
            <View className="w-1/6">
              <TextBody2 centered>
                {globalTools.formatQuantity(
                  p.quantity,
                  p.product.product.weight.unit,
                )}
              </TextBody2>
            </View>
            <View className="w-1/6">
              <TextBody1 centered>
                {orderTools
                  .getProductCost(
                    p.product.price,
                    p.quantity,
                    p.product.product.weight.unit,
                  )
                  .toFixed(2)}{" "}
                €
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
            key={cco.shop?._id}
            extraClasses="mb-1"
            displayMode="order"
            showDirectionButton
            onPressFn={() => {
              setIsOrderDetailModalVisible(false);
              navigation.navigate("ShopUser", {
                shopId: cco.shop?._id,
                distance: undefined,
                relevantProducts: [],
                sheetId: undefined,
              });
            }}
          />

          <View className="w-full divide-y divide-dashed divide-black dark:divide-white mt-1">
            <View className="mb-1">{productList}</View>

            <View className="flex flex-row justify-between w-full px-1 pt-1">
              <View>
                <TextHeading4>Total :</TextHeading4>
              </View>
              <View className="pr-1">
                <TextHeading3>{cco.shopTotalTTC.toFixed(2)} €</TextHeading3>
              </View>
            </View>
          </View>

          <View className="flex flex-row w-full justify-between mt-2">
            <View className="flex flex-row items-center rounded-lg bg-white dark:bg-tertiary py-2 px-5 mb-2">
              <Text className="text-dark dark:text-white">Status : </Text>
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
                  onPressFn={() => handleQRCodePress(selectedOrder._id)}
                />
              )}
            </View>
          </View>
        </View>
      );
    });

    marketOrdersDisplay = marketOrders.map((mo) => {
      console.log("mo :", mo);
      // const productList = mo.products.map((p) => {
      //   return (
      //     <CardProduct
      //       stockData={{
      //         ...p.product,
      //         notes: mo.shop.notes,
      //         quantity: p.quantity,
      //       }}
      //       key={p.product._id}
      //       extraClasses="mb-1"
      //       displayMode="detail"
      //     />
      //   );
      // });

      const productList = mo.products.map((p) => {
        return (
          <View className="flex flex-row justify-between items-center w-full px-2">
            <View className="w-4/6">
              <TextBody1>
                {p.product.product.family.name} {p.product.product.name}
              </TextBody1>
            </View>
            <View className="w-1/6">
              <TextBody2 centered>
                {globalTools.formatQuantity(
                  p.quantity,
                  p.product.product.weight.unit,
                )}
              </TextBody2>
            </View>
            <View className="w-1/6">
              <TextBody1 centered>
                {orderTools
                  .getProductCost(
                    p.product.price,
                    p.quantity,
                    p.product.product.weight.unit,
                  )
                  .toFixed(2)}{" "}
                €
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

          <View className="w-full divide-y divide-dashed divide-black dark:divide-white mt-1">
            <View className="mb-1">{productList}</View>
            <View className="flex flex-row justify-between w-full px-1 pt-1">
              <View>
                <TextHeading4>Total :</TextHeading4>
              </View>
              <View className="pr-1">
                <TextHeading3>
                  {parseFloat(mo.shopTotalPrice).toFixed(2)} €
                </TextHeading3>
              </View>
            </View>
          </View>

          <View className="flex flex-row w-full justify-between mb-2">
            <View className="flex flex-row items-center rounded-lg bg-white dark:bg-tertiary py-2 px-5 mb-2">
              <Text className="text-dark dark:text-white">Status : </Text>
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
                  onPressFn={() => handleQRCodePress(selectedOrder._id)}
                />
              )}
            </View>
          </View>
        </View>
      );
    });
  }

  console.log("orders :", JSON.stringify(fetchedOrders, null, 2));
  console.log("status :", status);

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

      <Modal
        visible={isOrderDetailModalVisible}
        animationType="slide"
        onRequestClose={() => setIsOrderDetailModalVisible(false)}
        className="p-3"
      >
        <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
          <View className="flex flex-row mb-1 mt-3">
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
                <TextHeading3
                  extraClasses="mb-1"
                  centered
                >{`Commande n° ${selectedOrder._id.slice(0, 7)}`}</TextHeading3>
                <View className="flex flex-row w-full items-center justify-around">
                  <View>
                    <TextHeading4 extraClasses="mb-1" centered>
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </TextHeading4>
                  </View>
                  <View>
                    <PriceBadge
                      colour="bg-tertiary"
                      extraClasses="px-3 py-1"
                      textClasses="font-bold text-lg"
                    >
                      {selectedOrder.totalTTC}
                    </PriceBadge>
                  </View>
                </View>

                <BadgeWithdrawStatus
                  type={orderTools.getOrderStatus(selectedOrder)}
                  extraClasses="mb-5"
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="items-center">
                    {clickCollectOrdersDisplay && (
                      <>
                        <TextHeading4 centered extraClasses="mb-2">
                          Retrait en Click & Collect
                        </TextHeading4>
                        {/* <ButtonPrimaryEnd
                            label="Itinéraire optimal"
                            iconName="location-arrow"
                            onPressFn={() => console.log("open google map")}
                            extraClasses="w-80 mb-3"
                          /> */}
                      </>
                    )}
                    {clickCollectOrdersDisplay}

                    {marketOrdersDisplay && (
                      <TextHeading4 centered extraClasses="mb-2">
                        Retrait sur Marchés locaux
                      </TextHeading4>
                    )}
                    {marketOrdersDisplay}
                  </View>
                  <View>
                    {selectedOrder.details.length > 1 && (
                      <View className="flex flex-row justify-center items-center w-full">
                        <View className="p-2 rounded-lg border border-darkbg dark:border-lightbg">
                          <TextBody1 extraClasses="px-3 mb-2">
                            Optimisez vos trajets et calculez un itinéraire
                            optimal pour récupérer tous vos achats.
                          </TextBody1>
                          <ButtonPrimaryEnd
                            label="Itinéraire optimal"
                            iconName="location-arrow"
                            onPressFn={() => console.log("open google map")}
                            extraClasses=""
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </>
            )}
          </View>

          <QRCodeModal
            visible={isQRCodeModalVisible}
            onClose={closeQRCodeModal}
            id={selectedOrderId}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
