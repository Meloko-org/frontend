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

  const [isSigninModalVisible, setIsSigninModalVisible] =
    useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isUserSaveLoading, setUserSaveLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      // à modifier
      navigation.navigate("SignIn", {
        from: "Home",
        backLabel: "Accueil",
        screenTitle: `CONNEXION\nINSCRIPTION`,
        next: "UserProfile",
      });
    } else {
      fetchData();
      setFirstname(userStore.firstname!);
      setLastname(userStore.lastname!);
      setEmail(userStore.email!);
    }
  }, [userStore, isSignedIn, dispatch]);

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

  const handleSaveUser = async () => {
    try {
      setUserSaveLoading(true);
      const token = await getToken();
      const values = email
        ? { email, firstname, lastname }
        : { email: null, firstname, lastname };
      const data = await userTools.updateUser(token, values);

      if (data) {
        Alert.alert(
          "Mise à jour de votre profil",
          "Votre profil à bien été mis à jour.",
        );
        dispatch(updateUser(data));
      }
      setUserSaveLoading(false);
    } catch (error) {
      console.error(error);
      setUserSaveLoading(false);
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
    navigation.navigate("UserProfileInformations");
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
    console.log("toggle colorScheme :", colorScheme);
    const displayMode = modeStore.mode === "light" ? "dark" : "light";
    dispatch(changeMode(displayMode));
    // dispatch(changeMode(colorScheme))
  };

  console.log("PROFILE modeStore.mode :", modeStore.mode);
  console.log("PROFILE colorScheme :", colorScheme);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      {isSignedIn && (
        <>
          <View className="flex-1">
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

              <View className="mt-5">
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
            </ScrollView>
          </View>

          <View className="absolute bottom-0 flex items-center w-full">
            <CustomButton
              label="Basculer en mode Producteur"
              extraClasses="bg-tertiary dark:bg-lightbg rounded-full my-5 px-5 h-[60px]"
              textClasses="text-lightbg dark:text-tertiary text-lg font-bold"
              onPressFn={switchProducer}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
