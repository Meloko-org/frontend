import { useState } from "react";

import { CrewMember } from "../../types/API";
import ImageUploader from "../utils/ImageUploader";

import { View, Image, Text } from "react-native";
import InputText from "../utils/inputs/Text";
import InputTextarea from "../utils/inputs/Textarea";
import IconButton from "../utils/buttons/Icon";

type CrewMemberEditProps = {
  member: CrewMember;
  onChange: (updateMember: CrewMember) => void;
  onDelete: () => void;
  onDataChange: () => void;
  extraClasses?: string;
};

export default function CrewMemberEditCard({
  member,
  onChange,
  onDelete,
  onDataChange,
  extraClasses,
}: CrewMemberEditProps) {
  const [errors, setErrors] = useState({
    forname: false,
    role: false,
  });

  return (
    <View className={`${extraClasses} flex flex-row`}>
      <View className="w-4/5">
        <View className="flex flex-row">
          <View className="w-1/3">
            <ImageUploader
              label="PHOTO"
              size={100}
              defaultUri={member.photo}
              onImageSelected={(uri) => onChange({ ...member, photo: uri })}
            />
          </View>
          <View className="w-2/3 pl-2 flex justify-center">
            <InputText
              label="Prénom"
              placeholder="Saisir le prénom"
              value={member.forname}
              onChangeText={(value: string) => {
                onChange({ ...member, forname: value });
                if (errors.forname && value.trim() !== "") {
                  setErrors((prev) => ({ ...prev, forname: false }));
                }
                onDataChange?.();
              }}
              onBlur={() => {
                console.log("onblur");
                setErrors((prev) => ({
                  ...prev,
                  forname: (member.forname ?? "").trim() === "",
                }));
              }}
              showError={errors.forname}
              extraClasses="w-auto"
            />
          </View>
        </View>

        <View className="mt-2">
          <InputText
            label="Rôle"
            placeholder="Saisir le rôle"
            value={member.role}
            onChangeText={(value: string) => {
              onChange({ ...member, role: value });
              if (errors.role && value.trim() !== "") {
                setErrors((prev) => ({ ...prev, role: false }));
              }
            }}
            onBlur={() => {
              setErrors((prev) => ({
                ...prev,
                role: (member.role ?? "").trim() === "",
              }));
            }}
            showError={errors.role}
            extraClasses="mb-2"
          />
          <InputTextarea
            label="Description"
            placeholder="Saisir la description"
            value={member.description}
            onChangeText={(value: string) =>
              onChange({ ...member, description: value })
            }
            extraClasses="h-32"
          />
        </View>
      </View>
      <View className="w-1/5 flex justify-center pl-1">
        <IconButton
          iconName="trash"
          iconFamily="FontAwesome5Icon"
          iconColor="white"
          buttonColor="bg-danger"
          onPressFn={onDelete}
          extraClasses="h-14"
        />
      </View>
    </View>
  );
}
