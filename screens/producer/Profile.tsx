import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/clerk-expo";

import {
  CompositeNavigationProp,
  RouteProp,
  useRoute,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ProducerTabParamList,
  RootStackParamList,
  UserTabParamList,
} from "../../types/Navigation";

import { useSelector, useDispatch } from "react-redux";
import { ModeState, changeMode } from "../../reducers/mode";
import { UserState, updateUser, resetUser } from "../../reducers/user";
import {
  ProducerState,
  resetProducerData,
  setProducerData,
} from "../../reducers/producer";
import { resetShopData, ShopState } from "../../reducers/shop";
import { emptyCart } from "../../reducers/cart";

import producerTools from "../../modules/producerTools";

// import { RouteProp } from "@react-navigation/native";
// import { CompositeNavigationProp } from "@react-navigation/native";
// import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import {
//   ProducerTabParamList,
//   RootStackParamList,
// } from "../../types/Navigation"; // <-- ton fichier de types

import { useColorScheme } from "nativewind";
import { SheetManager } from "react-native-actions-sheet";

/* Eléments graphiques */
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { View, Text, StyleSheet } from "react-native";
import InputText from "../../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import CustomButton from "../../components/utils/buttons/Custom";
import IconButton from "../../components/utils/buttons/Icon";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import TextHeading4 from "../../components/utils/texts/Heading4";
import ColorSchemeButton from "../../components/utils/buttons/ColorScheme";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";

type ProducerProfileNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<ProducerTabParamList, "ProducerProfile">,
  CompositeNavigationProp<
    NativeStackNavigationProp<RootStackParamList>,
    BottomTabNavigationProp<UserTabParamList>
  >
>;

type ProducerProfileRouteProp = RouteProp<
  ProducerTabParamList,
  "ProducerProfile"
>;

type Props = {
  navigation: ProducerProfileNavProp;
  route: ProducerProfileRouteProp;
};

export default function ProducerProfileScreen({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const modeStore = useSelector(
    (state: { mode: ModeState }) => state.mode.value,
  );
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const producerStore = useSelector(
    (state: { producer: ProducerState }) => state.producer?.value,
  );
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop?.value,
  );

  // Import the Clerk Auth functions
  const { getToken, signOut } = useAuth();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [isProducerSaveLoading, setProducerSaveLoading] = useState(false);

  const infoSection = useCollapsibleSection();
  const addressSection = useCollapsibleSection();

  // infoSection
  const [socialReason, setSocialReason] = useState<string>("");
  const [siren, setSiren] = useState<string>("");
  const [iban, setIban] = useState<string>("");
  const [bic, setBic] = useState<string>("");

  // addressSection
  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
  });

  const [isPremium, setPremium] = useState<boolean>(true); // à modifier

  useEffect(() => {
    if (producerStore !== null) {
      setSocialReason(producerStore.socialReason ?? "");
      setSiren(producerStore.siren ?? "");
      setIban(producerStore.iban ?? "");
      setBic(producerStore.bic ?? "");
      if (producerStore.address) {
        setAddress({
          address1: producerStore.address.address1 ?? "",
          address2: producerStore.address.address2 ?? "",
          postalCode: producerStore.address.postalCode ?? "",
          city: producerStore.address.city ?? "",
          country: producerStore.address.country ?? "",
        });
      } else {
        // valeur par défaut
        setAddress({
          address1: "",
          address2: "",
          postalCode: "",
          city: "",
          country: "",
        });
      }
    }
  }, []);

  // Signout the user from Clerk
  const onSignoutPress = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
      SheetManager.show("alert", {
        payload: {
          message: `Une erreur est survenue lors de la déconnexion.\nVeuillez ré-essayer.`,
          alertType: "error",
        },
      });
      return;
    }
    dispatch(resetUser());
    dispatch(emptyCart());
    dispatch(resetProducerData());
    dispatch(resetShopData());
    navigation.navigate("Home");
  };

  const switchUser = () => {
    navigation.navigate("TabNavigatorUser", {
      screen: "UserProfile",
    });
  };

  const handleProducerUpdate = async () => {
    try {
      setProducerSaveLoading(true);
      const token = await getToken();
      const values = { socialReason, siren, iban, bic, address };

      let producerResponse;
      if (producerStore === null) {
        producerResponse = await producerTools.createProducer(token, values);
      } else {
        producerResponse = await producerTools.updateProducer(token, values);
      }

      console.log(producerResponse);

      if (!producerResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: producerResponse.message,
            alertType: "error",
          },
        });
        return;
      }

      dispatch(setProducerData(producerResponse.data));
      SheetManager.show("alert", {
        payload: {
          message: "Informations mises à jour.",
          alertType: "success",
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setProducerSaveLoading(false);
    }
  };

  const toggleMode = () => {
    toggleColorScheme();
    const displayMode = modeStore.mode === "light" ? "dark" : "light";
    dispatch(changeMode(displayMode));
  };

  console.log(
    "---------------------------------- PRODUCER --------------------------------------------------------------------",
  );
  console.log("USERSTORE -> ", userStore);
  console.log("PRODUCERSTORE -> ", producerStore);
  console.log("SHOPSTORE -> ", shopStore?.isPremium);
  console.log("");

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 10 }}>
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          // className="flex h-full w-full p-3"
        >
          {/* TopBar  */}
          <View className="flex flex-row items-center mb-5">
            <View className="">
              <ColorSchemeButton
                iconName={colorScheme === "dark" ? "sun" : "moon"}
                iconFamily="FontAwesome5Icon"
                size={40}
                onPressFn={toggleMode}
              />
            </View>
            <View className="flex-grow">
              <TextHeading4 centered>{`MON COMPTE\nPRODUCTEUR`}</TextHeading4>
            </View>
            <View className="">
              <IconButton
                iconName="sign-in-alt"
                iconFamily="FontAwesome5Icon"
                iconColor="#98B66E"
                size={40}
                onPressFn={onSignoutPress}
                extraClasses="border border-primary p-1"
              />
            </View>
          </View>

          <OpenMenuButton
            label="Informations"
            onPressFn={infoSection.toggle}
            extraClasses="mb-2"
          />

          <Animated.View
            style={[infoSection.animatedStyle]}
            className="overflow-hidden"
          >
            <View
              onLayout={infoSection.onLayout}
              style={infoSection.innerContainerStyle}
              className="px-3"
            >
              <InputText
                label="Raison sociale"
                placeholder="Saisissez votre raison sociale"
                value={socialReason}
                onChangeText={(value: string) => setSocialReason(value)}
                extraClasses="mb-2"
              />
              <InputText
                label="SIREN"
                placeholder="Saisissez votre Siren"
                value={siren}
                onChangeText={(value: string) => setSiren(value)}
                extraClasses="mb-2"
              />
              <InputText
                label="IBAN"
                placeholder="Saisissez votre Iban"
                value={iban}
                onChangeText={(value: string) => setIban(value)}
                extraClasses="mb-2"
              />
              <InputText
                label="BIC"
                placeholder="Saisissez votre Bic"
                value={bic}
                onChangeText={(value: string) => setBic(value)}
                extraClasses="mb-2"
              />
            </View>
          </Animated.View>

          <OpenMenuButton
            label="Adresse"
            onPressFn={addressSection.toggle}
            extraClasses="mb-2"
          />

          <Animated.View
            style={[addressSection.animatedStyle]}
            className="overflow-hidden"
          >
            <View
              onLayout={addressSection.onLayout}
              style={addressSection.innerContainerStyle}
              className="px-3"
            >
              <InputText
                label="Adresse"
                placeholder="Saisissez votre adresse"
                value={address.address1}
                onChangeText={(value: string) =>
                  setAddress({
                    address1: value,
                    address2: address.address2,
                    postalCode: address.postalCode,
                    city: address.city,
                    country: address.country,
                  })
                }
                extraClasses="mb-2"
              />
              <InputText
                label="Adresse complément"
                placeholder="Saisissez votre adresse"
                value={address.address2}
                onChangeText={(value: string) =>
                  setAddress({
                    address1: address.address1,
                    address2: value,
                    postalCode: address.postalCode,
                    city: address.city,
                    country: address.country,
                  })
                }
                extraClasses="mb-2"
              />
              <InputText
                label="Code Postal"
                placeholder="Saisissez le code postal"
                value={address.postalCode}
                onChangeText={(value: string) =>
                  setAddress({
                    address1: address.address1,
                    address2: address.address2,
                    postalCode: value,
                    city: address.city,
                    country: address.country,
                  })
                }
                extraClasses="mb-2"
              />
              <InputText
                label="Ville"
                placeholder="Saisissez la ville"
                value={address.city}
                onChangeText={(value: string) =>
                  setAddress({
                    address1: address.address1,
                    address2: address.address2,
                    postalCode: address.postalCode,
                    city: value,
                    country: address.country,
                  })
                }
                extraClasses="mb-2"
              />
              <InputText
                label="Pays"
                placeholder="Saisissez le pays"
                value={address.country}
                onChangeText={(value: string) =>
                  setAddress({
                    address1: address.address1,
                    address2: address.address2,
                    postalCode: address.postalCode,
                    city: address.city,
                    country: value,
                  })
                }
                extraClasses="mb-2"
              />
            </View>
          </Animated.View>

          <View className="flex flex-row justify-center">
            <View className="w-[90%]">
              <ButtonPrimaryEnd
                label="Mettre à jour"
                iconFamily="FontAwesome5Icon"
                iconName="sync-alt"
                disabled={isProducerSaveLoading}
                onPressFn={() => handleProducerUpdate()}
                isLoading={isProducerSaveLoading}
                extraClasses="mt-5 mb-5 h-14"
              />
            </View>
          </View>

          {shopStore?.isPremium ? (
            <View className="px-3 items-center">
              <Text className="text-premium text-lg font-bold">
                Membre PREMIUM
              </Text>
              <Text className="text-secondary dark:text-lightbg text-md">
                jusqu'au 21/12/25
              </Text>
            </View>
          ) : (
            <View className="px-5">
              <CustomButton
                label="Devenir membre Premium"
                icon="crown"
                iconFamily="FontAwesome5Icon"
                extraClasses="bg-premium rounded-full my-4 h-[60px]"
                textClasses="text-lightbg text-lg font-bold"
                onPressFn={async () =>
                  await SheetManager.show("become-premium")
                }
              />
            </View>
          )}
        </ScrollView>
      </View>

      <View style={{ flex: 1.5 }}>
        <View className="px-3">
          <CustomButton
            label="Basculer en mode Utilisateur"
            extraClasses="bg-tertiary dark:bg-lightbg rounded-full my-4 px-5 h-[60px]"
            textClasses="text-lightbg dark:text-tertiary text-lg font-bold"
            onPressFn={switchUser}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
