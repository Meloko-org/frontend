import { useState } from "react";
import { LayoutChangeEvent, ViewStyle } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export function useCollapsibleSection(duration: number = 300) {
  const [isOpen, setIsOpen] = useState(false);
  const contentHeight = useSharedValue(0);
  const animatedHeight = useSharedValue(0);

  const toggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      animatedHeight.value = withTiming(next ? contentHeight.value : 0, {
        duration,
        easing: Easing.out(Easing.ease),
      });
      return next;
    });
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    contentHeight.value = height;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: animatedHeight.value > 0 ? 1 : 0,
  }));

  const innerContainerStyle: ViewStyle = {
    opacity: isOpen ? 1 : 0,
    position: isOpen ? "relative" : "absolute",
  };

  return {
    isOpen,
    toggle,
    animatedStyle,
    innerContainerStyle,
    onLayout,
  };
}
