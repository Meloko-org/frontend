import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

type CustomAlertProps = {
  message: string;
  visible: boolean;
  onClose: () => void;
};

export default function CustomAlert({
  message,
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

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={screenStyle}>
        <View style={containerStyle}>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Erreur</Text>
          </View>
          <View style={messageStyle}>
            <Text>{message}</Text>
          </View>
          <View style={styles.bottomBar}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.btn}
              className="p-2 bg-secondary rounded-lg self-center"
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
  screenLight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(252, 255, 240, 0.2)",
  },
  screenDark: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(38, 46, 32, 0.8)",
  },
  containerLight: {
    borderRadius: 10,
    borderColor: "#98B66E",
    borderWidth: 1,
    //backgroundColor: "rgb(252 255 240)",
    width: "90%",
  },
  containerDark: {
    borderRadius: 10,
    borderColor: "#98B66E",
    borderWidth: 1,
    //backgroundColor: "rgb(38 46 32)",
    backgroundColor: "#98B66E",
    width: "90%",
  },
  titleBar: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(148 41 17)",
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
  bottomBar: {
    marginRight: 10,
    marginBottom: 10,
    alignItems: "flex-end",
  },
  btn: {
    backgroundColor: "rgb(38 46 32)",
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
