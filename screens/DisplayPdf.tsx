import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import Pdf from "react-native-pdf";
import * as Sharing from "expo-sharing";

// import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";
import type { RouteProp } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import orderTools from "../modules/orderTools";

import Spinner from "../components/utils/Spinner";
import { View } from "react-native";
import PrimaryButton from "../components/utils/buttons/Primary";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/TopBar";
import MainButton from "../components/utils/buttons/MainButton";

type Props = NativeStackScreenProps<RootStackParamList, "DisplayPdf">;

export default function DisplayPdfScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle, id, type, path } = route.params;
  const { getToken } = useAuth();

  const [pdfUri, setPdfUri] = useState<string | null>(null);

  useEffect(() => {
    loadPdf();
  }, []);

  const loadPdf = async () => {
    const token = await getToken();
    const result = await orderTools.getPdfToDisplay(token, id, type, path);

    if (result.success) {
      setPdfUri(result.uri);
    } else {
      alert(result.message);
    }
  };

  if (!pdfUri)
    return (
      <View className="flex-1 w-full h-full items-center justify-center">
        <Spinner />
      </View>
    );

  console.log(pdfUri);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View style={{ flex: 1 }}>
        <TopBar
          onBackPress={() => navigation.goBack()}
          backLabel={backLabel || "Retour au tableau"}
          screen={from || "businessCenter"}
          label={screenTitle || "COMMANDES\nEN ATTENTE"}
          extraClasses="mt-2 mb-5"
        />
      </View>

      <View style={{ flex: 9 }}>
        <View className="flex-1 my-2">
          <View
            style={{
              flex: 1,
              backgroundColor: "#FCFFF0",
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            <Pdf
              source={{ uri: pdfUri }}
              style={{ flex: 1, backgroundColor: "#fff" }}
              trustAllCerts={false}
              onError={(error) => console.log("PDF error", error)}
            />
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }} className="flex flex-row justify-center px-5">
        <View className="">
          <MainButton
            label="Partager"
            buttonType="label-icon-top"
            iconName="file-pdf"
            iconColor="white"
            iconFamily="FontAwesome6Icon"
            bgColor="bg-withdrawn"
            iconSize={25}
            extraClasses="p-2 w-18 mr-2"
            onPressFn={() => Sharing.shareAsync(pdfUri)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
