import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import TextHeading2 from "../../utils/texts/Heading2";
import ButtonBack from "../../utils/buttons/Back";
import TextBody1 from "../../utils/texts/Body1";
import TextBody2 from "../../utils/texts/Body2";
import InputText from "../../utils/inputs/Text";
import ButtonPrimaryEnd from "../../utils/buttons/PrimaryEnd";
import { useColorScheme } from "nativewind";
import SearchMarketsModal from "./SearchMarkets";
import ManageMarketsModal from "./ManageMarkets";

type MarketsModalProps = {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

export default function MarketsModal(props: MarketsModalProps): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const bgStyle = colorScheme === "light" ? styles.light : styles.dark;

  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [isManageModalVisible, setManageModalVisible] = useState(false);

  const onSearchPress = async () => {};

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isVisible}
      onRequestClose={() => {
        props.onCloseFn(!props.isVisible);
      }}
    >
      <SafeAreaView style={bgStyle}>
        <View>
          <ButtonBack onPressFn={() => props.onCloseFn(false)} />
        </View>
        <ScrollView style={styles.scrollContainer}>
          <View>
            <TextHeading2 centered extraClasses="mb-5">
              Places de marché
            </TextHeading2>
            <TextBody1 centered={true} extraClasses="mb-5">
              {`Gérez ici les places de marché\nsur lesquelles vous vendez.`}
            </TextBody1>

            <TextBody1 centered={true} extraClasses="mb-1">
              {`Vous pouvez rechercher et ajouter\ndes places de marché.`}
            </TextBody1>

            <ButtonPrimaryEnd
              label="Rechercher"
              iconName="search"
              extraClasses="my-5"
              onPressFn={() => setSearchModalVisible(true)}
            />

            <TextBody1 centered={true} extraClasses="mb-1">
              {`Ensuite vous pouvez gérer les jours et les horaires pour chaque place de marché`}
            </TextBody1>

            <ButtonPrimaryEnd
              label="Gérer mes places"
              iconName="calendar"
              extraClasses="my-5"
              onPressFn={() => setManageModalVisible(true)}
            />
          </View>

          <SearchMarketsModal
            isVisible={isSearchModalVisible}
            onCloseFn={() => setSearchModalVisible(false)}
          />

          <ManageMarketsModal
            isVisible={isManageModalVisible}
            onCloseFn={() => setManageModalVisible(false)}
          />
        </ScrollView>
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
  scrollContainer: {
    height: "80%",
  },
});
