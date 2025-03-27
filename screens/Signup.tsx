import React, { useState } from "react";
import { useAuth, useSignUp } from "@clerk/clerk-expo";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import producerTools from "../modules/producerTools";

import TopBar from "../components/TopBar";
import InputText from "../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import { StyleSheet, TextInput, Button, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckBox from "../components/utils/inputs/CheckBox";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function SignUpScreen({ navigation }: Props) {
  // Import the Clerk signup functions
  const { isLoaded, signUp, setActive } = useSignUp();
  const { getToken } = useAuth();

  // Form fields
  const [newEmailAddress, setNewEmailAddress] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isConnectionLoading, setConnectionLoading] = useState(false);
  const [isVerifyLoading, setVerifyLoading] = useState(false);
  const [isProducer, setIsProducer] = useState<boolean>(false);

  // Email verification status
  const [pendingVerification, setPendingVerification] =
    useState<boolean>(false);
  // Email verification code
  const [code, setCode] = useState<string>("");

  const onSignUpPress = async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return;
    }

    try {
      // Try to signup
      await signUp.create({
        emailAddress: newEmailAddress,
        password: newPassword,
      });

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Verification is pending
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return;
    }

    try {
      // Try to verify the email with the provided code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If the verification event is sucessfull
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        // si c'est une création de compte producer,
        // -> création d'un producer vierge dans la base
        // -> redirection vers ProducerProfile
        // sinon, redirection vers UserProfile
        if (isProducer) {
          const token = await getToken();
          const producer = await producerTools.initialiseProducer(token);
          if (producer) {
            navigation.navigate("TabNavigatorProducer", {
              screen: "ProducerProfile",
            });
          } else {
            Alert.alert("impossible de créer le compte producteur");
          }
        } else {
          navigation.navigate("TabNavigatorUser", { screen: "UserProfile" });
        }
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  console.log("producer", isProducer);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel="Retour à la connexion"
          screen="SignIn"
          label={`CREER UN\nCOMPTE`}
          extraClasses="mt-2"
        />

        <View className="flex-1 justify-center px-5">
          <View>
            {pendingVerification ? (
              <>
                <InputText
                  label="Code de validation"
                  value={code}
                  placeholder="Code..."
                  onChangeText={(code: string) => setCode(code)}
                />
                <ButtonPrimaryEnd
                  label="Vérifier email"
                  iconName="arrow-right"
                  onPressFn={onPressVerify}
                  isLoading={isVerifyLoading}
                  extraClasses="w-full h-14"
                />
              </>
            ) : (
              <View>
                <View className="mb-5">
                  <InputText
                    value={newEmailAddress}
                    onChangeText={(newEmail: string) =>
                      setNewEmailAddress(newEmail)
                    }
                    placeholder="example@gmail.com"
                    label="Email"
                    autoCapitalize="none"
                    extraClasses="w-full mb-2"
                  />
                  <InputText
                    value={newPassword}
                    onChangeText={(newPassword: string) =>
                      setNewPassword(newPassword)
                    }
                    placeholder="Mot de passe"
                    label="Mot de passe"
                    autoCapitalize="none"
                    extraClasses="w-full mb-2"
                    secureTextEntry={true}
                  />
                  <InputText
                    value={confirmPassword}
                    onChangeText={(confirmPassword: string) =>
                      setConfirmPassword(confirmPassword)
                    }
                    placeholder="Confirmer mot de passe"
                    label="Confirmer mot de passe"
                    autoCapitalize="none"
                    extraClasses="w-full mb-2"
                    secureTextEntry={true}
                  />
                </View>

                <View className="flex flex-row justify-center my-5">
                  <CheckBox
                    label="Je suis un producteur"
                    bgColor="bg-white dark:bg-tertiary"
                    textClasses="text-dark dark:text-white"
                    onPressFn={() => setIsProducer(!isProducer)}
                  />
                </View>

                <View className="flex flex-row justify-center mt-5">
                  <View className="w-[90%]">
                    <ButtonPrimaryEnd
                      label="Inscription"
                      iconName="arrow-right"
                      onPressFn={onSignUpPress}
                      isLoading={isConnectionLoading}
                      extraClasses="w-full h-14"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
