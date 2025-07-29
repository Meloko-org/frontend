import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import postTools from "../../modules/postTools";
import { ValidatePostData } from "../../types/API";
import ProgrammedPostCard from "../../components/cards/ProgrammedPost";
import ProgrammedPostPreviewModal from "../../components/modals/producer/ProgrammedPostPreview";
import { SheetManager } from "react-native-actions-sheet";

type ProgrammedPostsScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProgrammedPosts"
>;

type ProgrammedPostsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProgrammedPosts"
>;

type Props = {
  navigation: ProgrammedPostsScreenNavigationProp;
};

export default function ProgrammedPostsScreen({ navigation }: Props) {
  const route = useRoute<ProgrammedPostsScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const [programmedPosts, setProgrammedPosts] = useState<ValidatePostData[]>(
    [],
  );

  const fetchProgrammedPosts = async () => {
    const token = await getToken();
    const postResponse = await postTools.getProgrammedPosts(token);
    if (postResponse.data) {
      setProgrammedPosts(postResponse.data);
    }
  };

  useEffect(() => {
    fetchProgrammedPosts();
  }, []);

  const handleBottomSheet = async (post: ValidatePostData) => {
    let message = await SheetManager.show("programmed-post-preview", {
      payload: {
        post: post,
      },
    });

    if (message) {
      fetchProgrammedPosts();

      // petite astuce pour laisser le temps à la première sheet de se fermer propremement
      await new Promise((resolve) => setTimeout(resolve, 10));

      return await SheetManager.show("alert", {
        payload: {
          message: message,
          alertType: "success",
        },
      });
    }
  };

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au premium"}
          screen={from || "PremiumOptions"}
          label={screenTitle || "OPTIONS\nPREMIUM"}
          screenParams={{
            from: "ShopProducer",
            backLabel: "Retour à la boutique",
            screenTitle: "PREMIUM\nOPTIONS",
            programmedPosts: programmedPosts.length.toString(),
          }}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3 pt-5" style={{ flex: 8 }}>
        {programmedPosts.map((post) => (
          <ProgrammedPostCard
            key={post._id}
            post={post}
            onPressFn={() => handleBottomSheet(post)}
            extraClasses="mb-2"
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
