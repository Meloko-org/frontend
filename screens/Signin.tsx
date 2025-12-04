import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useSignIn, useSSO, useUser, useAuth } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { SheetManager } from "react-native-actions-sheet";

import { updateUser } from "../reducers/user";
import { getRedirectTarget } from "../helpers/navigationHelpers";
import userTools from "../modules/userTools";
import producerTools from "../modules/producerTools";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { View } from "react-native";
import TopBar from "../components/TopBar";
import ButtonPrimaryEnd from "../components/utils/buttons/PrimaryEnd";
import InputText from "../components/utils/inputs/Text";
import Spinner from "../components/utils/Spinner";
import ChooseAccountTypeModal from "../components/modals/ChooseAccountType";
import TextBody1 from "../components/utils/texts/Body1";
import OpenScreenButton from "../components/utils/buttons/OpenScreen";

type SignInScreenProps = {
  navigation: any;
  route: any;
};

export default function SignInScreen({ navigation, route }: SignInScreenProps) {
  const { from, backLabel, screenTitle, next } = route.params || {};

  const dispatch = useDispatch();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const { user } = useUser();
  const { getToken, signOut } = useAuth();

  const pendingSessionIdRef = useRef<string | null>(null);

  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInvisible, setPasswordInvisible] = useState<boolean>(true);

  // loading state for network calls (shows full-screen overlay)
  const [backendWorking, setBackendWorking] = useState<boolean>(false);
  const [isConnectionLoading, setConnectionLoading] = useState<boolean>(false);

  const [isChooseAccountTypeModalVisible, setIsChooseAccountTypeModalvisible] =
    useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setEmailAddress("");
      setPassword("");
    }, []),
  );

  // timeout helper
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

  /**
   * fetchDataFlow:
   * - récupère token
   * - appelle userTools.getUserInfos (avec timeout)
   * - appelle producerTools.getProducerInfos
   * - dispatch updateUser
   * - calcule redirect et effectue navigation
   *
   * Retourne true si tout OK, false si erreur (et affiche la sheet d'erreur).
   */
  const fetchDataFlow = async (): Promise<boolean> => {
    setBackendWorking(true);
    try {
      const token = await getToken();

      // 1) get user infos (avec timeout)
      let userResponse;
      try {
        userResponse = await withTimeout(userTools.getUserInfos(token), 8000);
      } catch (err: any) {
        // timeout or network error
        let confirm;
        if (err?.message === "TIMEOUT") {
          confirm = await SheetManager.show("confirm", {
            payload: {
              message: "Le serveur met trop de temps à répondre.",
              alertType: "error",
              buttonLabel: "Ré-essayer",
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

        if (confirm) {
          await fetchDataFlow();
        } else {
          await signOut();
        }
        return false;
      }

      // if the backend responded but returned success:false
      if (!userResponse.success || !userResponse.data) {
        const message =
          userResponse.message ||
          "Une erreur s'est produite lors de la connexion.";
        SheetManager.show("alert", {
          payload: { message, alertType: "error" },
        });
        return false;
      }

      const userData = userResponse.data;
      dispatch(updateUser(userData));

      // 2) get producer (non bloquant si erreur)
      let producer = null;
      try {
        const producerResponse = await producerTools.getProducerInfos(token);
        if (producerResponse.success) {
          producer = producerResponse.data;
        } else {
          // log but don't block (possible non-producer account)
          console.warn(
            "producerTools.getProducerInfos:",
            producerResponse.message,
          );
        }
      } catch (err) {
        console.warn("producerTools.getProducerInfos error:", err);
      }

      // 3) redirect depending on role/onboarding/next
      const redirect = getRedirectTarget({ user: userData, producer, next });
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
        default:
          navigation.navigate("Home");
      }

      return true;
    } catch (err) {
      console.error("fetchDataFlow unexpected error:", err);
      SheetManager.show("alert", {
        payload: {
          message: "Une erreur inattendue est survenue.",
          alertType: "error",
        },
      });
      return false;
    } finally {
      setBackendWorking(false);
    }
  };

  /** Standard email+password sign-in */
  const onSignInPress = useCallback(async () => {
    // validations
    if (emailAddress.trim() === "") {
      SheetManager.show("alert", {
        payload: { message: "Veuillez saisir un email.", alertType: "warning" },
      });
      return;
    }
    if (password.trim() === "") {
      SheetManager.show("alert", {
        payload: {
          message: "Veuillez saisir un mot de passe.",
          alertType: "warning",
        },
      });
      return;
    }

    if (!isLoaded) return;

    setConnectionLoading(true);
    setBackendWorking(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        // active la session Clerk
        await setActive({ session: signInAttempt.createdSessionId });
        // maintenant on récupère les infos côté backend (avec timeout + erreurs)
        const ok = await fetchDataFlow();
        if (!ok) {
          // Backend failed: on ne force pas le signOut automatique.
          // On prévient l'utilisateur et lui laisse la session Clerk active
          // pour qu'il puisse réessayer (tu peux changer pour forcer signOut si tu veux).
          return;
        }
      } else {
        // non-complete: display Clerk returned info for debug
        console.error(
          "signInAttempt not complete:",
          JSON.stringify(signInAttempt, null, 2),
        );
        SheetManager.show("alert", {
          payload: {
            message: "Impossible de se connecter avec ces identifiants.",
            alertType: "error",
          },
        });
      }
    } catch (err: any) {
      // Clerk-level error (bad credentials, rate limit, network at Clerk level, ...)
      console.error("onSignInPress error:", err);
      // Try to map common Clerk errors:
      if (err?.errors?.length) {
        const joined = err.errors.map((e: any) => e?.message).join("\n");
        SheetManager.show("alert", {
          payload: { message: joined, alertType: "error" },
        });
      } else {
        SheetManager.show("alert", {
          payload: {
            message: "Connexion impossible avec ces identifiants.",
            alertType: "error",
          },
        });
      }
    } finally {
      // IMPORTANT : on remet les 2 flags à false ici aussi pour couvrir tous les cas
      setConnectionLoading(false);
      setBackendWorking(false);
    }
  }, [emailAddress, password, isLoaded, signIn, setActive]);

  /** Google SSO flow - same pattern as above */
  const onGoogleAuthPress = useCallback(async () => {
    if (!isLoaded) return;
    setBackendWorking(true);
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "meloko",
      });
      console.log("redirectUrl: ", redirectUrl);
      const result = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });
      const {
        createdSessionId,
        setActive: setActiveFromSSO,
        signUp,
      } = result as any;

      // const { createdSessionId, setActive, signIn, signUp } = result;
      console.log("result :", result);
      if (createdSessionId) {
        console.log("youpi2");
        if (signUp?.createdUserId) {
          // new user sign up (store and open modal)
          pendingSessionIdRef.current = createdSessionId;
          setIsChooseAccountTypeModalvisible(true);
        } else {
          // existing user: activate and fetch data
          await setActiveFromSSO!({ session: createdSessionId });
          // await setActive!({ session: createdSessionId });

          const ok = await fetchDataFlow();

          if (!ok) {
            // backend problem: user still signed in at Clerk side; user can retry or sign out
            return;
          }
        }
      } else {
        SheetManager.show("alert", {
          payload: {
            message: "Erreur lors de la connexion avec Google.",
            alertType: "error",
          },
        });
      }
    } catch (err) {
      console.error("onGoogleAuthPress error:", err);
      SheetManager.show("alert", {
        payload: {
          message: "Erreur lors de la connexion via Google.",
          alertType: "error",
        },
      });
    } finally {
      setBackendWorking(false);
    }
  }, [isLoaded, startSSOFlow]);

  /** Facebook SSO */
  const onFacebookAuthPress = useCallback(async () => {
    if (!isLoaded) return;
    setBackendWorking(true);
    try {
      const {
        createdSessionId,
        setActive: setActiveFromSSO,
        signUp,
      } = (await startSSOFlow({
        strategy: "oauth_facebook",
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "meloko",
          path: "expo-development-client",
        }),
      })) as any;

      if (createdSessionId) {
        if (signUp?.createdUserId) {
          pendingSessionIdRef.current = createdSessionId;
          setIsChooseAccountTypeModalvisible(true);
        } else {
          await setActiveFromSSO!({ session: createdSessionId });
          const ok = await fetchDataFlow();
          if (!ok) return;
        }
      } else {
        SheetManager.show("alert", {
          payload: {
            message: "Erreur lors de la connexion avec Facebook.",
            alertType: "error",
          },
        });
      }
    } catch (err) {
      console.error("onFacebookAuthPress error:", err);
      SheetManager.show("alert", {
        payload: {
          message: "Erreur lors de la connexion via Facebook.",
          alertType: "error",
        },
      });
    } finally {
      setBackendWorking(false);
    }
  }, [isLoaded, startSSOFlow]);

  // ChooseAccountType modal callbacks (for new users created via SSO)
  const onChooseAccountUser = async () => {
    // activate stored session then fetchDataFlow
    const id = pendingSessionIdRef.current!;
    if (!id) return;
    setBackendWorking(true);
    try {
      await setActive!({ session: id });
      pendingSessionIdRef.current = null;
      setIsChooseAccountTypeModalvisible(false);
      await fetchDataFlow();
    } catch (err) {
      console.error("onChooseAccountUser error:", err);
      SheetManager.show("alert", {
        payload: {
          message: "Erreur lors de la finalisation du compte.",
          alertType: "error",
        },
      });
    } finally {
      setBackendWorking(false);
    }
  };

  const onChooseAccountProducer = async () => {
    const id = pendingSessionIdRef.current!;
    if (!id) return;
    setBackendWorking(true);
    try {
      await setActive!({ session: id });
      pendingSessionIdRef.current = null;
      // create producer on backend
      const token = await getToken();
      const producerResponse = await producerTools.initialiseProducer(token);
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
      await fetchDataFlow();
    } catch (err) {
      console.error("onChooseAccountProducer error:", err);
      SheetManager.show("alert", {
        payload: {
          message: "Erreur lors de la création du compte producteur.",
          alertType: "error",
        },
      });
    } finally {
      setBackendWorking(false);
    }
  };

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
              {/* Texte */}
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
          <InputText
            value={emailAddress}
            onChangeText={(t: string) => setEmailAddress(t)}
            placeholder="example@gmail.com"
            label="Email"
            size="large"
            autoCapitalize="none"
            extraClasses="w-full mb-2"
          />
          <InputText
            value={password}
            onChangeText={(t: string) => setPassword(t)}
            placeholder="Mot de passe"
            label="Mot de passe"
            autoCapitalize="none"
            extraClasses="w-full mb-2"
            size="large"
            secureTextEntry={passwordInvisible}
            iconName="eye"
            onIconPressFn={() => setPasswordInvisible((p) => !p)}
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

      {/* full screen overlay when waiting for backend */}
      {backendWorking && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-darkbg/80">
          <Spinner />
        </View>
      )}

      <ChooseAccountTypeModal
        isVisible={isChooseAccountTypeModalVisible}
        onUserPress={onChooseAccountUser}
        onProducerPress={onChooseAccountProducer}
      />
    </SafeAreaView>
  );
}
