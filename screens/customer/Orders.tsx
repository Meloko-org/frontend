import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";

import { UserState } from "../../reducers/user";
import { OrderData } from "../../types/API";

import orderTools from "../../modules/orderTools";
import globalTools from "../../modules/globalTools";

import { View, Modal, Alert, Text, TextBase } from "react-native";
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
import Custom from "../../components/utils/buttons/Custom";
import TextBody1 from "../../components/utils/texts/Body1";
import QRCodeModal from "../../components/modals/user/QRCodeModal";
import TextBody2 from "../../components/utils/texts/Body2";
import PriceBadge from "../../components/utils/badges/Price";

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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchedOrders, setFetchedOrders] = useState();
  const [isQRCodeModalVisible, setQRCodeModalVisible] =
    useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const ordersPromise = await orderTools.getOrdersByUser(
        token,
        userStore._id,
      );
      const orderCards = ordersPromise.map((o: OrderData) => {
        console.log("o :", JSON.stringify(o, null, 2));
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
    console.log("click :", JSON.stringify(order, null, 2));
    setIsOrderDetailModalVisible(true);
    setSelectedOrder(order);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, []),
  );

  const handleQRCodePress = (id: string) => {
    setSelectedOrderId(id);
    setQRCodeModalVisible(true);
  };

  const closeQRCodeModal = () => {
    setQRCodeModalVisible(false);
    setSelectedOrderId(null);
  };

  let clickCollectOrdersDisplay = <></>;
  let marketOrdersDisplay = <></>;

  if (selectedOrder) {
    const clickCollectOrders = selectedOrder.details.filter(
      (d) => d.withdrawMode === "clickCollect",
    );
    const marketOrders = selectedOrder.details.filter(
      (d) => d.withdrawMode === "market",
    );

    clickCollectOrdersDisplay = clickCollectOrders.map((cco) => {
      // const productList = cco.products.map((p) => {
      //   return (
      //     <CardProduct
      //       stockData={{
      //         ...p.product,
      //         notes: cco.shop.notes,
      //         quantity: p.quantity,
      //       }}
      //       key={p.product._id}
      //       extraClasses="mb-1"
      //       displayMode="detail"
      //     />
      //   );
      // });

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
                    p.product.price.$numberDecimal,
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

          <View className="w-full divide-y divide-dashed divide-black dark:divide-white mt-1">
            <View className="mb-1">{productList}</View>

            <View className="flex flex-row justify-between w-full px-1 pt-1">
              <View>
                <TextHeading4>Total :</TextHeading4>
              </View>
              <View className="pr-1">
                <TextHeading3>
                  {parseFloat(cco.shopTotalPrice.$numberDecimal).toFixed(2)} €
                </TextHeading3>
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
                <Custom
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
                    p.product.price.$numberDecimal,
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
                  {parseFloat(mo.shopTotalPrice.$numberDecimal).toFixed(2)} €
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
                <Custom
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
                        {selectedOrder.totalPrice.$numberDecimal}
                      </PriceBadge>
                    </View>
                  </View>

                  <BadgeWithdrawStatus
                    type={orderTools.getOrderStatus(selectedOrder)}
                    extraClasses="mb-5"
                  />
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="items-center">
                      {clickCollectOrdersDisplay.length > 0 && (
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

                      {marketOrdersDisplay.length > 0 && (
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
      </View>
    </SafeAreaView>
  );
}
