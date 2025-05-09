import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { Region } from "react-native-maps";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

import {
  SheetManager,
  useSheetRef,
  ActionSheetRef,
  Sheets,
  getSheetStack,
} from "react-native-actions-sheet";

import ShopSearchResultCard from "../../components/cards/ShopSearchResult";
import MarketSearchResultCard from "../../components/cards/MarketSearchResult";
import ShopMarkerCard from "../../components/cards/ShopMarkerCard";
import MapSearchBox from "../../components/map/MapSearchBox";
import {
  MarketData,
  MarketResultData,
  ShopData,
  ShopResultData,
} from "../../types/API";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import MarketMarkerCard from "../../components/cards/MarketMarker";
import { handleSheetFlow } from "../../helpers/sheetHelpers";

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
  navigation,
}: MapProps): JSX.Element {
  const [currentPosition, setCurrentPosition] = useState<userPosition>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);

  const [shopResults, setShopResults] = useState<ShopResultData[] | null>([]);
  const [marketResults, setMarketResults] = useState<MarketResultData[] | null>(
    [],
  );
  // const [stockedMarketResults, setStockedMarketResults] = useState<MarketResultData[]>([]);
  const stockedMarketResultsRef = useRef<MarketResultData[]>([]);

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

  const buildShopComponents = (shops: ShopResultData[]): JSX.Element[] => {
    return shops.map((sr) => (
      <ShopSearchResultCard
        shopData={sr.shop}
        results={sr.relevantProducts.length}
        distance={sr.distance}
        onPressFn={() => {
          navigation.navigate("ShopUser", {
            shopId: sr?.shop?._id,
            distance: sr?.distance,
            relevantProducts: sr?.relevantProducts ? sr?.relevantProducts : [],
          });
        }}
        key={sr?.shop?._id}
        extraClasses="mb-1"
        displayMode="bottomSheet"
      />
    ));
  };

  const buildMarketComponents = (
    markets: MarketResultData[],
  ): JSX.Element[] => {
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
                navigation.navigate("ShopUser", {
                  shopId: data?.shop?._id,
                  distance: data?.distance,
                  relevantProducts: data?.relevantProducts
                    ? data.relevantProducts
                    : [],
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
        // style={styles.map}
        className="flex-1"
        region={region}
        userInterfaceStyle="dark"
      >
        {markers}
      </MapView>

      <View className="absolute top-[90px] px-3 w-full">
        <MapSearchBox
          refrechResultsFn={(
            type: string,
            newShopResults: ShopResultData[],
            newMarketResults: MarketResultData[],
          ) => {
            if (type === "shop") {
              setShopResults(newShopResults);
              setMarketResults(null);
            } else {
              setMarketResults(newMarketResults);
              setShopResults(null);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
