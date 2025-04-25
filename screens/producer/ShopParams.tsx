import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useSelector, useDispatch } from "react-redux";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SheetManager } from "react-native-actions-sheet";

import { ShopState, setTypes } from "../../reducers/shop";

import typesTools from "../../modules/typesTools";
import shopTools from "../../modules/shopTools";

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

  const dispatch = useDispatch();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [isParamsUpdateLoading, setParamsUpdateLoading] =
    useState<boolean>(false);

  const typeSection = useCollapsibleSection();

  // Contient les différents types de shop
  const [shopTypes, setShopTypes] = useState<string[]>([]);
  const [globalTypes, setGlobalTypes] = useState([]);

  // Créer des switch en fonction des types de shop
  const typesList = globalTypes.map((item: { _id: string; name: string }) => {
    return (
      <SwitchInput
        key={item!._id}
        thumbColor="#215487"
        label={item!.name}
        value={shopTypes.includes(item._id)}
        onValueChange={(isSelected) => handleSwitchType(item._id)}
        extraClasses="pl-5 mb-2"
      />
    );
  });

  useEffect(() => {
    (async () => {
      // récupération des différents types de shop
      const token = await getToken();
      const response = await typesTools.getTypes(token);
      setGlobalTypes(response);
    })();
    // récupération des types du shop
    if (shopStore !== null) {
      setShopTypes(shopStore.types.map((type: { _id: string }) => type._id));
    }
  }, [shopStore?.types]);

  const handleSwitchType = (typeId: string) => {
    setShopTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(typeId)
        ? prevSelectedTypes.filter((id) => id !== typeId)
        : [...prevSelectedTypes, typeId],
    );
  };

  const handleParamsUpdate = async () => {
    const token = await getToken();
    const typesResponse = await shopTools.updateShopTypes(token, shopTypes);

    console.log("response :", typesResponse);

    if (!typesResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: typesResponse.message,
          alertType: "error",
        },
      });
    } else {
      dispatch(setTypes(typesResponse.data));
      SheetManager.show("alert", {
        payload: {
          message: "Mise à jour effectuée.",
          alertType: "success",
        },
      });
    }
  };

  console.log(shopTypes);

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
              onPressFn={typeSection.toggle}
              // onPressFn={toggleOpenType}
            />

            <Animated.View
              style={[typeSection.animatedStyle]}
              // style={[animatedStyleType]}
              className="overflow-hidden"
            >
              <View
                onLayout={typeSection.onLayout}
                style={typeSection.innerContainerStyle}
                // onLayout={onContentLayout}
                // style={{
                //   opacity: isOpenType ? 1 : 0,
                //   position: isOpenType ? "relative" : "absolute",
                // }}
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
              disabled={isParamsUpdateLoading}
              onPressFn={() => handleParamsUpdate()}
              isLoading={isParamsUpdateLoading}
              extraClasses="mt-5 mb-5 h-14"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
