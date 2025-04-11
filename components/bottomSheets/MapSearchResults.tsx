import React from "react";
import { View, ScrollView } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useColorScheme } from "nativewind";
import TextHeading3 from "../utils/texts/Heading3";

export default function MapSearchResults(
  props: SheetProps<"map-search-results">,
) {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ActionSheet
      snapPoints={[25, 75]}
      initialSnapIndex={0}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      backgroundInteractionEnabled={true}
      isModal={false}
      id={props.sheetId}
      closable={false}
      useBottomSafeAreaPadding={true}
    >
      <View className="h-full">
        <View className="px-3 w-full">
          <TextHeading3 extraClasses="mt-2 mb-4 h-10">
            {`${props.payload?.producersList.length.toString()} Résultats `}
          </TextHeading3>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 0.3, width: "100%" }}
          className="px-3"
        >
          {props.payload?.producersList}
        </ScrollView>
      </View>
    </ActionSheet>
  );
}
