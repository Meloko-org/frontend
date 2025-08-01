import React, { JSX, useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { NoteData } from "../../types/API";
import TextBody1 from "../utils/texts/Body1";
import globalTools from "../../modules/globalTools";

type PostChoiceNoticeCardProps = {
  note: NoteData;
  onPress?: () => void;
};

export default function PostChoiceNoticeCard({
  note,
  onPress,
}: PostChoiceNoticeCardProps): JSX.Element {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white dark:bg-tertiary shadow-lg rounded-lg  p-2 mb-2`}
    >
      <View className="flex flex-row items-center w-full">
        <View className="rounded-lg w-1/4">
          <Image
            source={
              note.photo
                ? { uri: note.photo }
                : require("../../assets/images/visite.jpg")
            }
            className="rounded-xl w-20 h-20 mr-3"
            alt={`Illustration de la visite de ${note.user}`}
            resizeMode="stretch"
            width={96}
            height={64}
          />
        </View>

        <View className="w-3/4 pl-3">
          <View className="flex flex-row w-full flex-wrap mb-1">
            <TextBody1 extraClasses="font-bold mb-1">{note.comment}</TextBody1>
          </View>
          <TextBody1 extraClasses="">
            Commentaire du {globalTools.formatDateToFr(note.createdAt)}
          </TextBody1>
          <TextBody1 extraClasses="mb-1">par {note.user.lastname}</TextBody1>
        </View>
      </View>
    </TouchableOpacity>
  );
}
