import React from "react";
import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";

type ShopWithdrawModesScreenRouteProp = RouteProp<
  RootStackParamList,
  "ShopWithdrawModes"
>;

type ShopWithdrawModesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopWithdrawModes"
>;

type Props = {
  navigation: ShopWithdrawModesScreenNavigationProp;
};

export default function ShopWithdrawModesScreen({ navigation }: Props) {
  const route = useRoute<ShopWithdrawModesScreenRouteProp>();
  const { from, backLabel, screenTitle, onboarding } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [isClickCollectEnable, setClickCollectEnable] =
    useState<boolean>(false);
  const [isShopMarketsEnable, setShopMarketsEnable] = useState<boolean>(false);
  const [isDeliveryEnable, setDeliveryEnable] = useState<boolean>(false);

  useEffect(() => {
    if (shopStore !== null) {
      if (shopStore.clickCollect) {
        setClickCollectEnable(shopStore.clickCollect.isActive);
      }
      if (shopStore.markets) {
        setShopMarketsEnable(
          shopStore.markets.some((market) => market.isActive),
        );
      }
      // if (shopStore.delivery) {
      // 	setDeliveryEnable(shopStore.delivery.isActive)
      // }
    }
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      {!onboarding && (
        <View style={{ flex: 1 }}>
          <TopBar
            backLabel={backLabel || "Retour à la boutique"}
            screen={from || "ShopProducer"}
            label={screenTitle || "MODES DE\nRETRAIT"}
            extraClasses="mt-2"
          />
        </View>
      )}

      <View className="px-3 mt-5" style={{ flex: 11 }}>
        <ScrollView>
          <OpenScreenButton
            label="Click & Collect"
            switchProps={{
              label: "",
              value: isClickCollectEnable,
              onValueChange: setClickCollectEnable,
              extraClasses: "ml-2",
            }}
            onPressFn={() =>
              navigation.navigate("ShopWithdrawClickcollect", {
                from: "ShopWithdrawModes",
                backLabel: "Retour modes de retrait",
                screenTitle: "CLICK &\nCOLLECT",
              })
            }
            extraClasses="mb-2"
          />
          <OpenScreenButton
            label="Poins de vente"
            switchProps={{
              label: "",
              value: isShopMarketsEnable,
              onValueChange: setShopMarketsEnable,
              extraClasses: "ml-2",
            }}
            onPressFn={() =>
              navigation.navigate("ShopWithdrawShopMarkets", {
                from: "ShopWithdrawModes",
                backLabel: "Retour modes de retrait",
                screenTitle: "POINTS\nDE VENTE",
              })
            }
            extraClasses="mb-2"
          />
          <OpenScreenButton
            label="Livraison"
            switchProps={{
              label: "",
              value: isDeliveryEnable,
              onValueChange: setDeliveryEnable,
              extraClasses: "ml-2",
            }}
            onPressFn={() =>
              navigation.navigate("ShopWithdrawDelivery", {
                from: "ShopWithdrawModes",
                backLabel: "Retour modes de retrait",
                screenTitle: "LIVRAISON",
              })
            }
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
