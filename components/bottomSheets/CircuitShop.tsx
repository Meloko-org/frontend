import React, { useState } from "react";

import { useSelector } from "react-redux";
import { UserState } from "../../reducers/user";

import circuitTools from "../../modules/circuitTools";
import { NoteData } from "../../types/API";

import ActionSheet, {
  SheetProps,
  ScrollView,
  FlatList,
  SheetManager,
} from "react-native-actions-sheet";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Image, Linking, Platform } from "react-native";
import TextHeading3 from "../utils/texts/Heading3";
import TextBody1 from "../utils/texts/Body1";
import InputTextarea from "../utils/inputs/Textarea";
import ImageUploader from "../utils/ImageUploader";
import Thumbnail from "../utils/Thumbnail";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";
import MainButton from "../utils/buttons/MainButton";
import StarRating from "../utils/StarRating";
import TwoTimesButton from "../utils/buttons/TwoTimes";
import saveImageLocally from "../../helpers/ImageHelpers";

export default function CircuitShop(props: SheetProps<"circuit-shop">) {
  const insets = useSafeAreaInsets();

  const user = useSelector((state: { user: UserState }) => state.user.value);

  const [isNoteSaving, setIsNoteSaving] = useState<boolean>(false);

  const [comment, setComment] = useState<string>();
  const [photo, setPhoto] = useState<string | null>();
  const [rating, setRating] = useState<number | null>(null);

  const [note, setNote] = useState<NoteData>();

  const handlePhotoSelected = (uri: string) => {
    setPhoto(uri);
  };

  const clearNote = () => {
    setPhoto(null);
    setComment("");
    setRating(null);
  };

  const openMaps = (lat: number, lng: number, label?: string) => {
    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
    });

    const latLng = `${lat},${lng}`;
    const appLabel = label ? label : "Destination";

    const url = Platform.select({
      ios: `${scheme}${appLabel}@${latLng}`,
      android: `${scheme}${latLng}(${appLabel})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const handleSaveNote = async () => {
    try {
      setIsNoteSaving(true);
      const params = {
        rating,
        userId: user._id,
        shopId: props.payload?.shop?._id,
        comment,
        source: "touristVisit",
        photo,
      };
      const noteResponse = await circuitTools.addNoteFromCircuit(params);

      if (noteResponse.success) {
        // sauvegarde de l'image
        if (photo) {
          const savedUri = await saveImageLocally(photo, "noteImages/");
          if (!savedUri) {
            console.log("image non sauvegardée.");
          }
        }
        SheetManager.show("alert", {
          payload: {
            message: "Merci",
            alertType: "success",
          },
        });

        clearNote();
        // SheetManager.hide(props.sheetId)
      } else {
        SheetManager.show("alert", {
          payload: {
            message: noteResponse.message!,
            alertType: "error",
          },
        });
      }
      setIsNoteSaving(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ActionSheet
      CustomHeaderComponent={
        <View className="flex rounded-t-lg items-center justify-center h-5 bg-lightbg/30 dark:bg-tertiary">
          <View className="w-10 h-1 rounded-lg bg-darkbg dark:bg-white"></View>
        </View>
      }
      safeAreaInsets={insets}
      snapPoints={[100]}
      initialSnapIndex={0}
      // indicatorStyle={{ backgroundColor: "#262E20" }}
      gestureEnabled={true}
      backgroundInteractionEnabled={false}
      useBottomSafeAreaPadding
      containerStyle={{ paddingBottom: insets.bottom, overflow: "hidden" }}
      enableGesturesInScrollView={true}
      isModal={false}
      keyboardHandlerEnabled={false}
    >
      <View className="bg-lightbg dark:bg-darkbg">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* zone 1 : titre  */}
          <View className="flex flex-row items-center p-3 mb-5">
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
          <View className="px-2 mb-2">
            <View className="rounded-lg p-3 bg-premiumbg/30">
              <TextBody1 centered>Laisser une note :</TextBody1>
              <View className="mt-3 mb-5 items-center">
                {/* inclure ici le système de notation */}

                <StarRating
                  rating={rating ?? 0}
                  onChange={(value) => setRating(value)}
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
                      pickerOptions={{
                        allowsEditing: false,
                        quality: 1,
                      }}
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

              <View className="px-5">
                <ButtonPrimaryEnd
                  label="Valider"
                  iconName="check"
                  onPressFn={handleSaveNote}
                  isLoading={isNoteSaving}
                  disabled={rating === null}
                  extraClasses="h-14 mb-3"
                />
              </View>
            </View>
          </View>

          {/* zone 3 : les boutons */}
          <View className="flex flex-row justify-around px-3 my-5">
            <TwoTimesButton
              label={`Supprimer\ndu circuit`}
              buttonType="top"
              bgColor="bg-danger"
              iconName="trash"
              iconFamily="FontAwesome5Icon"
              iconColor="#ffffff"
              iconSize={28}
              onConfirm={() => {
                SheetManager.hide(props.sheetId, {
                  payload: props.payload?.shop,
                });
              }}
              extraClasses="w-48 h-24"
              textClasses="text-white text-lg/5"
            />
            <MainButton
              buttonType="label-icon-top"
              label={`Aller chez\n ce producteur`}
              iconName="location-arrow"
              iconColor="#ffffff"
              iconFamily="FontAwesome5Icon"
              extraClasses="h-24 w-32"
              onPressFn={() =>
                openMaps(
                  Number(props.payload?.shop?.address.latitude),
                  Number(props.payload?.shop?.address.longitude),
                  props.payload?.shop?.name,
                )
              }
            />
          </View>
        </ScrollView>
      </View>
    </ActionSheet>
  );
}
