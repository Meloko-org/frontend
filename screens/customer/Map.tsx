import React, { useState, useEffect, useRef, useCallback } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";

import { Region } from "react-native-maps";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

import { getSheetStack } from "react-native-actions-sheet";
import { MarketResultData, ShopResultData } from "../../types/API";
import { closeIfOpen, handleSheetFlow } from "../../helpers/sheetHelpers";

import { View, Text, StyleSheet, Platform } from "react-native";
import ShopSearchResultCard from "../../components/cards/ShopSearchResult";
import MarketSearchResultCard from "../../components/cards/MarketSearchResult";
import ShopMarkerCard from "../../components/cards/ShopMarkerCard";
import MapSearchBox from "../../components/map/MapSearchBox";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function MapCustomerScreen({ navigation }: MapProps) {
  const [currentPosition, setCurrentPosition] = useState<userPosition>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);

  const [shopResults, setShopResults] = useState<ShopResultData[] | null>([]);
  const [marketResults, setMarketResults] = useState<MarketResultData[] | null>(
    [],
  );
  const stockedMarketResultsRef = useRef<MarketResultData[]>([]);

  const mapSearchBoxRef = useRef<{ toggleSearch: () => void }>(null);

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
  }, []);

  const buildShopComponents = (shops: ShopResultData[]) => {
    return shops.map((sr) => (
      <ShopSearchResultCard
        shopData={sr.shop}
        results={sr.relevantProducts.length}
        distance={sr.distance}
        onPressFn={() => {
          const sheetId = getSheetStack()[0].id;
          closeIfOpen(sheetId);
          navigation.navigate("ShopUser", {
            shopId: sr?.shop?._id,
            distance: sr?.distance,
            relevantProducts: sr?.relevantProducts ? sr?.relevantProducts : [],
            sheetId: sheetId,
          });
        }}
        key={sr?.shop?._id}
        extraClasses="mb-1"
        displayMode="bottomSheet"
      />
    ));
  };

  const buildMarketComponents = (markets: MarketResultData[]) => {
    return markets.map((mr) => (
      <MarketSearchResultCard
        marketData={mr.market}
        results={mr.shops}
        distance={mr.distance}
        onPressFn={() => onMarketPress(mr.shops)}
        key={mr?.market?._id}
        extraClasses="mb-1"
      />
    ));
  };

  const onMarketPress = async (shops: any[]) => {
    // reconstruction d'un objet de type ShopResultData
    const transformedShops: ShopResultData[] = shops.map((shop, index) => {
      const { matchedStocks, ...cleanShop } = shop;
      return {
        shop: cleanShop,
        relevantProducts: shop.matchedStocks ?? [],
        distance: 0,
      };
    });

    await handleSheetFlow({
      sheet: "map-shop-results",
      payload: {
        resultsList: buildShopComponents(transformedShops),
        onBackFn: () => {
          handleSheetFlow({
            sheet: "map-market-results",
            payload: {
              resultsList: buildMarketComponents(
                stockedMarketResultsRef.current,
              ),
            },
          });
        },
      },
    });
  };

  useEffect(() => {
    if (shopResults && shopResults?.length > 0) {
      handleSheetFlow({
        sheet: "map-shop-results",
        payload: { resultsList: buildShopComponents(shopResults) },
      });
    }
  }, [shopResults]);

  useEffect(() => {
    if (marketResults && marketResults.length > 0) {
      stockedMarketResultsRef.current = marketResults;
      handleSheetFlow({
        sheet: "map-market-results",
        payload: { resultsList: buildMarketComponents(marketResults) },
      });
    }
  }, [marketResults]);

  const markers = shopResults
    ? shopResults.map((data: ShopResultData, i) => {
        return (
          <Marker
            key={i}
            coordinate={{
              latitude: Number(data?.shop?.address.latitude?.$numberDecimal),
              longitude: Number(data?.shop?.address.longitude?.$numberDecimal),
            }}
          >
            <Callout
              tooltip={false}
              onPress={() => {
                const sheetId = getSheetStack()[0].id;
                navigation.navigate("ShopUser", {
                  shopId: data?.shop?._id,
                  distance: data?.distance,
                  relevantProducts: data?.relevantProducts
                    ? data.relevantProducts
                    : [],
                  sheetId: sheetId,
                });
              }}
            >
              <View>
                <ShopMarkerCard key={data?.shop?._id} shopData={data.shop} />
              </View>
            </Callout>
          </Marker>
        );
      })
    : marketResults?.map((data: MarketResultData, i) => {
        return (
          <Marker
            key={i}
            coordinate={{
              latitude: Number(data?.market.address.latitude?.$numberDecimal),
              longitude: Number(data?.market.address.longitude?.$numberDecimal),
            }}
            pinColor="green"
          >
            <Callout
              // tooltip={true}
              onPress={() => {
                console.log("youpi");
              }}
            >
              <View>
                <MarketMarkerCard
                  key={data?.market._id}
                  marketData={data.market}
                  shops={data?.shops}
                  distance={data?.distance}
                />
              </View>
            </Callout>
          </Marker>
        );
      });

  // console.log("shopResults :", shopResults)
  // console.log("marketResults :", marketResults)

  return (
    <SafeAreaView className="flex-1">
      <MapView
        mapType="hybrid"
        showsUserLocation={true}
        style={{ flex: 1, marginBottom: Platform.OS === "android" ? -50 : 0 }}
        className="flex-1"
        region={region}
        userInterfaceStyle="dark"
      >
        {markers}
      </MapView>

      <View className="absolute top-[90px] px-3 w-full">
        <MapSearchBox
          ref={mapSearchBoxRef}
          refrechResultsFn={(
            type: string,
            newShopResults: ShopResultData[] | null,
            newMarketResults: MarketResultData[] | null,
          ) => {
            const hasShopResults = newShopResults && newShopResults.length > 0;
            const hasMarketResults =
              newMarketResults && newMarketResults.length > 0;

            if (type === "shop") {
              if (!hasShopResults) {
                handleSheetFlow({
                  sheet: "map-empty-search-results",
                  payload: {
                    searchType: "producteur",
                    onRetry: () => {
                      mapSearchBoxRef.current?.toggleSearch();
                    },
                  },
                });
              } else {
                setShopResults(newShopResults);
                setMarketResults(null);
              }
            } else {
              if (!hasMarketResults) {
                handleSheetFlow({
                  sheet: "map-empty-search-results",
                  payload: {
                    searchType: "point de vente",
                    onRetry: () => {
                      mapSearchBoxRef.current?.toggleSearch();
                    },
                  },
                });
              } else {
                setMarketResults(newMarketResults);
                setShopResults(null);
              }
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
