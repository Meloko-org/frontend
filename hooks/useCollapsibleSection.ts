import { useState } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useAnimatedRef,
  measure,
  runOnUI,
} from "react-native-reanimated";

export function useCollapsibleSection(duration: number = 300) {
  const [isOpen, setIsOpen] = useState(false);
  const contentHeight = useSharedValue(0);
  const animatedHeight = useSharedValue(0);
  const [lastLayoutHeight, setLastLayoutHeight] = useState(0);

  const animate = (open: boolean) => {
    animatedHeight.value = withTiming(open ? contentHeight.value : 0, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  };

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    animate(next);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    contentHeight.value = height;
    setLastLayoutHeight(height);
  };

  const refresh = () => {
    if (lastLayoutHeight > 0) {
      contentHeight.value = lastLayoutHeight;
      if (isOpen) {
        animate(true); // relance l'animation vers la nouvelle hauteur
      }
    }
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
    refresh,
  };
}
