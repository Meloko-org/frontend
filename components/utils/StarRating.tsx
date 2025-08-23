import { Pressable, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type StarRatingProps = {
  maxStars?: number;
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  color?: string;
};

export default function StarRating({
  maxStars = 5,
  rating,
  onChange,
  size = 28,
  color = "#FAA200",
}: StarRatingProps) {
  return (
    <View className="flex-row">
      {Array.from({ length: maxStars }, (_, index) => {
        const starNumber = index + 1;
        const isActive = starNumber <= rating;

        return (
          <Pressable
            key={starNumber}
            onPress={() => onChange?.(starNumber)}
            hitSlop={8} // zone de clic plus large
          >
            <FontAwesome
              name={isActive ? "star" : "star-o"}
              size={size}
              color={color}
              style={{ marginHorizontal: 2 }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
