import React from "react";
import { useState, useEffect } from "react";
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
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

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

  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  // bouton menu déroulant "Description" ------------------
  const [isOpenDesc, setOpenDesc] = useState(false);
  const heightDesc = useSharedValue(0);

  const toggleOpenDesc = () => {
    setOpenDesc((prev) => !prev);
    heightDesc.value = isOpenDesc ? withTiming(0) : withTiming(480);
  };

  const animatedStyleDesc = useAnimatedStyle(() => ({
    height: heightDesc.value,
    opacity: heightDesc.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));

  const [name, setName] = useState<string>("");
  const [siret, setSiret] = useState<string>("");
  const [shortDesc, setShortDesc] = useState<string>("");
  const [longDesc, setLongDesc] = useState<string>("");
  // -----------------------------------------------

  // bouton menu déroulant "Adresse" ------------------
  const [isOpenAddress, setOpenAddress] = useState(false);
  const heightAddress = useSharedValue(0);

  const toggleOpenAddress = () => {
    setOpenAddress((prev) => !prev);
    heightAddress.value = isOpenAddress ? withTiming(0) : withTiming(400);
  };

  const animatedStyleAddress = useAnimatedStyle(() => ({
    height: heightAddress.value,
    opacity: heightAddress.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));

  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
  });
  // -----------------------------------------------

  // bouton menu déroulant "Photo" ------------------
  const [isOpenPhoto, setOpenPhoto] = useState(false);
  const heightPhoto = useSharedValue(0);

  const toggleOpenPhoto = () => {
    setOpenPhoto((prev) => !prev);
    heightPhoto.value = isOpenPhoto ? withTiming(0) : withTiming(250);
  };

  const animatedStylePhoto = useAnimatedStyle(() => ({
    height: heightPhoto.value,
    opacity: heightPhoto.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));
  // -----------------------------------------------

  // bouton menu déroulant "Video" ------------------
  const [isOpenVideo, setOpenVideo] = useState(false);
  const heightVideo = useSharedValue(0);

  const toggleOpenVideo = () => {
    setOpenVideo((prev) => !prev);
    heightVideo.value = isOpenVideo ? withTiming(0) : withTiming(250);
  };

  const animatedStyleVideo = useAnimatedStyle(() => ({
    height: heightVideo.value,
    opacity: heightVideo.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));
  // -----------------------------------------------

  // bouton menu déroulant "Equipe" ------------------
  const [isOpenTeam, setOpenTeam] = useState(false);
  const heightTeam = useSharedValue(0);

  const toggleOpenTeam = () => {
    setOpenTeam((prev) => !prev);
    heightTeam.value = isOpenTeam ? withTiming(0) : withTiming(250);
  };

  const animatedStyleTeam = useAnimatedStyle(() => ({
    height: heightTeam.value,
    opacity: heightTeam.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));
  // -----------------------------------------------

  useEffect(() => {
    /* retrieve shop infos if exists */
    if (shopStore !== null) {
      setName(shopStore.name);
      setShortDesc(shopStore.description);
      setLongDesc(shopStore.description); // à modifier shortDesc/longDesc
      setSiret(shopStore.siret);
      setAddress({
        address1: shopStore.address.address1,
        address2: shopStore.address.address2,
        postalCode: shopStore.address.postalCode,
        city: shopStore.address.city,
        country: shopStore.address.country,
      });
    }
  }, []);

  const handleSave = () => {};

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
            <OpenMenuButton
              label="Description"
              onPressFn={toggleOpenDesc}
              extraClasses="mb-2"
            />

            <Animated.View
              style={[animatedStyleDesc]}
              className="overflow-hidden"
            >
              <View className="flex flex-row justify-between items-center">
                <View className="flex flex-row justify-center items-center w-2/6">
                  <TouchableOpacity onPress={() => setLogoModalVisible(true)}>
                    <View className="rounded-full bg-warning flex flex-row justify-center items-center mb-5 w-[100px] h-[100px]">
                      <FontAwesome
                        name="github-alt"
                        size={80}
                        color="#FFFFFF"
                        className="absolute"
                      />
                    </View>
                  </TouchableOpacity>
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
            </Animated.View>

            <OpenMenuButton
              label="Adresse"
              onPressFn={toggleOpenAddress}
              extraClasses="mb-2"
            />

            <Animated.View
              style={[animatedStyleAddress]}
              className="overflow-hidden"
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
                extraClasses="mb-2"
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
                extraClasses="mb-2"
              />
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
                extraClasses="mb-1"
              />
            </Animated.View>

            <OpenMenuButton
              label="Photos"
              onPressFn={toggleOpenPhoto}
              extraClasses="mb-2"
            />

            <Animated.View
              style={[animatedStylePhoto]}
              className="overflow-hidden"
            ></Animated.View>

            <OpenMenuButton
              label="Videos"
              icon="crown"
              iconFamily="FontAwesome5Icon"
              iconColor="premium"
              onPressFn={toggleOpenVideo}
              extraClasses="mb-2"
              bgColor="bg-premiumbg"
            />

            <Animated.View
              style={[animatedStyleVideo]}
              className="overflow-hidden"
            ></Animated.View>

            <OpenMenuButton
              label="Equipe"
              icon="crown"
              iconFamily="FontAwesome5Icon"
              iconColor="premium"
              onPressFn={toggleOpenTeam}
              extraClasses="mb-2"
              bgColor="bg-premiumbg"
            />

            <Animated.View
              style={[animatedStyleTeam]}
              className="overflow-hidden"
            ></Animated.View>
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
