import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { Region } from "react-native-maps";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { SheetManager } from "react-native-actions-sheet";
import TextHeading3 from "../../components/utils/texts/Heading3";
import CardProducer from "../../components/cards/ProducerSearchResult";
import ShopMarkerCard from "../../components/cards/ShopMarkerCard";
import MapSearchBox from "../../components/map/MapSearchBox";
import { ShopData } from "../../types/API";
import { useColorScheme } from "nativewind";
import BadgeSecondary from "../../components/utils/badges/Secondary";
import { Svg, Image as ImageSvg } from "react-native-svg";

type userPosition = {
  latitude: number;
  longitude: number;
} | null;

type MapScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MapCustomer"
>;

type MapProps = {
  navigation: MapScreenNavigationProp;
};

export default function MapCustomerScreen({
  route,
  navigation,
}: MapProps): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [currentPosition, setCurrentPosition] = useState<userPosition>(null);
  const [searchResults, setSearchResults] = useState<ShopData[]>([]);
  const [region, setRegion] = useState<Region | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
          setRegion({
            ...location.coords,
            latitudeDelta: 0.9,
            longitudeDelta: 0.9,
          });
        });
      }
    })();

    if (route.params && route.params.searchResults) {
      setSearchResults(route.params.searchResults);
    }
  }, [route.params]);

  const producersList =
    searchResults &&
    searchResults.map((sr: ShopData) => (
      <CardProducer
        shopData={sr}
        onPressFn={() => {
          navigation.navigate("TabNavigatorUser", {
            screen: "ShopUser",
            params: {
              shopId: sr?._id,
              distance: sr?.searchData.distance,
              relevantProducts: sr?.searchData.relevantProducts
                ? sr?.searchData.relevantProducts
                : [],
            },
          });
        }}
        key={sr?._id}
        extraClasses="mb-1"
        displayMode="bottomSheet"
      />
    ));

  useEffect(() => {
    if (producersList.length > 0) {
      SheetManager.show("map-search-results", {
        payload: {
          producersList: producersList,
        },
      });
    }
  }, [producersList]);

  const markers =
    searchResults &&
    searchResults.map((data: ShopData, i) => {
      return (
        <Marker
          key={i}
          coordinate={{
            latitude: Number(data?.address.latitude?.$numberDecimal),
            longitude: Number(data?.address.longitude?.$numberDecimal),
          }}
        >
          <Callout
            tooltip={true}
            onPress={() => {
              navigation.navigate("TabNavigatorUser", {
                screen: "ShopUser",
                params: {
                  shopId: data?._id,
                  distance: data?.searchData.distance,
                  relevantProducts: data?.searchData.relevantProducts
                    ? data.searchData.relevantProducts
                    : [],
                },
              });
            }}
          >
            <ShopMarkerCard key={data?._id} shopData={data} />
          </Callout>
        </Marker>
      );
    });

  const handleSheetChanges = useCallback((index: number) => {}, []);

  console.log(
    "------------------------------- MAP --------------------------------------------------------------------",
  );
  // console.log("SEARCHRESULT -> ", JSON.stringify(searchResults, null, 2));

  return (
    <View style={styles.container}>
      <MapView
        mapType="hybrid"
        showsUserLocation={true}
        style={styles.map}
        region={region}
        userInterfaceStyle="dark"
      >
        {/* {currentPosition && <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />} */}
        {markers}
      </MapView>
      <View
        className="flex flex-row justify-center"
        style={{ position: "absolute", top: 50, width: "100%" }}
      >
        <MapSearchBox
          search={
            route.params && route.params.search
              ? route.params.search
              : undefined
          }
          refrechResultsFn={(newSearchResults: ShopData[]) =>
            setSearchResults(newSearchResults)
          }
          displayMode="widget"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    position: "relative",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
