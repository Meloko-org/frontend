import { useCallback, useEffect, useRef, useState } from "react";

import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../types/Navigation";

import { Region } from "react-native-maps";
import MapView, { Polyline, Marker, Callout } from "react-native-maps";
import polylineLib from "@mapbox/polyline";
import * as Location from "expo-location";

import globalTools from "../modules/globalTools";
import circuitTools from "../modules/circuitTools";
import { CircuitOptionsData, ShopData } from "../types/API";

import { SheetManager } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

import { View, Text, Pressable, Linking } from "react-native";
import TextBody2 from "../components/utils/texts/Body2";
import TextBody1 from "../components/utils/texts/Body1";
import TextHeading3 from "../components/utils/texts/Heading3";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";

type CircuitMapRouteProp = RouteProp<UserTabParamList, "CircuitMap">;

type CircuitMapNavProp = BottomTabNavigationProp<
  UserTabParamList,
  "CircuitMap"
>;

type Props = {
  navigation: CircuitMapNavProp;
  route: CircuitMapRouteProp;
};

export default function CircuitMapScreen({ navigation, route }: Props) {
  const { circuitOptions } = route.params || {};

  const mapRef = useRef<MapView>(null);

  const [shops, setShops] = useState<ShopData[] | undefined>([]);
  const [polyline, setPolyline] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

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
      fetchCircuit();
    }, [circuitOptions]),
  );

  useEffect(() => {
    if (shops!.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        shops?.map((shop) => ({
          latitude: Number(shop?.address.latitude),
          longitude: Number(shop?.address.longitude),
        })),
        {
          edgePadding: { top: 50, right: 50, left: 50, bottom: 50 },
          animated: true,
        },
      );
    }
  }, [shops]);

  function decodePolyline(encoded: string) {
    return polylineLib
      .decode(encoded)
      .map(([latitude, longitude]: [string, string]) => ({
        latitude,
        longitude,
      }));
  }

  const openGoogleMapsCircuit = (shops: { lat: number; lng: number }[]) => {
    if (shops.length === 0) return;

    const origin = `${shops[0].lat},${shops[0].lng}`;
    const destination = `${shops[shops.length - 1].lat},${shops[shops.length - 1].lng}`;
    const waypoints = shops
      .slice(1, -1)
      .map((s) => `${s.lat},${s.lng}`)
      .join("|");

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;

    Linking.openURL(url);
  };

  const handleMarker = async (shop: ShopData) => {
    const shopToDelete = await SheetManager.show("circuit-shop", {
      payload: { shop },
    });

    if (shopToDelete) {
      const newShops = shops?.filter((shop) => shop?._id !== shopToDelete._id);
      console.log("MAP newShops :", newShops);
      const updateResponse = await circuitTools.updateCircuit(
        newShops!,
        circuitOptions.userPosition,
      );

      console.log(updateResponse);

      if (updateResponse.data) {
        setShops(updateResponse.data?.shops);
        setPolyline(updateResponse.data?.polyline!);
        setSummary({
          distance: updateResponse.data?.totalDistance!,
          duration: updateResponse.data?.totalDuration!,
        });
      }
    }
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
        ref={mapRef}
      >
        {polyline && (
          <Polyline
            coordinates={decodePolyline(polyline)} // il faut décoder le polyline encodé
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}

        <Marker
          coordinate={{
            latitude: circuitOptions.userPosition.latitude!,
            longitude: circuitOptions.userPosition.longitude!,
          }}
          pinColor="green"
          title="Vous êtes ici."
        />
        {shops &&
          shops.map((shop) => (
            <Marker
              key={shop?._id}
              coordinate={{
                latitude: Number(shop?.address.latitude),
                longitude: Number(shop?.address.longitude),
              }}
            >
              <Callout tooltip onPress={() => handleMarker(shop)}>
                <View className="bg-lightbg dark:bg-darkbg rounded-lg p-2 w-auto shadow-lg">
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

      <View className="absolute bottom-[35px] px-3 w-full">
        <ButtonPrimaryEnd
          label="Lancer la navigation"
          iconName="location-arrow"
          onPressFn={() =>
            openGoogleMapsCircuit(
              shops!.map((shop) => ({
                lat: Number(shop?.address.latitude),
                lng: Number(shop?.address.longitude),
              })),
            )
          }
          extraClasses="h-14"
        />
      </View>
    </SafeAreaView>
  );
}
