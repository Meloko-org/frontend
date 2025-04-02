import React, { useState } from "react";
import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { updateUser } from "../reducers/user";
import { useModal } from "../context/ModalContext";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import userTools from "../modules/userTools";
import producerTools from "../modules/producerTools";

import TopBar from "../components/TopBar";
import InputText from "../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import { StyleSheet, TextInput, Button, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckBox from "../components/utils/inputs/CheckBox";
import CodeInput from "../components/CodeInput";
import TextHeading4 from "../components/utils/texts/Heading4";
import CustomAlert from "../components/modals/CustomAlert";

type SignUpScreenRouteProp = RouteProp<RootStackParamList, "SignUp">;

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

type SignUpScreenProps = {
  navigation: SignUpScreenNavigationProp;
};

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const route = useRoute<SignUpScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params;

  const { setAlertMessage } = useModal();

  // const [alertMessage, setAlertMessage] = useState<string | null>(null);
  // const [alertType, setAlertType] = useState<"success" | "danger">("danger");

  // Import the Clerk signup functions
  const { isLoaded, signUp, setActive } = useSignUp();
  const { getToken } = useAuth();

  // store
  const dispatch = useDispatch();

  // Form fields
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordInvisible, setPasswordInvisible] = useState<boolean>(true);
  const [confirmPasswordInvisible, setConfirmPasswordInvisible] =
    useState<boolean>(true);
  const [isConnectionLoading, setConnectionLoading] = useState(false);
  const [isVerifyLoading, setVerifyLoading] = useState(false);
  const [isProducer, setIsProducer] = useState<boolean>(false);

  // Email verification status
  const [pendingVerification, setPendingVerification] =
    useState<boolean>(false);
  // Email verification code
  const [code, setCode] = useState<string>("");

  const fetchData = async () => {
    try {
      const token = await getToken();
      const userResponse = await userTools.getUserInfos(token);

      if (!userResponse.success) {
        console.error(userResponse.message);
        return;
      }

      // mise à jour du store
      dispatch(updateUser(userResponse.data!));

      if (isProducer) {
        const producerResponse = await producerTools.initialiseProducer(token);

        if (!producerResponse.success) {
          console.error(producerResponse.message);
          //setAlertMessage(producerResponse.message);
        } else {
          navigation.navigate("TabNavigatorProducer", {
            screen: "ProducerProfile",
          });
        }
      } else {
        navigation.navigate("TabNavigatorUser", { screen: "UserProfile" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSignUpPress = async () => {
    // vérification des champs
    if (emailAddress === "") {
      setAlertMessage("Veuillez saisir un email.", "warning");
      // setAlertType("danger");
      return;
    }
    if (password === "") {
      setAlertMessage("Veuillez saisir un mot de passe.", "warning");
      // setAlertType("danger");
      return;
    }
    if (confirmPassword === "") {
      setAlertMessage("Veuillez confirmer le mot de passe.", "warning");
      // setAlertType("danger");
      return;
    }
    if (password !== confirmPassword) {
      setAlertMessage(
        "Les deux mots de passe ne sont pas identiques.",
        "error",
      );
      // setAlertType("danger");
      return;
    }

    // If Clerk is not loaded
    if (!isLoaded) {
      return;
    }

    try {
      // Try to signup
      await signUp.create({
        emailAddress,
        password,
      });

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Verification is pending
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setAlertMessage(
        err.errors.map((err: string) => err.message).join("\n"),
        "error",
      );
      // setAlertType("danger");
    }
  };

  const handleVerifyCode = () => {
    if (code.length === 6) {
      onPressVerify();
    } else {
      setAlertMessage("Veuillez entrer un code à 6 chiffres.", "warning");
      // setAlertType("danger");
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

        fetchData();
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setAlertMessage(
        err.errors.map((err: string) => err.message).join("\n"),
        "error",
      );
      // setAlertType("danger");
    }
  };

  console.log("from :", from);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel={backLabel}
          screen={from}
          label={screenTitle}
          extraClasses="mt-2"
        />

        <View className="flex-1 justify-center px-5">
          <View>
            {pendingVerification ? (
              <>
                <View className="flex flex-row justify-center w-full mb-5">
                  <View>
                    <TextHeading4>Saisissez votre code</TextHeading4>
                  </View>
                </View>
                <View className="flex flex-row justify-center mb-5">
                  <CodeInput onCodeChange={setCode} />
                </View>
                <ButtonPrimaryEnd
                  label="Vérifier email"
                  iconName="arrow-right"
                  onPressFn={handleVerifyCode}
                  isLoading={isVerifyLoading}
                  extraClasses="w-full h-14"
                />
              </>
            ) : (
              <View>
                <View className="mb-5">
                  <InputText
                    value={emailAddress}
                    onChangeText={(newEmail: string) =>
                      setEmailAddress(newEmail)
                    }
                    placeholder="example@gmail.com"
                    label="Email"
                    autoCapitalize="none"
                    extraClasses="w-full mb-2"
                  />
                  <InputText
                    value={password}
                    onChangeText={(newPassword: string) =>
                      setPassword(newPassword)
                    }
                    placeholder="Mot de passe"
                    label="Mot de passe"
                    autoCapitalize="none"
                    extraClasses="w-full mb-2"
                    size="large"
                    secureTextEntry={passwordInvisible}
                    iconName="eye"
                    onIconPressFn={() => setPasswordInvisible((prev) => !prev)}
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
                    size="large"
                    secureTextEntry={confirmPasswordInvisible}
                    iconName="eye"
                    onIconPressFn={() =>
                      setConfirmPasswordInvisible((prev) => !prev)
                    }
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

        {/* Modale Alerte*/}
        {/* {alertMessage && (
          <CustomAlert
            visible={!!alertMessage}
            message={alertMessage}
            alertType={alertType}
            onClose={() => setAlertMessage(null)}
          />
        )} */}
      </SafeAreaView>
    </View>
  );
}
