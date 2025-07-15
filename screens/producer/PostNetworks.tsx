import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { setShopData, ShopState } from "../../reducers/shop";

import networksTools from "../../modules/networksTools";
import { NetworksData } from "../../types/API";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";

import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";

import TopBar from "../../components/TopBar";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import TextBody1 from "../../components/utils/texts/Body1";
import ButtonSecondaryEnd from "../../components/utils/buttons/SecondaryEnd";
import { SheetManager } from "react-native-actions-sheet";
import Spinner from "../../components/utils/Spinner";

type PostNetworksScreenRouteProp = RouteProp<
  RootStackParamList,
  "PostNetworks"
>;

type PostNetworksScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostNetworks"
>;

type Props = {
  navigation: PostNetworksScreenNavigationProp;
};

export default function PostNetworksScreen({ navigation }: Props) {
  const route = useRoute<PostNetworksScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const { getToken } = useAuth();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const [isActivating, setActivating] = useState<boolean>(false);

  const [networks, setNetworks] = useState<NetworksData>({
    instagram: {
      isEnabled: false,
      connected: false,
      username: "",
    },
    facebook: {
      isEnabled: false,
      connected: false,
      username: "",
    },
    tiktok: {
      isEnabled: false,
      connected: false,
      username: "",
    },
  });

  // les sections
  const instagramSection = useCollapsibleSection();
  const facebookSection = useCollapsibleSection();
  const tiktokSection = useCollapsibleSection();

  // section Instagram
  const [isInstagramLoading, setInstagramLoading] = useState<boolean>(false);

  // section Instagram
  const [isFacebookLoading, setFacebookLoading] = useState<boolean>(false);

  // section Instagram
  const [isTiktokLoading, setTiktokLoading] = useState<boolean>(false);

  const toggleNetworkEnabled = async (
    network: keyof NetworksData,
    value: boolean,
  ) => {
    setActivating(true);

    try {
      const token = await getToken();

      const updates = { isEnabled: value };

      const connectResponse = await networksTools.updateNetworks(token, {
        network,
        updates,
      });

      if (connectResponse.success && connectResponse.data) {
        dispatch(setShopData(connectResponse.data));

        setNetworks((prev) => ({
          ...prev,
          [network]: {
            ...prev[network],
            ...updates,
          },
        }));
      }
    } catch (error) {
      console.log(`Erreur connexion ${network}`, error);
    } finally {
      setActivating(false);
    }
  };

  const handleNetworkAction = async (
    network: keyof NetworksData,
    action: "connect" | "disconnect",
  ) => {
    const setLoadingMap = {
      instagram: setInstagramLoading,
      facebook: setFacebookLoading,
      tiktok: setTiktokLoading,
    };

    const setLoading = setLoadingMap[network];

    setLoading(true);

    try {
      const token = await getToken();

      const fakeUsername = "@fermeduchamp";

      const updates =
        action === "connect"
          ? {
              connected: true,
              username: fakeUsername,
            }
          : {
              connected: false,
              isEnabled: false,
              username: "",
              accessToken: "",
              refreshToken: "",
              userId: "",
              pageId: "",
              pageName: "",
              expiresAt: "",
            };

      const connectResponse = await networksTools.updateNetworks(token, {
        network,
        updates,
      });

      if (connectResponse.success && connectResponse.data) {
        dispatch(setShopData(connectResponse.data));

        setNetworks((prev) => ({
          ...prev,
          [network]: {
            ...prev[network],
            ...updates,
          },
        }));

        SheetManager.show("alert", {
          payload: {
            message:
              action === "connect"
                ? `Le réseau ${network} est connecté.`
                : `Le réseau ${network} est déconnecté.`,
            alertType: action === "connect" ? "success" : "warning",
          },
        });
      }
    } catch (error) {
      console.log(`Erreur connexion ${network}`, error);
      SheetManager.show("alert", {
        payload: {
          message: "Un problème est survenu.",
          alertType: "error",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopStore?.socials) {
      setNetworks({
        instagram: {
          connected: shopStore?.socials.instagram?.connected || false,
          isEnabled: shopStore?.socials.instagram?.isEnabled || false,
          username: shopStore?.socials.instagram?.username || "",
          pageId: shopStore?.socials.instagram?.pageId,
          pageName: shopStore?.socials.instagram?.pageName,
          accessToken: shopStore?.socials.instagram?.accessToken,
          refreshToken: shopStore?.socials.instagram?.refreshToken,
          userId: shopStore?.socials.instagram?.userId,
          expiresAt: shopStore?.socials.instagram?.expiresAt,
        },
        facebook: {
          connected: shopStore?.socials.facebook?.connected || false,
          isEnabled: shopStore?.socials.facebook?.isEnabled || false,
          username: shopStore?.socials.facebook?.username || "",
          pageId: shopStore?.socials.facebook?.pageId,
          pageName: shopStore?.socials.facebook?.pageName,
          accessToken: shopStore?.socials.facebook?.accessToken,
          refreshToken: shopStore?.socials.facebook?.refreshToken,
          userId: shopStore?.socials.facebook?.userId,
          expiresAt: shopStore?.socials.facebook?.expiresAt,
        },
        tiktok: {
          connected: shopStore?.socials.tiktok?.connected || false,
          isEnabled: shopStore?.socials.tiktok?.isEnabled || false,
          username: shopStore?.socials.tiktok?.username || "",
          accessToken: shopStore?.socials.tiktok?.accessToken,
          refreshToken: shopStore?.socials.tiktok?.refreshToken,
          userId: shopStore?.socials.tiktok?.userId,
          expiresAt: shopStore?.socials.tiktok?.expiresAt,
        },
      });
    }
  }, [shopStore]);

  console.log(JSON.stringify(shopStore?.socials, null, 2));

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour aux paramètres"}
          screen={from || "PostNetworks"}
          label={screenTitle || "PARAMETRES"}
          extraClasses="mt-2 mb-5"
        />
      </View>

      <View style={{ flex: 10 }}>
        <ScrollView>
          <OpenMenuButton
            label="Instagram"
            switchProps={{
              label: "",
              value: networks.instagram.isEnabled,
              onValueChange: (value) => {
                if (networks.instagram.connected) {
                  setNetworks((prev) => ({
                    ...prev,
                    instagram: { ...prev.instagram, isEnabled: true },
                  }));
                  toggleNetworkEnabled("instagram", value);
                } else {
                  SheetManager.show("alert", {
                    payload: {
                      message: `Vous devez connecter le\nréseau avant de pouvoir\nl'activer.`,
                      alertType: "warning",
                    },
                  });
                }
              },
              extraClasses: "ml-2",
            }}
            onPressFn={instagramSection.toggle}
            redAlert={!networks.instagram.connected}
            greenAlert={networks.instagram.connected}
            extraClasses="mb-3 px-3"
          />

          <Animated.View
            style={[instagramSection.animatedStyle]}
            className="overflow-hidden"
          >
            <View
              onLayout={instagramSection.onLayout}
              style={instagramSection.innerContainerStyle}
              className="px-3"
            >
              <View className="px-5 mb-5">
                {!networks.instagram.connected ? (
                  <TextBody1 centered>Compte Instagram non connecté</TextBody1>
                ) : (
                  <TextBody1 centered>
                    Utilisateur connecté: {networks.instagram.username}
                  </TextBody1>
                )}

                <ButtonSecondaryEnd
                  label={
                    networks.instagram.connected ? "Déconnexion" : "Connexion"
                  }
                  iconName="instagram"
                  iconFamily="FontAwesome5Icon"
                  onPressFn={() =>
                    handleNetworkAction(
                      "instagram",
                      networks.instagram.connected ? "disconnect" : "connect",
                    )
                  }
                  isLoading={isInstagramLoading}
                  extraClasses="my-3"
                />
              </View>
            </View>
          </Animated.View>

          <OpenMenuButton
            label="Facebook"
            switchProps={{
              label: "",
              value: networks.facebook.isEnabled,
              onValueChange: (value) => {
                if (networks.facebook.connected) {
                  setNetworks((prev) => ({
                    ...prev,
                    facebook: { ...prev.facebook, isEnabled: true },
                  }));
                  toggleNetworkEnabled("facebook", value);
                } else {
                  SheetManager.show("alert", {
                    payload: {
                      message: `Vous devez connecter le\nréseau avant de pouvoir\nl'activer.`,
                      alertType: "warning",
                    },
                  });
                }
              },
              extraClasses: "ml-2",
            }}
            onPressFn={facebookSection.toggle}
            redAlert={!networks.facebook.connected}
            greenAlert={networks.facebook.connected}
            extraClasses="mb-3 px-3"
          />

          <Animated.View
            style={[facebookSection.animatedStyle]}
            className="overflow-hidden"
          >
            <View
              onLayout={facebookSection.onLayout}
              style={facebookSection.innerContainerStyle}
              className="px-3"
            >
              <View className="px-5 mb-5">
                {!networks.facebook.connected ? (
                  <TextBody1>Page Facebook non connecté</TextBody1>
                ) : (
                  <TextBody1>
                    Page Facebook connectée: {networks.facebook.username}
                  </TextBody1>
                )}

                <ButtonSecondaryEnd
                  label={
                    networks.facebook.connected ? "Déconnexion" : "Connexion"
                  }
                  iconName="facebook"
                  iconFamily="FontAwesome5Icon"
                  onPressFn={() =>
                    handleNetworkAction(
                      "facebook",
                      networks.facebook.connected ? "disconnect" : "connect",
                    )
                  }
                  isLoading={isFacebookLoading}
                  extraClasses="my-3"
                />
              </View>
            </View>
          </Animated.View>

          <OpenMenuButton
            label="Tiktok"
            switchProps={{
              label: "",
              value: networks.tiktok.isEnabled,
              onValueChange: (value) => {
                if (networks.tiktok.connected) {
                  setNetworks((prev) => ({
                    ...prev,
                    tiktok: { ...prev.tiktok, isEnabled: true },
                  }));
                  toggleNetworkEnabled("tiktok", value);
                } else {
                  SheetManager.show("alert", {
                    payload: {
                      message: `Vous devez connecter le\nréseau avant de pouvoir\nl'activer.`,
                      alertType: "warning",
                    },
                  });
                }
              },
              extraClasses: "ml-2",
            }}
            onPressFn={tiktokSection.toggle}
            redAlert={!networks.tiktok.connected}
            greenAlert={networks.tiktok.connected}
            extraClasses="mb-3 px-3"
          />

          <Animated.View
            style={[tiktokSection.animatedStyle]}
            className="overflow-hidden"
          >
            <View
              onLayout={tiktokSection.onLayout}
              style={tiktokSection.innerContainerStyle}
              className="px-3"
            >
              <View className="px-5 mb-5">
                {!networks.tiktok.connected ? (
                  <TextBody1>Compte Tiktok non connecté</TextBody1>
                ) : (
                  <TextBody1>
                    Compte Tiktok connectée: {networks.tiktok.username}
                  </TextBody1>
                )}

                <ButtonSecondaryEnd
                  label={
                    networks.tiktok.connected ? "Déconnexion" : "Connexion"
                  }
                  iconName="tiktok"
                  iconFamily="FontAwesome5Icon"
                  onPressFn={() =>
                    handleNetworkAction(
                      "tiktok",
                      networks.tiktok.connected ? "disconnect" : "connect",
                    )
                  }
                  isLoading={isTiktokLoading}
                  extraClasses="my-3"
                />
              </View>
            </View>
          </Animated.View>

          {isActivating && (
            <View className="flex items-center justify-center h-32">
              <Spinner />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
