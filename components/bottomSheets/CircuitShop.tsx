import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionSheet, {
  SheetProps,
  ScrollView,
  FlatList,
} from "react-native-actions-sheet";
import React, { useState } from "react";
import { View, Image, Text, Pressable } from "react-native";
import StarsNotation from "../utils/StarsNotation";
import TextHeading3 from "../utils/texts/Heading3";
import TextBody1 from "../utils/texts/Body1";
import InputTextarea from "../utils/inputs/Textarea";
import ImageUploader from "../utils/ImageUploader";
import Thumbnail from "../utils/Thumbnail";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";
import MainButton from "../utils/buttons/MainButton";
import StarRating from "../utils/StarRating";

export default function CircuitShop(props: SheetProps<"circuit-shop">) {
  const insets = useSafeAreaInsets();

  const [comment, setComment] = useState<string>();
  const [photo, setPhoto] = useState<string | null>();

  const [note, setNote] = useState<number | null>(null);

  const handlePhotoSelected = (uri: string) => {
    setPhoto(uri);
  };

  return (
    <ActionSheet
      safeAreaInsets={insets}
      snapPoints={[100]}
      indicatorStyle={{ backgroundColor: "#262E20" }}
      gestureEnabled={true}
      backgroundInteractionEnabled={false}
      containerStyle={{ overflow: "hidden" }}
      initialSnapIndex={0}
      enableGesturesInScrollView={true}
      isModal={false}
    >
      <View className="bg-lightbg dark:bg-darkbg pb-5">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* zone 1 : titre  */}
          <View className="flex flex-row items-center p-3">
            <View className="">
              <Image
                source={
                  props.payload?.shop?.logo
                    ? { uri: props.payload?.shop?.logo }
                    : require("../../assets/icon.png")
                }
                className="rounded-lg border border-primary w-24 h-24"
                resizeMode="cover"
                width={96}
                height={64}
              />
            </View>

            <View className="h-full pl-2 items-start flex-shrink">
              <TextHeading3 extraClasses="text-lg font-bold">
                {props.payload?.shop?.name}
              </TextHeading3>
              <TextBody1>{props.payload?.shop?.shortDesc}</TextBody1>
            </View>
          </View>

          {/* zone 2 : notation */}
          <View className="p-3">
            <TextBody1 centered>Laisser une note :</TextBody1>
            <View className="mt-3 mb-5 items-center">
              {/* inclure ici le système de notation */}

              <StarRating
                rating={note ?? 0}
                onChange={(value) => setNote(value)}
              />
            </View>
            <InputTextarea
              placeholder="Laisser un commentaire"
              label="Commentaire"
              value={comment}
              onChangeText={(value: string) => setComment(value)}
              numberOfLines={3}
              extraClasses="mb-5"
            />
            <View className="flex mb-3">
              <View className="flex flex-row items-center ">
                <View className="w-1/4">
                  <ImageUploader
                    label="PHOTO"
                    onImageSelected={handlePhotoSelected}
                    mediaTypes={["images", "livePhotos"]}
                    message={`Ajoutez une photo.`}
                    displayImage={false}
                  />
                </View>
                <View className="pl-3 w-3/4">
                  {photo && (
                    <Thumbnail
                      source={photo!}
                      style={{ width: "100%", aspectRatio: 16 / 9 }}
                      extraClasses="flex flex-row items-center rounded-lg w-auto bg-white"
                      onDelete={(uri: string) => {
                        setPhoto(null);
                        // setHasChanges(true);
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>

          <View className="px-5">
            <ButtonPrimaryEnd
              label="Valider"
              iconName="check"
              onPressFn={() => {}}
              extraClasses="h-14 mb-5"
            />
          </View>

          {/* zone 3 : les boutons */}
          <View className="flex flex-row justify-around px-3 my-5">
            <MainButton
              buttonType="label-icon-top"
              label={`Supprimer\ndu circuit`}
              iconName="trash"
              iconFamily="FontAwesome5Icon"
              iconColor="#ffffff"
              buttonBackground={false}
              extraClasses="h-24 w-48"
              onPressFn={() => {}}
            />
            <MainButton
              buttonType="label-icon-top"
              label={`Aller chez\n ce producteur`}
              iconName="location-arrow"
              iconColor="#ffffff"
              iconFamily="FontAwesome5Icon"
              extraClasses="h-24 w-32"
              onPressFn={() => {}}
            />
          </View>
        </ScrollView>
      </View>
    </ActionSheet>
  );
}
