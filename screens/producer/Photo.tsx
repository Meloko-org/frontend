import React from "react";
import { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";

/* Eléments graphiques */
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import TextHeading3 from "../../components/utils/texts/Heading3";
import Text from "../../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
const FontAwesome = _Fontawesome as React.ElementType;

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PhotoShopProducer"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function PhotoShopProducerScreen({ navigation }: Props) {
  const [photoFile, setPhotoFile] = useState();

  const handleSelectFile = () => {};

  const handleUploadFile = () => {};

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg p-3 mt-5">
      <View className="mt-5 ml-5">
        <TouchableOpacity
          onPress={() => navigation.navigate("ShopProducer")}
          className="flex-none"
        >
          <FontAwesome name="arrow-left" size={25} color="#98B66E" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center">
        <TextHeading3 centered extraClasses="mb-5">
          Ajouter une photo
        </TextHeading3>
        <Text
          value={photoFile}
          onChangeText={(value: string) => setPhotoFile(value)}
          placeholder="Sélectionnez un fichier"
          label="Photo"
          autoCapitalize="none"
          extraClasses="w-full mb-5"
          size="large"
          iconName="search"
          onIconPressFn={handleSelectFile}
        />
        <ButtonPrimaryEnd
          label="Télécharger"
          iconName="upload"
          onPressFn={handleUploadFile}
          isLoading={false}
        />
      </View>
    </SafeAreaView>
  );
}
