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

// type DisplayPdfRouteProp = RouteProp<
//   RootStackParamList,
//   "DisplayPdf"
// >;

// type Props = {
//   route: DisplayPdfRouteProp;
// };

type Props = NativeStackScreenProps<RootStackParamList, "DisplayPdf">;

export default function DisplayPdfScreen({ route }: Props) {
  const { id, type, title } = route.params;
  const { getToken } = useAuth();

  const [pdfUri, setPdfUri] = useState<string | null>(null);

  useEffect(() => {
    loadPdf();
  }, []);

  const loadPdf = async () => {
    const token = await getToken();
    const result = await orderTools.getInvoicePdf(token, id);

    if (result.success) {
      setPdfUri(result.uri);
    } else {
      alert(result.message);
    }
  };

  if (!pdfUri) return <Spinner />;

  return (
    <View style={{ flex: 1 }}>
      <Pdf source={{ uri: pdfUri }} style={{ flex: 1 }} />

      <PrimaryButton
        label="Partager"
        onPressFn={() => Sharing.shareAsync(pdfUri)}
      />
    </View>
  );
}
