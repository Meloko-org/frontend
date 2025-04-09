import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import CustomAlert from "./CustomAlert";

registerSheet("alert", CustomAlert);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module "react-native-actions-sheet" {
  interface Sheets {
    alert: SheetDefinition<{
      payload: {
        message: string;
        alertType: "success" | "error" | "warning";
      };
    }>;
  }
}

export {};
