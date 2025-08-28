import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSignIn, useSignUp, useSSO } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { SheetManager } from "react-native-actions-sheet";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import {
  View,
  Modal,
  StyleSheet,
  ImageBackground,
  Button,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import InputText from "../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import TopBar from "../components/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { UserState, updateUser } from "../reducers/user";
import { ProducerState, setProducerData } from "../reducers/producer";
import { ShopState, setShopData } from "../reducers/shop";
import { useColorScheme } from "nativewind";

import userTools from "../modules/userTools";
import producerTools from "../modules/producerTools";
import shopTools from "../modules/shopTools";
import TextHeading4 from "../components/utils/texts/Heading4";
import TextBody1 from "../components/utils/texts/Body1";
import OpenScreenButton from "../components/utils/buttons/OpenScreen";
import TextHeading2 from "../components/utils/texts/Heading2";

type SignInScreenRouteProp = RouteProp<RootStackParamList, "SignIn">;

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

type SignInScreenProps = {
  navigation: SignInScreenNavigationProp;
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

export default function SignInScreen({ navigation }: SignInScreenProps) {
  useWarmUpBrowser();

  const route = useRoute<SignInScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {}; // route.params peut être non défini quand on revient SignUpScreen

  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const producerStore = useSelector(
    (state: { producer: ProducerState }) => state.producer.value,
  );

  // need to get the user infos
  const { signOut, isSignedIn, getToken } = useAuth();

  // and store user infos in the store
  const dispatch = useDispatch();

  // Import the Clerk Auth functions
  const { signIn, setActive, isLoaded } = useSignIn();

  // import the Clerk Google OAuth flow
  const { startSSOFlow } = useSSO();

  // Form fields
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInvisible, setPasswordInvisible] = useState<boolean>(true);

  const [performedSignedIn, setPerformedSignedIn] = useState(false);
  const [isConnectionLoading, setConnectionLoading] = useState(false);

  const { colorScheme } = useColorScheme();

  const fetchData = async () => {
    try {
      // store user info in the store
      const token = await getToken();
      const userResponse = await userTools.getUserInfos(token);

      if (!userResponse.success) {
        console.error(userResponse.message);
        return;
      }

      console.log("user fetchData :", userResponse.data);

      dispatch(updateUser(userResponse.data!));

      const producerResponse = await producerTools.getProducerInfos(token);

      if (!producerResponse.success) {
        console.error(producerResponse.message);
        // pas de profil producer, on dirige vers la SearchScreen
        navigation.navigate("TabNavigatorUser", { screen: "Search" });
        return;
      }

      console.log("producer fetchData :", producerResponse.data);

      const producer = producerResponse.data;
      dispatch(setProducerData(producer));

      const shopResponse = await shopTools.getShopInfos(token, producer?._id);

      if (!shopResponse.success) {
        console.error(shopResponse.message);
        navigation.navigate("TabNavigatorProducer", { screen: "Shop" });
      }

      const shop = shopResponse.data;
      dispatch(setShopData(shop));

      navigation.navigate("TabNavigatorProducer", {
        screen: "BusinessCenter",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Signin/up with Facebook
  const onFacebookAuthPress = useCallback(async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return;
    }

    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_facebook",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      // If the signin event went well
      if (createdSessionId) {
        console.log("sessionId", createdSessionId);
        await setActive!({ session: createdSessionId });
        // setActive!({ session: createdSessionId });
        setPerformedSignedIn(true);
        fetchData();
      } else {
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  // Signin/up with Google
  const onGoogleAuthPress = useCallback(async () => {
    // If Clerk is not loaded
    if (!isLoaded) {
      return;
    }

    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        });
      // Try to start the Google OAuth flow
      //   const { createdSessionId, setActive } = await startOAuthFlow({
      //     redirectUrl: Linking.createURL("/home", { scheme: "Meloko" }), // Redirect path on successful signin
      //   });

      // If the signin event went well
      if (createdSessionId) {
        console.log("sessionId", createdSessionId);
        await setActive!({ session: createdSessionId });
        // setActive!({ session: createdSessionId });
        setPerformedSignedIn(true);
        fetchData();
      } else {
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  // Signin the user with Clerk
  const onSignInPress = useCallback(async () => {
    // vérification des champs
    if (emailAddress === "") {
      SheetManager.show("alert", {
        payload: {
          message: "Veuillez saisir un email.",
          alertType: "warning",
        },
      });

      return;
    }
    if (password === "") {
      SheetManager.show("alert", {
        payload: {
          message: "Veuillez saisir un mot de passe.",
          alertType: "warning",
        },
      });

      return;
    }

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
      SheetManager.show("alert", {
        payload: {
          message: err.errors.map((err: string) => err.message).join("\n"),
          alertType: "error",
        },
      });

      setConnectionLoading(false);
    }
  }, [isLoaded, emailAddress, password]);

  console.log("---------------- SIGNIN -------------------");
  console.log("userStore :", userStore);
  console.log("producerStore: ", producerStore);

  return (
    <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
      <TopBar
        backLabel={backLabel || "Retour à l'accueil"}
        screen={from || "Home"}
        label={screenTitle || "CONNEXION\nINSCRIPTION"}
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
              onPressFn={onFacebookAuthPress}
              extraClasses="w-full mb-3"
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
          <OpenScreenButton
            label="Créer un compte"
            onPressFn={() =>
              navigation.navigate("SignUp", {
                from: "SignIn",
                backLabel: "Retour à la connexion",
                screenTitle: "CREER UN\nCOMPTE",
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
