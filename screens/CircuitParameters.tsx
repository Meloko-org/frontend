import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { CircuitOptionsData, ShopFeaturesData } from "../types/API";
import useMyPosition, {
  getAddressCoordinates,
} from "../helpers/AddressHelpers";

import { SafeAreaView } from "react-native-safe-area-context";
import { Slider } from "@miblanchard/react-native-slider";
import { SheetManager } from "react-native-actions-sheet";

import { Text, View, StyleSheet } from "react-native";
import TextHeading2 from "../components/utils/texts/Heading2";
import TextBody2 from "../components/utils/texts/Body2";
import InputText from "../components/utils/inputs/Text";
import IconButton from "../components/utils/buttons/Icon";
import Spinner from "../components/utils/Spinner";
import InputRadioGroup from "../components/utils/inputs/radioGroup";
import typesTools from "../modules/typesTools";
import SwitchInput from "../components/utils/inputs/Switch";
import { ScrollView } from "react-native-gesture-handler";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import { isEnabled } from "react-native/Libraries/Performance/Systrace";
import TextBody1 from "../components/utils/texts/Body1";
import featuresTools from "../modules/featuresTools";

import { StatusBar } from "expo-status-bar";

import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import TextHeading4 from "../components/utils/texts/Heading4";
import CircuitMapScreen from "./CircuitMap";

import { useColorScheme } from "nativewind";

type CircuitParametersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CircuitParameters"
>;

type Props = {
  navigation: CircuitParametersScreenNavigationProp;
};

export default function CircuitParametersScreen({ navigation }: Props) {
  const { signOut, isSignedIn, getToken } = useAuth();

  const [isSearchAddressLoading, setIsSearchAddressLoading] =
    useState<boolean>(false);
  const [isCoordinatesLoading, setIsCoordinatesLoading] =
    useState<boolean>(false);
  const [circuitOptions, setCircuitOptions] = useState<CircuitOptionsData>({
    types: [],
    address: "",
    radius: {
      value: [20],
    },
    userPosition: {
      latitude: 0,
      longitude: 0,
    },
    duration: "halfDay",
    features: [],
  });
  const [typeLabels, setTypeLabels] = useState<
    { _id: string; label: string }[] | null
  >([]);
  const [isAllTypeSelected, setIsAllTypeSelected] = useState<boolean>(false);

  const [features, setFeatures] = useState<ShopFeaturesData[]>([]);

  const fetchTypeLabels = async () => {
    try {
      const typeResponse = await typesTools.getTypeLabels();
      setTypeLabels(typeResponse.data);

      /* activation de "Tous" dès le départ */
      // setIsAllTypeSelected(true)
      // setCircuitOptions((prev) => ({
      // 	...prev,
      // 	types: typeResponse.data!.map((type) => type._id)
      // }))
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const featuresResponse = await featuresTools.getShopFeatures();
      setFeatures(featuresResponse.data!);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isSignedIn) {
      navigation.navigate("SignIn", {
        from: "Home",
        backLabel: "Retour à l'accueil",
        screenTitle: `CONNEXION\nINSCRIPTION`,
        next: "CircuitParameters",
      });
    } else {
      fetchTypeLabels();
      fetchFeatures();
    }
  }, []);

  const toggleAlltypes = () => {
    if (!typeLabels) return;

    if (circuitOptions.types.length === typeLabels.length) {
      setIsAllTypeSelected(false);
      setCircuitOptions((prev) => ({
        ...prev,
        types: [],
      }));
    } else {
      setIsAllTypeSelected(true);
      setCircuitOptions((prev) => ({
        ...prev,
        types: typeLabels.map((type) => type._id),
      }));
    }
  };

  const toggleSingleType = (typeId: string, isEnabled: boolean) => {
    setCircuitOptions((prev) => {
      const updatedTypes = isEnabled
        ? [...prev.types, typeId]
        : prev.types.filter((id) => id !== typeId);

      setIsAllTypeSelected(updatedTypes.length === typeLabels!.length);

      return {
        ...prev,
        types: updatedTypes,
      };
    });
  };

  const toggleFeature = (featureId: string, isEnabled: boolean) => {
    setCircuitOptions((prev) =>
      isEnabled
        ? {
            ...prev,
            features: [...prev.features, featureId],
          }
        : {
            ...prev,
            features: prev.features.filter((id) => id !== featureId),
          },
    );
  };

  const verifyAddress = async () => {
    const coordResponse = await getAddressCoordinates(circuitOptions.address);

    if (!coordResponse.success) {
      return "Adresse invalide.";
    } else {
      setCircuitOptions((prev) => ({
        ...prev,
        userPostion: {
          latitude: coordResponse.coords?.latitude,
          longitude: coordResponse.coords?.longitude,
        },
      }));
      return true;
    }
  };

  const handleLaunchCircuit = async (params: CircuitOptionsData) => {
    /* si une adresse et des coordonnées sont renseignées, on ne garde que l'adresse */
    // if (circuitOptions.address !== ""
    // 		&& circuitOptions.userPosition.latitude !== 0
    // 		&& circuitOptions.userPosition.longitude !== 0) {
    // 	setCircuitOptions((prev) => ({
    // 		...prev,
    // 		userPosition: {
    // 			latitude: 0,
    // 			longitude: 0
    // 		}
    // 	}))
    // }

    /* Vérifications des champs */
    if (
      circuitOptions.types.length === 0 ||
      (circuitOptions.address === "" &&
        circuitOptions.userPosition.latitude === 0 &&
        circuitOptions.userPosition.longitude === 0)
    ) {
      SheetManager.show("alert", {
        payload: {
          message: "Des paramètres sont manquants.",
          alertType: "warning",
        },
      });
      return;
    }

    /* Vérification de l'adresse */
    if (
      circuitOptions.address !== "" &&
      circuitOptions.address !== "Ma Position"
    ) {
      setIsSearchAddressLoading(true);
      const isAddressValid = await verifyAddress();

      if (typeof isAddressValid === "string") {
        SheetManager.show("alert", {
          payload: {
            message: isAddressValid,
            alertType: "error",
          },
        });
        setIsSearchAddressLoading(false);
        return;
      }
      setIsSearchAddressLoading(false);
    }

    navigation.navigate("CircuitMap", {
      circuitOptions,
    });
  };

  console.log("CIRCUIT :", circuitOptions);

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <ScrollView>
        <View className="p-3">
          <TextHeading2 extraClasses="mb-4" centered>
            Circuit Touristique
          </TextHeading2>

          <TextBody1 centered extraClasses="mb-5">
            {`Partez à la découverte des producteurs qui vous entourent en organisant un circuit toutistique. Définissez les paramètres de votre parcours et lancez le circuit.`}
          </TextBody1>

          <TextBody2 extraClasses="font-bold mb-1 ml-2">
            Point de départ
          </TextBody2>
          <View className="w-full flex flex-row justify-between">
            <View className="w-3/4 relative">
              <InputText
                label="ADRESSE"
                placeholder="Saisir une adresse"
                value={circuitOptions.address}
                onChangeText={(newAddress: string) => {
                  setCircuitOptions((prev) => ({
                    ...prev,
                    address: newAddress,
                    userPosition: {
                      latitude: 0,
                      longitude: 0,
                    },
                  }));
                }}
                extraClasses="mb-5"
              />
              {isCoordinatesLoading && (
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
                extraClasses="w-20 h-[70px] bg-secondary dark:bg-primary"
                onPressFn={async () => {
                  setIsCoordinatesLoading(true);
                  // récupération de la position et modification de circuitOptions
                  const result = await useMyPosition();

                  if (result.success && result.position) {
                    setCircuitOptions((prev) => ({
                      ...prev,
                      userPosition: {
                        latitude: result.position?.coords.latitude,
                        longitude: result.position?.coords.longitude,
                      },
                      address: "Ma Position",
                    }));
                  } else {
                    SheetManager.show("alert", {
                      payload: {
                        message: result.error!,
                        alertType: "error",
                      },
                    });
                  }
                  setIsCoordinatesLoading(false);
                }}
              />
            </View>
          </View>

          <TextBody2 extraClasses="font-bold ml-2">Distance</TextBody2>
          <View style={{ width: "100%" }} className="px-3 flex-row mb-5">
            <Slider
              containerStyle={{ width: "80%" }}
              value={circuitOptions.radius ? circuitOptions.radius.value : [20]}
              step={5}
              minimumValue={0}
              maximumValue={200}
              onValueChange={(newRadius) => {
                setCircuitOptions((prevState) => ({
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
                {circuitOptions.radius.value[0]} km
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center mb-5">
            <TextBody2 extraClasses="font-bold mb-1 ml-2">Durée</TextBody2>
            <View className="">
              <InputRadioGroup
                data={[
                  {
                    label: "Demi-journée",
                    value: "halfDay",
                    selected: circuitOptions.duration === "halfDay",
                  },
                  {
                    label: "Journée",
                    value: "day",
                    selected: circuitOptions.duration === "day",
                  },
                ]}
                size="base"
                onPressFn={(value) => {
                  setCircuitOptions((prev) => ({
                    ...prev,
                    duration: value,
                  }));
                }}
              />
            </View>
          </View>

          <TextBody2 centered extraClasses="font-bold ml-2 mb-1 mt-5">
            Quoi visiter ?
          </TextBody2>

          <View className="w-96 flex items-center mb-5">
            <View className="w-80">
              <SwitchInput
                label="Tous"
                value={isAllTypeSelected}
                onValueChange={toggleAlltypes}
                extraClasses="mb-5"
              />
              {typeLabels &&
                typeLabels.map((type) => {
                  const isSelected = circuitOptions.types.includes(type._id);

                  return (
                    <SwitchInput
                      key={type._id}
                      label={type.label}
                      value={isSelected}
                      onValueChange={(isEnabled) =>
                        toggleSingleType(type._id, isEnabled)
                      }
                      disabled={isAllTypeSelected}
                      extraClasses="mb-2"
                    />
                  );
                })}
            </View>
          </View>

          <TextBody2 centered extraClasses="font-bold ml-2 mb-1 mt-5">
            Options
          </TextBody2>
          <View className="w-96 flex mb-5">
            <View className="">
              {features &&
                features.map((feature) => (
                  <SwitchInput
                    key={feature._id}
                    label={
                      <View className="flex flex-row items-center">
                        <View
                          className="
												border border-lightbg dark:border-darkbg rounded-lg w-8 h-8
												bg-primary
												flex items-center justify-center"
                        >
                          <FontAwesome5Icon
                            name={feature.icon}
                            size={18}
                            color="#FFFFFF"
                          />
                        </View>
                        <TextBody1 extraClasses="pl-2 text-[18px]">
                          {feature.label}
                        </TextBody1>
                      </View>
                    }
                    value={circuitOptions.features.includes(feature._id)}
                    onValueChange={(isEnabled) =>
                      toggleFeature(feature._id, isEnabled)
                    }
                    extraClasses="mb-2"
                  />
                ))}
            </View>
          </View>

          <ButtonPrimaryEnd
            label="Lancer le circuit"
            iconName="car"
            isLoading={isSearchAddressLoading}
            onPressFn={() => handleLaunchCircuit(circuitOptions)}
            extraClasses="h-14 my-5"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bgDark: {
    // flex: 1,
    backgroundColor: "#262E20",
    // padding: 10,
  },
  iconDark: {
    color: "#fff",
  },
  bgLight: {
    // flex: 1,
    backgroundColor: "#FCFFF0",
    // padding: 10,
  },
  iconLight: {
    color: "#000",
  },
});
