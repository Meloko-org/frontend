import {
  ActionSheetRef,
  getSheetStack,
  SheetManager,
  Sheets,
} from "react-native-actions-sheet";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export async function showConfirm(
//   message: string,
//   alertType: "info" | "success" | "warning" | "error" = "warning",
// ): Promise<boolean> {
//   await wait(50);

//   return await SheetManager.show("confirm", {
//     payload: {
//       message,
//       alertType,
//     },
//   });
// }

// export async function showAlert(
//   message: string,
//   alertType: "info" | "success" | "warning" | "error" = "warning",
// ): Promise<void> {
//   await wait(50);

//   await SheetManager.show("alert", {
//     payload: {
//       message,
//       alertType,
//     },
//   });
// }

/*  Détail des options:
  sheet: la sheet cible à ouvrir
  payload: les paramètres de la sheet
  onAfter: la fonction à exécuter en cas de returnedValue de la sheet ouverte
  closeBefore: la sheet à fermer avant d'ouvrir la sheet cible
*/
type SheetFlowOptions<TSheet extends keyof Sheets> = {
  sheet: TSheet;
  payload?: Sheets[TSheet]["payload"];
  onAfter?: (result: Sheets[TSheet]["returnedValue"]) => Promise<void>;
  closeBefore?: string;
};

export async function handleSheetFlow<TSheet extends keyof Sheets>(
  options: SheetFlowOptions<TSheet>,
) {
  const { sheet, payload, onAfter, closeBefore = "" } = options;

  let closed = undefined;

  // 🧹 Si une autre sheet doit être fermée avant
  if (closeBefore && closeBefore !== sheet) {
    console.log("🧹 Fermeture demandée pour:", closeBefore);

    // On vérifie si elle est ouverte
    const ref = SheetManager.get(closeBefore);
    if (ref?.current) {
      console.log(`📪 Envoi du signal de fermeture à ${closeBefore}`);
      // On ferme la sheet en envoyant un payload
      closed = SheetManager.hide(closeBefore, { payload: { confirmed: true } });

      console.log(`✅ Fermeture confirmée de ${closeBefore}`);
    }

    // 🕓 Attente de la résolution de la promesse de show() côté fermeture
    // try {
    //   console.log(`⏳ Attente de la fermeture complète de ${closeBefore}`);
    //   await SheetManager.show(closeBefore); // attend la résolution de la précédente promesse
    // } catch (err) {
    //   console.log(`⚠️ Erreur ou fermeture déjà résolue de ${closeBefore}:`, err);
    // }
  }

  console.log("🚀 Ouverture de la nouvelle sheet:", sheet);

  try {
    let result;

    if (closeBefore && closed) {
      console.log("open after closed");
      result = await SheetManager.show(sheet, { payload });
    } else {
      result = await SheetManager.show(sheet, { payload });
    }

    // console.log("🟢 handleSheetFlow: après show (sheet rendue)");

    if (onAfter) {
      await onAfter(result);
    }
  } catch (error) {
    console.log("🔴 handleSheetFlow: erreur dans SheetManager.show:", error);
  }
}

export async function closeIfOpen(id: string) {
  const ref = SheetManager.get(id);
  if (ref?.current) {
    console.log(`🧹 [closeIfOpen] Hiding sheet: ${id}`);
    try {
      SheetManager.hide(id); // attendre la promesse de hide()
      await wait(250);
      console.log(`✅ [closeIfOpen] Sheet ${id} closed`);
    } catch (err) {
      console.log(`⚠️ [closeIfOpen] Error closing ${id}:`, err);
    }
  } else {
    console.log(`ℹ️ [closeIfOpen] No open sheet for id: ${id}`);
  }
}

// export async function closeIfOpen(id: string) {
//   const ref = SheetManager.get(id);
//   if (ref?.current?.hide) {
//     ref.current.hide();
//     await wait(50);
//   }
// }
