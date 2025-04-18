import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useColorScheme } from "nativewind";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAuth } from "@clerk/clerk-expo";
import { useSelector, useDispatch } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import _Fontawesome from "react-native-vector-icons/FontAwesome";

import { updateUserAddresses, UserState } from "../../reducers/user";
import { setProducerData } from "../../reducers/producer";
import { setShopData } from "../../reducers/shop";

import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import InputText from "../../components/utils/inputs/Text";
import TextHeading2 from "../../components/utils/texts/Heading2";
import MainButton from "../../components/utils/buttons/MainButton";
import Address from "../../components/cards/Address";

import producerTools from "../../modules/producerTools";
import shopTools from "../../modules/shopTools";
import userTools from "../../modules/userTools";

import { RootStackParamList } from "../../types/Navigation";
import { UserAddressData } from "../../types/API";

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
  const [isNewAddressSaveLoading, setNewAddressSaveLoading] = useState(false);

  const [newUserAddress, setNewUserAddress] = useState<UserAddressData>({
    name: "",
    address: {
      address1: "",
      address2: "",
      postalCode: 0,
      city: "",
      country: "",
    },
  });
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

  const addNewUserAddress = async () => {
    try {
      setNewAddressSaveLoading(true);

      const token = await getToken();
      // store producer info in the store
      const newAddressResponse = await userTools.addUserAddress(
        token,
        newUserAddress,
      );

      if (!newAddressResponse.success) {
        console.error(newAddressResponse.message);
        return;
      }

      dispatch(updateUserAddresses(newAddressResponse.user.addresses));

      setNewAddressSaveLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

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
                      <InputText
                        placeholder="Ex: 4 rue de Paris"
                        label="Adresse"
                        extraClasses="mb-2"
                        onChangeText={(value: string) =>
                          setNewUserAddress((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              address1: value,
                            },
                          }))
                        }
                        value={newUserAddress.address.address1}
                      ></InputText>
                      <InputText
                        placeholder="Ex: Bat 5 Esc 2"
                        label="Complément d'adresse"
                        extraClasses="mb-2"
                        onChangeText={(value: string) =>
                          setNewUserAddress((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              address2: value,
                            },
                          }))
                        }
                        value={newUserAddress.address.address2}
                      ></InputText>
                      <View className="flex-row">
                        <InputText
                          placeholder="75001"
                          label="Code postal"
                          extraClasses="mb-2 w-[45%] mr-[5%]"
                          onChangeText={(value: number) =>
                            setNewUserAddress((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                postalCode: value,
                              },
                            }))
                          }
                          value={newUserAddress.address.postalCode}
                        ></InputText>
                        <InputText
                          placeholder="Paris"
                          label="Ville"
                          extraClasses="mb-2 w-1/2 mr-2"
                          onChangeText={(value: string) =>
                            setNewUserAddress((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                city: value,
                              },
                            }))
                          }
                          value={newUserAddress.address.city}
                        ></InputText>
                      </View>
                      <InputText
                        placeholder="Ex: France"
                        label="Pays"
                        extraClasses="mb-2"
                        onChangeText={(value: string) =>
                          setNewUserAddress((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              country: value,
                            },
                          }))
                        }
                        value={newUserAddress.address.country}
                      ></InputText>
                      <View className="flex-row">
                        <Text className=" text-white text-sm font-bold p-2 w-[30%] text-right">
                          Enregistrer sous:
                        </Text>
                        <InputText
                          placeholder="Ex: Maison"
                          label="Nom de l'adresse"
                          extraClasses="mb-2 w-[70%]"
                          onChangeText={(value: string) =>
                            setNewUserAddress((prev) => ({
                              ...prev,
                              name: value,
                            }))
                          }
                          value={newUserAddress.name}
                        ></InputText>
                      </View>
                      <MainButton
                        buttonType="label-icon-end"
                        label="Enregistrer"
                        iconName="save"
                        onPressFn={addNewUserAddress}
                        isLoading={isNewAddressSaveLoading}
                      ></MainButton>
                    </View>
                  </View>
                </Animated.View>
              </View>
              <View>
                <Text className="mb-2 text-white text-lg font-bold">
                  Adresses enregistrées
                </Text>
                {addresses.length > 0 ? (
                  addresses
                ) : (
                  <View className="w-full">
                    <TextHeading2 extraClasses="mb-4 text-center">
                      Aucune adresse enregistrée
                    </TextHeading2>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        ) : (
          <View className="flex justify-center items-center h-full">
            <TextHeading2 extraClasses="mb-3">
              Connectez-vous pour voir votre profil.
            </TextHeading2>
            <MainButton
              buttonType="label-icon-end"
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
