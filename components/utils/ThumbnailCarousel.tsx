import { View, FlatList } from "react-native";
import Thumbnail from "./Thumbnail";

type ThumbnailCarouselProps = {
  images: any[]; // Un tableau d'images locales ou URL
};

export default function ThumbnailCarousel({ images }: ThumbnailCarouselProps) {
  return (
    <View className="w-full">
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Thumbnail source={item} extraClasses="mr-2" />
        )}
      />
    </View>
  );
}
