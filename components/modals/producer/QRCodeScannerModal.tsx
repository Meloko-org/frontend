import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { BarcodeScanningResult } from "expo-camera";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import TextHeading3 from "../../utils/texts/Heading3";
import Spinner from "../../utils/Spinner";
import CustomButton from "../../utils/buttons/Custom";
import TextBody1 from "../../utils/texts/Body1";

type QRCodeScannerModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onScan: (orderId: string) => void;
};

export default function QRCodeScannerModal({
  isVisible,
  onClose,
  onScan,
}: QRCodeScannerModalProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <Spinner />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    if (isVisible === true) {
      return (
        <View style={styles.alertContainer}>
          <TextBody1 extraClasses="mb-3">
            Autorisez-vous l'utilisation de la caméra ?
          </TextBody1>
          <CustomButton
            label="Autoriser caméra"
            onPressFn={requestPermission}
            extraClasses="rounded-lg bg-secondary p-2 mb-2 w-[200px]"
            textClasses="text-white font-font"
          />
          <CustomButton
            label="Annuler"
            onPressFn={onClose}
            extraClasses="rounded-lg bg-danger p-2 w-[200px]"
            textClasses="text-white font-font"
          />
        </View>
      );
    }
  }

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    onScan(result.data);
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text>Scannez un QR Code</Text>

        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          style={{ width: "100%", height: "80%" }}
        />
        <View className="flex flex-row justify-center w-full bg-warning">
          <CustomButton
            extraClasses="bg-danger rounded-lg mt-5 p-2 w-[200px]"
            textClasses="text-white font-bold"
            label="Annuler"
            onPressFn={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    flex: 1,
    backgroundColor: "rgba(0 0 0 / 0.9)",
    position: "absolute",
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
