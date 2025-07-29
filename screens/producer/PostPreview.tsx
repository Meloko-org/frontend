import React, { useCallback } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import TopBar from "../../components/TopBar";
import postTools from "../../modules/postTools";
import Spinner from "../../components/utils/Spinner";
import { SheetManager } from "react-native-actions-sheet";
import { GeneratedPostData } from "../../types/API";
import TextHeading3 from "../../components/utils/texts/Heading3";
import TextBody1 from "../../components/utils/texts/Body1";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import CustomButton from "../../components/utils/buttons/Custom";
import ButtonSecondaryEnd from "../../components/utils/buttons/SecondaryEnd";
import TagBadge from "../../components/utils/badges/Tag";
import NetworkIcon from "../../components/utils/NetworkIcon";
import InputText from "../../components/utils/inputs/Text";
import IconButton from "../../components/utils/buttons/Icon";

type PostPreviewScreenRouteProp = RouteProp<RootStackParamList, "PostPreview">;

type PostPreviewScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostPreview"
>;

type Props = {
  navigation: PostPreviewScreenNavigationProp;
};

export default function PostPreviewScreen({ navigation }: Props) {
  const route = useRoute<PostPreviewScreenRouteProp>();
  const {
    from,
    backLabel,
    screenTitle,
    shopCategoriesWithFamilies,
    stock,
    productTags,
    theme,
    networks,
  } = route.params || {};

  const { getToken } = useAuth();
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPostData>();
  const [postText, setPostText] = useState<string>();
  const [postType, setPostType] = useState<string>();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const [isProgramming, setIsProgramming] = useState<boolean>(false);

  const fetchGeneratedPost = async () => {
    const token = await getToken();
    const values = {
      stockId: stock._id,
      selectedThemeId: theme?._id,
      productTags,
      networks,
    };

    const postResponse = await postTools.generatePost(token, values);

    if (!postResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: postResponse.message!,
          alertType: "error",
        },
      });
    }

    if (postResponse.success) {
      setGeneratedPost(postResponse.data!);
      setPostText(postResponse.data?.generatedText);
    }

    setIsGenerating(false);
  };

  useFocusEffect(
    useCallback(() => {
      // réinitialise les states
      setGeneratedPost(undefined);
      setPostText(undefined);

      fetchGeneratedPost();

      if (stock) setPostType("product");
    }, [stock]),
  );

  const handleEditPostText = async () => {
    const canModifyText = await SheetManager.show("edit-post-text", {
      payload: {
        text: postText!,
      },
    });

    if (canModifyText !== "") {
      setPostText(canModifyText);
    }
  };

  const handlePost = async (isScheduled: boolean) => {
    try {
      if (isScheduled) {
        setIsProgramming(true);
      } else {
        setIsPosting(true);
      }

      const token = await getToken();

      const values = {
        stockId: stock._id,
        title: generatedPost?.title!,
        type: postType!,
        imageUrl: generatedPost?.imageUrl!,
        generatedText: generatedPost?.generatedText!,
        editedText: postText!,
        productTags: generatedPost?.productTags!,
        globalTags: generatedPost?.globalTags!,
        globalMentions: generatedPost?.globalMentions!,
        networks: generatedPost?.networks!,
        isScheduled,
        generatedId: generatedPost?._id!,
      };

      const postResponse = await postTools.validatePost(token, values);

      if (isScheduled) {
        setIsProgramming(false);
      } else {
        setIsPosting(false);
      }

      if (postResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: postResponse.message,
            alertType: "success",
          },
        });

        navigation.navigate("ShopProducer");
      } else {
        SheetManager.show("alert", {
          payload: {
            message: postResponse.message,
            alertType: "error",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour création"}
          screen={from || "CreatePost"}
          label={screenTitle || "PREVISUALISATION\nDU POST"}
          screenParams={{
            from: "ProductPostChoice",
            backLabel: "Retour au choix",
            screenTitle: "CRÉATION\nDU POST",
            shopCategoriesWithFamilies,
            stock,
          }}
          extraClasses="mt-2"
        />
      </View>

      <View className="" style={{ flex: 8 }}>
        {isGenerating ? (
          <Spinner />
        ) : (
          <View className="">
            <View className="flex flex-row justify-center mb-2">
              <TextBody1 centered extraClasses="">
                {`Post généré pour le${generatedPost?.networks && generatedPost?.networks.length > 1 ? "s" : ""} réseau${generatedPost?.networks && generatedPost?.networks.length > 1 ? "x" : ""}`}
              </TextBody1>
              {generatedPost?.networks.map((network) => (
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
                    {generatedPost?.title}
                  </TextHeading3>
                  <View className="h-64 w-64 mb-2">
                    <Image
                      source={
                        generatedPost?.imageUrl
                          ? { uri: generatedPost?.imageUrl }
                          : require("../../assets/icon.png")
                      }
                      className="rounded-lg"
                      alt={`photo du produit ${generatedPost?.title}`}
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
                        {postText}
                      </TextBody1>
                    </View>
                    <View>
                      <IconButton
                        iconName="pen"
                        iconFamily="FontAwesome6Icon"
                        iconColor="#98B66E"
                        onPressFn={handleEditPostText}
                        extraClasses="ml-5"
                      />
                    </View>
                  </View>
                  <View className="flex flex-row flex-wrap mt-3">
                    {generatedPost?.productTags.map((tag) => (
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
        )}
      </View>

      <View className="px-5" style={{ flex: 2 }}>
        <TextBody1 centered extraClasses="mb-2">
          {`Si vous le souhaitez, vous pouvez laisser l'IA choisir le meilleur moment pour poster.`}
        </TextBody1>
        <ButtonSecondaryEnd
          label="Programmer le post"
          iconName="calendar-days"
          iconFamily="FontAwesome6Icon"
          onPressFn={() => handlePost(true)}
          isLoading={isProgramming}
        />
      </View>

      <View className="px-3" style={{ flex: 1 }}>
        <View className="flex flex-row">
          <View className="w-1/3">
            <CustomButton
              label="Annuler"
              onPressFn={() => {
                navigation.navigate("PremiumOptions", {
                  from: "ShopProducer",
                  backLabel: "retour à la boutique",
                  screenTitle: "OPTIONS\nPremium",
                });
              }}
              extraClasses="bg-danger h-14 border rounded-lg "
              textClasses="text-white font-bold text-lg"
            />
          </View>
          <View className="w-2/3 pl-5">
            <ButtonPrimaryEnd
              label="Poster"
              iconName="circle-chevron-right"
              iconFamily="FontAwesome6Icon"
              onPressFn={() => handlePost(false)}
              isLoading={isPosting}
              extraClasses="h-14"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
