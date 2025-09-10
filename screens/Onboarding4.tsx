import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useDispatch } from "react-redux";
import { setShopData } from "../reducers/shop";
import { setProducerData } from "../reducers/producer";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import FoundationIcon from "@expo/vector-icons/Foundation";

import onboardingTools from "../modules/onboardingTools";
import { SheetManager } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

import ButtonSecondaryStart from "../components/utils/buttons/SecondaryStart";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import TextBody1 from "../components/utils/texts/Body1";
import CheckBox from "../components/utils/inputs/CheckBox";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding4">;

export default function Onboarding4Screen({ navigation }: Props) {
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  // pour permettre l'utlisation des classes tailwind sur l'icone
  const IconComponent = FontAwesome6Icon;
  const IconCheck = FoundationIcon;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [buttonLabel, setButtonLabel] = useState<string>("Ignorer");

  const handleNext = async () => {
    if (buttonLabel === "Ignorer") {
      navigation.navigate("Onboarding5");
    } else {
      const token = await getToken();

      const onboardingResponse = await onboardingTools.onboarding4(
        token,
        isPremium,
      );

      if (!onboardingResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: onboardingResponse.message!,
            alertType: "error",
          },
        });
        setIsLoading(false);
        return;
      } else {
        dispatch(setShopData(onboardingResponse.data?.shop!));
        dispatch(setProducerData(onboardingResponse.data?.producer!));
        setIsLoading(false);
        navigation.navigate("Onboarding5");
      }
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg px-3"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 10 }} className="items-center justify-center px-2">
        <View className="flex flex-row items-center justify-center h-14 bg-premium rounded-full px-4 mb-5">
          <Text className="font-bold text-lg text-white ">
            Devenir membre Premium
          </Text>
          <IconComponent name="crown" size={20} className="text-white pl-2" />
        </View>

        <TextBody1 centered extraClasses="text-lg my-5">
          En étant membre Premium :
        </TextBody1>

        <View className="px-3 mb-5">
          <View className="flex flex-row items-center mb-3">
            <IconCheck
              name="checkbox"
              solid
              size={25}
              className="text-primary"
            />
            <TextBody1 extraClasses="text-lg leading-5 pl-2">
              Vous bénéficiez d'une personnalisation avancée de votre boutique.
            </TextBody1>
          </View>

          <View className="flex flex-row items-center mb-3">
            <IconCheck
              name="checkbox"
              solid
              size={25}
              className="text-primary"
            />
            <TextBody1 extraClasses="text-lg leading-5 pl-2">
              Vous participez au circuit touristique.
            </TextBody1>
          </View>

          <View className="flex flex-row items-center mb-5">
            <IconCheck
              name="checkbox"
              solid
              size={25}
              className="text-primary"
            />
            <TextBody1 extraClasses="text-lg leading-5 pl-2">
              Vous bénéficiez d'un assistant IA pour créer des posts et les
              poster sur vos réseaux sociaux.
            </TextBody1>
          </View>
        </View>

        <View className="flex flex-row justify-center mt-5">
          <CheckBox
            label={`Je souscris à l'abonnement\nPremium à 15 HT / mois et\n j'accepte les conditions.`}
            bgColor="bg-lightbg dark:bg-darkbg"
            textClasses="text-black dark:text-white text-lg leading-5"
            onPressFn={() => {
              setIsPremium(!isPremium);
              setButtonLabel(!isPremium ? "Suivant" : "Ignorer");
            }}
          />
        </View>
      </View>

      <View style={{ flex: 1.5 }}>
        <View className="flex flex-row gap-x-2 mt-5">
          <View className="flex-1">
            <ButtonSecondaryStart
              label="Retour"
              iconName="angle-left"
              iconFamily="FontAwesome5Icon"
              onPressFn={() => navigation.navigate("Onboarding3")}
            />
          </View>
          <View className="flex-1">
            <ButtonPrimaryEnd
              label={buttonLabel}
              iconName="angle-right"
              iconFamily="FontAwesome5Icon"
              onPressFn={handleNext}
              isLoading={isLoading}
            />
          </View>
        </View>

        <View className="flex flex-row justify-center items-center mt-2">
          <IconComponent
            name="circle"
            size={12}
            solid
            className="px-2 text-darkbg/20 dark:text-primary/20"
          />
          <IconComponent
            name="circle"
            size={12}
            solid
            className="px-2 text-darkbg/20 dark:text-primary/20"
          />
          <IconComponent
            name="circle"
            size={12}
            solid
            className="px-2 text-darkbg/20 dark:text-primary/20"
          />
          <IconComponent
            name="circle"
            size={12}
            solid
            className="px-2 text-darkbg dark:text-primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
