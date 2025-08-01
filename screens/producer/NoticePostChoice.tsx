import React, { useCallback } from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import { NoteData } from "../../types/API";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { SectionList, View, Text } from "react-native";
import TopBar from "../../components/TopBar";
import PostChoiceNoticeCard from "../../components/cards/PostChoiceNotice";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import TextBody2 from "../../components/utils/texts/Body2";

type NoticePostChoiceScreenRouteProp = RouteProp<
  RootStackParamList,
  "NoticePostChoice"
>;

type NoticePostChoiceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "NoticePostChoice"
>;

type Props = {
  navigation: NoticePostChoiceScreenNavigationProp;
};

type GroupedNotices = {
  title: string;
  data: NoteData[];
}[];

export default function NoticePostChoiceScreen({ navigation }: Props) {
  const route = useRoute<NoticePostChoiceScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [groupedNotices, setGroupedNotices] = useState<GroupedNotices>([]);

  function groupNoticesByMonth(notices: NoteData[]): GroupedNotices {
    // tri des notices par date décroissante
    const sorted = [...notices].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // regroupement par mois/année
    const groups: { [key: string]: NoteData[] } = {};

    for (const note of sorted) {
      const date = new Date(note.createdAt);
      const key = format(date, "MMMM yyyy", { locale: fr });

      if (!groups[key]) groups[key] = [];
      groups[key].push(note);
    }

    // transformation en tableau ( pour la sectionList)
    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  }

  useFocusEffect(
    useCallback(() => {
      if (shopStore?.notes) {
        const touristNotices = shopStore?.notes.filter(
          (note) => note.source === "touristVisit",
        );
        const grouped = groupNoticesByMonth(touristNotices);
        setGroupedNotices(grouped);
      }
    }, [shopStore?.note]),
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
        <SectionList
          sections={groupedNotices}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PostChoiceNoticeCard
              key={item._id}
              note={item}
              onPress={() => {
                navigation.navigate("CreatePost", {
                  from: "NoticePostChoice",
                  backLabel: "Retour au choix",
                  screenTitle: "CRÉATION\nDU POST",
                  note: item,
                });
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <TextBody2 extraClasses="font-bold px-4 pt-4 pb-1">
              {title}
            </TextBody2>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
