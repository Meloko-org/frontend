import { useState } from "react";

import ActionSheet, {
  ScrollView,
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Image } from "react-native";

import TextBody1 from "../utils/texts/Body1";
import NetworkIcon from "../utils/NetworkIcon";
import TextHeading3 from "../utils/texts/Heading3";
import TagBadge from "../utils/badges/Tag";
import SecondaryButton from "../utils/buttons/Secondary";
import globalTools from "../../modules/globalTools";

export default function PublishedPost(props: SheetProps<"published-post">) {
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    SheetManager.hide(props.sheetId);
  };

  return (
    <ActionSheet
      indicatorStyle={{ backgroundColor: "#000000" }}
      safeAreaInsets={insets}
      useBottomSafeAreaPadding
      initialSnapIndex={0}
      snapPoints={[100]}
      containerStyle={{ flex: 1 }}
      gestureEnabled={true}
      isModal={false}
      id={props.sheetId}
    >
      <View className="bg-lightbg dark:bg-darkbg h-full">
        <View className="pt-5" style={{ flex: 8 }}>
          <View className="flex flex-row justify-center mb-2">
            <TextBody1 centered extraClasses="">
              {`Post généré pour le${props.payload?.post?.networks && props.payload?.post?.networks.length > 1 ? "s" : ""} réseau${props.payload?.post?.networks && props.payload?.post?.networks.length > 1 ? "x" : ""}`}
            </TextBody1>
            {props.payload?.post?.networks.map((network) => (
              <NetworkIcon
                key={network}
                iconName={network}
                iconFamily="FontAwesome6Icon"
                color="#98B66E"
                extraClasses="ml-2"
              />
            ))}
          </View>

          <TextBody1
            centered
            extraClasses="mb-5"
          >{`Post publié le ${globalTools.formatDateToFr(props.payload?.post.publishedAt)}`}</TextBody1>

          <View className="flex items-center bg-tertiary h-auto py-5">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex items-center">
                <TextHeading3 centered extraClasses="pt-5">
                  {props.payload?.post?.title}
                </TextHeading3>
                <View className="h-64 w-64 mb-2">
                  <Image
                    source={
                      props.payload?.post?.imageUrl
                        ? { uri: props.payload?.post?.imageUrl }
                        : require("../../assets/icon.png")
                    }
                    className="rounded-lg"
                    alt={`photo du produit ${props.payload?.post?.title}`}
                    resizeMode="cover"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>
                <View className="flex flex-row items-center px-2">
                  <View className="flex-grow">
                    <TextBody1 centered extraClasses="text-wrap">
                      {props.payload?.post.editedText
                        ? props.payload?.post.editedText
                        : props.payload?.post.generatedText}
                    </TextBody1>
                  </View>
                </View>
                <View className="flex flex-row flex-wrap mt-3 mb-5">
                  {props.payload?.post?.productTags.map((tag) => (
                    <TagBadge
                      key={tag}
                      extraClasses="px-2 py-1 ml-2"
                      textClasses="font-bold"
                    >
                      {tag}
                    </TagBadge>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        <View className="px-3" style={{ flex: 1 }}>
          <SecondaryButton
            label="Fermer le post"
            onPressFn={() => {
              SheetManager.hide(props.sheetId);
            }}
            extraClasses="h-14"
            textClasses="text-lg"
          />
        </View>
      </View>
    </ActionSheet>
  );
}
