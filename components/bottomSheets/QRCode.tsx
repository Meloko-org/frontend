import { useRef } from "react";
import { View } from "react-native";
import ActionSheet, {
  ActionSheetRef,
  SheetProps,
} from "react-native-actions-sheet";
import CloseSheetButton from "../utils/buttons/CloseSheet";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeSheet(props: SheetProps<"qr-code">) {
  const qrSheetRef = useRef<ActionSheetRef>(null);

  return (
    <ActionSheet
      ref={qrSheetRef}
      snapPoints={[80]}
      indicatorStyle={{ backgroundColor: "#000000" }}
      gestureEnabled={true}
      id={props.sheetId}
    >
      <View className="bg-lightbg dark:bg-darkbg w-full h-full p-5">
        <View style={{ flex: 1 }} className="w-full flex items-end">
          <CloseSheetButton
            onPressFn={() => {
              qrSheetRef.current?.hide();
            }}
          />
        </View>
        <View style={{ flex: 9 }} className="flex items-center justify-start">
          <QRCode value={props.payload?.orderId} size={300} />
        </View>
      </View>
    </ActionSheet>
  );
}
