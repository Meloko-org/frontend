import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { useDispatch, useSelector } from "react-redux";
import {
  clearShopResultsList,
  mapShopResultsState,
  setIsShopSearchActive,
  setSelectedShopId,
  setShopResultsList,
} from "../../reducers/mapShopResults";
import {
  clearMarketResultsList,
  mapMarketResultsState,
  setIsMarketNavigating,
  setIsMarketSearchActive,
  setMarketResultsList,
  setSelectedMarketId,
} from "../../reducers/mapMarketResults";

import { Region } from "react-native-maps";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

import { MarketResultData, ShopResultData } from "../../types/API";
import { handleSheetFlow } from "../../helpers/sheetHelpers";

import { View, Platform } from "react-native";
import MapSearchBox from "../../components/map/MapSearchBox";
import { SafeAreaView } from "react-native-safe-area-context";
import { SheetManager } from "react-native-actions-sheet";

type userPosition = {
  latitude: number;
  longitude: number;
} | null;

type MarketSheetPromiseResult = {
  confirmed: boolean;
  resultsList: ShopResultData[];
};

type ShopSheetPromiseResult = {
  confirmed: boolean;
  isGoingBack: boolean;
};

type MapCustomerRouteProp = RouteProp<UserTabParamList, "MapCustomer">;

type MapCustomerNavProp = BottomTabNavigationProp<
  UserTabParamList,
  "MapCustomer"
>;

type Props = {
  navigation: MapCustomerNavProp;
  route: MapCustomerRouteProp;
};

export default function MapCustomerScreen({ navigation, route }: Props) {
  const dispatch = useDispatch();

  const [currentPosition, setCurrentPosition] = useState<userPosition>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);

  /* ShopSearchStore */
  const isShopSearchActive = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.isShopSearchActive,
  );

  const storedShopResults = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.resultsList,
  );

  const isShopNavigating = useSelector(
    (state: { mapShopResults: mapShopResultsState }) =>
      state.mapShopResults.isNavigating,
  );

  /* MarketSearchStore */
  const isMarketSearchActive = useSelector(
    (state: { mapMarketResults: mapMarketResultsState }) =>
      state.mapMarketResults.isMarketSearchActive,
  );

  const storedMarketResults = useSelector(
    (state: { mapMarketResults: mapMarketResultsState }) =>
      state.mapMarketResults.resultsList,
  );

  const isMarketNavigating = useSelector(
    (state: { mapMarketResults: mapMarketResultsState }) =>
      state.mapMarketResults.isNavigating,
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
  }, []);

  useEffect(() => {
    if (
      storedShopResults &&
      storedShopResults.length > 0 &&
      isShopSearchActive
    ) {
      handleShopSheet();
    }
  }, [storedShopResults, isShopSearchActive]);

  // const onBackFn = () => {
  //   console.log("youpi")
  //   dispatch(setIsShopSearchActive(false))
  // }

  const handleShopSheet = async () => {
    try {
      const shopSheetPromise = (await SheetManager.show("map-shop-results", {
        payload: {
          resultsList: storedShopResults,
          navigation,
          mapSearchBoxRef,
          backButton: storedMarketResults.length > 0 ? true : undefined,
        },
      })) as ShopSheetPromiseResult;

      if (shopSheetPromise && shopSheetPromise.confirmed) {
        if (storedMarketResults && storedMarketResults.length > 0) {
          console.log(
            "Réouverture de marketSheet, goingBack:",
            shopSheetPromise.isGoingBack,
          );
          if (shopSheetPromise.isGoingBack) {
            dispatch(setIsMarketSearchActive(true));
          } else {
            dispatch(setIsMarketSearchActive(false));
          }
        }
      }
    } catch (error) {
      console.warn("Erreur de shopSheet: ", error);
    }
  };

  useEffect(() => {
    if (
      storedMarketResults &&
      storedMarketResults.length > 0 &&
      isMarketSearchActive
    ) {
      handleMarketSheet();
    }
  }, [storedMarketResults, isMarketSearchActive]);

  const handleMarketSheet = async () => {
    try {
      const marketSheetPromise = (await SheetManager.show(
        "map-market-results",
        {
          payload: {
            resultsList: storedMarketResults,
            navigation,
            mapSearchBoxRef,
          },
        },
      )) as MarketSheetPromiseResult;

      if (marketSheetPromise && marketSheetPromise.confirmed) {
        dispatch(setIsMarketSearchActive(false));
        dispatch(setIsShopSearchActive(true));
        dispatch(setShopResultsList(marketSheetPromise.resultsList));
      }
    } catch (error) {
      console.warn("Erreur de marketSheet: ", error);
    }
  };

  const handleShopMarkerPress = (shopId: string) => {
    dispatch(setSelectedShopId(shopId));
  };

  const handleMarketMarkerPress = (marketId: string) => {
    dispatch(setSelectedMarketId(marketId));
  };

  const markers = useMemo(() => {
    if (
      storedShopResults &&
      storedShopResults.length > 0 &&
      isShopSearchActive
    ) {
      return storedShopResults.map((data, i) => (
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

    if (
      storedMarketResults &&
      storedMarketResults.length > 0 &&
      isMarketSearchActive
    ) {
      return storedMarketResults.map((data, i) => (
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
  }, [
    storedShopResults,
    storedMarketResults,
    isMarketSearchActive,
    isShopSearchActive,
  ]);

  console.log("MAP -----------------------------");
  console.log("    SHOP:");
  console.log("         shopSearchActive :", isShopSearchActive);
  console.log("         results stored: ", storedShopResults.length);
  console.log("         isNavigating: ", isShopNavigating);
  console.log("    MARKET:");
  console.log("         marketsearchActive :", isMarketSearchActive);
  console.log("         results stored: ", storedMarketResults.length);
  console.log("         isNavigating: ", isMarketNavigating);

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
        {!isShopSearchActive && !isMarketSearchActive && (
          <MapSearchBox
            ref={mapSearchBoxRef}
            refreshResultsFn={(
              type: string,
              newShopResults: ShopResultData[] | null,
              newMarketResults: MarketResultData[] | null,
            ) => {
              const hasShopResults =
                newShopResults && newShopResults.length > 0;
              const hasMarketResults =
                newMarketResults && newMarketResults.length > 0;

              if (type === "shop") {
                dispatch(setIsShopSearchActive(true));
                if (!hasShopResults) {
                  dispatch(setShopResultsList([]));
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
                  dispatch(setShopResultsList(newShopResults));
                  dispatch(clearMarketResultsList());
                }
              } else {
                dispatch(setIsMarketSearchActive(true));
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
                  dispatch(setMarketResultsList(newMarketResults));
                  dispatch(clearShopResultsList());
                }
              }
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
