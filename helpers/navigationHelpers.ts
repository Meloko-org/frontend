import { ProducerData, UserData } from "../types/API";
import {
  ProducerTabParamList,
  Redirect,
  RootStackParamList,
  UserTabParamList,
} from "../types/Navigation";

type AuthContext = {
  user: UserData | null;
  producer?: ProducerData | null;
  next?: string;
};

export function getRedirectTarget({
  user,
  producer,
  next,
}: AuthContext): Redirect {
  // pas de user -> signup
  if (!user) {
    return { type: "root", screen: "SignUp" };
  }

  // user simple
  if (!producer) {
    if (next) {
      return { type: "userTab", screen: next as keyof UserTabParamList };
    }
    return { type: "userTab", screen: "MapCustomer" };
  }

  // producer : inscription -> debut onboarding
  if (producer && producer.onboardingStep === 0) {
    return {
      type: "onboarding",
      screen: "Onboarding0" as keyof RootStackParamList,
    };
  }

  // producer : onboarding arrivé à l'étape 5
  if (producer && producer.onboardingStep === 5) {
    return {
      type: "onboarding",
      screen: "Onboarding5" as keyof RootStackParamList,
    };
  }

  // producer : onboarding stoppé avant l'étape 5
  if (producer && producer.onboardingStep < 5) {
    return {
      type: "onboarding",
      screen: ("Onboarding" +
        (producer.onboardingStep + 1)) as keyof RootStackParamList,
    };
  }

  // producer : onboarding terminé
  return {
    type: "producerTab",
    screen: "BusinessCenter" as keyof ProducerTabParamList,
  };
}
