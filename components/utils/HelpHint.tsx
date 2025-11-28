import { Text, View } from "react-native";
import { iconLibraries, IconLibraryName } from "../iconLibraries";

type Props = {
  text: string;
  visible: boolean;
  iconName: string;
  iconFamily?: IconLibraryName;
  rotate: number;
  arrowPosition: "start" | "end";
  extraClasses?: string;
};

export default function HelpHint({
  text,
  visible,
  iconName,
  iconFamily = "FontAwesomeIcon",
  rotate,
  arrowPosition = "start",
  extraClasses,
}: Props) {
  if (!visible) return null;

  const IconComponent = iconLibraries[iconFamily];

  const arrow = (
    <IconComponent
      name={iconName}
      style={{ transform: [{ rotate: `${rotate}deg` }] }}
      color="#FAA200"
      size={20}
    />
  );

  return (
    <View className={`${extraClasses} flex flex-row items-center py-1`}>
      {arrowPosition === "start" && <View className="mr-2">{arrow}</View>}
      <View className="flex-grow">
        <Text className="text-premium font-caveatBold text-xl leading-4 pr-5">
          {text}
        </Text>
      </View>
      {arrowPosition === "end" && <View className="mr-2">{arrow}</View>}
    </View>
  );
}
