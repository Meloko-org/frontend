import { useEffect, useState } from "react";

import { ValidatePostData } from "../../types/API";
import globalTools from "../../modules/globalTools";

import { TouchableOpacity, View } from "react-native";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import TextBody2 from "../utils/texts/Body2";
import TextBody1 from "../utils/texts/Body1";

type ProgrammedPostCardProps = {
  post: ValidatePostData;
  onPressFn: () => void;
  extraClasses?: string;
};

export default function ProgrammedPostCard({
  post,
  onPressFn,
  extraClasses,
}: ProgrammedPostCardProps) {
  let postLabel = "";
  let postColor = "";

  switch (post.type) {
    case "product":
      postLabel = "POST PRODUIT";
      postColor = "success";
      break;
    case "review":
      postLabel = "POST AVIS CLIENT";
      postColor = "green";
      break;
    case "product":
      postLabel = "POST ACTIVITÉ";
      postColor = "premium";
      break;

    default:
      break;
  }

  return (
    <TouchableOpacity
      className={`${extraClasses} border rounded-lg bg-lightbg dark:bg-tertiary`}
      onPress={onPressFn}
    >
      <View className={`bg-${postColor} h-8 flex justify-center rounded-t-lg`}>
        <TextBody2 extraClasses="font-bold ml-2">{postLabel}</TextBody2>
      </View>

      <View className="flex flex-row">
        <View className="grow">
          <TextBody1 extraClasses="ml-3 py-2">{post.title}</TextBody1>
          {post.status === "scheduled" && (
            <TextBody2 extraClasses="ml-3 pb-2">
              Programmé le {globalTools.formatDateToFr(post.scheduledFor!)}
            </TextBody2>
          )}
          {post.status === "posted" && (
            <TextBody2 extraClasses="ml-3 pb-2">
              Publié le {globalTools.formatDateToFr(post.publishedAt!)}
            </TextBody2>
          )}
        </View>
        <View className="flex justify-center items-center p-2">
          <FontAwesome6Icon name="angle-right" size={25} color="#98B66E" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
