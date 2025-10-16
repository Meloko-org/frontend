import React from "react";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { useDispatch, useSelector } from "react-redux";
import { Text, StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import CardProducer from "../../components/cards/ProducerSearchResult";
import TextHeading2 from "../../components/utils/texts/Heading2";
import ButtonPrimaryStart from "../../components/utils/buttons/PrimaryStart";
import { ShopData } from "../../types/API";
import { UserState } from "../../reducers/user";
import TextHeading3 from "../../components/utils/texts/Heading3";
import { SheetManager } from "react-native-actions-sheet";

type BookmarksRouteProp = RouteProp<UserTabParamList, "Bookmarks">;

type BookmarksNavProp = BottomTabNavigationProp<UserTabParamList, "Bookmarks">;

type Props = {
  navigation: BookmarksNavProp;
  route: BookmarksRouteProp;
};

export default function BookmarksScreen({ navigation }: Props) {
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );

  console.log(
    "BOOKMARKS userStore :",
    JSON.stringify(userStore?.bookmarks, null, 2),
  );

  const producersList =
    userStore && userStore.bookmarks
      ? userStore.bookmarks.map((sr: ShopData) => {
          return (
            <CardProducer
              key={sr?._id}
              shopData={sr}
              extraClasses="mb-2"
              displayMode="bookmark"
              showDirectionButton={true}
              onPressFn={() => {
                SheetManager.show("shop-details", {
                  payload: {
                    shop: sr,
                    showButtons: true,
                  },
                });
              }}
            />
          );
        })
      : [];

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="p-3 flex flex-column h-full mt-2">
        {producersList.length > 0 ? (
          <>
            <TextHeading3 centered extraClasses="my-5">
              Vos producteurs favoris
            </TextHeading3>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {producersList}
            </ScrollView>
          </>
        ) : (
          <View className="h-full justify-center items-center px-3">
            <TextHeading3 centered extraClasses="mb-4 px-4">
              Vous n'avez pas de favoris :(
            </TextHeading3>
            <ButtonPrimaryStart
              label="Trouver un producteur"
              iconName="arrow-left"
              onPressFn={() => navigation.navigate("MapCustomer")}
              extraClasses="w-full h-14"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
