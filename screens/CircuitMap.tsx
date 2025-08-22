import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";

import { Region } from "react-native-maps";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

import { View } from "react-native";
import { CircuitOptionsData, ShopData } from "../types/API";
import circuitTools from "../modules/circuitTools";
import { useCallback, useState } from "react";
import { SheetManager } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

type CircuitMapScreenRouteProp = RouteProp<RootStackParamList, "CircuitMap">;

type CircuitMapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CircuitMap"
>;

type Props = {
  navigation: CircuitMapScreenNavigationProp;
};

export default function CircuitMapScreen({ navigation }: Props) {
  const route = useRoute<CircuitMapScreenRouteProp>();
  const { circuitOptions } = route.params || {};

  console.log("MAP :", circuitOptions);

  const [shops, setShops] = useState<ShopData[] | undefined>([]);

  const fetchCircuit = async () => {
    const response = await circuitTools.getCircuit(circuitOptions);

    if (response.data?.shops.length === 0) {
      SheetManager.show("alert", {
        payload: {
          message: "Aucun résultat. Réduisez les paramètres.",
          alertType: "warning",
        },
      });
      navigation.navigate("CircuitParameters");
    } else {
      setShops(response.data?.shops);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCircuit();
    }, []),
  );
  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: circuitOptions.userPosition.latitude!,
          longitude: circuitOptions.userPosition.longitude!,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {shops &&
          shops.map((shop) => (
            <Marker
              key={shop?._id}
              coordinate={{
                latitude: Number(shop?.address.latitude?.$numberDecimal),
                longitude: Number(shop?.address.longitude?.$numberDecimal),
              }}
              title={shop?.name}
              description={shop?.shortDesc}
              onPress={() => {}}
            />
          ))}
      </MapView>
    </SafeAreaView>
  );
}
