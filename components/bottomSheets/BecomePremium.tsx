import React from "react";
import { View } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useColorScheme } from "nativewind";
import TextBody1 from "../utils/texts/Body1";
import CheckBox from "../utils/inputs/CheckBox";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";

export default function BecomePremium(props: SheetProps<"product-details">) {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ActionSheet
      snapPoints={[75]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="flex justify-center items-center p-3 w-full h-full bg-lightbg dark:bg-darkbg">
        <View>
          <TextBody1 centered>
            En devenant membre Premium, bla bla bla. Cet abonnement est au prix
            de 15 € ht par mois
          </TextBody1>
          <View className="items-center my-5">
            <CheckBox
              label="J'accèpte les conditions"
              textClasses="text-secondary dark:text-lightbg"
            />
          </View>
          <View className="px-3">
            <ButtonPrimaryEnd
              label="Valider"
              iconName="check"
              iconFamily="FontAwesome5Icon"
              disabled={false}
              onPressFn={() => console.log("youpi")}
              extraClasses="mb-3 h-14"
            />
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}
