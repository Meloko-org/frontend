import { useRef, useState, useEffect } from "react";
import * as React from "react";
import {
  Dimensions,
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";

import IconButton from "../../utils/buttons/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import TextHeading4 from "../../utils/texts/Heading4";

type ImageViewerModalProps = {
  isVisible: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
};

const { width, height } = Dimensions.get("window");

export default function ImageViewerModal({
  isVisible,
  onClose,
  images,
  initialIndex = 0,
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const carouselRef = useRef<ICarouselInstance>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const renderItem = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={{
        width: width,
        height: height - 50,
        resizeMode: "contain",
      }}
    />
  );

  return (
    <Modal
      visible={isVisible}
      transparent={false}
      backdropColor={"#262E20"}
      animationType="slide"
    >
      <SafeAreaView className="bg-light-bg dark:bg-darkbg relative">
        <Carousel
          ref={carouselRef}
          width={width}
          height={height - 50}
          data={images}
          pagingEnabled
          snapEnabled
          mode="horizontal-stack"
          scrollAnimationDuration={500}
          defaultIndex={initialIndex}
          onSnapToItem={(index) => setCurrentIndex(index)}
          renderItem={renderItem}
          style={{
            width: width,
            height: height - 50,
          }}
        />

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 60,
            flexDirection: "row",
          }}
        >
          {images.map((_, index) => {
            const animatedScale = useRef(
              new Animated.Value(index === currentIndex ? 1.2 : 1),
            ).current;

            useEffect(() => {
              Animated.spring(animatedScale, {
                toValue: index === currentIndex ? 1.4 : 1,
                useNativeDriver: true,
              }).start();
              // Animated.timing(animatedScale, {
              // 	toValue: index === currentIndex ? 1.4 : 1,
              // 	duration: 200,
              // 	useNativeDriver: true,
              // }).start();
            }, [currentIndex]);

            return (
              <Animated.View
                key={index}
                style={{
                  transform: [{ scale: animatedScale }],
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  marginHorizontal: 8,
                  backgroundColor:
                    index === currentIndex
                      ? "#fff"
                      : "rgba(255, 255, 255, 0.3)",
                }}
              />
            );
          })}
        </View>

        <IconButton
          iconName="times-circle"
          iconColor="white"
          iconFamily="FontAwesome5Icon"
          buttonColor="bg-tertiary"
          onPressFn={onClose}
          extraClasses="w-12 h-12 absolute top-1 right-1"
        />
      </SafeAreaView>
    </Modal>
  );
}
