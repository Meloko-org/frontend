import React, { useEffect, useState } from "react";
import { Pressable, Image, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import { SheetManager } from "react-native-actions-sheet";
import TextHeading4 from "./texts/Heading4";

type ImageUploaderProps = {
  label?: string;
  size?: number;
  onImageSelected?: (
    uri: string,
    mediaType: "image" | "video" | "livePhoto" | "pairedVideo" | undefined,
  ) => void;
  defaultUri?: string | null;
  mediaTypes?: ImagePicker.MediaType | ImagePicker.MediaType[];
  message?: string;
  displayImage?: boolean;
  pickerOptions?: ImagePicker.ImagePickerOptions;
};

/** Pour définir les possibilités de l'ImageUploader, jouer sur les mediaTypes
 * ["images"] pour choisir un fichier image
 * ["videos"] pour choisir une video
 * ["livePhotos"] pour prendre une photo
 * ["images", "videos", "livePhotos"] pour les 3 possibilités par exemple
 */

export default function ImageUploader({
  label = "LOGO",
  size = 90,
  onImageSelected,
  defaultUri = null,
  mediaTypes = "images",
  message = "Choisissez une photo",
  displayImage = true,
  pickerOptions = {
    allowsEditing: true,
    aspect: [1, 1], // carré
    quality: 0.8,
  },
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
      mediaTypes,
      ...pickerOptions,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const mediaType = asset.type;

      setImageUri(uri);
      onImageSelected?.(uri, mediaType);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      // alert("Permission refusée pour utiliser la caméra.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      ...pickerOptions,
    });

    console.log("IMAGEUPLOADER:", result);

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const mediaType = asset.type;

      setImageUri(uri);
      onImageSelected?.(uri, mediaType);
    }
  };

  const handleImageSheet = async () => {
    const whatToDo = await SheetManager.show("image-uploader", {
      payload: {
        message: message,
        type: mediaTypes,
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
      {displayImage && imageUri ? (
        <View className="absolute top-0 left-0">
          <Image
            source={{ uri: imageUri }}
            style={{ width: size, height: size }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <TextHeading4 centered>{label}</TextHeading4>
      )}

      <View className="absolute right-0 bottom-0 items-center justify-center p-1">
        <FontAwesome6Icon name="camera" color="#98B66E" size={30} />
      </View>
    </Pressable>
  );
}
