import { View } from "react-native";
import ActionSheet, { SheetProps } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TextBody1 from "../utils/texts/Body1";
import StarsNotation from "../utils/StarsNotation";

export default function Note(props: SheetProps<"note">) {
  const insets = useSafeAreaInsets();
  return (
    <ActionSheet
      safeAreaInsets={insets}
      // snapPoints={[50]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      backgroundInteractionEnabled={false}
      containerStyle={{ overflow: "hidden" }}
      // initialSnapIndex={0}
      enableGesturesInScrollView={true}
      isModal={false}
    >
      <View className="bg-lightbg dark:bg-darkbg p-5">
        <View className="px-5">
          <TextBody1 centered extraClasses="font-bold">
            {props.payload?.note.comment}
          </TextBody1>
        </View>
        <View className="my-3">
          <StarsNotation
            iconNames={["star", "star-half", "star-o"]}
            note={Number(props.payload?.note.note)}
            extraClasses="pb-1"
          />
        </View>
        <View className=" flex flex-row justify-center w-full">
          <TextBody1>{props.payload?.note.user.lastname} </TextBody1>

          <TextBody1>
            (
            {
              props.payload?.note.user.addresses?.find(
                (adr) => adr.isDefault === true,
              )?.address.postalCode
            }
            )
          </TextBody1>
        </View>
      </View>
    </ActionSheet>
  );
}
