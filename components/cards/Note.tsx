import React, { JSX } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import TextBody1 from "../utils/texts/Body1";
import StarsNotation from "../utils/StarsNotation";
import { NoteData } from "../../types/API";
import { SheetManager } from "react-native-actions-sheet";

type NoteProps = {
  extraClasses: string;
  note: NoteData;
};

export default function CardNote({
  note,
  extraClasses,
}: NoteProps): JSX.Element {
  return (
    <TouchableOpacity
      className={`${extraClasses} flex justify-center items-center rounded-lg p-2 shadow-sm bg-gray-100 w-[200px] h-[100px] dark:bg-tertiary`}
      onPress={() => {
        SheetManager.show("note", {
          payload: {
            note: note,
          },
        });
      }}
    >
      <TextBody1 extraClasses="italic font-bold mb-1">{`"${note.comment}"`}</TextBody1>
      <StarsNotation
        iconNames={["star", "star-half", "star-o"]}
        note={Number(note.note)}
        extraClasses="pb-1"
      />
      <View className=" flex flex-row justify-end w-full">
        <TextBody1>{note.user.lastname} </TextBody1>

        <TextBody1>
          (
          {
            note.user.addresses?.find((adr) => adr.isDefault === true)?.address
              .postalCode
          }
          )
        </TextBody1>
      </View>
    </TouchableOpacity>
  );
}
