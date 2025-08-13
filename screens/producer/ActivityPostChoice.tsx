import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import { SectionList, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import { ActivityPostData, NoteData } from "../../types/API";
import postTools from "../../modules/postTools";
import TextHeading3 from "../../components/utils/texts/Heading3";
import TextBody1 from "../../components/utils/texts/Body1";
import PostChoiceActivityCard from "../../components/cards/PostChoiceActivity";
import Spinner from "../../components/utils/Spinner";

type ActivityPostChoiceScreenRouteProp = RouteProp<
  RootStackParamList,
  "ActivityPostChoice"
>;

type ActivityPostChoiceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ActivityPostChoice"
>;

type Props = {
  navigation: ActivityPostChoiceScreenNavigationProp;
};

export default function ActivityPostChoiceScreen({ navigation }: Props) {
  const route = useRoute<ActivityPostChoiceScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [groupedActivities, setGroupedActivities] = useState<
    ActivityPostData[]
  >([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchActivities = async (ids: string[]) => {
    setIsFetching(true);
    const token = await getToken();
    const activityResponse = await postTools.getActivities(token, ids);

    if (activityResponse.data) {
      setGroupedActivities(activityResponse.data);
    }
    setIsFetching(false);
  };

  useFocusEffect(
    useCallback(() => {
      const productTypeIds = shopStore?.types.map((type) => type._id);

      if (productTypeIds) {
        fetchActivities(productTypeIds);
      }
    }, [shopStore]),
  );

  return (
    <SafeAreaView
      className="bg-lightbg flex-1 dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au type"}
          screen={from || "PostType"}
          label={screenTitle || "CREER\nUN POST"}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3" style={{ flex: 9 }}>
        {isFetching ? (
          <View className="h-full flex justify-center items-center">
            <Spinner />
          </View>
        ) : (
          <SectionList
            sections={groupedActivities}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <PostChoiceActivityCard
                activity={item}
                onPressFn={() => {
                  navigation.navigate("CreatePost", {
                    from: "ActivityPostChoice",
                    backLabel: "Retour au choix",
                    screenTitle: "CRÉATION\nDU POST",
                    activity: item,
                  });
                }}
                extraClasses="mb-2"
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <TextBody1 centered extraClasses="mb-2">
                {title}
              </TextBody1>
            )}
            renderSectionFooter={() => <View className="h-6" />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
