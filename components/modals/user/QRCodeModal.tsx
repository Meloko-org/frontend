import React from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import TextBody1 from "../../utils/texts/Body1";
import BackLabelButton from "../../utils/buttons/BackLabel";

type QRCodeModalProps = {
  visible: boolean;
  onClose: () => void;
  id: string | null | undefined;
};

export default function QRCodeModal({
  visible,
  onClose,
  id,
}: QRCodeModalProps): JSX.Element {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.bgStyle}>
        <View style={styles.navBar}>
          <BackLabelButton onPressFn={onClose} extraClasses="ml-5">
            Retour au détail
          </BackLabelButton>
        </View>

        <View style={styles.container}>
          <View style={styles.qrContainer}>
            {/* <Text className="text-secondary mb-5">QR code</Text> */}
            <QRCode value={id} size={300} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    marginBottom: 20,
  },
  bgStyle: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "rgb(0 0 0)",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qrContainer: {
    backgroundColor: "white",
    padding: 15,
    // marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});
