import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { SafeAreaView } from "react-native-safe-area-context";

import FoundationIcon from "@expo/vector-icons/Foundation";

import { View } from "react-native";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import TextHeading2 from "../components/utils/texts/Heading2";
import TextBody1 from "../components/utils/texts/Body1";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ShopState } from "../reducers/shop";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding5">;

export default function Onboarding5Screen({ navigation }: Props) {
  const IconCheck = FoundationIcon;

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [withdrawDisabled, setWithdrawDisabled] = useState<boolean>(false);
  const [addProductDisabled, setAddProductDisabled] = useState<boolean>(false);
  const [businessDisabled, setBusinessDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (
      shopStore?.clickCollect ||
      (shopStore?.markets && shopStore?.markets.length > 0)
    ) {
      setWithdrawDisabled(true);
    }

    if (shopStore?.products) {
      setAddProductDisabled(true);
    }
  }, [shopStore]);

  console.log("Onboarding5 shopStore :", JSON.stringify(shopStore, null, 2));

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 10 }} className="items-center justify-center px-2">
        <TextHeading2 extraClasses="mt-5">Bravo !</TextHeading2>

        <TextBody1 centered extraClasses="text-lg my-5">
          Votre boutique est maintenant créée.
        </TextBody1>

        <View className="flex flex-row items-center mb-3">
          <IconCheck name="checkbox" solid size={35} className="text-primary" />
          <TextBody1 extraClasses="text-lg leading-5 font-bold pl-5">
            Configurer ma boutique
          </TextBody1>
        </View>

        <TextBody1
          centered
          extraClasses="text-lg my-5"
        >{`Encore 2 étapes pour passer\nvotre boutique en ligne.`}</TextBody1>

        <View className="w-64 mb-5">
          <View className="flex flex-row items-center mb-3">
            {!withdrawDisabled ? (
              <IconCheck
                name="plus"
                solid
                size={35}
                className="text-danger rotate-45"
              />
            ) : (
              <IconCheck
                name="checkbox"
                solid
                size={35}
                className="text-primary"
              />
            )}
            <TextBody1 extraClasses="text-lg leading-5 font-bold pl-5">
              Paramétrer les modes de retrait
            </TextBody1>
          </View>

          <View className="flex flex-row items-center mb-3">
            {!addProductDisabled ? (
              <IconCheck
                name="plus"
                solid
                size={35}
                className="text-danger rotate-45"
              />
            ) : (
              <IconCheck
                name="checkbox"
                solid
                size={35}
                className="text-primary"
              />
            )}
            <TextBody1 extraClasses="text-lg leading-5 font-bold pl-5">
              Ajouter des produits
            </TextBody1>
          </View>
        </View>

        <View style={{ flex: 1.5 }} className="px-5">
          <ButtonPrimaryEnd
            label={`Paramétrer les\nmodes de retrait`}
            iconName="angle-right"
            iconFamily="FontAwesome6Icon"
            onPressFn={() =>
              navigation.navigate("OnboardingShopWithdrawModes", {
                from: "Onboarding5",
                backLabel: "Retour",
                screenTitle: "MODES DE\nRETRAIT",
                onboarding: true,
              })
            }
            extraClasses="h-20 mb-2"
            disabled={withdrawDisabled}
          />
          <ButtonPrimaryEnd
            label="Ajouter des produits"
            iconName="angle-right"
            iconFamily="FontAwesome6Icon"
            onPressFn={() =>
              navigation.navigate("OnboardingStockCategories", {
                from: "Onboarding5",
                backLabel: "Retour",
                screenTitle: "GESTION\nDES STOCKS",
                onboarding: true,
              })
            }
            extraClasses="h-20"
            disabled={addProductDisabled}
          />
        </View>
      </View>

      <View style={{ flex: 1.5 }} className="px-5">
        <ButtonPrimaryEnd
          label="Mon Business Center"
          iconName="angle-right"
          iconFamily="FontAwesome6Icon"
          onPressFn={() => {}}
          extraClasses="h-14"
          disabled={businessDisabled}
        />
      </View>
    </SafeAreaView>
  );
}
