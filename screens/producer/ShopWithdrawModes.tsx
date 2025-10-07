import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useSelector, useDispatch } from "react-redux";
import { setShopData, ShopState } from "../../reducers/shop";

import { ProducerTabParamList } from "../../types/Navigation";
import { RootStackParamList } from "../../types/Navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";

import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import TextBody1 from "../../components/utils/texts/Body1";
import PrimaryButton from "../../components/utils/buttons/Primary";
import withdrawTools from "../../modules/withdrawTools";
import { SheetManager } from "react-native-actions-sheet";
import Spinner from "../../components/utils/Spinner";

type FromProducerTab = BottomTabScreenProps<
  ProducerTabParamList,
  "ShopWithdrawModes"
>;

type FromRootStack = NativeStackScreenProps<
  RootStackParamList,
  "OnboardingShopWithdrawModes"
>;

type Props = FromProducerTab | FromRootStack;

export default function ShopWithdrawModesScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle, onboarding } = route.params || {};

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  /* gère l'état des switch */
  const [isClickCollectEnable, setClickCollectEnable] =
    useState<boolean>(false);
  const [isShopMarketsEnable, setShopMarketsEnable] = useState<boolean>(false);
  // const [isDeliveryEnable, setDeliveryEnable] = useState<boolean>(false);

  /* gère le disabled des boutons */
  const [isClickCollectOpenable, setClickCollectOpenable] =
    useState<boolean>(false);
  const [isShopMarketOpenable, setShopMarketOpenable] =
    useState<boolean>(false);
  // const [ isDeliveryOpenable, setDeliveryOpenable ] = useState<boolean>(false)

  const [isWithdrawModeSetted, setIsWithdrawModeSetted] =
    useState<boolean>(false);

  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  useEffect(() => {
    if (shopStore !== null) {
      /* gestion des switch des boutons */
      if (shopStore.clickCollect) {
        setClickCollectEnable(shopStore.clickCollect.isActive);
      }
      if (shopStore.markets) {
        setShopMarketsEnable(
          shopStore.markets.some((market) => market.isActive),
        );
      }
      // if (shopStore.delivery) {
      // 	setDeliveryEnable(shopStore.delivery.isActive)
      // }

      /* gestion du disabled */
      setClickCollectOpenable(!shopStore.clickCollect.isActive);
      setShopMarketOpenable(
        shopStore?.marketsPreviouslyActive &&
          shopStore?.marketsPreviouslyActive.length > 0
          ? true
          : false,
      );
    }

    /* gestion du bouton de validation */
    if (
      (shopStore?.clickCollect && shopStore?.clickCollect.isActive) ||
      (shopStore?.markets &&
        shopStore?.markets.some((market) => market.isActive))
    ) {
      setIsWithdrawModeSetted(true);
    }
  }, [shopStore]);

  const handleWithdrawToggle = async (
    mode: "clickCollect" | "markets",
    value: boolean,
  ) => {
    // conserve la valeur initiale
    const previousValue =
      mode === "clickCollect" ? isClickCollectEnable : isShopMarketsEnable;

    setIsSaveLoading(true);

    try {
      const token = await getToken();

      const values = { mode, value };

      const withdrawResponse = await withdrawTools.activeWithdrawModes(
        token,
        values,
      );

      setIsSaveLoading(false);

      if (withdrawResponse.data === null) {
        if (mode === "clickCollect") {
          setClickCollectEnable(previousValue);
        } else if (mode === "markets") {
          setShopMarketsEnable(previousValue);
        }

        SheetManager.show("alert", {
          payload: {
            message: "Une erreur est survenue.",
            alertType: "error",
          },
        });
        return;
      }

      if (withdrawResponse.success) {
        dispatch(setShopData(withdrawResponse.data));
      }

      SheetManager.show("alert", {
        payload: {
          message: withdrawResponse.message!,
          alertType: "success",
        },
      });
    } catch (error) {
      // rollback en cas d'exception réseau
      if (mode === "clickCollect") {
        setClickCollectEnable(previousValue);
      } else if (mode === "markets") {
        setShopMarketsEnable(previousValue);
      }

      SheetManager.show("alert", {
        payload: {
          message: "Impossible de sauvegarder les modifications.",
          alertType: "error",
        },
      });
    } finally {
      setIsSaveLoading(false);
    }
  };

  console.log("SWM shopStore :", shopStore?.marketsPreviouslyActive);

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        {!onboarding && (
          <TopBar
            backLabel={
              backLabel || (onboarding ? "Retour" : "Retour à la boutique")
            }
            screen={from || (onboarding ? "Onboarding5" : "ShopProducer")}
            label={screenTitle || "MODES DE\nRETRAIT"}
            screenParams={{ onboarding: true }}
            navigationOverride={navigation}
            extraClasses="mt-2"
          />
        )}
      </View>

      <View className="px-3 mt-5" style={{ flex: 10 }}>
        <ScrollView>
          {onboarding && (
            <View className="border border-primary rounded-lg mb-5 p-3">
              <TextBody1
                centered
              >{`Paramétrez au moins un mode de retrait pour la mise en ligne de votre boutique.\n
Une fois votre boutique en ligne, vous pourrez à tout moment ajouter, modifier, supprimer\ndes modes de retrait depuis votre boutique.`}</TextBody1>
            </View>
          )}

          <OpenScreenButton
            label="Click & Collect"
            switchProps={{
              label: "",
              value: isClickCollectEnable,
              onValueChange: (val) => {
                setClickCollectEnable(val);
                handleWithdrawToggle("clickCollect", val);
              },
              extraClasses: "ml-2",
            }}
            onPressFn={() => {
              if (onboarding) {
                (navigation as FromRootStack["navigation"]).navigate(
                  "OnboardingShopWithdrawClickcollect",
                  {
                    from: "OnboardingShopWithdrawModes",
                    backLabel: "Retour modes de retrait",
                    screenTitle: "CLICK &\nCOLLECT",
                    onboarding: true,
                  },
                );
              } else {
                (navigation as FromProducerTab["navigation"]).navigate(
                  "ShopWithdrawClickcollect",
                  {
                    from: "ShopWithdrawModes",
                    backLabel: "Retour modes de retrait",
                    screenTitle: "CLICK &\nCOLLECT",
                  },
                );
              }
            }}
            disabled={isClickCollectOpenable}
            extraClasses="mb-2"
          />
          <OpenScreenButton
            label="Poins de vente"
            switchProps={{
              label: "",
              value: isShopMarketsEnable,
              onValueChange: (val) => {
                setShopMarketsEnable(val);
                handleWithdrawToggle("markets", val);
              },
              extraClasses: "ml-2",
            }}
            onPressFn={() => {
              if (onboarding) {
                (navigation as FromRootStack["navigation"]).navigate(
                  "OnboardingShopWithdrawShopMarkets",
                  {
                    from: "OnboardingShopWithdrawModes",
                    backLabel: "Retour modes de retrait",
                    screenTitle: "POINTS DE\nVENTE",
                    onboarding,
                  },
                );
              } else {
                (navigation as FromProducerTab["navigation"]).navigate(
                  "ShopWithdrawShopMarkets",
                  {
                    from: "ShopWithdrawModes",
                    backLabel: "Retour modes de retrait",
                    screenTitle: "POINTS DE\nVENTE",
                  },
                );
              }
            }}
            disabled={isShopMarketOpenable}
            extraClasses="mb-2"
          />
          {/* <OpenScreenButton
            label="Livraison"
            switchProps={{
              label: "",
              value: isDeliveryEnable,
              onValueChange: setDeliveryEnable,
              extraClasses: "ml-2",
            }}
            onPressFn={() => {
              if (onboarding) {
                (navigation as FromRootStack["navigation"]).navigate(
                  "OnboardingShopWithdrawDelivery",
                  {
                    from: "OnboardingShopWithdrawModes",
                    backLabel: "Retour modes de retrait",
                    screenTitle: "LIVRAISON",
                    onboarding: true,
                  },
                );
              } else {
                (navigation as FromProducerTab["navigation"]).navigate(
                  "ShopWithdrawDelivery",
                  {
                    from: "ShopWithdrawModes",
                    backLabel: "Retour modes de retrait",
                    screenTitle: "LIVRAISON",
                  },
                );
              }
            }}
          /> */}
          {isSaveLoading && <Spinner />}
        </ScrollView>
      </View>

      {onboarding && (
        <View className="px-3 mt-5" style={{ flex: 2 }}>
          <PrimaryButton
            label="Valider les modes de retrait"
            onPressFn={() =>
              (navigation as FromRootStack["navigation"]).navigate(
                "Onboarding5",
              )
            }
            disabled={!isWithdrawModeSetted}
            extraClasses="h-20"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
