import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useSelector, useDispatch } from "react-redux";
import { updateUser, UserState } from "../../reducers/user";

// import ImageView from "react-native-image-viewing"
import { useVideoPlayer, VideoView } from "expo-video";

import { View, Image, Dimensions, Text } from "react-native";
import ActionSheet, {
  SheetProps,
  ScrollView,
  FlatList,
  ActionSheetRef,
} from "react-native-actions-sheet";
import TextHeading3 from "../utils/texts/Heading3";
import IconButton from "../utils/buttons/Icon";
import MainButton from "../utils/buttons/MainButton";
import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import TextHeading2 from "../utils/texts/Heading2";
import TextBody1 from "../utils/texts/Body1";
import TextBody2 from "../utils/texts/Body2";
import StarsNotation from "../utils/StarsNotation";
import CardNote from "../cards/Note";
import CrewMemberCard from "../cards/CrewMember";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThumbnailCarousel from "../utils/ThumbnailCarousel";
import ImageViewerModal from "../modals/user/ImageViewer";
import Spinner from "../utils/Spinner";
import bookmarksTools from "../../modules/bookmarksTools";
import CloseSheetButton from "../utils/buttons/CloseSheet";
import BadgeSecondary from "../utils/badges/Secondary";
import React from "react";
// import globalTools from "../../modules/globalTools";
import { googleMapsDrive } from "../../modules/globalTools";

type ClickCollectInfosData = {
  instructions: string | undefined;
  days: {
    key: number;
    day: number;
    periods: {
      key: string;
      open: string | null;
      close: string | null;
    }[];
  }[];
};

type MarketsInfosData = {
  markets: {
    key: string;
    name: string;
    days: {
      key: number;
      day: number;
      periods: {
        key: string;
        open: string | null;
        close: string | null;
      }[];
    }[];
  }[];
};

export default function ShopDetails(props: SheetProps<"shop-details">) {
  const insets = useSafeAreaInsets();
  const shopSheetRef = useRef<ActionSheetRef>(null);

  const dayLabels = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const dispatch = useDispatch();

  const { signOut, isSignedIn, getToken } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);

  const shop = props.payload?.shop;
  const isPremium = props.payload?.shop?.isPremium;

  const [isViewerVisible, setViewerVisible] = useState<boolean>(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleImagePress = (index: number) => {
    setInitialIndex(index);
    setViewerVisible(true);
  };

  // gestion de la video
  const player = useVideoPlayer(shop!.video[0], (player) => {
    player.staysActiveInBackground = false;
  });

  /* gestion des infos de click & collect */
  const clickCollect = props.payload?.shop?.clickCollect;

  let clickCollectInfos: ClickCollectInfosData | null = null;

  if (clickCollect?.isActive) {
    clickCollectInfos = {
      instructions: clickCollect.instructions,
      days: clickCollect.openingHours.map((o) => ({
        key: o.day,
        day: o.day,
        periods: o.periods.map((p) => ({
          key: p._id,
          open: p.openingTime,
          close: p.closingTime,
        })),
      })),
    };
  }

  /* gestion des infos des markets */
  const markets = props.payload?.shop?.markets;

  const hasMarketActive = props.payload?.shop?.markets.some(
    (m) => m.isActive === true,
  );

  const marketsInfos: MarketsInfosData = {
    markets:
      markets
        ?.filter((m) => m.isActive)
        .map((m) => ({
          key: m.market._id,
          name: m.market.name,
          days: m.openingHours.map((o) => ({
            key: o.day,
            day: o.day,
            periods: o.periods.map((p) => ({
              key: p._id,
              open: p.openingTime,
              close: p.closingTime,
            })),
          })),
        })) ?? [],
  };

  console.log("markets :", marketsInfos);

  const members =
    props.payload?.shop?.crew &&
    props.payload.shop.crew.map((member, i) => {
      // member.photo = localMemberPic[i]
      return <CrewMemberCard key={i} crewMember={member} />;
    });

  const topComments =
    shop &&
    shop.notes
      .filter((n) => n.comment)
      .map((c) => {
        return (
          <View key={c._id}>
            {c && <CardNote note={c} extraClasses="mr-2" />}
          </View>
        );
      });

  useEffect(() => {
    if (
      userStore.bookmarks &&
      userStore.bookmarks.some((bookmark) => bookmark?._id === shop?._id)
    ) {
      setIsBookmarked(true);
    }
  }, [userStore]);

  const handleBookmarkPress = async () => {
    try {
      setIsBookmarking(true);
      const token = await getToken();
      const bookmarkResponse = await bookmarksTools.updateBookmarks(
        token,
        shop?._id,
      );

      if (bookmarkResponse.success) {
        setIsBookmarked(!isBookmarked);
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

  return (
    <ActionSheet
      ref={shopSheetRef}
      safeAreaInsets={insets}
      snapPoints={[100]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      backgroundInteractionEnabled={false}
      containerStyle={{ overflow: "hidden" }}
      initialSnapIndex={0}
      enableGesturesInScrollView={true}
      isModal={false}
    >
      <View className="bg-lightbg dark:bg-darkbg">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex flex-row w-full px-3 mt-3 mb-5">
            <View className="w-[30%]">
              <Image
                source={
                  props.payload?.shop?.logo
                    ? { uri: props.payload?.shop?.logo }
                    : require("../../assets/icon.png")
                }
                className="rounded-lg border border-primary w-24 h-24"
                alt={`photo du point de vente ${props.payload?.shop?.name}`}
                resizeMode="cover"
                width={112}
                height={112}
              />
            </View>
            <View className="w-[60%] flex-row items-center">
              <View className="w-full">
                <View>
                  <TextHeading3 extraClasses="" centered>
                    {props.payload?.shop?.name}
                  </TextHeading3>
                </View>
                <View className="felx flex-row justify-center">
                  {shop?.isPremium && (
                    <FontAwesome5Icon
                      name="crown"
                      size={25}
                      color="#FAA200"
                      className=""
                    />
                  )}
                </View>
              </View>
            </View>
            <View className="w-[10%]">
              <View className="">
                <CloseSheetButton
                  onPressFn={() => {
                    shopSheetRef.current?.hide();
                  }}
                />
              </View>
              <View className="flex-grow items-end justify-end">
                {isSignedIn && (
                  <IconButton
                    iconName={isBookmarked ? "heart" : "heart-o"}
                    iconFamily="FontAwesomeIcon"
                    iconColor="#98B66E"
                    extraClasses="h-10"
                    onPressFn={handleBookmarkPress}
                  />
                )}
              </View>
            </View>
          </View>

          {isPremium && (
            <View className="w-full mb-5">
              {shop!.video[0] && (
                <VideoView
                  player={player}
                  style={{
                    width: Dimensions.get("window").width,
                    height: Dimensions.get("window").width * (9 / 16),
                  }}
                />
              )}

              <View className="w-full mt-3">
                <ThumbnailCarousel
                  images={shop!.photos}
                  onImagePress={handleImagePress}
                  extraClasses="mb-5"
                />
              </View>
            </View>
          )}

          {props.payload?.showButtons && (
            <View className="flex flex-row justify-around px-3 mb-5">
              <MainButton
                buttonType="label-icon-top"
                label={`Voir les\nproduits`}
                iconName="shopping-basket"
                iconFamily="FontAwesome5Icon"
                iconColor="#ffffff"
                buttonBackground={false}
                extraClasses="h-24 w-32"
                onPressFn={() => {}}
              />
              <MainButton
                buttonType="label-icon-top"
                label={`Y aller`}
                iconName="location-arrow"
                iconColor="#ffffff"
                iconFamily="FontAwesome5Icon"
                extraClasses="h-24 w-32"
                onPressFn={() => googleMapsDrive(shop)}
              />
            </View>
          )}

          <View className="px-3 mb-5">
            <TextBody1 centered>{props.payload?.shop?.longDesc}</TextBody1>
          </View>

          <View className="px-3 mb-5">
            <TextBody2 centered>
              {props.payload?.shop?.address.address1}
            </TextBody2>
            {props.payload?.shop?.address.address2 && (
              <TextBody2 centered>
                {props.payload?.shop?.address.address2}
              </TextBody2>
            )}
            <View className="flex flex-row justify-center">
              <TextBody2 centered>
                {String(props.payload?.shop?.address.postalCode)}
              </TextBody2>
              <TextBody2 centered>
                {" "}
                {props.payload?.shop?.address.city}
              </TextBody2>
            </View>
          </View>

          <View className="flex flex-row justify-center">
            <StarsNotation
              iconNames={["star", "star-half", "star-o"]}
              shopData={props.payload?.shop}
              extraClasses="mb-4"
            />
          </View>

          {topComments && (
            <View className="mb-3">
              {/* <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                // contentContainerStyle={styles.contentContainer}
              >
                <View className="p-2 flex flex-row">{topComments}</View>
              </ScrollView> */}

              <View className="px-2">
                <FlatList
                  data={topComments}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${index}`}
                  renderItem={({ item }) => item}
                />
              </View>
            </View>
          )}

          {!isPremium && (
            <View className="flex flex-row items-center rounded-lg w-auto bg-white m-2">
              <Image
                source={
                  shop?.photos[0]
                    ? { uri: shop?.photos[0] }
                    : require("../../assets/icon.png")
                }
                className="rounded-lg border border-primary w-24 h-24"
                alt={`photo du point de vente ${props.payload?.shop?.name}`}
                resizeMode="cover"
                style={{
                  width: "100%",
                  aspectRatio: 16 / 9,
                }}
              />
            </View>
          )}

          <View className="px-3 my-5">
            <TextHeading3 centered extraClasses="mb-5">
              Modes de retrait
            </TextHeading3>

            {/* Click & Collect */}
            {clickCollect?.isActive && (
              <View className="mb-5">
                <BadgeSecondary uppercase extraClasses="mb-2">
                  click & collect
                </BadgeSecondary>
                <TextBody1 centered extraClasses="font-bold mb-1">
                  Jours de retrait
                </TextBody1>
                <View className="flex flex-row justify-center mb-5">
                  <View className="w-64">
                    {clickCollectInfos?.days.map((d) => (
                      <View
                        key={d.key}
                        className="flex flex-row rounded-lg bg-tertiary mb-1"
                      >
                        <View className="w-[40%] flex flex-row items-center justify-center rounded-l-lg bg-primary">
                          <TextBody1 centered>{dayLabels[d.day - 1]}</TextBody1>
                        </View>
                        <View className="w-[60%]">
                          {d.periods.map((p) => {
                            if (p.open) {
                              return (
                                <Text
                                  key={p.key}
                                  className="text-center text-lighbg"
                                >
                                  {p.open} - {p.close}
                                </Text>
                              );
                            } else {
                              return (
                                <Text
                                  key={p.key}
                                  className="text-center text-lighbg"
                                >
                                  Fermé
                                </Text>
                              );
                            }
                          })}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
                <TextBody1 centered extraClasses="font-bold mb-1">
                  Instructions
                </TextBody1>
                <TextBody1 centered>
                  {clickCollectInfos?.instructions}
                </TextBody1>
              </View>
            )}

            {/* Markets */}
            {hasMarketActive && (
              <View className="my-5">
                <BadgeSecondary uppercase extraClasses="mb-2">
                  points de vente
                </BadgeSecondary>
                {marketsInfos &&
                  marketsInfos.markets.map((i) => (
                    <React.Fragment key={i.key}>
                      <TextBody1 centered extraClasses="font-bold mb-1">
                        {i.name}
                      </TextBody1>
                      <View className="flex flex-row justify-center mb-5">
                        <View className="w-64">
                          {i.days.map((d) => (
                            <View
                              key={d.key}
                              className="flex flex-row rounded-lg bg-tertiary mb-1"
                            >
                              <View className="w-[40%] flex flex-row items-center justify-center rounded-l-lg bg-primary">
                                <TextBody1 centered>
                                  {dayLabels[d.day - 1]}
                                </TextBody1>
                              </View>
                              <View className="w-[60%]">
                                {d.periods.map((p) => {
                                  if (p.open) {
                                    return (
                                      <Text
                                        key={p.key}
                                        className="text-center text-lighbg"
                                      >
                                        {p.open} - {p.close}
                                      </Text>
                                    );
                                  } else {
                                    return (
                                      <Text
                                        key={p.key}
                                        className="text-center text-lighbg"
                                      >
                                        Absent
                                      </Text>
                                    );
                                  }
                                })}
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    </React.Fragment>
                  ))}
              </View>
            )}
          </View>

          {isPremium && members !== undefined && members!.length > 0 && (
            <View className="px-3 my-5">
              <TextHeading3 centered extraClasses="text-bold mb-3">
                Notre équipe
              </TextHeading3>
              {members}
            </View>
          )}
        </ScrollView>
      </View>

      <ImageViewerModal
        isVisible={isViewerVisible}
        onClose={() => setViewerVisible(false)}
        images={shop!.photos}
        initialIndex={initialIndex}
      />

      {isBookmarking && (
        <View className="absolute top-0 w-full h-full flex items-center justify-center bg-darkbg/80">
          <Spinner />
        </View>
      )}
    </ActionSheet>
  );
}
