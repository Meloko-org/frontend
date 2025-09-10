import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useDispatch } from "react-redux";
import { updateUser } from "../reducers/user";
import { setProducerData } from "../reducers/producer";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { validateRequiredFields } from "../helpers/fieldHelpers";
import saveImageLocally from "../helpers/ImageHelpers";

import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { KeyboardAvoidingView, Platform, View } from "react-native";
import UnderlineInputText from "../components/utils/inputs/UnderlineText";
import TextBody1 from "../components/utils/texts/Body1";
import ImageUploader from "../components/utils/ImageUploader";
import Thumbnail from "../components/utils/Thumbnail";
import ButtonSecondaryStart from "../components/utils/buttons/SecondaryStart";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import { SheetManager } from "react-native-actions-sheet";
import onboardingTools from "../modules/onboardingTools";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding1">;

export default function Onboarding1Screen({ navigation }: Props) {
  // pour permettre l'utlisation des classes tailwind sur l'icone
  const IconComponent = FontAwesome5Icon;

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* Gestion des inputs required dans un seul state */
  type FieldsState = {
    name: string;
    lastname: string;
    socialReason: string;
    siren: string;
    iban: string;
    bic: string;
    kbis: string | null;
  };

  const [fields, setFields] = useState<FieldsState>({
    name: "",
    lastname: "",
    socialReason: "",
    siren: "",
    iban: "",
    bic: "",
    kbis: "",
  });

  const handleKbisSelected = (uri: string) => {
    setFields((prev) => ({ ...prev, kbis: uri }));
    setErrors((prev) => ({ ...prev, kbis: false }));
  };

  /* gestion des erreurs sur les inputs */
  type ErrorsState = Record<string, boolean>;

  const [errors, setErrors] = useState<ErrorsState>({
    name: false,
    lastname: false,
    socialReason: false,
    siren: false,
    iban: false,
    bic: false,
    kbis: false,
  });

  /* gestion du bouton suivant en fonction des erreurs */
  const handleNext = async () => {
    const { newErrors, isValid } = validateRequiredFields(fields, errors);

    setErrors(newErrors);

    if (isValid) {
      setIsLoading(true);

      const savedUri = await saveImageLocally(fields.kbis!, "/kbis");
      if (!savedUri) {
        SheetManager.show("alert", {
          payload: {
            message: "L'image n'a pas pu être sauvegardée.",
            alertType: "error",
          },
        });
        setIsLoading(false);
        return;
      } else {
        setFields((prev) => ({ ...prev, kbis: savedUri }));
      }

      const token = await getToken();

      const onboardingResponse = await onboardingTools.onboarding1(
        token,
        fields,
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
        dispatch(updateUser(onboardingResponse.data?.user!));
        dispatch(setProducerData(onboardingResponse.data?.producer!));
        setIsLoading(false);
        navigation.navigate("Onboarding2");
      }
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg px-3"
      edges={["right", "left", "top"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 10 }} className="flex-row items-center px-2">
            <View>
              <UnderlineInputText
                placeholder="Quel est votre nom ?"
                value={fields.name}
                onChangeText={(value) => {
                  setFields((prev) => ({ ...prev, name: value }));
                  // annule l'erreur dès qu'on saisie
                  if (errors.name && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, name: false }));
                  }
                }}
                onBlur={() => {
                  // signale l'erreur
                  setErrors((prev) => ({
                    ...prev,
                    name: (fields.name ?? "").trim() === "",
                  }));
                }}
                showError={errors.name}
                height="h-12"
                extraClasses="mt-3 mb-2"
                textClasses="text-lg"
              />
              <UnderlineInputText
                placeholder="Votre prénom"
                value={fields.lastname}
                onChangeText={(value) => {
                  setFields((prev) => ({ ...prev, lastname: value }));
                  // annule l'erreur dès qu'on saisie
                  if (errors.lastname && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, lastname: false }));
                  }
                }}
                onBlur={() => {
                  // signale l'erreur
                  setErrors((prev) => ({
                    ...prev,
                    lastname: (fields.lastname ?? "").trim() === "",
                  }));
                }}
                showError={errors.lastname}
                height="h-12"
                extraClasses="mb-2"
                textClasses="text-lg"
              />

              <TextBody1
                centered
                extraClasses="my-5 text-lg"
              >{`Quelques informations nécessaires\npour pouvoir vendre sur La Charrue`}</TextBody1>

              <UnderlineInputText
                placeholder="Raison sociale"
                value={fields.socialReason}
                onChangeText={(value) => {
                  setFields((prev) => ({ ...prev, socialReason: value }));
                  // annule l'erreur dès qu'on saisie
                  if (errors.socialReason && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, socialReason: false }));
                  }
                }}
                onBlur={() => {
                  // signale l'erreur
                  setErrors((prev) => ({
                    ...prev,
                    socialReason: (fields.socialReason ?? "").trim() === "",
                  }));
                }}
                showError={errors.socialReason}
                height="h-12"
                extraClasses="mb-2"
                textClasses="text-lg"
              />
              <UnderlineInputText
                placeholder="SIREN"
                value={fields.siren}
                onChangeText={(value) => {
                  setFields((prev) => ({ ...prev, siren: value }));
                  // annule l'erreur dès qu'on saisie
                  if (errors.siren && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, siren: false }));
                  }
                }}
                onBlur={() => {
                  // signale l'erreur
                  setErrors((prev) => ({
                    ...prev,
                    siren: (fields.siren ?? "").trim() === "",
                  }));
                }}
                showError={errors.siren}
                height="h-12"
                extraClasses="mb-2"
                textClasses="text-lg"
              />
              <UnderlineInputText
                placeholder="IBAN"
                value={fields.iban}
                onChangeText={(value) => {
                  setFields((prev) => ({ ...prev, iban: value }));
                  // annule l'erreur dès qu'on saisie
                  if (errors.iban && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, iban: false }));
                  }
                }}
                onBlur={() => {
                  // signale l'erreur
                  setErrors((prev) => ({
                    ...prev,
                    iban: (fields.iban ?? "").trim() === "",
                  }));
                }}
                showError={errors.iban}
                height="h-12"
                extraClasses="mb-2"
                textClasses="text-lg"
              />
              <UnderlineInputText
                placeholder="BIC"
                value={fields.bic}
                onChangeText={(value) => {
                  setFields((prev) => ({ ...prev, bic: value }));
                  // annule l'erreur dès qu'on saisie
                  if (errors.bic && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, bic: false }));
                  }
                }}
                onBlur={() => {
                  // signale l'erreur
                  setErrors((prev) => ({
                    ...prev,
                    bic: (fields.bic ?? "").trim() === "",
                  }));
                }}
                showError={errors.bic}
                height="h-12"
                extraClasses="mb-2"
                textClasses="text-lg"
              />

              <View className="flex flex-row items-center mt-5">
                <View className="w-1/4">
                  <TextBody1
                    centered
                    extraClasses=""
                  >{`Kbis de moins\nde 3 mois`}</TextBody1>

                  <ImageUploader
                    label="KBIS"
                    onImageSelected={handleKbisSelected}
                    mediaTypes={["images", "livePhotos"]}
                    message={`Ajoutez une photo.`}
                    displayImage={false}
                    pickerOptions={{
                      allowsEditing: false,
                      quality: 1,
                    }}
                  />
                </View>
                <View className="pl-3 w-3/4">
                  <View
                    className={`
											${errors.kbis ? " border-4 border-danger" : "border border-darkbg/20 dark:border-lightbg border-dotted"} 
											rounded-lg h-32
										`}
                  >
                    {fields.kbis && (
                      <Thumbnail
                        source={fields.kbis!}
                        extraClasses=""
                        style={{ width: "100%", height: "100%" }}
                        onDelete={() => {
                          setFields((prev) => ({ ...prev, kbis: null }));
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flex: 1.5 }}>
            <View className="flex flex-row gap-x-2 mt-5">
              <View className="flex-1">
                <ButtonSecondaryStart
                  label="Retour"
                  iconName="angle-left"
                  iconFamily="FontAwesome5Icon"
                  onPressFn={() => navigation.navigate("Onboarding0")}
                />
              </View>
              <View className="flex-1">
                <ButtonPrimaryEnd
                  label="Suivant"
                  iconName="angle-right"
                  iconFamily="FontAwesome5Icon"
                  // onPressFn={() => navigation.navigate("Onboarding2")}
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
                className="px-2 text-darkbg dark:text-primary"
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
                className="px-2 text-darkbg/20 dark:text-primary/20"
              />
              <IconComponent
                name="circle"
                size={12}
                solid
                className="px-2 text-darkbg/20 dark:text-primary/20"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
