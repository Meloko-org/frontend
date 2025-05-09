import {
  ActionSheetRef,
  getSheetStack,
  SheetManager,
  Sheets,
} from "react-native-actions-sheet";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function showConfirm(
  message: string,
  alertType: "info" | "success" | "warning" | "error" = "warning",
): Promise<boolean> {
  await wait(50);

  return await SheetManager.show("confirm", {
    payload: {
      message,
      alertType,
    },
  });
}

export async function showAlert(
  message: string,
  alertType: "info" | "success" | "warning" | "error" = "warning",
): Promise<void> {
  await wait(50);

  await SheetManager.show("alert", {
    payload: {
      message,
      alertType,
    },
  });
}

type SheetFlowOptions<TSheet extends keyof Sheets> = {
  sheet: TSheet;
  payload?: Sheets[TSheet]["payload"];
  onAfter?: (result: Sheets[TSheet]["returnedValue"]) => Promise<void>;
};

export async function handleSheetFlow<TSheet extends keyof Sheets>(
  options: SheetFlowOptions<TSheet>,
) {
  await closeIfOpen("map-shop-results");
  await closeIfOpen("map-market-results");

  await wait(200);

  // Ouvrir la nouvelle
  const result = await SheetManager.show(options.sheet, {
    payload: options.payload,
  });

  if (options.onAfter) {
    await options.onAfter(result);
  }
}

export async function closeIfOpen(id: string) {
  const ref = SheetManager.get(id);
  if (ref?.current?.hide) {
    await ref.current.hide();
    await wait(50);
  }
}
