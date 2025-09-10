import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { SafeAreaView } from "react-native-safe-area-context";

import { View } from "react-native";
import TextBody1 from "../components/utils/texts/Body1";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding0">;

export default function Onboarding0Screen({ navigation }: Props) {
  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View className="flex items-center justify-center h-full">
        <View className="p-5">
          <TextBody1 centered extraClasses="text-lg mb-5">
            Bienvenue dans l'assistant de configuration de votre boutique.
          </TextBody1>
          <TextBody1 centered extraClasses="text-lg mb-5">
            Quelques minutes suffisent...
          </TextBody1>
          <ButtonPrimaryEnd
            label="Démarrer"
            iconName="angle-right"
            iconFamily="FontAwesome5Icon"
            onPressFn={() => navigation.navigate("Onboarding1")}
            extraClasses="h-14 mt-5"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
