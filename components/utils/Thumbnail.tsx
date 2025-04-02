import React from "react";
import { View, Image } from "react-native";

type ThumbnailProps = {
  source: string;
  width?: number;
  height?: number;
  extraClasses?: string;
};

export default function Thumbnail({
  source,
  width = 100,
  height = 75,
  extraClasses,
}: ThumbnailProps): JSX.Element {
  return (
    <View className={`${extraClasses}`}>
      <Image
        source={source}
        className="rounded-lg"
        style={{ width, height, resizeMode: "cover" }} // Applique les dimensions
      />
    </View>
  );
}
