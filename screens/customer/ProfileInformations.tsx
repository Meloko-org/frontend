import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useColorScheme } from "nativewind";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { UserState, updateUser, resetUser } from "../../reducers/user";
import { ShopState, setShopData, resetShopData } from "../../reducers/shop";
import { ModeState, changeMode } from "../../reducers/mode";
import { emptyCart } from "../../reducers/cart";
import {
  ProducerState,
  setProducerData,
  resetProducerData,
} from "../../reducers/producer";

import userTools from "../../modules/userTools";
import producerTools from "../../modules/producerTools";
import shopTools from "../../modules/shopTools";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { View, Alert } from "react-native";
import Text from "../../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextBody2 from "../../components/utils/texts/Body2";
import TextHeading4 from "../../components/utils/texts/Heading4";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;

import SignInScreen from "../Signin";
import TextBody1 from "../../components/utils/texts/Body1";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import IconButton from "../../components/utils/buttons/Icon";
import TextHeading3 from "../../components/utils/texts/Heading3";
import { SheetManager } from "react-native-actions-sheet";
import TopBar from "../../components/TopBar";

type UserProfileInformationsRouteProp = RouteProp<
  UserTabParamList,
  "UserProfileInformations"
>;

type UserProfileInformationsNavProp = BottomTabNavigationProp<
  UserTabParamList,
  "UserProfileInformations"
>;

type Props = {
  navigation: UserProfileInformationsNavProp;
  route: UserProfileInformationsRouteProp;
};

export default function UserProfileInformationsScreen({
  navigation,
  route,
}: Props) {
  const { from, backLabel, screenTitle } = route.params || [];
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
  const [isUserSaveLoading, setUserSaveLoading] = useState(false);

  useEffect(() => {
    setFirstname(userStore.firstname!);
    setLastname(userStore.lastname!);
    setEmail(userStore.email!);
  }, [shopStore]);

  const handleSaveUser = async () => {
    try {
      setUserSaveLoading(true);
      const token = await getToken();
      const values = email
        ? { email, firstname, lastname }
        : { email: null, firstname, lastname };
      const data = await userTools.updateUser(token, values);

      if (data) {
        dispatch(updateUser(data));
        SheetManager.show("alert", {
          payload: {
            message: "Votre profil à bien été mis à jour.",
            alertType: "success",
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserSaveLoading(false);
    }
  };

  const handleAddressesPress = () => {
    navigation.navigate("UserProfileAddresses", {
      from: "UserProfileInformations",
      backLabel: "Retour mes informations",
      screenTitle: "MES ADRESSES",
    });
  };

  console.log(
    "------------------------------- INFORMATIONS --------------------------------------------------------------------",
  );

  // console.log("USERSTORE -> ", userStore);
  // console.log("PRODUCERSTORE -> ", producerStore);
  // console.log("SHOPSTORE -> ", shopStore);
  // console.log("");

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      {isSignedIn && (
        <>
          {/* TopBar */}
          <View style={{ flex: 1 }}>
            <TopBar
              backLabel={backLabel || "Retour au compte"}
              screen={from || "UserProfile"}
              label={screenTitle || "MES INFORMATIONS"}
              // navigationOverride={navigation}
              extraClasses="mt-2 mb-5"
            />
          </View>

          <View style={{ flex: 8.5 }} className="px-3">
            <ScrollView>
              <View className="w-full">
                {userStore.clerkPasswordEnabled === true ? (
                  <>
                    <Text
                      placeholder="Changez votre email"
                      label="Email"
                      onChangeText={(value: string) => setEmail(value)}
                      value={email}
                      extraClasses="mb-2"
                    ></Text>
                    <Text
                      placeholder="Saisissez votre mot de passe"
                      label="Mot de passe"
                      onChangeText={(value: string) => setPassword(value)}
                      value={password}
                      extraClasses="mb-2"
                    ></Text>
                    <Text
                      placeholder="Confirmez votre mot de passse"
                      label="Confirmation"
                      onChangeText={(value: string) => setConfirm(value)}
                      value={confirm}
                      extraClasses="mb-5"
                    ></Text>
                  </>
                ) : (
                  <>
                    <View className="ml-2">
                      <TextBody2 extraClasses="font-bold text-secondary/60">
                        EMAIL
                      </TextBody2>
                      <TextHeading4 extraClasses="mb-5">
                        {userStore.email}
                      </TextHeading4>
                    </View>
                  </>
                )}
                <View className="flex flex-row justify-between items-center mb-5">
                  <View className="flex flex-row justify-center items-center w-2/6">
                    <View className="rounded-full bg-warning flex flex-row justify-center items-center mb-5 w-[100px] h-[100px]">
                      <FontAwesome
                        name="github-alt"
                        size={80}
                        color="#FFFFFF"
                        className="absolute"
                      />
                    </View>
                  </View>

                  <View className="w-4/6">
                    <Text
                      placeholder="Saisissez votre nom"
                      label="Nom"
                      onChangeText={(value: string) => setFirstname(value)}
                      value={firstname}
                      extraClasses="mb-2"
                    />
                    <Text
                      placeholder="Saisissez votre prénom"
                      label="Prénom"
                      onChangeText={(value: string) => setLastname(value)}
                      value={lastname}
                      extraClasses="mb-2"
                    />
                  </View>
                </View>
                <OpenScreenButton
                  label="Mes adresses"
                  onPressFn={handleAddressesPress}
                  extraClasses="mb-1"
                />
              </View>
            </ScrollView>
          </View>

          <View style={{ flex: 1 }}>
            <View className="px-5">
              <ButtonPrimaryEnd
                label="Enregistrer"
                iconName="save"
                disabled={isUserSaveLoading}
                onPressFn={() => handleSaveUser()}
                extraClasses="h-14"
                isLoading={isUserSaveLoading}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
