import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { useSelector, useDispatch } from "react-redux";
import {
  setDefaultAddress,
  updateUserAddresses,
  UserState,
} from "../../reducers/user";
import { setProducerData } from "../../reducers/producer";
import { setShopData } from "../../reducers/shop";

import { useColorScheme } from "nativewind";

import Animated from "react-native-reanimated";

import producerTools from "../../modules/producerTools";
import shopTools from "../../modules/shopTools";
import userTools from "../../modules/userTools";

import { UserAddressData } from "../../types/API";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";

import { SafeAreaView } from "react-native-safe-area-context";
import { SheetManager } from "react-native-actions-sheet";

import { View, Text, FlatList } from "react-native";
import TopBar from "../../components/TopBar";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import InputText from "../../components/utils/inputs/Text";
import TextHeading2 from "../../components/utils/texts/Heading2";
import MainButton from "../../components/utils/buttons/MainButton";
import Address from "../../components/cards/Address";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
import TextHeading4 from "../../components/utils/texts/Heading4";
import Spinner from "../../components/utils/Spinner";
import TextBody1 from "../../components/utils/texts/Body1";

type UserProfileAddressesRouteProp = RouteProp<
  UserTabParamList,
  "UserProfileAddresses"
>;

type UserProfileAddressesNavProp = BottomTabNavigationProp<
  UserTabParamList,
  "UserProfileAddresses"
>;

type Props = {
  navigation: UserProfileAddressesNavProp;
  route: UserProfileAddressesRouteProp;
};

export default function UserProfileAddressesScreen({
  navigation,
  route,
}: Props) {
  const { from, backLabel, screenTitle, next, selectAddressFn } =
    route.params || [];

  // Import the Clerk Auth functions
  const { signOut, isSignedIn, getToken } = useAuth();

  const dispatch = useDispatch();
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );

  const [isNewAddressSaveLoading, setNewAddressSaveLoading] =
    useState<boolean>(false);
  const [isDefaultAddressSaving, setIsDefaultAddressSaving] =
    useState<boolean>(false);
  const [addresses, setAddresses] = useState<UserAddressData[]>([]);

  const addSection = useCollapsibleSection();

  const [newUserAddress, setNewUserAddress] = useState<UserAddressData>({
    name: "",
    address: {
      address1: "",
      address2: "",
      postalCode: "",
      city: "",
      country: "",
    },
    isDefault: false,
  });

  useEffect(() => {
    if (userStore) {
      setAddresses(userStore.addresses!);
    }
  }, [userStore]);

  const handleDefaultAddress = async (id: string) => {
    console.log("id passée :", id);
    setIsDefaultAddressSaving(true);

    try {
      const token = await getToken();
      const defaultResponse = await userTools.setDefaultAddress(token, id);

      if (!defaultResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: defaultResponse.message!,
            alertType: "error",
          },
        });
        return;
      }

      dispatch(setDefaultAddress(defaultResponse.data!));
      SheetManager.show("alert", {
        payload: {
          message: "nouvelle adresse principale",
          alertType: "success",
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsDefaultAddressSaving(false);
    }
  };

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
        SheetManager.show("alert", {
          payload: {
            message: newAddressResponse.message!,
            alertType: "error",
          },
        });
        return;
      }

      dispatch(updateUserAddresses(newAddressResponse.data!));
      SheetManager.show("alert", {
        payload: {
          message: "Adresse enregistrée.",
          alertType: "success",
        },
      });
      clearNewAddress();
    } catch (error) {
      console.error(error);
    } finally {
      setNewAddressSaveLoading(false);
    }
  };

  const clearNewAddress = () => {
    setNewUserAddress({
      name: "",
      address: {
        address1: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
      },
      isDefault: false,
    });
  };

  console.log(
    "------------------------------- ADRESSES --------------------------------------------------------------------",
  );
  // console.log("userStoreaddresses :", JSON.stringify(userStore, null, 2));
  // console.log(" mes adresses :", addresses)

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
              backLabel={backLabel || "Retour aux informations"}
              screen={from || "UserProfileInformations"}
              label={screenTitle || "MES ADRESSES"}
              navigationOverride={navigation}
              extraClasses="mt-2 mb-5"
            />
          </View>

          <View style={{ flex: 10 }} className="px-3 pt-5">
            <OpenMenuButton
              label="Ajouter une adress"
              onPressFn={addSection.toggle}
              extraClasses="mb-2"
            />

            <Animated.View
              style={addSection.animatedStyle}
              className="overflow-hidden mb-5"
            >
              <View
                onLayout={addSection.onLayout}
                style={addSection.innerContainerStyle}
                className="px-3"
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
                    value={newUserAddress.address.address1!}
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
                    value={newUserAddress.address.address2!}
                  ></InputText>
                  <View className="flex-row">
                    <InputText
                      placeholder="75001"
                      label="Code postal"
                      extraClasses="mb-2 w-[32%] mr-2"
                      onChangeText={(value: string) =>
                        setNewUserAddress((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            postalCode: value,
                          },
                        }))
                      }
                      value={newUserAddress.address.postalCode!}
                    ></InputText>
                    <InputText
                      placeholder="Paris"
                      label="Ville"
                      extraClasses="mb-2 w-[65%] mr-2"
                      onChangeText={(value: string) =>
                        setNewUserAddress((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            city: value,
                          },
                        }))
                      }
                      value={newUserAddress.address.city!}
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
                    value={newUserAddress.address.country!}
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
                    extraClasses="h-14"
                  ></MainButton>
                </View>
              </View>
            </Animated.View>

            <View className="mb-5">
              <TextHeading4 centered extraClasses="mb-3">
                Adresses enregistrées
              </TextHeading4>

              {selectAddressFn ? (
                <>
                  <TextBody1
                    centered
                  >{`Cliquez sur une adresse\npour modifier l'adresse de facturation.`}</TextBody1>
                </>
              ) : (
                <>
                  <TextBody1
                    centered
                  >{`Cliquez sur une adresse\npour en faire l'adresse par défaut.`}</TextBody1>
                </>
              )}
            </View>

            <FlatList
              data={userStore.addresses || []}
              keyExtractor={(item) => item._id!}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 30 }} />}
              renderItem={({ item }) => (
                <Address
                  address={item}
                  onPressFn={
                    !selectAddressFn ? handleDefaultAddress : undefined
                  }
                  onSelectAddressFn={selectAddressFn}
                  extraClasses="mb-2"
                />
              )}
            />
          </View>
        </>
      )}

      {isDefaultAddressSaving && (
        <View className="absolute top-0 w-full h-full flex items-center justify-center bg-darkbg/50">
          <Spinner />
        </View>
      )}
    </SafeAreaView>
  );
}
