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

import { ShopState, setTypes, setFeatures } from "../../reducers/shop";

import typesTools from "../../modules/typesTools";
import shopTools from "../../modules/shopTools";
import globalTools from "../../modules/globalTools";
import featuresTools from "../../modules/featuresTools";

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
import { ShopData, ShopFeaturesData } from "../../types/API";
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
  const [isUpdateButtonEnabled, setIsUpdateButtonEnabled] =
    useState<boolean>(false);

  const typeSection = useCollapsibleSection();
  const featuresSection = useCollapsibleSection();

  // Contient les différents types de shop
  const [shopTypes, setShopTypes] = useState<string[]>([]);
  const [globalTypes, setGlobalTypes] = useState([]);

  const [shopFeatures, setShopFeatures] = useState<string[]>([]);
  const [globalFeatures, setGlobalFeatures] = useState<ShopFeaturesData[]>([]);

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

  const featuresList = globalFeatures.map((item: ShopFeaturesData) => {
    return (
      <SwitchInput
        key={item._id}
        label={item.label}
        value={shopFeatures.includes(item._id)}
        onValueChange={(isEnabled) => handleSwitchFeature(item._id)}
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

      // récupération de la liste des shopFeatures
      const featResponse = await featuresTools.getShopFeatures();
      if (featResponse.data) {
        setGlobalFeatures(featResponse.data);
      }
    })();
  }, []);

  useEffect(() => {
    if (shopStore !== null) {
      // récupération des types du shop
      setShopTypes(shopStore.types.map((type: { _id: string }) => type._id));
      // récupération des features du shop
      setShopFeatures(
        shopStore.features.map((feature: { _id: string }) => feature._id),
      );
    }
  }, [shopStore]);

  useEffect(() => {
    const typesChanged = !globalTools.arraysEqualById(
      shopStore?.types.map((type) => ({ _id: type._id })) || [],
      shopTypes.map((type) => ({ _id: type })),
    );
    const featuresChanged = !globalTools.arraysEqualById(
      shopStore?.features.map((feature) => ({ _id: feature._id })) || [],
      shopFeatures.map((feature) => ({ _id: feature })),
    );
    setIsUpdateButtonEnabled(typesChanged || featuresChanged);
  }, [shopTypes, shopFeatures, shopStore]);

  const handleSwitchType = (typeId: string) => {
    setShopTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(typeId)
        ? prevSelectedTypes.filter((id) => id !== typeId)
        : [...prevSelectedTypes, typeId],
    );
  };

  const handleSwitchFeature = (featureId: string) => {
    setShopFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId],
    );
  };

  const handleParamsUpdate = async () => {
    setParamsUpdateLoading(true);
    const token = await getToken();

    const typesChanged = !globalTools.arraysEqualById(
      shopStore?.types.map((type) => ({ _id: type._id }))!,
      shopTypes.map((type) => ({ _id: type })),
    );

    const featuresChanged = !globalTools.arraysEqualById(
      shopStore?.features.map((feature) => ({ _id: feature._id }))!,
      shopFeatures.map((feature) => ({ _id: feature })),
    );

    let errorMessage = null;

    if (typesChanged) {
      const typesResponse = await shopTools.updateShopTypes(token, shopTypes);

      if (!typesResponse.success) {
        errorMessage = typesResponse.message;
      } else {
        dispatch(setTypes(typesResponse.data));
      }
    }

    if (featuresChanged) {
      const featuresResponse = await shopTools.updateShopFeatures(
        token,
        shopFeatures,
      );

      if (!featuresResponse.success) {
        errorMessage = featuresResponse.message;
      } else {
        dispatch(setFeatures(featuresResponse.data));
      }
    }

    SheetManager.show("alert", {
      payload: {
        message: errorMessage || "Mise à jour effectuée.",
        alertType: errorMessage ? "error" : "success",
      },
    });

    setParamsUpdateLoading(false);
  };

  console.log("SHOPPARAMS features :", shopFeatures);
  console.log("SHOPPARAMS store features :", shopStore?.features);
  console.log("SHOPPARAMS types :", shopTypes);
  console.log("SHOPPARAMS store types :", shopStore?.types);

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour à l'accueil"}
          screen={from || "Home"}
          label={screenTitle || "CONNEXION\nINSCRIPTION"}
          extraClasses="mt-2"
        />
      </View>

      <View style={{ flex: 10 }} className="pt-5">
        <ScrollView>
          <View className="w-full px-3">
            <OpenMenuButton
              label="Type de produits"
              onPressFn={typeSection.toggle}
              extraClasses="mb-2"
            />

            <Animated.View
              style={[typeSection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={typeSection.onLayout}
                style={typeSection.innerContainerStyle}
              >
                <View className="py-5">{typesList}</View>
              </View>
            </Animated.View>

            <OpenMenuButton
              label="Options du shop"
              onPressFn={featuresSection.toggle}
            />

            <Animated.View
              style={[featuresSection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={featuresSection.onLayout}
                style={featuresSection.innerContainerStyle}
              >
                <View className="py-5">{featuresList}</View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </View>

      <View className="px-5 bg-lightbg dark:bg-darkbg" style={{ flex: 1 }}>
        <ButtonPrimaryEnd
          label="Sauvegarder"
          iconFamily="FontAwesome5Icon"
          iconName="sync-alt"
          disabled={isParamsUpdateLoading || !isUpdateButtonEnabled}
          onPressFn={() => handleParamsUpdate()}
          isLoading={isParamsUpdateLoading}
          extraClasses="h-14"
        />
      </View>
    </SafeAreaView>
  );
}
