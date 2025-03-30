import React, { useState, useCallback, useEffect } from "react";
import { useSignIn, useSignUp, useOAuth } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import InputText from "../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import TopBar from "../components/TopBar";
import CustomAlert from "../components/modals/CustomAlert";

import { useDispatch, useSelector } from "react-redux";
import { UserState, updateUser } from "../reducers/user";
import { ProducerState, setProducerData } from "../reducers/producer";
import { ShopState, setShopData } from "../reducers/shop";

import userTools from "../modules/userTools";
import producerTools from "../modules/producerTools";
import shopTools from "../modules/shopTools";
import TextHeading4 from "../components/utils/texts/Heading4";
import TextBody1 from "../components/utils/texts/Body1";
import OpenScreenButton from "../components/utils/buttons/OpenScreen";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

// Warm up the android browser to improve UX
// https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen({ navigation }: Props) {
  useWarmUpBrowser();
  const producerStore = useSelector(
    (state: { producer: ProducerState }) => state.producer.value,
  );

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // need to get the user infos
  const { signOut, isSignedIn, getToken } = useAuth();

  // and store user infos in the store
  const dispatch = useDispatch();

  // Import the Clerk Auth functions
  const { signIn, setActive, isLoaded } = useSignIn();
  //const { signUp } = useSignUp();

  // import the Clerk Google OAuth flow
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // Form fields
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInvisible, setPasswordInvisible] = useState<boolean>(true);

  const [performedSignedIn, setPerformedSignedIn] = useState(false);
  const [isConnectionLoading, setConnectionLoading] = useState(false);

  /* 
  useEffect(() => {
    if (isSignedIn) {
      if (performedSignedIn) {
        fetchData();
        setPerformedSignedIn(false);
        //setPerformedSignedUp(false);
      }

      if (performedSignedUp) {
        setTimeout(() => {
          fetchData();
          setPerformedSignedIn(false);
          setPerformedSignedUp(false);
        }, 3000);
      }
    } else {
    }
  }, [isSignedIn, performedSignedIn, ]); //performedSignedUp
*/

  const fetchData = async () => {
    try {
      // store user info in the store
      const token = await getToken();
      const user = await userTools.getUserInfos(token);
      if (user) {
        dispatch(updateUser(user));
        const producer = await producerTools.getProducerInfos(token);
        if (producer) {
          dispatch(setProducerData(producer));
          const shop = await shopTools.getShopInfos(token, producer._id);
          if (shop) {
            dispatch(setShopData(shop));
            navigation.navigate("TabNavigatorProducer", {
              screen: "BusinessCenter",
            });
          } else {
            navigation.navigate("TabNavigatorProducer", { screen: "Stocks" });
          }
        } else {
          navigation.navigate("TabNavigatorUser", { screen: "Search" });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Signin/up with Google
  const onGoogleAuthPress = useCallback(async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return;
    }

    try {
      // Try to start the Google OAuth flow
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/home", { scheme: "Meloko" }), // Redirect path on successful signin
      });

      // If the signin event went well
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        setPerformedSignedIn(true);
      } else {
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  /*
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
      const completeSignUp = await signUp?.attemptEmailAddressVerification({
        code,
      });

      // If the verification event is sucessfull
      if (completeSignUp?.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setPerformedSignedUp(true);
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
*/

  // Signin the user with Clerk
  const onSignInPress = useCallback(async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return;
    }

    try {
      setConnectionLoading(true);
      // Try to signin
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If the signing event went well
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        setPerformedSignedIn(true);
        fetchData();
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
      setConnectionLoading(false);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setAlertMessage(err.errors[0].message);
      setConnectionLoading(false);
    }
  }, [isLoaded, emailAddress, password]);

  console.log("producerStore: ", producerStore);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          backLabel="Retour à l'accueil"
          screen="Home"
          label={`CONNEXION\nINSCRIPTION`}
          extraClasses="mt-2"
        />

        <ScrollView>
          <View className="flex flex-row justify-center mt-2 mb-3">
            <View className="w-[70%]">
              <View className="flex flex-row justify-center mb-3">
                <TextBody1>Connexion avec votre compte</TextBody1>
              </View>

              <ButtonPrimaryEnd
                label="Google"
                iconName="google"
                onPressFn={onGoogleAuthPress}
                extraClasses="w-full mb-3"
              />
              <ButtonPrimaryEnd
                label="Facebook"
                iconName="facebook-f"
                onPressFn={onGoogleAuthPress}
                extraClasses="w-full mb-3"
              />
              <ButtonPrimaryEnd
                label="Instagram"
                iconName="instagram"
                onPressFn={onGoogleAuthPress}
                extraClasses="w-full"
              />
            </View>
          </View>

          <View className="px-5 mt-5 mb-3">
            <View className="flex flex-row justify-center mb-3">
              <TextBody1>Connexion par email</TextBody1>
            </View>

            <InputText
              value={emailAddress}
              onChangeText={(newEmail: string) => setEmailAddress(newEmail)}
              placeholder="example@gmail.com"
              label="Email"
              size="large"
              autoCapitalize="none"
              extraClasses="w-full mb-2"
            />
            <InputText
              value={password}
              onChangeText={(newPassword: string) => setPassword(newPassword)}
              placeholder="Mot de passe"
              label="Mot de passe"
              autoCapitalize="none"
              extraClasses="w-full mb-2"
              size="large"
              secureTextEntry={passwordInvisible}
              iconName="eye"
              onIconPressFn={() => setPasswordInvisible((prev) => !prev)}
            />
            <View className="flex flex-row justify-center">
              <View className="w-[90%]">
                <ButtonPrimaryEnd
                  label="Connexion"
                  iconName="sign-in-alt"
                  onPressFn={onSignInPress}
                  isLoading={isConnectionLoading}
                  extraClasses="w-full h-14"
                />
              </View>
            </View>
          </View>

          <View className="px-3 mt-5">
            <View className="flex flex-row justify-center mb-3">
              <TextBody1>Pas encore membre ?</TextBody1>
            </View>
            <OpenScreenButton label="Créer un compte" screen="SignUp" />
          </View>

          {/* Modale Alerte*/}
          {alertMessage && (
            <CustomAlert
              visible={!!alertMessage}
              message={alertMessage}
              alertType="danger"
              onClose={() => setAlertMessage(null)}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
