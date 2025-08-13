import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

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
import CustomButton from "../utils/buttons/Custom";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";
import SecondaryButton from "../utils/buttons/Secondary";
import postTools from "../../modules/postTools";

export default function ProgrammedPostPreview(
  props: SheetProps<"programmed-post-preview">,
) {
  const insets = useSafeAreaInsets();
  const { getToken } = useAuth();

  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = await getToken();
      const postResponse = await postTools.deleteProgrammedPost(
        token,
        props.payload?.post._id,
      );

      setIsDeleting(false);

      SheetManager.hide(props.sheetId, {
        payload: postResponse.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePost = async () => {
    try {
      setIsPosting(true);
      const token = await getToken();

      const postResponse = await postTools.postProgrammedPosts(
        token,
        props.payload?.post!,
      );

      setIsPosting(false);

      console.log("PROGRAMMEDPOSTPREVIEW ", postResponse);

      SheetManager.hide(props.sheetId, {
        payload: postResponse.message,
      });
    } catch (error) {
      console.log(error);
    }
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

          <View className="flex items-center bg-tertiary h-auto pt-5 pb-2">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex items-center">
                <TextHeading3 centered extraClasses="">
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
                  {/* <View>
										<IconButton
											iconName="pen"
											iconFamily="FontAwesome6Icon"
											iconColor="#98B66E"
											onPressFn={handleEditPostText}
											extraClasses="ml-5"
										/>
									</View> */}
                </View>
                <View className="flex flex-row flex-wrap mt-3">
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
          <View className="flex flex-row">
            <View className="w-1/3">
              <CustomButton
                label="Supprimer"
                onPressFn={handleDelete}
                isLoading={isDeleting}
                extraClasses="bg-danger h-14 border rounded-lg "
                textClasses="text-white font-bold text-lg"
              />
            </View>
            <View className="w-2/3 pl-5">
              <ButtonPrimaryEnd
                label="Poster"
                iconName="circle-chevron-right"
                iconFamily="FontAwesome6Icon"
                onPressFn={() => handlePost()}
                isLoading={isPosting}
                extraClasses="h-14"
              />
            </View>
          </View>
        </View>

        <View className="px-3" style={{ flex: 1 }}>
          <SecondaryButton
            label="Fermer la prévisualisation"
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
