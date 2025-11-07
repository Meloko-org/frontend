import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

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
import { UserState, updateUser, resetUser } from "../../reducers/user";
import {
  ProducerState,
  setProducerData,
  resetProducerData,
} from "../../reducers/producer";
import { ShopState, setShopData, resetShopData } from "../../reducers/shop";
import { ModeState, changeMode } from "../../reducers/mode";
import { emptyCart } from "../../reducers/cart";

import producerTools from "../../modules/producerTools";
import userTools from "../../modules/userTools";
import shopTools from "../../modules/shopTools";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { View, Alert, StyleSheet } from "react-native";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import ButtonSecondaryEnd from "../../components/utils/buttons/SecondaryEnd";
import CustomButton from "../../components/utils/buttons/Custom";
import TextHeading2 from "../../components/utils/texts/Heading2";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import MainButton from "../../components/utils/buttons/MainButton";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
import ColorSchemeButton from "../../components/utils/buttons/ColorScheme";
import TextHeading4 from "../../components/utils/texts/Heading4";
import IconButton from "../../components/utils/buttons/Icon";
import TextHeading3 from "../../components/utils/texts/Heading3";
const FontAwesome = _Fontawesome as React.ElementType;

type UserProfileNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList, "UserProfile">,
  CompositeNavigationProp<
    NativeStackNavigationProp<RootStackParamList>,
    BottomTabNavigationProp<ProducerTabParamList>
  >
>;

type UserProfileRouteProp = RouteProp<UserTabParamList, "UserProfile">;

type Props = {
  navigation: UserProfileNavProp;
  route: UserProfileRouteProp;
};

export default function UserProfileScreen({ navigation }: Props) {
  const { colorScheme, setColorScheme } = useColorScheme();
  // Import the Clerk Auth functions
  const { signOut, isSignedIn, getToken } = useAuth();

  const dispatch = useDispatch();
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const modeStore = useSelector(
    (state: { mode: ModeState }) => state.mode.value,
  );

  const producerStore = useSelector(
    (state: { producer: ProducerState }) => state.producer.value,
  );
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  useEffect(() => {
    if (isSignedIn) {
      fetchData();
      setFirstname(userStore.firstname!);
      setLastname(userStore.lastname!);
      setEmail(userStore.email!);
    }
  }, [userStore, isSignedIn]);

  const fetchData = async () => {
    try {
      const token = await getToken();
      // store producer info in the store
      const producerResponse = await producerTools.getProducerInfos(token);

      if (!producerResponse.success) {
        console.warn(producerResponse.message);
        return;
      }

      const producer = producerResponse.data;
      dispatch(setProducerData(producer));

      const shopResponse = await shopTools.getShopInfos(token, producer?._id!);

      if (!shopResponse.success) {
        console.warn(shopResponse.message);
        return;
      }

      dispatch(setShopData(shopResponse.data));
    } catch (error) {
      console.error(error);
    }
  };

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
      console.error(err);
    }
  };

  const switchProducer = () => {
    navigation.navigate("TabNavigatorProducer", {
      screen: "ProducerProfile",
    });
  };

  const handleOrdersPress = () => {
    navigation.navigate("OrdersCustomer");
  };

  const handlePersonalInfoPress = () => {
    navigation.navigate("UserProfileInformations", {
      from: "UserProfile",
      backLabel: "Retour au compte",
      screenTitle: "MES INFORMATIONS",
    });
  };

  const handleBookmarksPress = () => {
    navigation.navigate("Bookmarks");
  };

  const handleSearchPress = () => {
    navigation.navigate("MapCustomer");
  };

  const handleCircuitMap = () => {
    navigation.navigate("CircuitParameters");
  };

  const toggleMode = () => {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
    const displayMode = modeStore.mode === "light" ? "dark" : "light";
    dispatch(changeMode(displayMode));
  };

  console.log("PROFILE modeStore.mode :", modeStore.mode);
  console.log("PROFILE colorScheme :", colorScheme);
  console.log("les adresses :", userStore.addresses);

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      {isSignedIn ? (
        <>
          {/* TopBar */}
          <View style={{ flex: 1.5 }}>
            <View className="flex flex-row items-center mb-5 px-3">
              <View className="">
                <ColorSchemeButton
                  iconName={colorScheme === "dark" ? "sun" : "moon"}
                  iconFamily="FontAwesome5Icon"
                  size={40}
                  onPressFn={toggleMode}
                />
              </View>
              <View className="flex-grow">
                <TextHeading4 centered>{`MON COMPTE`}</TextHeading4>
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
          </View>

          <View style={{ flex: 8.5 }}>
            <View className="mt-5 px-3">
              <OpenScreenButton
                label="Mes commandes"
                onPressFn={handleOrdersPress}
                extraClasses="mb-1"
              />

              <OpenScreenButton
                label="Mes alertes"
                onPressFn={() => console.log("pressed button")}
                extraClasses="mb-1"
              />

              <View className="my-4">
                <View className="flex flex-row justify-around">
                  <View>
                    <MainButton
                      iconName="magnifying-glass"
                      iconSize={50}
                      iconColor="#FFF"
                      iconFamily="FontAwesome6Icon"
                      onPressFn={handleSearchPress}
                      buttonType="label-icon-top"
                      label="Rechercher"
                      buttonBackground={true}
                      extraClasses="py-2 w-24"
                    ></MainButton>
                  </View>
                  <View>
                    <MainButton
                      iconName="car"
                      iconSize={50}
                      iconColor="#FFF"
                      onPressFn={handleCircuitMap}
                      buttonType="label-icon-top"
                      label="Visiter"
                      buttonBackground={true}
                      extraClasses="py-2 w-24"
                    ></MainButton>
                  </View>
                  <View>
                    <MainButton
                      iconName="heart"
                      iconSize={50}
                      iconColor="#FFF"
                      onPressFn={handleBookmarksPress}
                      buttonType="label-icon-top"
                      label="Favoris"
                      buttonBackground={true}
                      extraClasses="py-2 w-24"
                    ></MainButton>
                  </View>
                </View>
              </View>

              <OpenScreenButton
                label="Mes informations"
                onPressFn={handlePersonalInfoPress}
                extraClasses="mb-1"
              />
              <OpenScreenButton
                label="Nous contacter"
                onPressFn={() => console.log("pressed button")}
                extraClasses="mb-1"
              />
            </View>
          </View>

          <View style={{ flex: 1.5 }}>
            <View className="px-3">
              <CustomButton
                label="Basculer en mode Producteur"
                extraClasses="bg-tertiary dark:bg-lightbg rounded-full my-5 px-5 h-[60px]"
                textClasses="text-lightbg dark:text-tertiary text-lg font-bold"
                onPressFn={switchProducer}
              />
            </View>
          </View>
        </>
      ) : (
        <View className="flex justify-center items-center h-full px-3">
          <TextHeading3 centered extraClasses="mb-5">
            {`Connectez-vous\npour voir votre profil.`}
          </TextHeading3>
          <View className="px-5">
            <ButtonPrimaryEnd
              label="Connexion"
              iconName="sign-in-alt"
              extraClasses="h-14 mt-5"
              onPressFn={() =>
                navigation.navigate("SignIn", {
                  from: "UserProfile",
                  backLabel: "Accueil",
                  screenTitle: `CONNEXION\nINSCRIPTION`,
                  next: "UserProfile",
                })
              }
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
