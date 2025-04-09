import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import CustomAlert from "../components/bottomSheets/CustomAlert";

type ModalContextType = {
  setAlertMessage: (
    message: string,
    type?: "success" | "error" | "warning",
  ) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [alertMessage, setAlertMessageState] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | "warning">(
    "success",
  );

  const setAlertMessage = (
    message: string | null,
    type: "success" | "error" | "warning" = "success",
  ) => {
    setAlertMessageState(message);
    setAlertType(type); // 🔥 Correction : mise à jour du type !
  };

  return (
    <ModalContext.Provider value={{ setAlertMessage }}>
      {children}

      {/* Affichage automatique de la modal si un message est défini */}
      {alertMessage && (
        <CustomAlert
          visible={!!alertMessage}
          message={alertMessage}
          alertType={alertType}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
