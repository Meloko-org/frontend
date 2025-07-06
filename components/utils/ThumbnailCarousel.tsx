import { View, FlatList } from "react-native";
import Thumbnail from "./Thumbnail";

type ThumbnailCarouselProps = {
  images: any[]; // Un tableau d'images locales ou URL
  onDeleteImage?: (uri: string) => void;
  onImagePress?: (uri: string) => void;
  extraClasses?: string;
};

export default function ThumbnailCarousel({
  images,
  onDeleteImage,
  onImagePress,
  extraClasses,
}: ThumbnailCarouselProps) {
  return (
    <View className={`${extraClasses} w-full`}>
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Thumbnail
            source={item}
            extraClasses="mr-1"
            onDelete={onDeleteImage ? () => onDeleteImage(item) : undefined}
            onPress={onImagePress ? () => onImagePress(item) : undefined}
            clickable={!!onImagePress}
          />
        )}
      />
    </View>
  );
}
