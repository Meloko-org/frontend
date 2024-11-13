import React from "react";

import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextHeading2 from "../components/utils/texts/Heading2";

export default function BusinessScreen() {
  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 p-3"
      >
        <TextHeading2 extraClasses="my-1" centered>
          Ventes en cours
        </TextHeading2>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texte: {
    textAlign: "center",
    marginTop: "70%",
  },
});
