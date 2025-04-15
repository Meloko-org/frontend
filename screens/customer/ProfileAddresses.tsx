import { View, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useColorScheme } from "nativewind";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";

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
import Address from "../../components/cards/Address";
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

  const [isOpenType, setOpenType] = useState<boolean>(false);
  const contentType = useSharedValue(0);
  const heightType = useSharedValue(0);
  const [isUserSaveLoading, setUserSaveLoading] = useState(false);

  // useEffect(() => {
  //     if (!isSignedIn) {
  //         // à modifier
  //         navigation.navigate("SignIn", {
  //             from: "UserProfile",
  //             label: "Retour à la recherche",
  //         });
  //     } else {
  //     }
  // }, [userStore, isSignedIn, dispatch]);

  const animatedStyleType = useAnimatedStyle(() => ({
    height: heightType.value,
    opacity: heightType.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));

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

  const toggleOpenType = () => {
    setOpenType((prev) => {
      const newState = !prev;
      heightType.value = withTiming(newState ? contentType.value : 0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      return newState;
    });
  };

  const onContentLayout = (event: LayoutChangeEvent) => {
    const measuredHeight = event.nativeEvent.layout.height;
    contentType.value = measuredHeight;
  };

  const addresses = userStore.addresses?.map((address, i) => (
    <Address address={address} key={i}></Address>
  ));

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="p-3">
        {isSignedIn ? (
          <View className="h-full relative flex">
            <TextHeading2 extraClasses="mb-5" centered>
              Mes addresses
            </TextHeading2>
            <ScrollView>
              <View className="w-full px-3">
                <OpenMenuButton
                  label="Ajouter une adresse"
                  onPressFn={toggleOpenType}
                  extraClasses="mb-2"
                />

                <Animated.View
                  style={[animatedStyleType]}
                  className="overflow-hidden"
                >
                  <View
                    onLayout={onContentLayout}
                    style={{
                      opacity: isOpenType ? 1 : 0,
                      position: isOpenType ? "relative" : "absolute",
                    }}
                  >
                    <View className="py-5">
                      <Text>FORMULAIRE ICI</Text>
                    </View>
                  </View>
                </Animated.View>
              </View>
              <View>{addresses}</View>
            </ScrollView>
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
              // onPressFn={() => setIsSigninModalVisible(true)}
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
