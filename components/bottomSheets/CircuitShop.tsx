import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet, {
  SheetProps,
  ScrollView,
  FlatList,
} from "react-native-actions-sheet";
import React from "react";
import { View, Image, Text } from "react-native";
import StarsNotation from "../utils/StarsNotation";

export default function CircuitShop(props: SheetProps<"circuit-shop">) {
  const insets = useSafeAreaInsets();

  return (
    <ActionSheet
      safeAreaInsets={insets}
      snapPoints={[100]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      backgroundInteractionEnabled={false}
      containerStyle={{ overflow: "hidden" }}
      initialSnapIndex={0}
      enableGesturesInScrollView={true}
      isModal={false}
    >
      <View className="bg-lightbg dark:bg-darkbg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-row items-center w-4/5">
            <View className="flex flex-row items-center rounded-sm w-24 h-full">
              <Image
                source={
                  props.payload?.shop?.logo
                    ? { uri: props.payload?.shop?.logo }
                    : require("../../assets/icon.png")
                }
                className="rounded-lg border border-primary w-24 h-24"
                resizeMode="cover"
                width={96}
                height={64}
              />
            </View>

            <View className="h-full pl-2 items-start">
              <View className="flex flex-row items-center">
                <View className="grow">
                  <Text className="text-lg font-bold text-darkbg dark:text-lightbg">
                    {props.payload?.shop?.name}
                  </Text>
                </View>
              </View>
              {/* <StarsNotation
							iconNames={["star", "star-half", "star-o"]}
							shopData={props.payload?.shop}
							extraClasses="pb-1"
						/> */}
            </View>
          </View>
        </ScrollView>
      </View>
    </ActionSheet>
  );
}
