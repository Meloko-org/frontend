import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import * as Location from "expo-location";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";

import { MarketResultData, ShopResultData } from "../../types/API";
import { SheetManager } from "react-native-actions-sheet";

import { Animated, View, Text, Pressable, StyleSheet } from "react-native";
import InputText from "../utils/inputs/Text";
import IconButton from "../utils/buttons/Icon";
import { Slider } from "@miblanchard/react-native-slider";
import TextHeading3 from "../../components/utils/texts/Heading3";
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
  refrechResultsFn?: (
    type: string,
    newShopResults: ShopResultData[],
    newMarketResults: MarketResultData[],
  ) => void;
};

// export default function MapSearchBox({ refrechResultsFn }: Props) {

const MapSearchBox = forwardRef(function MapSearchBox(
  { refrechResultsFn }: Props,
  ref: React.Ref<{ toggleSearch: () => void }>,
) {
  const searchSection = useCollapsibleSection();

  useImperativeHandle(ref, () => ({
    toggleSearch: () => {
      searchSection.toggle();
    },
  }));

  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchAddressLoading, setIsSearchAddressLoading] =
    useState<Boolean>(false);
  const [searchOptions, setSearchOptions] = useState<searchOptions>({
    query: "",
    address: "",
    radius: {
      value: [40],
    },
    userPosition: {
      latitude: 0,
      longitude: 0,
    },
    searchType: "shop",
  });

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

  // gestion du inputRadioGroup
  const radioData = [
    {
      label: "Producteurs",
      value: "shop",
      selected: searchOptions.searchType === "shop",
    },
    {
      label: "Points de vente",
      value: "market",
      selected: searchOptions.searchType === "market",
    },
  ];

  const handleSearchTypeChange = (value: string) => {
    setSearchOptions((prev) => ({
      ...prev,
      searchType: value as "shop" | "market",
    }));
  };

  const useMyPosition = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      setSearchOptions((prev) => ({
        ...prev,
        address: "Ma Position",
        userPosition: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));
    }
    setIsSearchAddressLoading(false);
  };

  const searchAddress = async (): Promise<boolean> => {
    try {
      setIsSearchAddressLoading(true);
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${searchOptions.address}`,
      );

      const data = await response.json();

      if (!response.ok || !data.features || data.features.length === 0) {
        SheetManager.show("alert", {
          payload: {
            message:
              "Les coordonnées de cette adresse n'ont pas pu être trouvées. L'adresse est elle correcte ?",
            alertType: "warning",
          },
        });
        setIsSearchAddressLoading(false);
        return false;
      }

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

      setIsSearchAddressLoading(false);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const onSearchPress = async (): Promise<void> => {
    if (!searchOptions.query.trim()) {
      SheetManager.show("alert", {
        payload: {
          message: "Indiquez votre recherche",
          alertType: "warning",
        },
      });
      return;
    }

    setIsSearchLoading(true);
    let canSearch = true;

    // si une adresse est saisie, on cherche les coordonnées
    if (
      searchOptions.address !== "Ma Position" &&
      searchOptions.address.trim() !== ""
    ) {
      canSearch = await searchAddress();
    }

    if (
      searchOptions.userPosition.latitude === 0 ||
      searchOptions.userPosition.longitude === 0
    ) {
      SheetManager.show("alert", {
        payload: {
          message:
            "Indiquez une adresse ou géolocalisez vous en appuyant sur le bouton à côté de l'adresse.",
          alertType: "warning",
        },
      });
      setIsSearchLoading(false);
      return;
    }

    if (!canSearch) {
      setIsSearchLoading(false);
      return;
    }

    try {
      searchSection.toggle();

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
          searchType: searchOptions.searchType,
        }),
      });
      const data = await response.json();

      console.log("databack :", data);

      if (refrechResultsFn) {
        if (searchOptions.searchType === "shop") {
          refrechResultsFn("shop", data.shopResults, null);
        } else {
          refrechResultsFn("market", null, data.marketResults);
        }
      }

      setIsSearchLoading(false);
    } catch (err) {
      setIsSearchLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    if (!searchSection.isOpen) {
      searchSection.toggle();
    }
  }, []);

  return (
    <>
      <View className={`rounded-lg bg-lightbg p-2 dark:bg-tertiary`}>
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
            }}
          />
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
                data={radioData}
                onPressFn={handleSearchTypeChange}
                size="base"
              />
            </View>

            <TextHeading3 extraClasses="mt-5" centered>
              Localisation
            </TextHeading3>
            <View className="w-full flex flex-row justify-between">
              <View className="w-3/4 relative">
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
                {isSearchAddressLoading && (
                  <View className="absolute top-0 left-0 flex justify-center align-center w-full h-full">
                    <Spinner />
                  </View>
                )}
              </View>
              <View className="w-1/4 flex flex-row justify-end">
                <IconButton
                  iconName="map-marker"
                  iconColor="white"
                  buttonColor="bg-primary"
                  extraClasses="w-20 bg-secondary dark:bg-primary"
                  onPressFn={() => {
                    useMyPosition();
                    setIsSearchAddressLoading(true);
                  }}
                />
              </View>
            </View>

            <TextHeading3 extraClasses="mt-5" centered>
              Distance
            </TextHeading3>
            <View style={{ width: "100%" }} className="px-3 flex-row mb-2">
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

        <Pressable onPress={searchSection.toggle}>
          <View className="h-7 mt-2">
            <Text
              className={` text-sm w-full text-center font-bold text-secondary/40 my-1 dark:text-lightbg`}
            >
              {`Appuyez pour ${searchSection.isOpen ? "moins" : "plus"} d'options !`}
            </Text>
          </View>
        </Pressable>
      </View>

      {isSearchLoading && (
        <View className="flex-1 justify-center align-center h-64">
          <Spinner />
        </View>
      )}
    </>
  );
});

export default MapSearchBox;
