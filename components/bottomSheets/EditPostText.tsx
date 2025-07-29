import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import TextBody1 from "../utils/texts/Body1";
import CustomButton from "../utils/buttons/Custom";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditPostText(props: SheetProps<"edit-post-text">) {
  const insets = useSafeAreaInsets();
  const [postText, setPostText] = useState<string>(props.payload!.text);

  return (
    <ActionSheet
      indicatorStyle={{ backgroundColor: "#000000" }}
      safeAreaInsets={insets}
      useBottomSafeAreaPadding
      // initialSnapIndex={0}
      // snapPoints={[75]}
      containerStyle={{ paddingBottom: insets.bottom }}
      gestureEnabled={true}
      isModal={false}
      id={props.sheetId}
    >
      <View className="bg-lightbg dark:bg-darkbg h-auto p-5">
        <TextBody1 centered extraClasses="mb-3">
          Modifier le texte du post
        </TextBody1>
        <View className="border rounded-lg border-white bg-white dark:bg-tertiary dark:border-tertiary px-3 mb-5">
          <TextInput
            // editable
            multiline
            autoFocus
            value={postText}
            onChangeText={(text) => setPostText(text)}
            textAlignVertical="top"
            className="dark:text-lightbg h-48 text-center"
          />
        </View>

        <View className="flex flex-row">
          <View className="w-1/3">
            <CustomButton
              label="Annuler"
              onPressFn={() => {
                SheetManager.hide(props.sheetId, {
                  payload: "",
                });
              }}
              extraClasses="bg-danger h-12 border rounded-lg "
              textClasses="text-white font-bold text-lg"
            />
          </View>
          <View className="w-2/3 pl-5">
            <ButtonPrimaryEnd
              label="Valider"
              iconName="circle-chevron-right"
              iconFamily="FontAwesome6Icon"
              onPressFn={() => {
                SheetManager.hide(props.sheetId, {
                  payload: postText,
                });
              }}
              extraClasses="h-12"
            />
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}
