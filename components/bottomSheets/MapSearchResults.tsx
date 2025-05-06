import React from "react";
import { View, ScrollView } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useColorScheme } from "nativewind";
import TextHeading3 from "../utils/texts/Heading3";
import TextHeading4 from "../utils/texts/Heading4";

export default function MapSearchResults(
  props: SheetProps<"map-search-results">,
) {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ActionSheet
      snapPoints={[25, 75]}
      initialSnapIndex={1}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="h-full bg-lightbg dark:bg-darkbg">
        <View className="px-3 w-full">
          <TextHeading4 centered extraClasses="my-3 h-10">
            {`${props.payload?.resultsList.length.toString()} ${props.payload?.searchType === "shop" ? "Producteur(s)" : "Point(s) de vente"}`}
          </TextHeading4>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 0.3, width: "100%" }}
          className="px-3"
        >
          {props.payload?.resultsList}
        </ScrollView>
      </View>
    </ActionSheet>
  );
}
