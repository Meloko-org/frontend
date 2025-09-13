import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../../types/Navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import TextBody1 from "../../components/utils/texts/Body1";

type ProducerContactRouteProp = RouteProp<
  ProducerTabParamList,
  "ProducerContact"
>;

type ProducerContactNavProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "ProducerContact"
>;

type Props = {
  navigation: ProducerContactNavProp;
  route: ProducerContactRouteProp;
};

export default function ProducerContactScreen({ navigation, route }: Props) {
  //   const { from, backLabel, screenTitle } = route.params || {};

  return (
    <SafeAreaView>
      <TextBody1 centered>Page de contact des producteurs</TextBody1>
    </SafeAreaView>
  );
}
