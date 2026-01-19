import { useAuth } from "@clerk/clerk-expo";
import { OrderDetail } from "../types/API";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/Navigation";

import globalTools from "../modules/globalTools";
import orderTools from "../modules/orderTools";

import { SheetManager } from "react-native-actions-sheet";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { View, Text } from "react-native";
import MainButton from "./utils/buttons/MainButton";

type Props = {
  subOrder: OrderDetail;
  from: string;
  backLabel: string;
  screenTitle?: string;
};

export default function InvoiceSection({
  subOrder,
  from,
  backLabel,
  screenTitle,
}: Props) {
  const { getToken } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const hasInvoice = subOrder.invoice;
  const hasCreditNote = subOrder.creditNotes.length > 0;

  const displayPdf = (
    id: string,
    type: "invoice" | "creditNote",
    path: "invoices" | "creditNotes",
  ) => {
    navigation.navigate("DisplayPdf", {
      from,
      backLabel,
      screenTitle: type === "invoice" ? "FACTURE" : "AVOIR",
      id: id,
      type,
      path,
    });
  };

  const downloadPdf = async (id: string, path: "invoices" | "creditNotes") => {
    const token = await getToken();
    const pdfResponse = await orderTools.getPdfToShare(token, id, path);

    if (!pdfResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: pdfResponse.message,
          alertType: "error",
        },
      });
      return;
    }

    try {
      const filename =
        path === "invoices" ? `facture-${id}.pdf` : `avoir-${id}.pdf`;
      const fileUri = FileSystem.documentDirectory + filename;

      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(",")[1];

        if (!base64Data) return;

        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(fileUri);
      };

      reader.readAsDataURL(pdfResponse.blob);
    } catch (error) {
      console.error(error);
      SheetManager.show("alert", {
        payload: {
          message: "Impossible d’ouvrir le document.",
          alertType: "error",
        },
      });
    }
  };

  return (
    <View className="">
      {hasInvoice && (
        <View className="rounded-lg bg-tertiary/30 dark:bg-tertiary p-2 mb-1">
          <Text className="text-black dark:text-white font-bold text-sm ml-1">
            FACTURE
          </Text>
          <View className="flex flex-row">
            <View className="flex-grow justify-center items-center">
              <Text className="text-black dark:text-white font-bold text-xl">
                {globalTools.formatDateToFr(subOrder.invoice.createdAt)}
              </Text>
            </View>
            <View className="flex flex-row justify-around px-5">
              <MainButton
                label="Partager"
                buttonType="label-icon-top"
                iconName="file-pdf"
                iconColor="white"
                iconFamily="FontAwesome6Icon"
                bgColor="bg-validated"
                iconSize={25}
                extraClasses="p-2 w-18 mr-5"
                onPressFn={() => downloadPdf(subOrder.invoice._id, "invoices")}
              />
              <MainButton
                label="Afficher"
                buttonType="label-icon-top"
                iconName="file-pdf"
                iconColor="white"
                iconFamily="FontAwesome6Icon"
                bgColor="bg-partialValidated"
                iconSize={25}
                extraClasses="p-2 w-18"
                onPressFn={() =>
                  displayPdf(subOrder.invoice._id, "invoice", "invoices")
                }
              />
            </View>
          </View>
        </View>
      )}

      {hasCreditNote && (
        <View className="rounded-lg bg-tertiary/30 dark:bg-tertiary p-2 mb-3">
          <Text className="text-black dark:text-white font-bold text-sm ml-1">
            AVOIRS
          </Text>
          {subOrder.creditNotes.map((cn) => (
            <View key={cn._id} className="flex flex-row">
              <View className="flex-grow justify-center items-center">
                <Text className="text-black dark:text-white font-bold text-xl">
                  {globalTools.formatDateToFr(cn.createdAt)}
                </Text>
              </View>
              <View className="flex flex-row justify-around px-5">
                <MainButton
                  label="Partager"
                  buttonType="label-icon-top"
                  iconName="file-pdf"
                  iconColor="white"
                  iconFamily="FontAwesome6Icon"
                  bgColor="bg-withdrawn"
                  iconSize={25}
                  extraClasses="p-2 w-18 mr-5"
                  onPressFn={() => downloadPdf(cn._id, "creditNotes")}
                />
                <MainButton
                  label="Afficher"
                  buttonType="label-icon-top"
                  iconName="file-pdf"
                  iconColor="white"
                  iconFamily="FontAwesome6Icon"
                  bgColor="bg-partialWithdrawn"
                  iconSize={25}
                  extraClasses="p-2 w-18"
                  onPressFn={() =>
                    displayPdf(cn._id, "creditNote", "creditNotes")
                  }
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
