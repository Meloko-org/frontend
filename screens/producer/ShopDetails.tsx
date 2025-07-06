import React, { JSX, ReactNode, useCallback } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { setShopData, ShopState } from "../../reducers/shop";

import saveImageLocally from "../../helpers/ImageHelpers";
import shopTools from "../../modules/shopTools";
import { AddressData, CrewMember } from "../../types/API";

import { Dimensions, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { SheetManager } from "react-native-actions-sheet";

import TopBar from "../../components/TopBar";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import InputText from "../../components/utils/inputs/Text";
import InputTextarea from "../../components/utils/inputs/Textarea";
import ImageUploader from "../../components/utils/ImageUploader";
import CrewMemberEditCard from "../../components/cards/CrewMemberEdit";
import Thumbnail from "../../components/utils/Thumbnail";
import ThumbnailCarousel from "../../components/utils/ThumbnailCarousel";
import TextBody1 from "../../components/utils/texts/Body1";
import VideoThumbnail from "../../components/utils/VideoThumbnail";

type ShopDetailsScreenRouteProp = RouteProp<RootStackParamList, "ShopDetails">;

type ShopDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopDetails"
>;

type Props = {
  navigation: ShopDetailsScreenNavigationProp;
};

export default function ShopDetailsScreen({ navigation }: Props) {
  const route = useRoute<ShopDetailsScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};
  const { getToken } = useAuth();

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);

  // fonction à passer à CrewMemberEdit pour détecter les changements des inputs
  const handleDataChange = () => {
    if (!hasChanges) setHasChanges(true);
  };

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const isPremium = shopStore?.isPremium;

  // nécessaire pour le calcul de la hauteur du conteneur de la teamSection
  const [topBarHeight, setTopBarHeight] = useState(0);
  const bottomHeight = 80;
  const scrollHeight =
    Dimensions.get("window").height - topBarHeight - bottomHeight;

  // gestion des erreurs
  const [errors, setErrors] = useState({
    name: false,
    siret: false,
    address1: false,
    postalCode: false,
    city: false,
    country: false,
  });

  // Logo, nom, siret
  const [logo, setLogo] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [siret, setSiret] = useState<string>("");

  const handleImageSelected = async (uri: string) => {
    const savedUri = await saveImageLocally(uri, "shopImages/");
    if (savedUri) {
      console.log("image sauvée");
      setLogo(savedUri);
    }
  };

  const descSection = useCollapsibleSection();
  const addressSection = useCollapsibleSection();
  const photoSection = useCollapsibleSection();
  const videoSection = useCollapsibleSection();
  const teamSection = useCollapsibleSection();

  // desc Section

  const [shortDesc, setShortDesc] = useState<string>("");
  const [longDesc, setLongDesc] = useState<string>("");

  // address Section
  const [address, setAddress] = useState<AddressData>({
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
  });

  // photo Section
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (shopStore && shopStore.photos) {
      setPhotos(shopStore.photos);
    }
  }, [shopStore?.photos]);

  const handlePhotosSelected = (uri: string) => {
    setPhotos((prev) => {
      if (isPremium) {
        return [...prev, uri];
      } else {
        return [uri];
      }
    });
    setHasChanges(true);
  };

  // Video Section
  const [video, setVideo] = useState<string[]>([]);

  // const player = useVideoPlayer(video[0], (player) => {
  //   player.staysActiveInBackground = false;
  // })

  useEffect(() => {
    if (shopStore?.video) {
      setVideo(shopStore?.video);
    }
  }, [shopStore?.video]);

  const handleVideosSelected = (uri: string) => {
    setVideo([uri]);
    setHasChanges(true);
  };

  // TeamSection
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [editableCrew, setEditableCrew] = useState<CrewMember[]>([]);

  useEffect(() => {
    if (shopStore !== null && shopStore.crew) {
      setEditableCrew(shopStore.crew);
    }
  }, [shopStore]);

  useEffect(() => {
    if (teamSection.isOpen) {
      // petit délai pour que le DOM se mette à jour
      setTimeout(() => {
        teamSection.refresh();
      }, 10);
    }
  }, [editableCrew.length]);

  const handleAddMember = () => {
    const newMember = { forname: "", role: "", description: "", photo: "" };
    setEditableCrew((prev) => [newMember, ...prev]);
  };

  useEffect(() => {
    /* retrieve shop infos if exists */
    if (shopStore !== null) {
      setName(shopStore.name);
      setShortDesc(shopStore.shortDesc);
      setLongDesc(shopStore.longDesc); // à modifier shortDesc/longDesc
      setSiret(shopStore.siret);
      setLogo(shopStore.logo);
      setAddress({
        address1: shopStore.address.address1,
        address2: shopStore.address.address2,
        postalCode: shopStore.address.postalCode,
        city: shopStore.address.city,
        country: shopStore.address.country,
      });
    }
  }, []);

  const handleSave = async () => {
    try {
      console.log("save1");
      setSaveLoading(true);

      // vérification des erreurs
      const hasErrors = Object.values(errors).some(Boolean);
      if (hasErrors) {
        console.log("erreeeeurs :", errors);
        setSaveLoading(false);
        return;
      }

      // s'il n'y a pas d'erreurs, on s'aasure que chaque membre a bien un prénom et un role
      const valideCrew = editableCrew.filter((member) => {
        return member.forname.trim() !== "" && member.role.trim() !== "";
      });
      // puis on commence la sauvegarde
      const token = await getToken();

      // à venir: stockage des fichiers dans le stockage distant

      const values = {
        _id: shopStore?._id,
        name,
        siret,
        shortDesc,
        longDesc,
        logo,
        address,
        photos,
        video,
        crew: valideCrew,
      };

      const shopResponse = await shopTools.updateShop(token, values);

      if (!shopResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: "La mise à jour a échoué.",
            alertType: "error",
          },
        });
        return;
      }

      dispatch(setShopData(shopResponse.data));

      setSaveLoading(false);
      setHasChanges(false);

      SheetManager.show("alert", {
        payload: {
          message: "Shop mis à jour.",
          alertType: "success",
        },
      });
    } catch (error) {}
  };

  console.log("shopStore video :", shopStore?.video);

  return (
    <View className="flex-1 h-full bg-lightbg dark:bg-darkbg">
      <SafeAreaView className="bg-lightbg flex-1 dark:bg-darkbg">
        <TopBar
          onLayout={(event) => {
            setTopBarHeight(event.nativeEvent.layout.height);
          }}
          backLabel={backLabel || "Retour à l'accueil"}
          screen={from || "Home"}
          label={screenTitle || "CONNEXION\nINSCRIPTION"}
          extraClasses="mt-2 mb-5"
        />

        <ScrollView
          style={{ height: scrollHeight }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          className="flex-1"
        >
          <View className="">
            <View className="flex flex-row justify-between items-center mb-5 px-3">
              <View className="flex flex-row justify-center items-center w-2/6">
                <ImageUploader
                  defaultUri={shopStore?.logo}
                  onImageSelected={handleImageSelected}
                  mediaTypes={["images"]}
                  message={`Choisisssez une image\nou prenez une photo.`}
                />
              </View>

              <View className="w-4/6">
                <InputText
                  label="Nom"
                  placeholder="Saisissez le nom de la boutique"
                  value={name}
                  onChangeText={(value: string) => {
                    setName(value);
                    if (errors.name && value.trim() !== "") {
                      setErrors((prev) => ({ ...prev, name: false }));
                    } else if (!hasChanges) {
                      setHasChanges(true); // activation du bouton de sauvegarde
                    }
                  }}
                  onBlur={() =>
                    setErrors((prev) => ({
                      ...prev,
                      name: (name ?? "").trim() === "",
                    }))
                  }
                  showError={errors.name}
                  extraClasses="mb-2"
                />
                <InputText
                  label="Siret"
                  placeholder="Saisissez le siret de la boutique"
                  value={siret}
                  onChangeText={(value: string) => {
                    setSiret(value);
                    if (errors.siret && value.trim() !== "") {
                      setErrors((prev) => ({ ...prev, siret: false }));
                    } else if (!hasChanges) {
                      setHasChanges(true);
                    }
                  }}
                  onBlur={() =>
                    setErrors((prev) => ({
                      ...prev,
                      siret: (siret ?? "").trim() === "",
                    }))
                  }
                  showError={errors.siret}
                  extraClasses="mb-2"
                />
              </View>
            </View>

            <OpenMenuButton
              label="Description"
              onPressFn={descSection.toggle}
              extraClasses="mb-2 px-3"
            />

            <Animated.View
              style={[descSection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={descSection.onLayout}
                style={descSection.innerContainerStyle}
                className="px-3"
              >
                <InputTextarea
                  label="Courte description"
                  placeholder="Saisissez une courte description de votre boutique"
                  value={shortDesc}
                  onChangeText={(value: string) => {
                    setShortDesc(value);
                    if (!hasChanges) {
                      setHasChanges(true);
                    }
                  }}
                  extraClasses="mb-2 w-full"
                />
                <InputTextarea
                  label="Présentation"
                  placeholder="Présentez votre boutique"
                  value={longDesc}
                  onChangeText={(value: string) => {
                    setLongDesc(value);
                    if (!hasChanges) {
                      setHasChanges(true);
                    }
                  }}
                  extraClasses="mb-2 w-full h-48"
                />
              </View>
            </Animated.View>

            <OpenMenuButton
              label="Adresse"
              onPressFn={addressSection.toggle}
              extraClasses="mb-2 px-3"
            />

            <Animated.View
              style={[addressSection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={addressSection.onLayout}
                style={addressSection.innerContainerStyle}
                className="px-3"
              >
                <InputText
                  label="Adresse"
                  placeholder="Saisissez votre adresse"
                  value={address.address1}
                  onChangeText={(value: string) => {
                    setAddress({
                      address1: value,
                      address2: address.address2,
                      postalCode: address.postalCode,
                      city: address.city,
                      country: address.country,
                    });
                    if (errors.address1 && value.trim() !== "") {
                      setErrors((prev) => ({ ...prev, address1: false }));
                    } else if (!hasChanges) {
                      setHasChanges(true);
                    }
                  }}
                  onBlur={() =>
                    setErrors((prev) => ({
                      ...prev,
                      address1: (address.address1 ?? "").trim() === "",
                    }))
                  }
                  extraClasses="mb-2"
                />
                <InputText
                  label="Adresse complément"
                  placeholder="Complément d'adresse"
                  value={address.address2}
                  onChangeText={(value: string) => {
                    setAddress({
                      address1: address.address1,
                      address2: value,
                      postalCode: address.postalCode,
                      city: address.city,
                      country: address.country,
                    });
                    if (!hasChanges) {
                      setHasChanges(true);
                    }
                  }}
                  extraClasses="mb-2"
                />
                <View className="flex-row">
                  <InputText
                    label="Code Postal"
                    placeholder="Saisissez le code postal"
                    value={address.postalCode}
                    onChangeText={(value: string) => {
                      setAddress({
                        address1: address.address1,
                        address2: address.address2,
                        postalCode: value,
                        city: address.city,
                        country: address.country,
                      });
                      if (errors.postalCode && value.trim() !== "") {
                        setErrors((prev) => ({ ...prev, postalCode: false }));
                      } else if (!hasChanges) {
                        setHasChanges(true);
                      }
                    }}
                    onBlur={() => {
                      setErrors((prev) => ({
                        ...prev,
                        postalCode: (address.postalCode ?? "").trim() === "",
                      }));
                    }}
                    extraClasses="mb-2 w-[30%] mr-[2%]"
                  />
                  <InputText
                    label="Ville"
                    placeholder="Saisissez la ville"
                    value={address.city}
                    onChangeText={(value: string) => {
                      setAddress({
                        address1: address.address1,
                        address2: address.address2,
                        postalCode: address.postalCode,
                        city: value,
                        country: address.country,
                      });
                      if (errors.city && value.trim() !== "") {
                        setErrors((prev) => ({ ...prev, city: false }));
                      } else if (!hasChanges) {
                        setHasChanges(true);
                      }
                    }}
                    onBlur={() => {
                      setErrors((prev) => ({
                        ...prev,
                        city: (address.city ?? "").trim() === "",
                      }));
                    }}
                    extraClasses="mb-2 w-[68%]"
                  />
                </View>

                <InputText
                  label="Pays"
                  placeholder="Saisissez le pays"
                  value={address.country}
                  onChangeText={(value: string) => {
                    setAddress({
                      address1: address.address1,
                      address2: address.address2,
                      postalCode: address.postalCode,
                      city: address.city,
                      country: value,
                    });
                    if (errors.country && value.trim() !== "") {
                      setErrors((prev) => ({ ...prev, country: false }));
                    } else if (!hasChanges) {
                      setHasChanges(true);
                    }
                  }}
                  onBlur={() => {
                    setErrors((prev) => ({
                      ...prev,
                      country: (address.country ?? "").trim() === "",
                    }));
                  }}
                  extraClasses="mb-5"
                />
              </View>
            </Animated.View>

            <OpenMenuButton
              label="Photos"
              onPressFn={photoSection.toggle}
              extraClasses="mb-2 px-3"
            />

            <Animated.View
              style={[photoSection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={photoSection.onLayout}
                style={photoSection.innerContainerStyle}
                className="px-2"
              >
                <View className="flex items-center px-3 mb-3">
                  <View className="flex flex-row items-center">
                    <View>
                      <ImageUploader
                        label="PHOTO"
                        onImageSelected={handlePhotosSelected}
                        mediaTypes={["images"]}
                        message={`Ajoutez une photo.`}
                      />
                    </View>
                    <View className="pl-3">
                      <TextBody1
                        centered
                      >{`Ajoutez ou\nmodifier\nles photos`}</TextBody1>
                    </View>
                  </View>
                </View>

                {!isPremium ? (
                  <Thumbnail
                    source={photos[0]}
                    style={{ width: "100%", aspectRatio: 16 / 9 }}
                    extraClasses="flex flex-row items-center rounded-lg w-auto bg-white"
                    onDelete={(uri: string) => {
                      setPhotos((prev) =>
                        prev.filter((photo) => photo !== uri),
                      );
                      setHasChanges(true);
                    }}
                  />
                ) : (
                  <ThumbnailCarousel
                    images={photos}
                    onDeleteImage={(uri: string) => {
                      setPhotos((prev) =>
                        prev.filter((photo) => photo !== uri),
                      );
                      setHasChanges(true);
                    }}
                    extraClasses="mb-5"
                  />
                )}
              </View>
            </Animated.View>

            {isPremium && (
              <>
                <OpenMenuButton
                  label="Videos"
                  icon="crown"
                  iconFamily="FontAwesome5Icon"
                  iconColor="premium"
                  onPressFn={videoSection.toggle}
                  extraClasses="mb-2 px-3"
                  bgColor="bg-premiumbg"
                />

                <Animated.View
                  style={[videoSection.animatedStyle]}
                  className="overflow-hidden"
                >
                  <View
                    onLayout={videoSection.onLayout}
                    style={videoSection.innerContainerStyle}
                  >
                    <View className="flex items-center px-3 mb-3">
                      <View className="flex flex-row items-center">
                        <View>
                          <ImageUploader
                            label="VIDEO"
                            onImageSelected={handleVideosSelected}
                            mediaTypes={["videos"]}
                            message={`Ajoutez une video.`}
                          />
                        </View>
                        <View className="pl-3">
                          <TextBody1>{`Ajoutez ou\nmodifier une vidéo`}</TextBody1>
                        </View>
                      </View>
                    </View>

                    <VideoThumbnail
                      source={video[0]}
                      onDelete={() => {
                        setVideo([]);
                        setHasChanges(true);
                      }}
                      placeholderText="Aucune vidéo"
                    />
                  </View>
                </Animated.View>

                {/* TEAM */}
                <OpenMenuButton
                  label="Equipe"
                  icon="crown"
                  iconFamily="FontAwesome5Icon"
                  iconColor="premium"
                  onPressFn={() => {
                    // refresh nécessaire s'il y a eu un ajout de membre et que la hauteur du conteneur est recalculée
                    teamSection.refresh();

                    // Attendre le prochain tick pour laisser `onLayout` s'exécuter s'il y a eu un changement
                    setTimeout(() => {
                      teamSection.toggle();
                    }, 10);
                  }}
                  extraClasses="mb-2 px-3"
                  bgColor="bg-premiumbg"
                />

                <Animated.View
                  style={[teamSection.animatedStyle]}
                  className="overflow-hidden"
                >
                  <View
                    key={editableCrew.length}
                    onLayout={teamSection.onLayout}
                    style={teamSection.innerContainerStyle}
                    className="px-3"
                  >
                    <View className="px-5">
                      <ButtonPrimaryEnd
                        label="Ajouter un membre"
                        iconName="user-plus"
                        iconFamily="FontAwesome5Icon"
                        onPressFn={() => {
                          handleAddMember();
                          handleDataChange();
                        }}
                        extraClasses="mb-5 h-14"
                      />
                    </View>

                    {editableCrew.map((member, index) => (
                      <CrewMemberEditCard
                        key={index}
                        member={member}
                        onChange={(updateMember) => {
                          const newCrew = [...editableCrew];
                          newCrew[index] = updateMember;
                          setEditableCrew(newCrew);
                          handleDataChange();
                        }}
                        onDelete={() => {
                          const newCrew = [...editableCrew];
                          newCrew.splice(index, 1);
                          setEditableCrew(newCrew);
                          handleDataChange();
                        }}
                        onDataChange={handleDataChange}
                        extraClasses="mb-5"
                      />
                    ))}
                  </View>
                </Animated.View>
              </>
            )}
          </View>
        </ScrollView>

        <View className="px-5 absolute bottom-0 bg-lightbg dark:bg-darkbg w-full flex items-center">
          <ButtonPrimaryEnd
            label="Sauvegarder"
            iconFamily="FontAwesome5Icon"
            iconName="sync-alt"
            disabled={!hasChanges || isSaveLoading}
            onPressFn={() => handleSave()}
            isLoading={isSaveLoading}
            extraClasses="mt-5 mb-5 h-14"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
