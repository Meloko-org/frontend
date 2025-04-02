import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useColorScheme } from "nativewind";

type CustomAlertProps = {
  message: string;
  alertType: "success" | "error" | "warning";
  visible: boolean;
  onClose: () => void;
};

const { width, height } = Dimensions.get("window");

export default function CustomAlert({
  message,
  alertType,
  visible,
  onClose,
}: CustomAlertProps): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const screenStyle =
    colorScheme === "light" ? styles.screenLight : styles.screenDark;
  const containerStyle =
    colorScheme === "light" ? styles.containerLight : styles.containerDark;
  const messageStyle =
    colorScheme === "light" ? styles.messageLight : styles.messageDark;
  const textStyle =
    colorScheme === "light" ? styles.textLight : styles.textDark;
  const titleStyle = [styles.titleBar, styles[alertType]];

  console.log("alertType :", alertType);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      pointerEvents="box-none"
    >
      <View style={[styles.overlay, screenStyle]}>
        <View style={containerStyle}>
          <View style={titleStyle}>
            <Text style={styles.title}>{alertType}</Text>
          </View>
          <View style={messageStyle}>
            <Text style={textStyle}>{message}</Text>
          </View>
          <View style={styles.bottomBar}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.btn}
              // className="p-2 bg-secondary rounded-lg self-center"
            >
              <Text style={styles.btnLabel}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  screenLight: {
    backgroundColor: "rgba(252, 255, 240, 0.8)",
  },
  screenDark: {
    backgroundColor: "rgba(38, 46, 32, 0.8)",
  },
  containerLight: {
    borderRadius: 10,
    borderColor: "#98B66E",
    borderWidth: 1,
    backgroundColor: "rgb(252 255 240)",
    width: "80%",
  },
  containerDark: {
    borderRadius: 10,
    borderColor: "#98B66E",
    borderWidth: 1,
    backgroundColor: "rgb(38 46 32)",
    width: "80%",
  },
  titleBar: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    backgroundColor: "#942911",
  },
  warning: {
    backgroundColor: "#D16014",
  },
  success: {
    backgroundColor: "#98B66E",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  messageLight: {
    //backgroundColor: "white",
    padding: 15,
    alignItems: "center",
  },
  messageDark: {
    //backgroundColor: "white",
    padding: 15,
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
  },
  textLight: {
    color: "#000000",
  },
  textDark: {
    color: "#ffffff",
  },
  bottomBar: {
    marginRight: 10,
    marginBottom: 10,
    alignItems: "flex-end",
  },
  btn: {
    backgroundColor: "#98B66E",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnLabel: {
    color: "white",
    fontWeight: "bold",
  },
});
