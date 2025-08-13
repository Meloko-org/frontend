import { JSX } from "react";
import { ActivityData } from "../../types/API";
import { TouchableOpacity, View } from "react-native";
import TextBody1 from "../utils/texts/Body1";
import TextHeading4 from "../utils/texts/Heading4";

type PostChoiceActivityCardProps = {
  activity: ActivityData;
  onPressFn: () => void;
  extraClasses: string;
};

export default function PostChoiceActivityCard({
  activity,
  onPressFn,
  extraClasses,
}: PostChoiceActivityCardProps): JSX.Element {
  return (
    <TouchableOpacity
      onPress={onPressFn}
      className={`${extraClasses} rounded-lg border bg-white dark:bg-tertiary border-white dark:border-tertiary h-14`}
    >
      <View className="flex flex-row justify-center items-center h-14">
        <TextHeading4 centered extraClasses="font-bold">
          {activity.title}
        </TextHeading4>
      </View>
    </TouchableOpacity>
  );
}
