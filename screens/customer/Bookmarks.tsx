import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { RouteProp, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserTabParamList } from "../../types/Navigation";

import { useDispatch, useSelector } from "react-redux";
import { Text, StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import CardProducer from "../../components/cards/ProducerSearchResult";
import TextHeading2 from "../../components/utils/texts/Heading2";
import ButtonPrimaryStart from "../../components/utils/buttons/PrimaryStart";
import { ShopData } from "../../types/API";
import { updateUser, UserState } from "../../reducers/user";
import TextHeading3 from "../../components/utils/texts/Heading3";
import { SheetManager } from "react-native-actions-sheet";
import bookmarksTools from "../../modules/bookmarksTools";
import Spinner from "../../components/utils/Spinner";

type BookmarksRouteProp = RouteProp<UserTabParamList, "Bookmarks">;

type BookmarksNavProp = BottomTabNavigationProp<UserTabParamList, "Bookmarks">;

type Props = {
  navigation: BookmarksNavProp;
  route: BookmarksRouteProp;
};

export default function BookmarksScreen({ navigation }: Props) {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );

  const [shops, setShops] = useState<ShopData[]>([]);
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);

  const handleRemoveBookmark = async (shopId: string) => {
    try {
      setIsBookmarking(true);
      const token = await getToken();
      const bookmarkResponse = await bookmarksTools.updateBookmarks(
        token,
        shopId,
      );

      if (bookmarkResponse.success) {
        dispatch(updateUser(bookmarkResponse.data!));
      } else {
        throw new Error(bookmarkResponse.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsBookmarking(false);
    }
  };

  // console.log(
  //   "BOOKMARKS userStore :",
  //   JSON.stringify(userStore?.bookmarks, null, 2),
  // );

  useEffect(() => {
    if (userStore.bookmarks) {
      setShops(userStore.bookmarks);
    } else {
      setShops([]);
    }
  }, [userStore]);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="p-3 flex flex-column h-full mt-2">
        {shops.length > 0 ? (
          <>
            <TextHeading3 centered extraClasses="my-5">
              Vos producteurs favoris
            </TextHeading3>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {shops.map((shop) => (
                <CardProducer
                  key={shop?._id}
                  shopData={shop}
                  extraClasses="mb-2"
                  displayMode="bookmark"
                  showDirectionButton={true}
                  onPressFn={() => {
                    SheetManager.show("shop-details", {
                      payload: {
                        shop: shop,
                        showButtons: true,
                      },
                    });
                  }}
                  onBookmarkPressFn={handleRemoveBookmark}
                />
              ))}
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

      {isBookmarking && (
        <View className="absolute w-full h-full flex items-center justify-center bg-darkbg/80">
          <Spinner />
        </View>
      )}
    </SafeAreaView>
  );
}
