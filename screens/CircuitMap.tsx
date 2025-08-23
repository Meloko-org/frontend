import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";

import { Region } from "react-native-maps";
import MapView, { Polyline, Marker, Callout } from "react-native-maps";
import polylineLib from "@mapbox/polyline";
import * as Location from "expo-location";

import { View, Text, Pressable } from "react-native";
import { CircuitOptionsData, ShopData } from "../types/API";
import circuitTools from "../modules/circuitTools";
import { useCallback, useState } from "react";
import { SheetManager } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TextBody2 from "../components/utils/texts/Body2";
import TextBody1 from "../components/utils/texts/Body1";
import TextHeading1 from "../components/utils/texts/Heading1";
import TextHeading3 from "../components/utils/texts/Heading3";
import globalTools from "../modules/globalTools";

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

  const [maxShops, setMaxShops] = useState<number>(8);
  const [shops, setShops] = useState<ShopData[] | undefined>([]);
  const [polyline, setPolyline] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const fetchCircuit = async () => {
    const response = await circuitTools.getCircuit(circuitOptions);

    console.log("FETCH :", response);

    if (response.data?.shops.length === 0) {
      SheetManager.show("alert", {
        payload: {
          message: "Aucun résultat. Réduisez les paramètres.",
          alertType: "warning",
        },
      });
      navigation.navigate("CircuitParameters");
    } else {
      const limit = circuitOptions.duration === "halfDay" ? 4 : 8;
      const filteredShops = response.data?.shops.slice(0, limit);
      setShops(filteredShops);
      setPolyline(response.data?.polyline!);
      setSummary({
        distance: response.data?.totalDistance!,
        duration: response.data?.totalDuration!,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      setMaxShops(
        circuitOptions.duration === "halfDay"
          ? 4
          : circuitOptions.duration === "day"
            ? 8
            : 8,
      );
      fetchCircuit();
    }, [circuitOptions]),
  );

  function decodePolyline(encoded: string) {
    return polylineLib.decode(encoded).map(([latitude, longitude]) => ({
      latitude,
      longitude,
    }));
  }

  const handleMarker = (shop: ShopData) => {
    SheetManager.show("circuit-shop", {
      payload: { shop },
    });
  };

  console.log("MAPC shops :", shops);

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
        {polyline && (
          <Polyline
            coordinates={decodePolyline(polyline)} // il faut décoder le polyline encodé
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}
        {shops &&
          shops.map((shop) => (
            <Marker
              key={shop?._id}
              coordinate={{
                latitude: Number(shop?.address.latitude?.$numberDecimal),
                longitude: Number(shop?.address.longitude?.$numberDecimal),
              }}
            >
              <Callout tooltip onPress={() => handleMarker(shop)}>
                <View className="bg-lightbg dark:bg-darkbg rounded-lg p-2 w-auto shadow">
                  <TextBody1 centered extraClasses="font-semibold">
                    {shop?.name}
                  </TextBody1>
                  <Pressable
                    className="mt-2 bg-primary rounded-lg p-2"
                    onPress={() => handleMarker(shop)}
                  >
                    <Text className="text-white text-center">
                      Plus de détails
                    </Text>
                  </Pressable>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>

      <View className="absolute top-[35px] px-3 w-full">
        <View className="rounded-lg py-1 px-2 bg-lightbg dark:bg-darkbg">
          <View className="flex flex-row">
            <View>
              <View className="flex flex-row items-center">
                <TextBody2 extraClasses="font-bold">
                  Distance totale :
                </TextBody2>
                <TextBody1 extraClasses="pl-5">
                  {globalTools.formatDistance(Number(summary?.distance))}
                </TextBody1>
              </View>
              <View className="flex flex-row items-center">
                <TextBody2 extraClasses="font-bold">Durée totale :</TextBody2>
                <TextBody1 extraClasses="pl-5">
                  {globalTools.formatDuration(Number(summary?.duration))}
                </TextBody1>
              </View>
            </View>
            <View className="flex flex-row ml-5 items-center">
              <View className="w-20 text-wrap">
                <TextBody2 extraClasses="font-bold">
                  Nombre de producteurs:
                </TextBody2>
              </View>
              <View className="pl-5">
                <TextHeading3>{shops?.length}</TextHeading3>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
