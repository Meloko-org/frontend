import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "../types/Navigation";

/* 
	Ce fichier permet de créer et utiliser une référence globale de navigation.
	Ce qui permet d'utiliser la sheet SignInRequired qui n'est pas un enfant du 
	NavigationContainer
 */

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
