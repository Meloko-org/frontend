import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(authToken: string | null) {
  console.log("registerForPushNotifications");

  if (!Device.isDevice) {
    console.log("Push notifications only work on physical devices");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  console.log("existingstatus :", existingStatus);

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  console.log("finalStatus :", finalStatus);

  if (finalStatus !== "granted") {
    console.log("Permission refusée");
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.error("Expo projectId introuvable");
    return null;
  }

  let expoPushToken: string;

  try {
    expoPushToken = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
  } catch (err) {
    console.error("Erreur getExpoPushTokenAsync", err);
    return null;
  }

  console.log("token :", expoPushToken);
  console.log("appel fetch");
  // à faire UNE SEULE FOIS par utilisateur
  await fetch(`${API_ROOT}/notifications/users/push-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      token: expoPushToken,
      platform: Platform.OS,
    }),
  });

  console.log("Expo push token:", expoPushToken);
  return expoPushToken;
}

export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Commande prête 🧺",
      body: "Votre commande est prête à être récupérée",
      data: { orderId: "test-order-id" },
    },
    trigger: null, // immédiat
  });
}
