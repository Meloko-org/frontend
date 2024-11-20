import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { Text, StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextHeading2 from "../components/utils/texts/Heading2";
import producerTools from "../modules/producerTools";

export default function BusinessScreen() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const response = await producerTools.getAllOrders(token);

      if ("message" in response) {
        Alert.alert("Erreur", response.message);
        console.log(response.message);
      } else {
        setOrders(response);
      }
    })();
  }, []);

  // const ordersCards = orders.map((order) =>
  //   return (

  //   )
  // )

  const nbrOrders = orders ? orders.length.toString() : 0;

  console.log(orders);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 p-3"
      >
        <TextHeading2 extraClasses="my-1" centered>
          Ventes en cours ({nbrOrders})
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
