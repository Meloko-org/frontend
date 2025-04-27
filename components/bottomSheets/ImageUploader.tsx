import React from "react";
import { View, Text } from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import PrimaryButton from "../utils/buttons/Primary";
import SecondaryButton from "../utils/buttons/Secondary";
import TextHeading4 from "../utils/texts/Heading4";
import IconButton from "../utils/buttons/Icon";
import CustomButton from "../utils/buttons/Custom";

export default function ImageUploaderSheet(
  props: SheetProps<"image-uploader">,
) {
  return (
    <ActionSheet
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="p-5 min-h-min w-full flex justify-center items-center bg-white dark:bg-darkbg">
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
