import React from "react";
import { View, Text } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextHeading4 from "../utils/texts/Heading4";
import IconButton from "../utils/buttons/Icon";

export default function ImageUploaderSheet(
  props: SheetProps<"image-uploader">,
) {
  const insets = useSafeAreaInsets();

  return (
    <ActionSheet
      CustomHeaderComponent={
        <View className="flex rounded-t-lg items-center justify-center h-5 bg-white dark:bg-tertiary">
          <View className="w-10 h-1 rounded-lg bg-darkbg dark:bg-white"></View>
        </View>
      }
      safeAreaInsets={insets}
      snapPoints={[100]}
      // indicatorStyle={{ backgroundColor: "#262E20" }}
      gestureEnabled={true}
      containerStyle={{ paddingBottom: insets.bottom }}
      isModal={false}
      id={props.sheetId}
    >
      <View className="p-5 min-h-min w-full flex justify-center items-center bg-lightbg dark:bg-darkbg">
        <TextHeading4 centered extraClasses="font-extrabold text-xl">
          {props.payload?.message}
        </TextHeading4>
        <View className="flex flex-row w-[80%] justify-around mt-5">
          <IconButton
            iconName="arrow-rotate-left"
            iconFamily="FontAwesome6Icon"
            iconColor="#ffffff"
            extraClasses="bg-danger h-14 w-14"
            onPressFn={() => {
              SheetManager.hide(props.sheetId);
            }}
          />
          <IconButton
            iconName="image"
            iconFamily="FontAwesome6Icon"
            iconColor="#ffffff"
            extraClasses="bg-primary h-14 w-14"
            onPressFn={() => {
              SheetManager.hide(props.sheetId, {
                payload: "image",
              });
            }}
          />
          {props.payload?.type.includes("livePhotos") && (
            <IconButton
              iconName="camera"
              iconFamily="FontAwesome6Icon"
              iconColor="#ffffff"
              extraClasses="bg-primary h-14 w-14"
              onPressFn={() => {
                SheetManager.hide(props.sheetId, {
                  payload: "camera",
                });
              }}
            />
          )}
        </View>
      </View>
    </ActionSheet>
  );
}
