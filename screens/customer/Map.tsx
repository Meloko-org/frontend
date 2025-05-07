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
import {
  MarketData,
  MarketResultData,
  ShopData,
  ShopResultData,
} from "../../types/API";
import { useColorScheme } from "nativewind";
import BadgeSecondary from "../../components/utils/badges/Secondary";
import { Svg, Image as ImageSvg } from "react-native-svg";
import MarketSearchResultCard from "../../components/cards/MarketSearchResult";
import MarketMarkerCard from "../../components/cards/MarketMarker";

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
  // const [searchResults, setSearchResults] = useState<ShopData[]>([]);
  const [producerResults, setProducerResults] = useState<ShopResultData[]>([]);
  const [marketResults, setMarketResults] = useState<MarketResultData[]>([]);
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

    // if (route.params && route.params.searchResults) {
    //   setSearchResults(route.params.searchResults);
    // }
  }, [route.params]);

  const producersList =
    producerResults &&
    producerResults.map((sr: ShopResultData) => {
      console.log("sr :", sr);
      return (
        <CardProducer
          shopData={sr.shop}
          results={sr.relevantProducts.length}
          distance={sr.distance}
          onPressFn={() => {
            navigation.navigate("ShopUser", {
              params: {
                shopId: sr?.shop?._id,
                distance: sr?.distance,
                relevantProducts: sr?.relevantProducts
                  ? sr?.relevantProducts
                  : [],
              },
            });
          }}
          key={sr?.shop?._id}
          extraClasses="mb-1"
          displayMode="bottomSheet"
        />
      );
    });

  const marketsList =
    marketResults &&
    marketResults.map((sr: MarketResultData) => {
      console.log("sr :", sr);
      return (
        <MarketSearchResultCard
          marketData={sr.market}
          results={sr.shops}
          distance={sr.distance}
          onPressFn={() => {}}
          key={sr?.market?._id}
          extraClasses="mb-1"
        />
      );
    });

  useEffect(() => {
    if (producersList.length > 0) {
      SheetManager.show("map-search-results", {
        payload: {
          resultsList: producersList,
          searchType: "shop",
        },
      });
    }
    if (marketsList.length > 0) {
      SheetManager.show("map-search-results", {
        payload: {
          resultsList: marketsList,
          searchType: "market",
        },
      });
    }
  }, [producersList, marketsList]);

  const markers = producerResults
    ? producerResults.map((data: ShopResultData, i) => {
        return (
          <Marker
            key={i}
            coordinate={{
              latitude: Number(data?.shop?.address.latitude?.$numberDecimal),
              longitude: Number(data?.shop?.address.longitude?.$numberDecimal),
            }}
          >
            <Callout
              tooltip={true}
              onPress={() => {
                navigation.navigate("ShopUser", {
                  params: {
                    shopId: data?.shop?._id,
                    distance: data?.distance,
                    relevantProducts: data?.relevantProducts
                      ? data.relevantProducts
                      : [],
                  },
                });
              }}
            >
              <ShopMarkerCard key={data?.shop?._id} shopData={data.shop} />
            </Callout>
          </Marker>
        );
      })
    : marketResults.map((data, i) => {
        return (
          <Marker
            key={i}
            coordinate={{
              latitude: Number(data?.market.address.latitude?.$numberDecimal),
              longitude: Number(data?.market.address.longitude?.$numberDecimal),
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
              <MarketMarkerCard
                key={data?.market._id}
                marketData={data.market}
                shops={data?.shops}
                distance={data?.distance}
              />
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
        className="px-2"
        style={{ position: "absolute", top: 50, width: "100%" }}
      >
        <MapSearchBox
          search={
            route.params && route.params.search
              ? route.params.search
              : undefined
          }
          refrechResultsFn={(type: string, newSearchResults: string[]) => {
            if (type === "shop") {
              setProducerResults(newSearchResults);
            } else {
              setMarketResults(newSearchResults);
            }
          }}
          // displayMode="widget"
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
