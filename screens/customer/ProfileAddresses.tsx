import { View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useColorScheme } from "nativewind";

import Text from "../../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import ButtonSecondaryEnd from "../../components/utils/buttons/SecondaryEnd";
import CustomButton from "../../components/utils/buttons/Custom";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";
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

// import SignInScreen from "../Signin";
import SignInScreen from "../Signin";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextBody1 from "../../components/utils/texts/Body1";
import TextBody2 from "../../components/utils/texts/Body2";
import userTools from "../../modules/userTools";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import IconButton from "../../components/utils/buttons/Icon";
import producerTools from "../../modules/producerTools";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import TextHeading4 from "../../components/utils/texts/Heading4";
import { ScrollView } from "react-native-gesture-handler";
import shopTools from "../../modules/shopTools";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TabNavigatorUser"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function UserProfileAddressesScreen({ navigation }: Props) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
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
        from: "UserProfile",
        label: "Retour à la recherche",
      });
    } else {
      fetchData();
      setFirstname(userStore.firstname);
      setLastname(userStore.lastname);
      setEmail(userStore.email);
    }
  }, [userStore, isSignedIn, dispatch]);

  const fetchData = async () => {
    try {
      const token = await getToken();
      // store producer info in the store
      const producerResponse = await producerTools.getProducerInfos(token);

      if (!producerResponse.success) {
        console.error(producerResponse.message);
        return;
      }

      const producer = producerResponse.data;
      dispatch(setProducerData(producer));

      const shopResponse = await shopTools.getShopInfos(token, producer?._id);

      if (!shopResponse.success) {
        console.error(shopResponse.message);
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
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const switchProducer = () => {
    navigation.navigate("TabNavigatorProducer", {
      screen: "ProducerProfile",
    });
  };

  const handleOrdersPress = () => {
    navigation.navigate("TabNavigatorUser", {
      screen: "OrdersCustomer",
    });
  };

  const toggleMode = () => {
    toggleColorScheme();
    const displayMode = modeStore.mode === "light" ? "dark" : "light";
    dispatch(changeMode(displayMode));
  };

  console.log(
    "------------------------------- CUSTOMER --------------------------------------------------------------------",
  );
  console.log("USERSTORE -> ", userStore);
  console.log("PRODUCERSTORE -> ", producerStore);
  console.log("SHOPSTORE -> ", shopStore);
  console.log("");

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="p-3">
        {isSignedIn ? (
          <View className="h-full relative flex">
            <TextHeading2 extraClasses="mb-5" centered>
              Mes addresses
            </TextHeading2>
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
                <View className="flex flex-row justify-between items-center">
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
                <ButtonPrimaryEnd
                  label="Mes adresses"
                  iconName="address-book"
                  onPressFn={() => console.log("going to addresses")}
                />
              </View>
            </ScrollView>
            <ButtonPrimaryEnd
              label="Enregistrer"
              iconName="save"
              disabled={isUserSaveLoading}
              onPressFn={() => handleSaveUser()}
              extraClasses=""
              isLoading={isUserSaveLoading}
            />
          </View>
        ) : (
          <View className="flex justify-center items-center h-full">
            <TextHeading2 extraClasses="mb-3">
              Connectez-vous pour voir votre profil.
            </TextHeading2>
            <ButtonPrimaryEnd
              label="Connexion"
              iconName="sign-in"
              disabled={isUserSaveLoading}
              extraClasses="w-full"
              onPressFn={() => setIsSigninModalVisible(true)}
              isLoading={isUserSaveLoading}
            />
          </View>
        )}
      </View>

      {/* <SignInScreen
        showModal={isSigninModalVisible}
        onCloseFn={() => setIsSigninModalVisible(false)}
      /> */}
    </SafeAreaView>
  );
}
