import React, { useRef, useState } from "react";
import { View, ScrollView } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { useColorScheme } from "nativewind";
import TextHeading3 from "../utils/texts/Heading3";
import TextHeading4 from "../utils/texts/Heading4";
import BackLabelButton from "../utils/buttons/BackLabel";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";

export default function MapEmptySearchResults(
  props: SheetProps<"map-empty-search-results">,
) {
  return (
    <ActionSheet
      backgroundInteractionEnabled={true}
      isModal={false}
      snapPoints={[25, 50, 75]}
      initialSnapIndex={1}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
      ref={(ref) => {
        if (ref) {
          SheetManager.registerRef("map-empty-search-results", "global", {
            current: ref,
          });
        }
      }}
    >
      <View className="h-full bg-lightbg dark:bg-darkbg">
        <View className="px-3 w-full h-full">
          <TextHeading4 centered extraClasses="my-3">
            {`Aucun ${props.payload?.searchType} trouvé avec ces paramètres.`}
          </TextHeading4>
          <ButtonPrimaryEnd
            label="Modifier paramètres"
            iconFamily="FontAwesome5Icon"
            iconName="search"
            onPressFn={() => {
              const ref = SheetManager.get(props.sheetId);
              ref?.current?.hide();
              props.payload?.onRetry();
            }}
          />
        </View>
      </View>
    </ActionSheet>
  );
}
