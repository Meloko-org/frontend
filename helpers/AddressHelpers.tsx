import * as Location from "expo-location";

export type MyPositionResult = {
  success: boolean;
  position?: Location.LocationObject;
  error?: string;
};

export default async function useMyPosition(): Promise<MyPositionResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return { success: false, error: "Permission de localisation refusée." };
    }

    const position = await Location.getCurrentPositionAsync({});

    return { success: true, position };
  } catch (error) {
    return { success: false, error: "Impossible de récupérer la position." };
  }
}

export type AddresResult = {
  success: boolean;
  coords?: {
    latitude: number;
    longitude: number;
  };
  error?: string;
};

export async function getAddressCoordinates(
  address: string,
): Promise<AddresResult> {
  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${address}`,
    );

    const data = await response.json();

    if (!response.ok || !data.features || data.features.length === 0) {
      return {
        success: false,
        error: "Adresse inconnue.",
      };
    }

    return {
      success: true,
      coords: {
        latitude: data.features[0].geometry.coordinates[1],
        longitude: data.features[0].geometry.coordinates[0],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Impossible de récupéreer les coordonnées de l'adresse.",
    };
  }
}
