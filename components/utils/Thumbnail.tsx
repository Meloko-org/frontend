import React, { JSX } from "react";
import {
  View,
  Image,
  Pressable,
  StyleProp,
  ImageStyle,
  ImageResizeMode,
} from "react-native";
import IconButton from "./buttons/Icon";

type ThumbnailProps = {
  source: string;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  extraClasses?: string;
  onDelete?: (uri: string) => void;
  onPress?: () => void;
  clickable?: boolean;
};

export default function Thumbnail({
  source,
  width = 100,
  height = 75,
  style,
  extraClasses,
  onDelete,
  onPress,
  clickable,
}: ThumbnailProps): JSX.Element {
  const baseStyle = style
    ? { resizeMode: "cover" as ImageResizeMode }
    : { width, height, resizeMode: "cover" as ImageResizeMode };

  const image = (
    <View className={`${extraClasses}`}>
      <Image
        source={{ uri: source }}
        className="rounded-lg w-full h-full"
        style={[baseStyle, style]} // Applique les dimensions
      />
      {onDelete && (
        <View className="absolute bottom-1 right-1">
          <IconButton
            iconName="times-circle"
            iconColor="white"
            iconFamily="FontAwesome5Icon"
            buttonColor="bg-danger"
            onPressFn={() => onDelete?.(source)}
            extraClasses="w-9 h-9"
          />
        </View>
      )}
    </View>
  );

  return (
    <View className={extraClasses}>
      {clickable && onPress ? (
        <Pressable onPress={onPress}>{image}</Pressable>
      ) : (
        image
      )}
    </View>
  );
}
