import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

// import ImageView from "react-native-image-viewing"
import { useVideoPlayer, VideoView } from "expo-video";

import { View, Image, Dimensions } from "react-native";
import ActionSheet, {
  SheetProps,
  ScrollView,
  FlatList,
} from "react-native-actions-sheet";
import TextHeading3 from "../utils/texts/Heading3";
import IconButton from "../utils/buttons/Icon";
import MainButton from "../utils/buttons/MainButton";
import TextHeading2 from "../utils/texts/Heading2";
import TextBody1 from "../utils/texts/Body1";
import TextBody2 from "../utils/texts/Body2";
import StarsNotation from "../utils/StarsNotation";
import CardNote from "../cards/Note";
import CrewMemberCard from "../cards/CrewMember";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThumbnailCarousel from "../utils/ThumbnailCarousel";
import ImageViewerModal from "../modals/user/ImageViewer";

export default function ShopDetails(props: SheetProps<"shop-details">) {
  const insets = useSafeAreaInsets();

  const { signOut, isSignedIn, getToken } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const shop = props.payload?.shop;
  const isPremium = props.payload?.shop?.isPremium;

  // temporaire
  // const localSource = require("../../assets/videos/video1.mp4");

  // gestion de l'image Viewer
  // const [ isImageViewerVisible, setIsImageViewerVisible ] = useState<boolean>(false)
  // const [ currentIndex, setCurrentIndex ] = useState(0)
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

  const handleBookmarkPress = () => {};

  return (
    <ActionSheet
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
          <View className="flex flex-row px-3 mt-2 mb-5">
            <View className="">
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
            <View className="flex flex-grow justify-center">
              <TextHeading2 extraClasses="" centered>
                {props.payload?.shop?.name}
              </TextHeading2>
            </View>
            <View className="flex flex-column justify-center">
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
                onPressFn={() => {}}
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

          {isPremium && members!.length > 0 && (
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
    </ActionSheet>
  );
}
