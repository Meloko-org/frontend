import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useDispatch } from "react-redux";
import { setShopData } from "../reducers/shop";
import { setProducerData } from "../reducers/producer";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";

import { SheetManager } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

import ButtonSecondaryStart from "../components/utils/buttons/SecondaryStart";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import TextBody1 from "../components/utils/texts/Body1";
import typesTools from "../modules/typesTools";
import SwitchInput from "../components/utils/inputs/Switch";
import Spinner from "../components/utils/Spinner";
import onboardingTools from "../modules/onboardingTools";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding3">;

export default function Onboarding3Screen({ navigation }: Props) {
  // pour permettre l'utlisation des classes tailwind sur l'icone
  const IconComponent = FontAwesome5Icon;

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [typesLoading, setTypesLoading] = useState<boolean>(false);
  const [globalTypes, setGlobalTypes] = useState([]);
  const [shopTypes, setShopTypes] = useState<string[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setTypesLoading(true);
    (async () => {
      const token = await getToken();
      const typeResponse = await typesTools.getTypes(token);
      setGlobalTypes(typeResponse);
    })();
    setTypesLoading(false);
  }, []);

  // Créer des switch en fonction des types de shop
  const typesList = globalTypes.map((item: { _id: string; name: string }) => {
    return (
      <SwitchInput
        key={item!._id}
        thumbColor="#215487"
        label={item!.name}
        value={shopTypes.includes(item._id)}
        onValueChange={(isSelected) => handleSwitchType(item._id)}
        extraClasses="px-5 mb-2"
      />
    );
  });

  const handleSwitchType = (typeId: string) => {
    setShopTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId],
    );
    setError(false);
  };

  const handleNext = async () => {
    if (shopTypes.length === 0) {
      setError(true);
      return;
    }

    const token = await getToken();

    setIsLoading(true);

    const onboardingResponse = await onboardingTools.onboarding3(
      token,
      shopTypes,
    );

    if (!onboardingResponse.success) {
      SheetManager.show("alert", {
        payload: {
          message: onboardingResponse.message!,
          alertType: "error",
        },
      });
      setIsLoading(false);
      return;
    } else {
      dispatch(setShopData(onboardingResponse.data?.shop!));
      dispatch(setProducerData(onboardingResponse.data?.producer!));
      setIsLoading(false);
      navigation.navigate("Onboarding4");
    }
  };

  console.log(shopTypes);

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg px-3"
      edges={["right", "left", "top"]}
    >
      <View
        style={{ flex: 10 }}
        className="flex-row items-center justify-center px-2"
      >
        <View className="">
          <TextBody1
            centered
            extraClasses="text-lg mb-5"
          >{`Que vendrez vous\ndans votre boutique ?`}</TextBody1>

          {typesLoading ? (
            <Spinner />
          ) : (
            <View className={`${error && "border-2 border-danger"}  py-5`}>
              {typesList}
            </View>
          )}
        </View>
      </View>

      <View style={{ flex: 1.5 }}>
        <View className="flex flex-row gap-x-2 mt-5">
          <View className="flex-1">
            <ButtonSecondaryStart
              label="Retour"
              iconName="angle-left"
              iconFamily="FontAwesome5Icon"
              onPressFn={() => navigation.navigate("Onboarding2")}
            />
          </View>
          <View className="flex-1">
            <ButtonPrimaryEnd
              label="Suivant"
              iconName="angle-right"
              iconFamily="FontAwesome5Icon"
              onPressFn={handleNext}
              isLoading={isLoading}
            />
          </View>
        </View>

        <View className="flex flex-row justify-center items-center mt-2">
          <IconComponent
            name="circle"
            size={12}
            solid
            className="px-2 text-darkbg/20 dark:text-primary/20"
          />
          <IconComponent
            name="circle"
            size={12}
            solid
            className="px-2 text-darkbg/20 dark:text-primary/20"
          />
          <IconComponent
            name="circle"
            size={12}
            solid
            className="px-2 text-darkbg dark:text-primary"
          />
          <IconComponent
            name="circle"
            size={12}
            solid
            className="px-2 text-darkbg/20 dark:text-primary/20"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
