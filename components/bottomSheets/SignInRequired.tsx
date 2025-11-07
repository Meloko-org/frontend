import ActionSheet, {
  SheetManager,
  SheetProps,
} from "react-native-actions-sheet";

import { navigationRef } from "../../navigation/navigationRef";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import TextHeading4 from "../utils/texts/Heading4";
import ButtonPrimaryEnd from "../utils/buttons/PrimaryEnd";

export default function SignInRequired(props: SheetProps<"signin-required">) {
  const insets = useSafeAreaInsets();

  const getMessage = () => {
    switch (props.payload?.context) {
      case "profile":
        return "Vous devez vous connecter pour accéder à votre compte.";
      case "bookmarks":
        return "Vous devez vous connecter pour accéder à vos favoris.";
      case "circuit":
        return "Vous devez vous connecter pour accéder au circuit.";
      default:
        return "Vous devez vous connecter pour accéder à votre compte.";
    }
  };

  const hanldeSignInPress = () => {
    SheetManager.hide("signin-required");
    if (navigationRef.isReady()) {
      navigationRef.navigate("SignIn", {
        from: props.payload?.from,
        backLabel: "Retour",
        screenTitle: `CONNEXION\nINSCRIPTION`,
        next: props.payload?.next,
      });
    }
  };

  return (
    <ActionSheet
      indicatorStyle={{ backgroundColor: "#000000" }}
      safeAreaInsets={insets}
      initialSnapIndex={0}
      snapPoints={[30]}
      gestureEnabled={true}
      isModal={false}
      id={props.sheetId}
    >
      <View className="bg-lightbg dark:bg-darkbg h-full">
        <TextHeading4 centered extraClasses="my-5">
          {getMessage()}
        </TextHeading4>
        <View className="px-5">
          <ButtonPrimaryEnd
            label="Connexion"
            iconName="sign-in-alt"
            extraClasses="h-14 mt-5"
            onPressFn={hanldeSignInPress}
          />
        </View>
      </View>
    </ActionSheet>
  );
}
