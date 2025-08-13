import { useCallback, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { ValidatePostData } from "../../types/API";
import postTools from "../../modules/postTools";

import { SafeAreaView } from "react-native-safe-area-context";
import { SheetManager } from "react-native-actions-sheet";

import { View } from "react-native";
import TopBar from "../../components/TopBar";
import ProgrammedPostCard from "../../components/cards/ProgrammedPost";
import Spinner from "../../components/utils/Spinner";

type PostHistoryScreenRouteProp = RouteProp<RootStackParamList, "PostHistory">;

type PostHistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostHistory"
>;

type Props = {
  navigation: PostHistoryScreenNavigationProp;
};

export default function PostHistoryScreen({ navigation }: Props) {
  const route = useRoute<PostHistoryScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const [isFetching, seetIsFetching] = useState<boolean>(false);
  const [posts, setPosts] = useState<ValidatePostData[]>([]);

  const fetchPosts = async () => {
    seetIsFetching(true);
    const token = await getToken();
    const postResponse = await postTools.getPostHistory(token);
    if (postResponse.data) {
      setPosts(postResponse.data);
    }
    seetIsFetching(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, []),
  );

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
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3 pt-5" style={{ flex: 8 }}>
        {isFetching ? (
          <View className="h-full flex justify-center items-center">
            <Spinner />
          </View>
        ) : (
          posts.map((post) => (
            <ProgrammedPostCard
              key={post._id}
              post={post}
              onPressFn={() => {
                console.log("youpi");
                SheetManager.show("published-post", {
                  payload: {
                    post: post,
                  },
                });
              }}
              extraClasses="mb-2"
            />
          ))
        )}
      </View>
    </SafeAreaView>
  );
}
