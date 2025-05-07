import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { Animated, View, Text, Pressable, StyleSheet } from "react-native";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";

import { SafeAreaView } from "react-native-safe-area-context";
import InputText from "../utils/inputs/Text";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";
import IconButton from "../utils/buttons/Icon";
import { Slider } from "@miblanchard/react-native-slider";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import InputButtonGroup from "../utils/inputs/radioGroup";
import Spinner from "../utils/Spinner";

type userPosition = {
  latitude: number;
  longitude: number;
};

type searchOptions = {
  query: string;
  address: string;
  radius: {
    value: number[];
  };
  userPosition: userPosition;
  searchType: "shop" | "market";
};

type Props = {
  search?: searchOptions;
  refrechResultsFn?: Function;
  // navigation?: object;
};

export default function MapSearchBox(props: Props): JSX.Element {
  const searchSection = useCollapsibleSection();

  const [searchType, setSearchType] = useState<string>("shop");

  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchOptions, setSearchOptions] = useState<searchOptions>({
    query: "",
    address: "",
    radius: {
      value: [40],
    },
    userPosition: {
      latitude: 0.0,
      longitude: 0.0,
    },
    searchType: "shop",
  });

  const [performSearch, setPerformSearch] = useState(false);
  const [openSearchBox, setOpenSearchBox] = useState(false);

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

  // useEffect(() => {
  //   if (props.search) {
  //     // console.log("search", props.search)
  //     setSearchOptions(props.search);
  //   }
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     if (
  //       searchOptions.userPosition.latitude !== 0 &&
  //       searchOptions.userPosition.longitude !== 0 &&
  //       performSearch
  //     ) {
  //       setIsSearchLoading(true);
  //       const response = await fetch(`${API_ROOT}/shops/search`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           mode: "cors",
  //         },
  //         body: JSON.stringify({
  //           query: searchOptions.query,
  //           radius: searchOptions.radius.value[0],
  //           userPosition: searchOptions.userPosition,
  //           searchType: searchType,
  //         }),
  //       });
  //       const data = await response.json();

  //       console.log("databack :", data);
  //       setIsSearchLoading(false);
  //       // if (props.displayMode === "widget") {
  //       //   props.refrechResultsFn && props.refrechResultsFn(data.searchResults);
  //       // }

  //       props.refrechResultsFn &&
  //         searchType === "shop" &&
  //         props.refrechResultsFn("shop", data.producerResults);
  //       props.refrechResultsFn &&
  //         searchType === "market" &&
  //         props.refrechResultsFn("market", data.marketResults);

  //       // if (props.navigation) {
  //       //   props.navigation.navigate("TabNavigatorUser", {
  //       //     screen: "Search",
  //       //     params: {
  //       //       search: {
  //       //         address: searchOptions.address,
  //       //         query: searchOptions.query,
  //       //         radius: searchOptions.radius,
  //       //         userPosition: searchOptions.userPosition,
  //       //       },
  //       //       searchResults: data.searchResults,
  //       //     },
  //       //   });
  //       // }
  //     }
  //     // setOpenSearchBox(false);
  //     setPerformSearch(false);
  //   })();
  // }, [searchOptions.userPosition, performSearch]);

  const useMyPosition = async (): Promise<void> => {
    const result = await Location.requestForegroundPermissionsAsync();
    const status = result?.status;

    if (status === "granted") {
      Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
        setSearchOptions((prevState) => ({
          ...prevState,
          address: "Ma Position",
          userPosition: {
            ...prevState.userPosition,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }));
      });
    }
  };

  const searchAddress = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${searchOptions.address}`,
      );
      const data = await response.json();
      const latitude: number = data.features[0].geometry.coordinates[1];
      const longitude: number = data.features[0].geometry.coordinates[0];

      setSearchOptions((prevState) => ({
        ...prevState,
        userPosition: {
          ...prevState.userPosition,
          latitude: latitude,
          longitude: longitude,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // const onSearchPress = async (): Promise<void> => {
  //   try {
  //     // setIsSearchLoading(true);
  //     if (
  //       searchOptions.address !== "Ma Position" &&
  //       searchOptions.address !== ""
  //     ) {
  //       await searchAddress();
  //     }
  //     setPerformSearch(true);
  //     // setIsSearchLoading(false);
  //   } catch (err) {
  //     // setIsSearchLoading(false);
  //     console.error(err);
  //   }
  // };

  const onSearchPress = async (): Promise<void> => {
    try {
      if (
        searchOptions.address !== "Ma Position" &&
        searchOptions.address !== ""
      ) {
        await searchAddress();
      }
      setIsSearchLoading(true);
      const response = await fetch(`${API_ROOT}/shops/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
        body: JSON.stringify({
          query: searchOptions.query,
          radius: searchOptions.radius.value[0],
          userPosition: searchOptions.userPosition,
          searchType: searchType,
        }),
      });
      const data = await response.json();

      console.log("databack :", data);
      setIsSearchLoading(false);

      props.refrechResultsFn &&
        searchType === "shop" &&
        props.refrechResultsFn("shop", data.producerResults);
      props.refrechResultsFn &&
        searchType === "market" &&
        props.refrechResultsFn("market", data.marketResults);
    } catch (err) {
      // setIsSearchLoading(false);
      console.error(err);
    }
  };

  console.log("searchType :", searchType);

  return (
    <>
      <Pressable
        className={`rounded-lg bg-lightbg p-2 shadow-sm dark:bg-tertiary`}
        onPress={searchSection.toggle}
      >
        <View>
          <InputText
            value={searchOptions.query}
            onChangeText={(newQuery: string) =>
              setSearchOptions((prevState) => ({
                ...prevState,
                query: newQuery,
              }))
            }
            placeholder="ex: tomates, oignons..."
            label="Votre recherche"
            autoCapitalize="none"
            extraClasses="w-full"
            size="large"
            iconName="search"
            onIconPressFn={() => {
              onSearchPress();
              searchSection.toggle();
            }}
          />

          {!searchSection.isOpen && (
            <View className="h-7 mt-2">
              <Text
                className={`${openSearchBox && "hidden"} text-sm w-full text-center font-bold text-secondary/40 my-1 dark:text-lightbg`}
              >
                Cliquez pour plus d'options !
              </Text>
            </View>
          )}
        </View>

        <Animated.View
          style={[searchSection.animatedStyle]}
          className="overflow-hidden"
        >
          <View
            onLayout={searchSection.onLayout}
            style={searchSection.innerContainerStyle}
          >
            <View className="mt-5">
              <InputButtonGroup
                data={[
                  {
                    label: "Producteurs",
                    value: "shop",
                    selected: true,
                  },
                  {
                    label: "Points de vente",
                    value: "market",
                    selected: false,
                  },
                ]}
                onPressFn={(value) => setSearchType(value)}
                size="base"
              />
            </View>

            <TextHeading3 extraClasses="mt-5" centered>
              Localisation
            </TextHeading3>
            <View className="w-full flex flex-row justify-between">
              <View className="w-3/4">
                <InputText
                  value={searchOptions.address}
                  onChangeText={(newAddress: string) =>
                    setSearchOptions((prevState) => ({
                      ...prevState,
                      address: newAddress,
                    }))
                  }
                  placeholder="Adresse, code postal, ville ..."
                  label="Adresse"
                  autoCapitalize="none"
                  extraClasses="w-full"
                />
              </View>
              <View className="w-1/4 flex flex-row justify-end">
                <IconButton
                  iconName="map-marker"
                  extraClasses="w-20 bg-secondary dark:bg-primary"
                  onPressFn={useMyPosition}
                />
              </View>
            </View>

            <TextHeading3 extraClasses="mt-5" centered>
              Distance
            </TextHeading3>
            <View style={{ width: "100%" }} className="px-3 flex-row mb-5">
              <Slider
                containerStyle={{ width: "80%" }}
                value={searchOptions.radius ? searchOptions.radius.value : [20]}
                step={5}
                minimumValue={0}
                maximumValue={200}
                onValueChange={(newRadius) => {
                  setSearchOptions((prevState) => ({
                    ...prevState,
                    radius: {
                      value: [...newRadius],
                    },
                  }));
                }}
                minimumTrackTintColor="#98B66E"
                thumbTintColor="#98B66E"
              />
              <View className="flex flex-row items-center justify-center w-20">
                <Text className=" dark:text-lightbg">
                  {searchOptions.radius.value[0]} km
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>

      {isSearchLoading && (
        <View className="flex-1 justify-center align-center h-64">
          <Spinner />
        </View>
      )}
    </>
  );
}
