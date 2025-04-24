import React, { useEffect, useState } from "react";
import { Pressable, Image, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import { SheetManager } from "react-native-actions-sheet";

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

  useEffect(() => {
    setImageUri(defaultUri ?? null);
  }, [defaultUri]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult) {
      alert("Permission refusée pour accéder à la galerie.");
      return;
    }

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

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      // alert("Permission refusée pour utiliser la caméra.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    console.log(result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onImageSelected?.(uri);
    }
  };

  const handleImageSheet = async () => {
    const whatToDo = await SheetManager.show("image-uploader", {
      payload: {
        message: "Choississez une image ou prenez une photo.",
      },
    });

    if (whatToDo) {
      if (whatToDo === "image") {
        pickImage();
      } else if (whatToDo === "camera") {
        takePhoto();
      }
    }
  };

  return (
    <Pressable
      onPress={handleImageSheet}
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        backgroundColor: "#e5e7eb", // équivalent Tailwind bg-gray-200
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      className="relative"
    >
      {imageUri && (
        <View className="absolute top-0 left-0">
          <Image
            source={{ uri: imageUri }}
            style={{ width: size, height: size }}
            resizeMode="cover"
          />
        </View>
      )}
      <View className="absolute right-0 bottom-0 items-center justify-center p-1">
        <FontAwesome6Icon name="camera" color="#98B66E" size={30} />
      </View>
    </Pressable>
  );
}
