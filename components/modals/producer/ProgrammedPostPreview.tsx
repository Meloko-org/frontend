import { useState } from "react";

import { ValidatePostData } from "../../../types/API";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { Modal, View, Image, StyleSheet } from "react-native";
import TopBar from "../../TopBar";
import CustomButton from "../../utils/buttons/Custom";
import ButtonPrimaryEnd from "../../utils/buttons/PrimaryEnd";
import TextBody1 from "../../utils/texts/Body1";
import NetworkIcon from "../../utils/NetworkIcon";
import TextHeading3 from "../../utils/texts/Heading3";
import IconButton from "../../utils/buttons/Icon";
import TagBadge from "../../utils/badges/Tag";
import { useColorScheme } from "nativewind";

type ProgrammedPostPreviewModalProps = {
  post: ValidatePostData | undefined;
  isVisible: boolean;
  onClose: () => void;
};

export default function ProgrammedPostPreviewModal({
  post,
  isVisible,
  onClose,
}: ProgrammedPostPreviewModalProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const bgStyle = colorScheme === "light" ? styles.light : styles.dark;

  const [isPosting, setIsPosting] = useState<boolean>(false);

  const handlePost = async () => {};

  if (!post) return null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={bgStyle} edges={["right", "left", "top"]}>
        <View className="" style={{ flex: 10 }}>
          <View className="">
            <View className="flex flex-row justify-center mb-2">
              <TextBody1 centered extraClasses="">
                {`Post généré pour le${post?.networks && post?.networks.length > 1 ? "s" : ""} réseau${post?.networks && post?.networks.length > 1 ? "x" : ""}`}
              </TextBody1>
              {post?.networks.map((network) => (
                <NetworkIcon
                  key={network}
                  iconName={network}
                  iconFamily="FontAwesome6Icon"
                  color="#98B66E"
                  extraClasses="ml-2"
                />
              ))}
            </View>

            <View className="flex items-center bg-tertiary h-[430px] pt-5 pb-2">
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex items-center">
                  <TextHeading3 centered extraClasses="">
                    {post?.title}
                  </TextHeading3>
                  <View className="h-64 w-64 mb-2">
                    <Image
                      source={
                        post?.imageUrl
                          ? { uri: post?.imageUrl }
                          : require("../../../assets/icon.png")
                      }
                      className="rounded-lg"
                      alt={`photo du produit ${post?.title}`}
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
                        {post.editedText ? post.editedText : post.generatedText}
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
                    {post?.productTags.map((tag) => (
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
        </View>

        <View className="px-3" style={{ flex: 1 }}>
          <View style={styles.buttonContainer} className="flex flex-row">
            <View style={styles.cancelContainer} className="w-1/3">
              <CustomButton
                label="Annuler"
                onPressFn={onClose}
                extraClasses="bg-danger h-14 border rounded-lg "
                textClasses="text-white font-bold text-lg"
              />
            </View>
            <View style={styles.postContainer} className="w-2/3 pl-5">
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
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dark: {
    flex: 1,
    backgroundColor: "#262E20",
    padding: 10,
  },
  light: {
    flex: 1,
    backgroundColor: "#FCFFF0",
    padding: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
  },
  cancelContainer: {
    width: "33%",
  },
  postContainer: {
    width: "67%",
    paddingLeft: 10,
  },
});
