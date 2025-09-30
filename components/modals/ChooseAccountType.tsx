import { Modal, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextBody1 from "../utils/texts/Body1";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";
import PrimaryButton from "../utils/buttons/Primary";
import SecondaryButton from "../utils/buttons/Secondary";

type ChooseAccountTypeModalProps = {
  isVisible: boolean;
  onUserPress: () => void;
  onProducerPress: () => void;
};

export default function ChooseAccountTypeModal({
  isVisible,
  onUserPress,
  onProducerPress,
}: ChooseAccountTypeModalProps) {
  return (
    <Modal
      visible={isVisible}
      transparent={false}
      backdropColor={"#262E20"}
      animationType="slide"
    >
      <SafeAreaView
        className="bg-light-bg dark:bg-darkbg relative"
        edges={["right", "left", "top"]}
      >
        <View className="flex justify-center items-center p-3 h-full">
          <View className="p-3">
            <TextBody1 centered extraClasses="mb-5">
              Vous souhaitez utiliser l'application comme :
            </TextBody1>
            <PrimaryButton
              label="Utilisateur"
              onPressFn={onUserPress}
              isLoading={false}
              extraClasses="h-14 my-5"
            />
            <SecondaryButton
              label="Producteur"
              onPressFn={onProducerPress}
              isLoading={false}
              extraClasses="h-14"
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
