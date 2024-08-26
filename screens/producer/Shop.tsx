import { Text, StyleSheet, View, Button } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopProducer"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ShopProducteurScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.texte}>Shop</Text>
      <Button
        title="Create my producer profile"
        onPress={() => navigation.navigate("ProfilProducer")}
      />
    </View>
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
