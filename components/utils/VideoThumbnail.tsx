import React, { JSX } from "react";
import { Dimensions, View, ViewStyle } from "react-native";
import TextHeading4 from "./texts/Heading4";
import { useVideoPlayer, VideoView } from "expo-video";
import IconButton from "./buttons/Icon";

type VideoThumbnailProps = {
  source: string | null;
  onDelete?: (uri: string) => void;
  style?: ViewStyle;
  placeholderText?: string;
};

export default function VideoThumbnail({
  source,
  onDelete,
  style,
  placeholderText,
}: VideoThumbnailProps) {
  const player = useVideoPlayer(source, (player) => {
    player.staysActiveInBackground = false;
  });

  return (
    <View className="w-full rounded-lg mb-5">
      {source ? (
        <>
          <VideoView
            player={player}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width * (9 / 16),
            }}
          />
          <View className="absolute top-1 right-1">
            <IconButton
              iconName="times-circle"
              iconColor="white"
              iconFamily="FontAwesome5Icon"
              buttonColor="bg-danger"
              onPressFn={() => onDelete?.(source)}
              extraClasses="w-9 h-9"
            />
          </View>
        </>
      ) : (
        <View
          className="w-full bg-tertiary border border-primary flex items-center justify-center"
          style={{ aspectRatio: 16 / 9 }}
        >
          <TextHeading4 centered>{placeholderText}</TextHeading4>
        </View>
      )}
    </View>
  );
}
