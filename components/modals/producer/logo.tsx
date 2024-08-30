import React, { useState } from "react";
import { SafeAreaView, View, Modal, StyleSheet } from "react-native";
import TextHeading2 from "../../utils/texts/Heading2";
import ButtonBack from "../../utils/buttons/Back";
import InputText from "../../utils/inputs/Text";
import ButtonPrimaryEnd from "../../utils/buttons/PrimaryEnd";
import { useColorScheme } from "nativewind";

type LogoModalProps = {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

export default function LogoModal(props: LogoModalProps): JSX.Element {
  const [logoFile, setLogoFile] = useState();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const bgStyle = colorScheme === "light" ? styles.light : styles.dark;

  const handleSelectFile = () => {};

  const handleUploadFile = () => {
    /* créer fonction d'upload du fichier */
    props.onCloseFn(!props.isVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isVisible}
      onRequestClose={() => {
        props.onCloseFn(!props.isVisible);
      }}
    >
      <SafeAreaView
        style={bgStyle}
        className="flex-1 bg-lightbg dark:bg-darkbg items-center"
      >
        <View className="flex-1 justify-start p-3 w-full">
          <ButtonBack onPressFn={() => props.onCloseFn(false)} />
          <TextHeading2 centered extraClasses="mb-5">
            Modifier le logo
          </TextHeading2>
          <InputText
            value={logoFile}
            onChangeText={(value: string) => setLogoFile(logoFile)}
            placeholder="Sélectionnez un fichier"
            label="Logo de la boutique"
            autoCapitalize="none"
            extraClasses="w-full mb-5"
            size="large"
            iconName="search"
            onIconPressFn={handleSelectFile}
          />
          <ButtonPrimaryEnd
            label="Sauvegarder"
            iconName="upload"
            onPressFn={handleUploadFile}
            isLoading={false}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

/* impossible d'appliquer du styling avec la propriété className et des classes tailwind,
		obligé de créer des styles pour styliser en fonction du dark mode
 */
const styles = StyleSheet.create({
  dark: {
    flex: 1,
    backgroundColor: "#262E20",
    padding: 10,
  },
  light: {
    flex: 1,
    backgroundColor: "#FCFFF0",
    padding: 10,
  },
});
