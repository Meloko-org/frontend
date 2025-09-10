import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useDispatch } from "react-redux";
import { setShopData } from "../reducers/shop";
import { setProducerData } from "../reducers/producer";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import FontAwesome5Icon from "@expo/vector-icons/FontAwesome5";

import { validateRequiredFields } from "../helpers/fieldHelpers";
import saveImageLocally from "../helpers/ImageHelpers";
import onboardingTools from "../modules/onboardingTools";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import ButtonSecondaryStart from "../components/utils/buttons/SecondaryStart";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import UnderlineInputText from "../components/utils/inputs/UnderlineText";
import TextBody1 from "../components/utils/texts/Body1";
import TextBody2 from "../components/utils/texts/Body2";
import ImageUploader from "../components/utils/ImageUploader";
import Thumbnail from "../components/utils/Thumbnail";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding2">;

export default function Onboarding2Screen({ navigation }: Props) {
  // pour permettre l'utlisation des classes tailwind sur l'icone
  const IconComponent = FontAwesome5Icon;

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* Gestion des inputs required dans un seul state */
  type FieldsState = {
    shopName: string;
    siret: string;
    shortDesc: string;
    logo: string | null;
    photo: string | null;
  };

  const [fields, setFields] = useState<FieldsState>({
    shopName: "",
    siret: "",
    shortDesc: "",
    logo: "",
    photo: "",
  });

  /* gestion des erreurs sur les inputs */
  type ErrorsState = Record<string, boolean>;

  const [errors, setErrors] = useState<ErrorsState>({
    shopName: false,
    siret: false,
    shortDesc: false,
  });

  /* gestion des fields non required */
  // const [ logo, setLogo ] = useState<string>()
  // const [ photo, setPhoto ] = useState<string | null>()

  const handleLogo = (uri: string) => {
    setFields((prev) => ({ ...prev, logo: uri }));
  };

  const handlePhotoSelected = (uri: string) => {
    setFields((prev) => ({ ...prev, photo: uri }));
  };

  /* gestion du bouton suivant en fonction des erreurs */
  const handleNext = async () => {
    const { newErrors, isValid } = validateRequiredFields(fields, errors);

    setErrors(newErrors);

    if (isValid) {
      setIsLoading(true);

      if (fields.logo) {
        const savedUriLogo = await saveImageLocally(fields.logo, "/shopLogos");
        if (!savedUriLogo) {
          SheetManager.show("alert", {
            payload: {
              message: "Le logo n'a pas pu être sauvegardé.",
              alertType: "error",
            },
          });
          setIsLoading(false);
          return;
        } else {
          setFields((prev) => ({ ...prev, logo: savedUriLogo }));
        }
      }

      if (fields.photo) {
        const savedUriPhoto = await saveImageLocally(
          fields.photo,
          "/shopPhotos",
        );
        if (!savedUriPhoto) {
          SheetManager.show("alert", {
            payload: {
              message: "L'image n'a pas pu être sauvegardée.",
              alertType: "error",
            },
          });
          setIsLoading(false);
          return;
        } else {
          setFields((prev) => ({ ...prev, photo: savedUriPhoto }));
        }
      }

      const token = await getToken();

      const onboardingResponse = await onboardingTools.onboarding2(
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
        dispatch(setShopData(onboardingResponse.data?.shop!));
        dispatch(setProducerData(onboardingResponse.data?.producer!));
        setIsLoading(false);
        navigation.navigate("Onboarding3");
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
                placeholder="Quel sera le nom de votre boutique ?"
                value={fields.shopName}
                onChangeText={(value) => {
                  setFields((prev) => ({ ...prev, shopName: value }));
                  // annule l'erreur dès qu'on saisie
                  if (errors.shopName && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, shopName: false }));
                  }
                }}
                onBlur={() => {
                  // signale l'erreur
                  setErrors((prev) => ({
                    ...prev,
                    shopName: (fields.shopName ?? "").trim() === "",
                  }));
                }}
                showError={errors.shopName}
                height="h-12"
                extraClasses="mt-3 mb-5"
                textClasses="text-lg"
              />
              <UnderlineInputText
                placeholder="Votre Siret"
                value={fields.siret}
                onChangeText={(value) => {
                  setFields((prev) => ({ ...prev, siret: value }));
                  // annule l'erreur dès qu'on saisie
                  if (errors.siret && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, siret: false }));
                  }
                }}
                onBlur={() => {
                  // signale l'erreur
                  setErrors((prev) => ({
                    ...prev,
                    siret: (fields.siret ?? "").trim() === "",
                  }));
                }}
                showError={errors.siret}
                height="h-12"
                extraClasses="mt-3 mb-5"
                textClasses="text-lg"
              />
              <UnderlineInputText
                placeholder="Quelques mots pour présenter votre boutique"
                value={fields.shortDesc}
                onChangeText={(value) => {
                  setFields((prev) => ({ ...prev, shortDesc: value }));
                  // annule l'erreur dès qu'on saisie
                  if (errors.shortDesc && value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, shortDesc: false }));
                  }
                }}
                onBlur={() => {
                  // signale l'erreur
                  setErrors((prev) => ({
                    ...prev,
                    shortDesc: (fields.shortDesc ?? "").trim() === "",
                  }));
                }}
                showError={errors.shortDesc}
                height="h-24"
                twoLines={true}
                extraClasses="mb-5"
                textClasses="text-lg"
              />
              <View className="flex flex-row items-center justify-center my-5">
                <View className="flex-grow">
                  <TextBody1 centered extraClasses="text-lg">
                    Vous avez un logo ?
                  </TextBody1>
                  <TextBody2 centered>(facultatif)</TextBody2>
                </View>
                <View className="">
                  <ImageUploader
                    label="LOGO"
                    onImageSelected={handleLogo}
                    mediaTypes={["images"]}
                    message={`Ajoutez un logo.`}
                    displayImage={true}
                    pickerOptions={{
                      allowsEditing: false,
                      quality: 1,
                    }}
                  />
                </View>
              </View>

              <TextBody1 centered extraClasses="text-lg mt-5">
                Une photo de votre exploitation
              </TextBody1>
              <TextBody2
                centered
              >{`(Pas obligatoire mais très\nfortement recommandé)`}</TextBody2>

              <View className="flex flex-row items-center mt-5">
                <View className="w-1/4">
                  <ImageUploader
                    label="PHOTO"
                    onImageSelected={handlePhotoSelected}
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
                  <View className="border border-darkbg/20 dark:border-lightbg border-dotted rounded-lg h-32">
                    {fields.photo && (
                      <Thumbnail
                        source={fields.photo!}
                        style={{ width: "100%", height: "100%" }}
                        extraClasses=""
                        onDelete={(uri: string) => {
                          setFields((prev) => ({ ...prev, photo: null }));
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>

            <TextBody2 centered extraClasses="my-5">
              {`
							Vous pourrez ajouter d'autres photos ainsi qu'une\ndescription plus détaillée de votre exploitation\nlorsque votre boutique sera créée.
						`}
            </TextBody2>
          </View>

          <View style={{ flex: 1.5 }}>
            <View className="flex flex-row gap-x-2 mt-5">
              <View className="flex-1">
                <ButtonSecondaryStart
                  label="Retour"
                  iconName="angle-left"
                  iconFamily="FontAwesome5Icon"
                  onPressFn={() => navigation.navigate("Onboarding1")}
                />
              </View>
              <View className="flex-1">
                <ButtonPrimaryEnd
                  label="Suivant"
                  iconName="angle-right"
                  iconFamily="FontAwesome5Icon"
                  // onPressFn={() => navigation.navigate("Onboarding3")}
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
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
