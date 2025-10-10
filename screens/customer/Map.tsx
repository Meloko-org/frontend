import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";

import { Region } from "react-native-maps";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

import {
  ActionSheetRef,
  getSheetStack,
  SheetManager,
} from "react-native-actions-sheet";
import { MarketResultData, ShopResultData } from "../../types/API";
import { closeIfOpen, handleSheetFlow } from "../../helpers/sheetHelpers";

import { View, Text, StyleSheet, Platform } from "react-native";
import ShopSearchResultCard from "../../components/cards/ShopSearchResult";
import MarketSearchResultCard from "../../components/cards/MarketSearchResult";
import ShopMarkerCard from "../../components/cards/ShopMarkerCard";
import MapSearchBox from "../../components/map/MapSearchBox";
import { SafeAreaView } from "react-native-safe-area-context";
import MarketMarkerCard from "../../components/cards/MarketMarker";
import { useDispatch, useSelector } from "react-redux";
import {
  mapShopResultsState,
  setSelectedShopId,
} from "../../reducers/mapShopResults";
import {
  mapMarketResultsState,
  setSelectedMarketId,
} from "../../reducers/mapMarketResults";

type userPosition = {
  latitude: number;
  longitude: number;
} | null;

type MapProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function MapCustomerScreen({ navigation }: MapProps) {
  const dispatch = useDispatch();

  const [currentPosition, setCurrentPosition] = useState<userPosition>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);

  const isShopSearchActive = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.isSearchActive,
  );

  const isMarketSearchActive = useSelector(
    (state: { mapMarketResults: mapMarketResultsState }) =>
      state.mapMarketResults.isSearchActive,
  );

  // stockage des résultats venant de mapSearchBox
  const [shopResults, setShopResults] = useState<ShopResultData[] | null>([]);
  const [marketResults, setMarketResults] = useState<MarketResultData[] | null>(
    [],
  );
  // nécessaire pour le retour de map-shop-results à map-markets-results
  const stockedMarketResultsRef = useRef<MarketResultData[]>([]);
  const mapSearchBoxRef = useRef<{
    toggleSearch: () => void;
    openSearch: () => void;
  } | null>(null);

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

  // s'il n'y a plus de recherche en cours, on efface les potentiels résultats précédents
  useEffect(() => {
    if (!isShopSearchActive) {
      setShopResults(null);
    }
    if (!isMarketSearchActive) {
      setMarketResults(null);
    }
  }, [isShopSearchActive, isMarketSearchActive]);

  useEffect(() => {
    if (shopResults && shopResults?.length > 0) {
      handleSheetFlow({
        sheet: "map-shop-results",
        payload: {
          resultsList: shopResults,
          navigation: navigation,
          mapSearchBoxRef,
        },
      });
    }
  }, [shopResults]);

  useEffect(() => {
    if (marketResults && marketResults.length > 0) {
      stockedMarketResultsRef.current = marketResults;
      handleSheetFlow({
        sheet: "map-market-results",
        payload: {
          resultsList: marketResults,
          navigation: navigation,
          mapSearchBoxRef,
        },
      });
    }
  }, [marketResults]);

  const handleShopMarkerPress = (shopId: string) => {
    dispatch(setSelectedShopId(shopId));
  };

  const handleMarketMarkerPress = (marketId: string) => {
    dispatch(setSelectedMarketId(marketId));
  };

  const markers = useMemo(() => {
    if (shopResults && shopResults.length > 0) {
      return shopResults.map((data, i) => (
        <Marker
          key={`shop-${data?.shop?._id}`}
          coordinate={{
            latitude: Number(data?.shop?.address.latitude),
            longitude: Number(data?.shop?.address.longitude),
          }}
          onPress={() => handleShopMarkerPress(data.shop!._id)}
        />
      ));
    }

    if (marketResults && marketResults.length > 0) {
      return marketResults.map((data, i) => (
        <Marker
          key={`market-${data?.market?._id}`}
          coordinate={{
            latitude: Number(data?.market.address.latitude),
            longitude: Number(data?.market.address.longitude),
          }}
          pinColor="green"
          onPress={() => {
            handleMarketMarkerPress(data.market._id);
          }}
        />
      ));
    }

    return null;
  }, [shopResults, marketResults]);

  // console.log("MAPCUSTOMER: marketResults :", marketResults);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
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
                setShopResults([]);
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
              setShopResults(null);
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
