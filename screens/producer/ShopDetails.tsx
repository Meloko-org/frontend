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

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";

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

  // bouton menu déroulant "Description" ------------------
  const [isOpenDesc, setOpenDesc] = useState(false);
  const heightDesc = useSharedValue(0);

  const toggleOpenDesc = () => {
    setOpenDesc((prev) => !prev);
    heightDesc.value = isOpenDesc ? withTiming(0) : withTiming(150);
  };

  const animatedStyleDesc = useAnimatedStyle(() => ({
    height: heightDesc.value,
    opacity: heightDesc.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));
  // -----------------------------------------------

  // bouton menu déroulant "Adresse" ------------------
  const [isOpenAddress, setOpenAddress] = useState(false);
  const heightAddress = useSharedValue(0);

  const toggleOpenAddress = () => {
    setOpenAddress((prev) => !prev);
    heightAddress.value = isOpenAddress ? withTiming(0) : withTiming(250);
  };

  const animatedStyleAddress = useAnimatedStyle(() => ({
    height: heightAddress.value,
    opacity: heightAddress.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));
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
            ></Animated.View>

            <OpenMenuButton
              label="Adresse"
              onPressFn={toggleOpenAddress}
              extraClasses="mb-2"
            />

            <Animated.View
              style={[animatedStyleAddress]}
              className="overflow-hidden"
            ></Animated.View>

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
