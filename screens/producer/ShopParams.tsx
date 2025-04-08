import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { ShopState } from "../../reducers/shop";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { View, Text, LayoutChangeEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import SwitchInput from "../../components/utils/inputs/Switch";
import { ShopData } from "../../types/API";
import { useAuth } from "@clerk/clerk-expo";
import typesTools from "../../modules/typesTools";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";

type ShopParamsScreenRouteProp = RouteProp<RootStackParamList, "ShopParams">;

type ShopParamsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopParams"
>;

type Props = {
  navigation: ShopParamsScreenNavigationProp;
};

export default function ShopParamsScreen({ navigation }: Props) {
  const route = useRoute<ShopParamsScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [isProducerSaveLoading, setIsProducerSaveLoading] =
    useState<boolean>(false);

  // bouton menu déroulant "Type" ------------------
  const [isOpenType, setOpenType] = useState<boolean>(false);
  const contentType = useSharedValue(0);
  const heightType = useSharedValue(0);

  const animatedStyleType = useAnimatedStyle(() => ({
    height: heightType.value,
    opacity: heightType.value > 0 ? 1 : 0, // Facultatif : gérer l'opacité
  }));

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

  // -----------------------------------------------

  // Contient les différents types de shop
  const [types, setTypes] = useState<string[]>([]);
  const [shopTypes, setShopTypes] = useState([]);

  // Créer des switch en fonction des types de shop
  const typesList = shopTypes.map((item: { _id: string; name: string }) => {
    return (
      <SwitchInput
        key={item!._id}
        thumbColor="#215487"
        label={item!.name}
        value={types.includes(item._id)}
        onValueChange={(isSelected) => handleSwitchType(item._id, isSelected)}
        extraClasses="pl-5 mb-2"
      />
    );
  });

  useEffect(() => {
    (async () => {
      // récupération des différents types de shop
      const token = await getToken();
      const response = await typesTools.getTypes(token);
      setShopTypes(response);
    })();
    // récupération des types du shop
    if (shopStore !== null) {
      setTypes(shopStore.types.map((type: { _id: string }) => type._id));
    }
  }, []);

  const handleSwitchType = (typeId: string) => {
    setTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(typeId)
        ? prevSelectedTypes.filter((id) => id !== typeId)
        : [...prevSelectedTypes, typeId],
    );
  };

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
          <View className="w-full px-3">
            <OpenMenuButton
              label="Type de produits"
              onPressFn={toggleOpenType}
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
                <View className="py-5">{typesList}</View>
              </View>
            </Animated.View>
          </View>

          <View className="px-5">
            <ButtonPrimaryEnd
              label="Sauvegarder"
              iconFamily="FontAwesome5Icon"
              iconName="sync-alt"
              disabled={isProducerSaveLoading}
              onPressFn={() => handleProducerUpdate()}
              isLoading={isProducerSaveLoading}
              extraClasses="mt-5 mb-5 h-14"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
