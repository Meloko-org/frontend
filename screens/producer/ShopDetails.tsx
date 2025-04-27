import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import InputText from "../../components/utils/inputs/Text";
import InputTextarea from "../../components/utils/inputs/Textarea";
import { useDispatch, useSelector } from "react-redux";
import { setShopData, ShopState } from "../../reducers/shop";
import ImageUploader from "../../components/utils/ImageUploader";
import saveImageLocally from "../../helpers/ImageHelpers";
import shopTools from "../../modules/shopTools";
import { SheetManager } from "react-native-actions-sheet";

type ShopDetailsScreenRouteProp = RouteProp<RootStackParamList, "ShopDetails">;

type ShopDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopDetails"
>;

type Props = {
  navigation: ShopDetailsScreenNavigationProp;
};

export default function ShopDetailsScreen({ navigation }: Props) {
  const route = useRoute<ShopDetailsScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};
  const { getToken } = useAuth();

  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const isPremium = shopStore?.isPremium;

  const descSection = useCollapsibleSection();
  const addressSection = useCollapsibleSection();
  const photoSection = useCollapsibleSection();
  const videoSection = useCollapsibleSection();
  const teamSection = useCollapsibleSection();

  // desc Section
  const [name, setName] = useState<string>("");
  const [siret, setSiret] = useState<string>("");
  const [shortDesc, setShortDesc] = useState<string>("");
  const [longDesc, setLongDesc] = useState<string>("");
  const [logo, setLogo] = useState<string>("");

  // address Section
  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
  });

  // photo Section

  // Video Section

  // TeamSection

  useEffect(() => {
    /* retrieve shop infos if exists */
    if (shopStore !== null) {
      setName(shopStore.name);
      setShortDesc(shopStore.description);
      setLongDesc(shopStore.description); // à modifier shortDesc/longDesc
      setSiret(shopStore.siret);
      setLogo(shopStore.logo);
      setAddress({
        address1: shopStore.address.address1,
        address2: shopStore.address.address2,
        postalCode: shopStore.address.postalCode,
        city: shopStore.address.city,
        country: shopStore.address.country,
      });
    }
  }, []);

  const handleImageSelected = async (uri: string) => {
    const savedUri = await saveImageLocally(uri, "shopImages/");
    if (savedUri) {
      console.log("image sauvée");
      setLogo(savedUri);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const token = await getToken();

      const values = {
        _id: shopStore?._id,
        name,
        siret,
        shortDesc,
        longDesc,
        logo,
        address,
      };

      const shopResponse = await shopTools.updateShop(token, values);

      if (!shopResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: "La mise à jour a échoué.",
            alertType: "error",
          },
        });
        return;
      }

      dispatch(setShopData(shopResponse.data));

      SheetManager.show("alert", {
        payload: {
          message: "Shop mis à jour.",
          alertType: "success",
        },
      });
    } catch (error) {}
  };

  console.log("premium: ", isPremium);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel || "Retour à l'accueil"}
          screen={from || "Home"}
          label={screenTitle || "CONNEXION\nINSCRIPTION"}
          extraClasses="mt-2"
        />

        <ScrollView>
          <View className="w-fl px-3">
            <View className="flex flex-row justify-between items-center mb-5">
              <View className="flex flex-row justify-center items-center w-2/6">
                <ImageUploader
                  defaultUri={shopStore?.logo}
                  onImageSelected={handleImageSelected}
                  mediaTypes={["images"]}
                  message={`Choisisssez une image\nou prenez une photo.`}
                />
              </View>

              <View className="w-4/6">
                <InputText
                  label="Nom"
                  placeholder="Saisissez le nom de la boutique"
                  value={name}
                  onChangeText={(value: string) => setName(value)}
                  extraClasses="mb-2"
                />
                <InputText
                  label="Siret"
                  placeholder="Saisissez le siret de la boutique"
                  value={siret}
                  onChangeText={(value: string) => setSiret(value)}
                  extraClasses="mb-2"
                />
              </View>
            </View>

            <OpenMenuButton
              label="Description"
              onPressFn={descSection.toggle}
              extraClasses="mb-2"
            />

            <Animated.View
              style={[descSection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={descSection.onLayout}
                style={descSection.innerContainerStyle}
              >
                <InputTextarea
                  label="Courte description"
                  placeholder="Saisissez une courte description de votre boutique"
                  value={shortDesc}
                  onChangeText={(value: string) => setShortDesc(value)}
                  extraClasses="mb-2 w-full"
                />
                <InputTextarea
                  label="Présentation"
                  placeholder="Présentez votre boutique"
                  value={longDesc}
                  onChangeText={(value: string) => setLongDesc(value)}
                  extraClasses="mb-2 w-full h-48"
                />
              </View>
            </Animated.View>

            <OpenMenuButton
              label="Adresse"
              onPressFn={addressSection.toggle}
              extraClasses="mb-2"
            />

            <Animated.View
              style={[addressSection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={addressSection.onLayout}
                style={addressSection.innerContainerStyle}
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
                  placeholder="Complément d'adresse"
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
                <View className="flex-row">
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
                    extraClasses="mb-2 w-[30%] mr-[2%]"
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
                    extraClasses="mb-2 w-[68%]"
                  />
                </View>

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
                  extraClasses="mb-5"
                />
              </View>
            </Animated.View>

            <OpenMenuButton
              label="Photos"
              onPressFn={photoSection.toggle}
              extraClasses="mb-2"
            />

            <Animated.View
              style={[photoSection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={photoSection.onLayout}
                style={photoSection.innerContainerStyle}
              ></View>
            </Animated.View>

            {isPremium && (
              <>
                <OpenMenuButton
                  label="Videos"
                  icon="crown"
                  iconFamily="FontAwesome5Icon"
                  iconColor="premium"
                  onPressFn={videoSection.toggle}
                  extraClasses="mb-2"
                  bgColor="bg-premiumbg"
                />

                <Animated.View
                  style={[videoSection.animatedStyle]}
                  className="overflow-hidden"
                >
                  <View
                    onLayout={videoSection.onLayout}
                    style={videoSection.innerContainerStyle}
                  ></View>
                </Animated.View>

                <OpenMenuButton
                  label="Equipe"
                  icon="crown"
                  iconFamily="FontAwesome5Icon"
                  iconColor="premium"
                  onPressFn={teamSection.toggle}
                  extraClasses="mb-2"
                  bgColor="bg-premiumbg"
                />

                <Animated.View
                  style={[teamSection.animatedStyle]}
                  className="overflow-hidden"
                >
                  <View
                    onLayout={teamSection.onLayout}
                    style={teamSection.innerContainerStyle}
                  ></View>
                </Animated.View>
              </>
            )}
          </View>
        </ScrollView>

        <View className="px-5">
          <ButtonPrimaryEnd
            label="Sauvegarder"
            iconFamily="FontAwesome5Icon"
            iconName="sync-alt"
            disabled={isSaveLoading}
            onPressFn={() => handleSave()}
            isLoading={isSaveLoading}
            extraClasses="mt-5 mb-5 h-14"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
