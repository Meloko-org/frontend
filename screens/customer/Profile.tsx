import { View, Alert, StyleSheet } from "react-native";
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
import MainButton from "../../components/utils/buttons/MainButton";
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

export default function UserProfileScreen({ navigation }: Props) {
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

  const handlePersonalInfoPress = () => {
    navigation.navigate("TabNavigatorUser", {
      screen: "UserProfileInformations",
    });
  };

  const handleBookmarksPress = () => {
    navigation.navigate("TabNavigatorUser", {
      screen: "BookmarksCustomer",
    });
  };

  const handleSearchPress = () => {
    navigation.navigate("TabNavigatorUser", {
      screen: "Search",
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
    <SafeAreaView className="flex bg-lightbg dark:bg-darkbg">
      <View className="p-3 ">
        {isSignedIn ? (
          <View className="h-full relative flex">
            <TextHeading2 extraClasses="mb-5" centered>
              Mon compte
            </TextHeading2>
            <ScrollView>
              <View>
                <OpenScreenButton
                  label="Mes commandes"
                  onPressFn={handleOrdersPress}
                  extraClasses="mb-1"
                ></OpenScreenButton>

                <OpenScreenButton
                  label="Mes alertes"
                  onPressFn={() => console.log("pressed button")}
                  extraClasses="mb-1"
                ></OpenScreenButton>

                <View style={styles.app} className="mb-4">
                  <View style={styles.row}>
                    <View style={styles[`1col`]}>
                      <MainButton
                        iconName="magnifying-glass"
                        iconSize={50}
                        iconColor="#FFF"
                        iconFamily="FontAwesome6Icon"
                        onPressFn={handleSearchPress}
                        buttonType="label-icon-top"
                        label="Rechercher"
                        buttonBackground={true}
                      ></MainButton>
                    </View>
                    <View style={styles[`1col`]}>
                      <MainButton
                        iconName="car"
                        iconSize={50}
                        iconColor="#FFF"
                        onPressFn={() => console.log("button pressed")}
                        buttonType="label-icon-top"
                        label="Visiter"
                        buttonBackground={true}
                      ></MainButton>
                    </View>
                    <View style={styles[`1col`]}>
                      <MainButton
                        iconName="heart"
                        iconSize={50}
                        iconColor="#FFF"
                        onPressFn={handleBookmarksPress}
                        buttonType="label-icon-top"
                        label="Favoris"
                        buttonBackground={true}
                      ></MainButton>
                    </View>
                  </View>
                </View>

                <OpenScreenButton
                  label="Mes informations"
                  onPressFn={handlePersonalInfoPress}
                  extraClasses="mb-1"
                ></OpenScreenButton>
                <OpenScreenButton
                  label="Nous contacter"
                  onPressFn={() => console.log("pressed button")}
                  extraClasses="mb-1"
                ></OpenScreenButton>

                <ButtonPrimaryEnd
                  label={colorScheme === "dark" ? "Mode clair" : "Mode sombre"}
                  iconName={colorScheme === "dark" ? "sun-o" : "moon-o"}
                  disabled={false}
                  onPressFn={toggleMode}
                  extraClasses="mb-3"
                />
                <ButtonSecondaryEnd
                  label="Déconnexion"
                  iconName="arrow-right"
                  onPressFn={onSignoutPress}
                  extraClasses="mb-3"
                  disabled={false}
                  isLoading={false}
                />
              </View>
            </ScrollView>
            <CustomButton
              label="Basculer en mode Producteur"
              extraClasses="bg-tertiary dark:bg-lightbg rounded-full my-5 px-5 h-[60px]"
              textClasses="text-lightbg dark:text-tertiary text-lg font-bold"
              onPressFn={switchProducer}
            ></CustomButton>
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

const styles = StyleSheet.create({
  app: {
    flex: 4, // the number of columns you want to devide the screen into
    marginHorizontal: "auto",
    width: "100%",
  },
  row: {
    flexDirection: "row",
  },
  "1col": {
    flex: 1,
    padding: 5,
  },
  "2col": {
    flex: 2,
  },
  "3col": {
    flex: 3,
  },
  "4col": {
    flex: 4,
  },
});
