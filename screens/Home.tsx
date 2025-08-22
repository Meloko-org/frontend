import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import TextBody1 from "../components/utils/texts/Body1";
import TextHeading3 from "../components/utils/texts/Heading3";
import LogoDark from "../assets/images/logo_meloko-dark.png";
import LogoLight from "../assets/images/logo_meloko-light.png";
import LogoCoq from "../assets/images/logo_coq.png";

import userTools from "../modules/userTools";
import producerTools from "../modules/producerTools";
import shopTools from "../modules/shopTools";

import { useSelector, useDispatch } from "react-redux";
import { UserState, updateUser, resetUser } from "../reducers/user";
import {
  ProducerState,
  setProducerData,
  resetProducerData,
} from "../reducers/producer";
import { ShopState, setShopData, resetShopData } from "../reducers/shop";
import { emptyCart } from "../reducers/cart";
import { ModeState } from "../reducers/mode";
import SignInScreen from "./Signin";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  // Import the Clerk Auth functions
  const { signOut, isSignedIn, getToken } = useAuth();

  const [logger, setLogger] = useState<string | null>(null);
  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

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

  const fetchData = async () => {
    try {
      // store user's info in the store
      const token = await getToken();
      const userResponse = await userTools.getUserInfos(token);

      if (!userResponse.success) {
        console.warn(userResponse.message);
        return;
      }

      dispatch(updateUser(userResponse.data!));

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
      }

      const shop = shopResponse.data;
      dispatch(setShopData(shop));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (modeStore.mode === "dark" && colorScheme === "light") {
      toggleColorScheme();
    }
    if (isSignedIn) {
      (async () => {
        await fetchData();
      })();
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
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // const logo = colorScheme === "dark" ? LogoDark : LogoLight;

  // console.log(
  //   "------------------------- HOME --------------------------------------------------------------------",
  // );
  // console.log("USERSTORE -> ", userStore);
  // console.log("PRODUCERSTORE:", producerStore);
  // console.log("SHOPSTORE :", shopStore);
  // console.log("");

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="flex-1">
        <View className="flex-1">
          <View className="flex-[0.4] my-5">
            <Image
              source={require("../assets/images/logo_lacharrue.png")}
              alt={`Logo MELOKO`}
              resizeMode="contain"
              className="w-full h-full"
            />
          </View>

          <View className="flex-[0.2] px-7 justify-center items-center">
            <View className="w-full">
              <ButtonPrimaryEnd
                label="Recherche"
                iconName="search"
                disabled={false}
                onPressFn={() =>
                  navigation.navigate("TabNavigatorUser", {
                    screen: "MapCustomer",
                  })
                }
                extraClasses="mb-3 h-14"
              />
              <ButtonPrimaryEnd
                label="Circuit touristique"
                iconName="car-side"
                disabled={false}
                onPressFn={() =>
                  navigation.navigate("TabNavigatorUser", {
                    screen: "CircuitParameters",
                  })
                }
                extraClasses="mb-3 h-14"
              />
            </View>
          </View>

          <View className="flex-[0.4] px-7">
            <View className="flex-1 justify-end pb-10 items-center">
              {isSignedIn ? (
                <>
                  {producerStore !== null ? (
                    <>
                      <View className="w-full">
                        <ButtonPrimaryEnd
                          label="Mon Activité"
                          iconName="search"
                          disabled={false}
                          onPressFn={() =>
                            navigation.navigate("TabNavigatorProducer", {
                              screen: "BusinessCenter",
                            })
                          }
                          extraClasses="mb-3 h-14"
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <View className="w-full">
                        <ButtonPrimaryEnd
                          label="Mon Compte"
                          iconName="user"
                          disabled={false}
                          onPressFn={() =>
                            navigation.navigate("TabNavigatorUser", {
                              screen: "UserProfile",
                            })
                          }
                          extraClasses="mb-3 h-14"
                        />
                      </View>
                    </>
                  )}
                  <View className="w-full">
                    <ButtonPrimaryEnd
                      label="Déconnexion"
                      iconName="sign-out-alt"
                      disabled={false}
                      onPressFn={onSignoutPress}
                      extraClasses="mb-3 h-14"
                    />
                  </View>
                </>
              ) : (
                <>
                  <TextHeading3 centered>
                    Producteur ou utilisateur ?
                  </TextHeading3>
                  <TextBody1 extraClasses="px-5 mb-3 text-wrap w-full" centered>
                    Connectez-vous ou créez un compte.
                  </TextBody1>
                  <ButtonPrimaryEnd
                    label={`Connexion\nInscription`}
                    iconName="sign-in-alt"
                    disabled={false}
                    onPressFn={() =>
                      navigation.navigate("SignIn", {
                        from: "Home",
                        backLabel: "Retour à l'accueil",
                        screenTitle: "CONNEXION\nINSCRIPTION",
                      })
                    }
                    extraClasses="w-full h-20"
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
