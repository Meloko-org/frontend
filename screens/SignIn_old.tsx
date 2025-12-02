import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  useSignIn,
  useSignUp,
  useSSO,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import type { SessionResource } from "@clerk/types";
import * as AuthSession from "expo-auth-session";

import { useDispatch, useSelector } from "react-redux";
import { UserState, updateUser } from "../reducers/user";
import { ProducerState, setProducerData } from "../reducers/producer";
import { ShopState, setShopData } from "../reducers/shop";

import { SheetManager } from "react-native-actions-sheet";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { getRedirectTarget } from "../helpers/navigationHelpers";

import userTools from "../modules/userTools";
import producerTools from "../modules/producerTools";
import shopTools from "../modules/shopTools";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { View } from "react-native";
import InputText from "../components/utils/inputs/Text";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import TopBar from "../components/TopBar";
// import { useColorScheme } from "nativewind";

import TextBody1 from "../components/utils/texts/Body1";
import OpenScreenButton from "../components/utils/buttons/OpenScreen";
import ChooseAccountTypeModal from "../components/modals/ChooseAccountType";
import Spinner from "../components/utils/Spinner";

type SignInScreenRouteProp = RouteProp<RootStackParamList, "SignIn">;

type SignInScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

type SignInScreenProps = {
  navigation: SignInScreenNavigationProp;
  route: SignInScreenRouteProp;
};

export default function SignInScreen({ navigation, route }: SignInScreenProps) {
  const { from, backLabel, screenTitle, next } = route.params || {}; // route.params peut être non défini quand on revient SignUpScreen

  const [backendWorking, setBackendWorking] = useState<boolean>(false);

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
  const { user } = useUser();
  // sert au stockage de createdSessionId pour une utilisation ultérieure dans la modal
  const pendingSessionIdRef = useRef<string | null>(null);

  // import the Clerk Google OAuth flow
  const { startSSOFlow } = useSSO();

  const [isChooseAccountTypeModalVisible, setIsChooseAccountTypeModalvisible] =
    useState<boolean>(false);

  // const [ nextScreen, setNextScreen ] = useState<string>()

  // Form fields
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInvisible, setPasswordInvisible] = useState<boolean>(true);

  const [performedSignedIn, setPerformedSignedIn] = useState(false);
  const [isConnectionLoading, setConnectionLoading] = useState(false);

  const withTimeout = <T,>(promise: Promise<T>, ms = 8000): Promise<T> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("TIMEOUT"));
      }, ms);

      promise
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };

  useFocusEffect(
    useCallback(() => {
      setEmailAddress("");
      setPassword("");
    }, []),
  );

  const fetchData = async () => {
    try {
      const token = await getToken();
      // Étape 1 : récupération des données
      const userResponse = await withTimeout(
        userTools.getUserInfos(token),
        8000,
      );

      if (!userResponse.success || !userResponse.data) {
        console.error(userResponse.message);
        SheetManager.show("alert", {
          payload: {
            message: userResponse.message
              ? userResponse.message
              : `Une erreur s'est produite lors de la connexion.\nVeuillez ré-essayer.`,
            alertType: "error",
          },
        });
        return;
      }
      const user = userResponse.data;
      dispatch(updateUser(user!));

      const producerResponse = await producerTools.getProducerInfos(token);

      if (!producerResponse.success) {
        console.log(producerResponse.message);
      }

      const producer = producerResponse.success ? producerResponse.data : null;

      // Étape 2 : logique de redirection
      const redirect = getRedirectTarget({ user, producer, next });

      // Étape 3 : exécution de la navigation
      switch (redirect.type) {
        case "root":
          navigation.navigate(redirect.screen as never);
          break;
        case "userTab":
          navigation.navigate("TabNavigatorUser", {
            screen: redirect.screen,
            params: redirect.params,
          });
          break;
        case "producerTab":
          navigation.navigate("TabNavigatorProducer", {
            screen: redirect.screen,
          });
          break;
        case "onboarding":
          navigation.navigate(redirect.screen as never);
          break;
      }
      if (userResponse.success) {
        setBackendWorking(false);
      }
    } catch (error: any) {
      console.error("Erreur lors du fetchData:", error);
      if (error.message === "TIMEOUT") {
        SheetManager.show("alert", {
          payload: {
            message: "Le serveur met trop de temps à répondre.",
            alertType: "error",
          },
        });
      } else {
        SheetManager.show("alert", {
          payload: {
            message: "Impossible de contacter le serveur.",
            alertType: "error",
          },
        });
      }
      setBackendWorking(false);
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
        // on récupère le user avant que lastSignInAt ait pu être mis à jour
        const freshUser = await user?.reload();

        await setActive!({ session: createdSessionId });
        // setActive!({ session: createdSessionId });
        setPerformedSignedIn(true);

        if (freshUser) {
          if (freshUser.lastSignInAt === null) {
            // signifie que c'est une inscription et non un log
            // ouvrir la modal de choix de compte
            setIsChooseAccountTypeModalvisible(true);
          } else {
            fetchData();
          }
        }
      } else {
        // afficher un message d'erreur
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
      console.log("SIGNIN google auth");
      // Start the authentication process by calling `startSSOFlow()`

      const redirectUrl = AuthSession.makeRedirectUri({ scheme: "meloko" });
      console.log("Redirect URL:", redirectUrl);

      const result = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });
      console.log("OAuth result:", result);

      const { createdSessionId, setActive, signIn, signUp } = result;

      // If the signin event went well
      if (createdSessionId) {
        console.log("signup :", signUp);

        if (signUp?.createdUserId) {
          // Nouvel utilisateur : on stocke ce qu'il faut pour l'utiliser après
          pendingSessionIdRef.current = createdSessionId;
          setIsChooseAccountTypeModalvisible(true);
        } else {
          console.log("not signup");
          await setActive!({ session: createdSessionId });
          setPerformedSignedIn(true);

          fetchData();
        }
      } else {
        // afficher message erreur
        console.log("Erreur lors de la connexion avec google.");
      }
    } catch (err: any) {
      console.error(err);
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
      setBackendWorking(true);
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
    } catch (err: any) {
      console.error("test :", JSON.stringify(err, null, 2));
      // const message = err.errors.map((err: string) => err.message).join("\n")
      SheetManager.show("alert", {
        payload: {
          message: "Connexion impossible avec ces identifiants.",
          alertType: "error",
        },
      });
    } finally {
      setConnectionLoading(false);
    }
  }, [isLoaded, emailAddress, password]);

  console.log("SIGNIN next: ", next);

  return (
    <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
      <TopBar
        backLabel={backLabel || "Retour à l'accueil"}
        screen={from || "Home"}
        label={screenTitle || "CONNEXION\nINSCRIPTION"}
        extraClasses="mt-2 mb-5"
      />

      <ScrollView>
        <View className="flex flex-row justify-center my-5">
          <View className="w-[70%]">
            <View className="flex flex-row justify-center mb-3">
              <TextBody1>Connexion avec votre compte</TextBody1>
            </View>

            <ButtonPrimaryEnd
              label="Google"
              iconName="google"
              onPressFn={onGoogleAuthPress}
              extraClasses="w-full h-14 mb-3"
            />
            <ButtonPrimaryEnd
              label="Facebook"
              iconName="facebook-f"
              onPressFn={onFacebookAuthPress}
              extraClasses="w-full h-14 mb-3"
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

        <View className="px-3 my-5">
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

      {backendWorking && (
        <View className="absolute top-8 w-full h-full flex items-center justify-center bg-darkbg/80">
          <Spinner />
        </View>
      )}

      <ChooseAccountTypeModal
        isVisible={isChooseAccountTypeModalVisible}
        onUserPress={async () => {
          const id = pendingSessionIdRef.current!;
          await setActive!({ session: id });
          pendingSessionIdRef.current = null;
          setIsChooseAccountTypeModalvisible(false);
          fetchData();
        }}
        onProducerPress={async () => {
          const id = pendingSessionIdRef.current!;
          await setActive!({ session: id });
          pendingSessionIdRef.current = null;

          const token = await getToken();
          const producerResponse =
            await producerTools.initialiseProducer(token);

          if (!producerResponse.success) {
            SheetManager.show("alert", {
              payload: {
                message:
                  "Le compte producteur n'a pu être créé. Veuillez recommencer.",
                alertType: "error",
              },
            });
            return;
          }
          setIsChooseAccountTypeModalvisible(false);
          fetchData();
        }}
      />
    </SafeAreaView>
  );
}
