import React, { useState } from "react";
import { Pressable, Image, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";

type ImageUploaderProps = {
  size?: number;
  onImageSelected?: (uri: string) => void;
  defaultUri?: string | null;
};

export default function ImageUploader({
  size = 90,
  onImageSelected,
  defaultUri = null,
}: ImageUploaderProps) {
  const [imageUri, setImageUri] = useState<string | null>(defaultUri);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1], // carré
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onImageSelected?.(uri);
    }
  };

  return (
    <Pressable
      onPress={pickImage}
      className={`relative items-center justify-center rounded-lg bg-gray-200 w-[${size}px] h-[${size}px]`}
    >
      {imageUri && (
        <View className="absolute top-0 left-0">
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
      )}
      <View className="absolute right-0 bottom-0 items-center justify-center p-1">
        <FontAwesome6Icon name="square-plus" color="#98B66E" size={35} />
      </View>
    </Pressable>
  );
}
