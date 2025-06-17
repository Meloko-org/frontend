import React from "react";
import { SheetProvider as ActionsSheetProvider } from "react-native-actions-sheet";

// Important : cela va enregistrer les feuilles globalement !
import "./sheets";

const SheetProvider = ({ children }: { children: React.ReactNode }) => {
  return <ActionsSheetProvider>{children}</ActionsSheetProvider>;
};

export default SheetProvider;
