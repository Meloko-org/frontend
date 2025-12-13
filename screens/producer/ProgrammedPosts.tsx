import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import {
  ProducerTabParamList,
  RootStackParamList,
} from "../../types/Navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";

import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import postTools from "../../modules/postTools";
import { ValidatePostData } from "../../types/API";
import ProgrammedPostCard from "../../components/cards/ProgrammedPost";
import ProgrammedPostPreviewModal from "../../components/modals/producer/ProgrammedPostPreview";
import { SheetManager } from "react-native-actions-sheet";
import Spinner from "../../components/utils/Spinner";

type ProgrammedPostsScreenRouteProp = RouteProp<
  ProducerTabParamList,
  "ProgrammedPosts"
>;

type ProgrammedPostsScreenNavigationProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "ProgrammedPosts"
>;

type Props = {
  navigation: ProgrammedPostsScreenNavigationProp;
};

export default function ProgrammedPostsScreen({ navigation }: Props) {
  const route = useRoute<ProgrammedPostsScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const [isFetching, seetIsFetching] = useState<boolean>(false);
  const [programmedPosts, setProgrammedPosts] = useState<ValidatePostData[]>(
    [],
  );

  const fetchProgrammedPosts = async () => {
    seetIsFetching(true);
    const token = await getToken();
    const postResponse = await postTools.getProgrammedPosts(token);
    if (postResponse.data) {
      setProgrammedPosts(postResponse.data);
    }
    seetIsFetching(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProgrammedPosts();
    }, []),
  );

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
        {isFetching ? (
          <View className="h-full flex justify-center items-center">
            <Spinner />
          </View>
        ) : (
          programmedPosts.map((post) => (
            <ProgrammedPostCard
              key={post._id}
              post={post}
              onPressFn={() => handleBottomSheet(post)}
              extraClasses="mb-2"
            />
          ))
        )}
      </View>
    </SafeAreaView>
  );
}
