import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useDispatch, useSelector } from "react-redux";
import { setShopData, ShopState } from "../reducers/shop";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { SafeAreaView } from "react-native-safe-area-context";

import FoundationIcon from "@expo/vector-icons/Foundation";

import { View } from "react-native";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import TextHeading2 from "../components/utils/texts/Heading2";
import TextBody1 from "../components/utils/texts/Body1";
import shopTools from "../modules/shopTools";
import TextHeading1 from "../components/utils/texts/Heading1";
import { useFocusEffect } from "@react-navigation/native";
import onboardingTools from "../modules/onboardingTools";
import { SheetManager } from "react-native-actions-sheet";
import { setProducerData } from "../reducers/producer";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding5">;

export default function Onboarding5Screen({ navigation }: Props) {
  const IconCheck = FoundationIcon;
  const { getToken } = useAuth();

  const dispatch = useDispatch();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [withdrawDisabled, setWithdrawDisabled] = useState<boolean>(false);
  const [addProductDisabled, setAddProductDisabled] = useState<boolean>(false);

  /* Récupération du shopStore en cas d'intérruption du onboarding */
  useEffect(() => {
    if (shopStore) return;

    (async () => {
      const token = await getToken();
      const shopResponse = await shopTools.getShopInfos(token, "true");
      if (shopResponse.success) {
        dispatch(setShopData(shopResponse.data));
      }
    })();
  }, []);

  /* Mise à jour de onboardingStep  
    Si un mode de retrait ET un produit sont ajoutés -> onboarding = 6
    si un mode de retrait OU un produit sont ajoutés -> onboarding = 5
  */
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const token = await getToken();

        const hasWithdraw =
          (shopStore?.clickCollect && shopStore?.clickCollect.isActive) ||
          (shopStore?.markets &&
            shopStore?.markets.some((market) => market.isActive));

        const hasProduct =
          shopStore?.products && shopStore?.products.length > 0;

        if (hasWithdraw && hasProduct) {
          const producerResponse = await onboardingTools.onboarding6(token);

          if (producerResponse.success) {
            dispatch(setProducerData(producerResponse.data));
            setWithdrawDisabled(true);
            setAddProductDisabled(true);

            SheetManager.show("alert", {
              payload: {
                message: "Votre boutique est désormais en ligne.",
                alertType: "success",
              },
            });
          }
        } else if (hasWithdraw || hasProduct) {
          const producerResponse = await onboardingTools.onboarding5(token);
          if (hasWithdraw) setWithdrawDisabled(true);
          if (hasProduct) setAddProductDisabled(true);
        }
      })();
    }, [shopStore]),
  );

  console.log("withdraw :", withdrawDisabled);
  console.log("addProducts :", addProductDisabled);
  // console.log("Onboarding5 shopStore :", JSON.stringify(shopStore, null, 2));
  console.log("Onboarding5 shopStore :", shopStore);

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
              Paramétrer au moins un mode de retrait
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
      </View>

      <View style={{ flex: 4.5 }} className="px-5">
        {!withdrawDisabled || !addProductDisabled ? (
          <>
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
          </>
        ) : (
          <>
            <View className="">
              <TextHeading1
                centered
                extraClasses="mb-3"
                textClasses="text-primary"
              >
                SUPER !!
              </TextHeading1>
            </View>
            <TextBody1 centered extraClasses="mb-3">
              Votre boutique est en ligne.
            </TextBody1>
            <ButtonPrimaryEnd
              label="Mon Business Center"
              iconName="angle-right"
              iconFamily="FontAwesome6Icon"
              onPressFn={() =>
                navigation.navigate("TabNavigatorProducer", {
                  screen: "BusinessCenter",
                })
              }
              extraClasses="h-14"
            />
          </>
        )}
      </View>

      <View style={{ flex: 4 }} className="px-5 mt-3">
        {withdrawDisabled && addProductDisabled && (
          <>
            <View className="flex flex-row justify-center">
              <TextBody1>Abonnées </TextBody1>
              <TextBody1 textClasses="text-premium">Premium</TextBody1>
            </View>
            <TextBody1
              centered
            >{`Rendez vous dans votre boutique\npour configurer votre assitant IA.`}</TextBody1>
            <ButtonPrimaryEnd
              label="Ma boutique"
              iconName="angle-right"
              iconFamily="FontAwesome6Icon"
              onPressFn={() =>
                navigation.navigate("TabNavigatorProducer", {
                  screen: "ShopProducer",
                })
              }
              extraClasses="h-14 mt-3"
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
