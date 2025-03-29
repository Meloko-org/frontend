import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

type CustomAlertContentProps = {
  message: string;
  onClose: () => void;
};

export default function CustomAlertContent({
  message,
  onClose,
}: CustomAlertContentProps): JSX.Element {
  return (
    <View className="flex items-center justify-center bg-darkbg/20 dark:bg-lightbg/20 p-5">
      <View className="rounded-lg p-1 bg-lightbg dark: bg-darkbg">
        <View className="bg-danger">
          <Text>Erreur</Text>
        </View>
        <View className="text-base text-center text-black dark:text-white p-3">
          <Text>{message}</Text>
        </View>
        <View className="flex flex-row justify-end items-center p-1">
          <TouchableOpacity
            onPress={onClose}
            className="p-2 bg-secondary rounded-lg self-center"
          >
            <Text className="">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
