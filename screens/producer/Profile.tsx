import { useAuth } from "@clerk/clerk-expo";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ModeState, changeMode } from "../../reducers/mode";
import { useColorScheme } from "nativewind";

import { useModal } from "../../context/ModalContext";

import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { UserState, updateUser, resetUser } from "../../reducers/user";
import { resetProducerData, setProducerData } from "../../reducers/producer";
import { resetShopData } from "../../reducers/shop";
import { emptyCart } from "../../reducers/cart";

import producerTools from "../../modules/producerTools";
import { ProducerData, ShopData } from "../../types/API";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";

/* Eléments graphiques */
import {
  View,
  Alert,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
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
import TextBody1 from "../../components/utils/texts/Body1";
import CheckBox from "../../components/utils/inputs/CheckBox";
import CustomAlert from "../../components/modals/CustomAlert";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProducerProfile"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ProducerProfileScreen({ navigation }: Props) {
  const { setAlertMessage } = useModal();

  const dispatch = useDispatch();
  const modeStore = useSelector(
    (state: { mode: ModeState }) => state.mode.value,
  );
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const producerStore = useSelector(
    (state: { producer: ProducerData }) => state.producer?.value,
  );
  const shopStore = useSelector(
    (state: { shop: ShopData }) => state.shop?.value,
  );

  // Import the Clerk Auth functions
  const { getToken, signOut } = useAuth();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  // const [alertMessage, setAlertMessage] = useState<string | null>(null);
  // const [alertType, setAlertType] = useState<"success" | "danger">("danger");

  const [isOpenInfo, setOpenInfo] = useState(false);
  const [isOpenAddress, setOpenAddress] = useState(false);

  const [isProducerSaveLoading, setProducerSaveLoading] = useState(false);

  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const [socialReason, setSocialReason] = useState<string>("");
  const [siren, setSiren] = useState<string>("");
  const [iban, setIban] = useState<string>("");
  const [bic, setBic] = useState<string>("");
  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
  });
  const [isPremium, setPremium] = useState<boolean>(true); // à modifier

  const heightInfo = useSharedValue(0);
  const heightAddress = useSharedValue(0);

  const toggleOpenInfo = () => {
    setOpenInfo((prev) => !prev);
    heightInfo.value = isOpenInfo ? withTiming(0) : withTiming(330);
    // heightInfo.value = isOpenInfo ? withTiming(infoMeasuredHeight) : withTiming(0);
  };

  const toggleOpenAddress = () => {
    setOpenAddress((prev) => !prev);
    heightAddress.value = isOpenAddress ? withTiming(0) : withTiming(380);
  };

  const animatedStyleInfo = useAnimatedStyle(() => ({
    height: heightInfo.value,
    opacity: heightInfo.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));

  const animatedStyleAddress = useAnimatedStyle(() => ({
    height: heightAddress.value,
    opacity: heightAddress.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));

  useEffect(() => {
    console.log("Valeur actuelle de producerStore:", producerStore);
    if (producerStore !== null) {
      setSocialReason(producerStore.socialReason);
      setSiren(producerStore.siren);
      setIban(producerStore.iban);
      setBic(producerStore.bic);
      setAddress({
        address1: producerStore.address.address1,
        address2: producerStore.address.address2,
        postalCode: producerStore.address.postalCode,
        city: producerStore.address.city,
        country: producerStore.address.country,
      });
      //setIsPremium()
    }
  }, []);

  // Signout the user from Clerk
  const onSignoutPress = async () => {
    try {
      await signOut();
      dispatch(resetUser());
      dispatch(emptyCart());
      dispatch(resetProducerData());
      dispatch(resetShopData());
      navigation.navigate("Home");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
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
        setAlertMessage(producerResponse.message, "error");
        // setAlertType("danger")
        return;
      }

      dispatch(setProducerData(producerResponse.data));
      setAlertMessage("Informations mises à jour.", "success");
      // setAlertType("success")

      setProducerSaveLoading(false);
    } catch (error) {
      console.error(error);
      setProducerSaveLoading(false);
    }
  };

  const switchUser = () => {
    navigation.navigate("TabNavigatorUser", {
      screen: "UserProfile",
    });
  };

  const toggleMode = () => {
    toggleColorScheme();
    const displayMode = modeStore.mode === "light" ? "dark" : "light";
    dispatch(changeMode(displayMode));
  };

  const handleSheetChanges = useCallback((index: number) => {}, []);

  console.log(
    "---------------------------------- PRODUCER --------------------------------------------------------------------",
  );
  console.log("USERSTORE -> ", userStore);
  console.log("PRODUCERSTORE -> ", producerStore);
  console.log("SHOPSTORE -> ", shopStore);
  console.log("");

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="flex-1 items-center">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="flex h-full w-full p-3"
        >
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
                size={40}
                onPressFn={onSignoutPress}
              />
            </View>
          </View>

          <OpenMenuButton
            label="Informations"
            onPressFn={toggleOpenInfo}
            extraClasses="mb-3"
          />

          <Animated.View
            style={[animatedStyleInfo]}
            className="overflow-hidden"
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
          </Animated.View>

          <OpenMenuButton
            label="Adresse"
            onPressFn={toggleOpenAddress}
            extraClasses="mb-3"
          />

          <Animated.View
            style={[animatedStyleAddress]}
            className="overflow-hidden"
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

          <View className="px-3 items-center">
            <Text className="text-premium text-lg font-bold">
              Membre PREMIUM
            </Text>
            <Text className="text-secondary dark:text-lightbg text-md">
              jusqu'au 21/12/25
            </Text>
          </View>

          <View className="px-5">
            <CustomButton
              label="Devenir membre Premium"
              icon="crown"
              iconFamily="FontAwesome5Icon"
              extraClasses="bg-premium rounded-full my-4 h-[60px]"
              textClasses="text-lightbg text-lg font-bold"
              onPressFn={openBottomSheet}
            />
          </View>
        </ScrollView>

        <CustomButton
          label="Basculer en mode Utilisateur"
          extraClasses="bg-tertiary dark:bg-lightbg rounded-full my-4 px-5 h-[60px]"
          textClasses="text-lightbg dark:text-tertiary text-lg font-bold"
          onPressFn={switchUser}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["75%"]}
        enablePanDownToClose={true}
        handleStyle={{
          backgroundColor: colorScheme === "dark" ? "#444C3D" : "#FFF",
        }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === "dark" ? "#FCFFF0" : "#444C3D",
        }}
        onChange={(index) => setBottomSheetOpen(index !== -1)}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            {
              backgroundColor: colorScheme === "dark" ? "#262E20" : "#FCFFF0",
            },
          ]}
        >
          <View className="flex justify-center items-center p-3 w-full h-full">
            <View>
              <TextBody1 centered>
                En devenant membre Premium, bla bla bla. Cet abonnement est au
                prix de 15 € ht par mois
              </TextBody1>
              <View className="items-center my-5">
                <CheckBox
                  label="J'accèpte les conditions"
                  textClasses="text-secondary dark:text-lightbg"
                />
              </View>
              <View className="px-3">
                <ButtonPrimaryEnd
                  label="Valider"
                  iconName="check"
                  iconFamily="FontAwesome5Icon"
                  disabled={false}
                  onPressFn={() => console.log("youpi")}
                  extraClasses="mb-3 h-14"
                />
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
