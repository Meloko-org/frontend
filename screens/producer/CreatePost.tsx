import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { PostThemeData, TagData } from "../../types/API";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import {
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import TopBar from "../../components/TopBar";
import TextHeading3 from "../../components/utils/texts/Heading3";
import SelectableTag from "../../components/utils/badges/SelectableTag";
import TextBody1 from "../../components/utils/texts/Body1";
import NetworkSelector from "../../components/NetworkSelector";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import TextBody2 from "../../components/utils/texts/Body2";
import TextHeading4 from "../../components/utils/texts/Heading4";
import globalTools from "../../modules/globalTools";
import StarsNotation from "../../components/utils/StarsNotation";
import ImageUploader from "../../components/utils/ImageUploader";
import VideoThumbnail from "../../components/utils/VideoThumbnail";

type CreatePostScreenRouteProp = RouteProp<RootStackParamList, "CreatePost">;

type CreatePostScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePost"
>;

type Props = {
  navigation: CreatePostScreenNavigationProp;
};

export default function CreatePostScreen({ navigation }: Props) {
  const route = useRoute<CreatePostScreenRouteProp>();
  const { from, backLabel, screenTitle, stock, note, activity } =
    route.params || {};

  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [previewEnable, setPreviewEnable] = useState<boolean>(false);

  // states liés au produit
  const [customProduct, setCustomProduct] = useState<boolean>(false);
  const [tags, setTags] = useState<TagData[] | undefined>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // states liés à un avis

  const [media, setMedia] = useState<string>();
  const [mediaType, setMediaType] = useState<string>();

  const [postType, setPostType] = useState<string>("Product");

  const [socials, setSocials] = useState<string[]>([]);
  const [selectedSocials, setSelectedsocials] = useState<string[]>([]);

  const themeSection = useCollapsibleSection();
  const [themes, setThemes] = useState<PostThemeData[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<PostThemeData | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      // réinitialisation des states pour un affichage vierge à chaque passage sur la screen
      setSelectedTags([]);
      setSelectedTheme(null);
      setSelectedsocials([]);

      if (stock) {
        setCustomProduct(stock.hasOwnProperty("productCustomName"));
        setTags(stock.tags);
        setPostType("product");
      } else if (note) {
        setPostType("review");
      } else if (activity) {
        setMedia(undefined);
        setMediaType(undefined);
        setPostType("activity");
      }

      // détection des réseaux valides
      const connectedNetworks = Object.entries(shopStore!.socials)
        .filter(([_, data]) => data.connected && data.isEnabled)
        .map(([network]) => network);

      setSocials(connectedNetworks);
    }, [stock, shopStore]),
  );

  // active ou désactive le bouton de preview
  useEffect(() => {
    if (selectedSocials.length > 0 && selectedTheme !== null) {
      setPreviewEnable(true);
    } else {
      setPreviewEnable(false);
    }
  }, [selectedSocials, selectedTags]);

  // récupère les thèmes de post pour alimenter la dropdown
  useEffect(() => {
    const fetchPostThemes = async () => {
      const response = await fetch(`${API_ROOT}/postThemes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
      });
      const allThemes = await response.json();

      const filteredThemes = allThemes.filter(
        (theme: PostThemeData) => theme.type === postType,
      );
      setThemes(filteredThemes);
    };

    fetchPostThemes();
  }, [postType]);

  // définit un élément de la dropdown
  const Item = ({ theme }: { theme: PostThemeData }) => (
    <TouchableOpacity
      className="border border-tertiary mb-1 rounded-lg bg-tertiary h-12 flex flex-row items-center justify-center"
      onPress={() => {
        setSelectedTheme(theme);
        themeSection.toggle();
      }}
    >
      <TextBody1 centered>{theme.title}</TextBody1>
    </TouchableOpacity>
  );

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleToggleSocial = (network: string) => {
    setSelectedsocials((prev) =>
      prev.includes(network)
        ? prev.filter((n) => n !== network)
        : [...prev, network],
    );
  };

  const handlePreview = () => {
    navigation.navigate("PostPreview", {
      from: "CreatePost",
      backLabel: "Retour création",
      screenTitle: "PREVISUALISATION\nDU POST",
      postType,
      stock: stock,
      note: note,
      activity: activity,
      mediaUri: media,
      productTags: selectedTags,
      theme: selectedTheme,
      networks: selectedSocials,
    });
  };

  console.log("CREATE :", mediaType);

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au choix"}
          screen={from || "ProductPostchoice"}
          label={screenTitle || "CRÉATION\nDU POST"}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3" style={{ flex: 9 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {stock && (
            <View className="pt-5 mb-5">
              <TextBody1 centered>Produit sélectionné</TextBody1>
              <TextHeading3 centered extraClasses="mb-2">
                {customProduct
                  ? stock.productCustomName
                  : stock.product.family.name + " " + stock.product.name}
              </TextHeading3>
              <View className="border rounded-lg bg-primary w-auto h-48 mb-2">
                <Image
                  source={
                    customProduct
                      ? stock.image
                        ? { uri: stock.image }
                        : require("../../assets/icon.png")
                      : stock.product.image
                        ? { uri: stock.product.image }
                        : require("../../assets/icon.png")
                  }
                  className="rounded-lg"
                  alt={`photo du produit ${customProduct ? stock.productCustomName : stock.product.name}`}
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>

              <View
                className={`${stock.stock.$numberDecimal === "0" ? "bg-danger/50" : "bg-white dark:bg-tertiary"} flex flex-row border rounded-lg p-1 border-white  dark:border-tertiary justify-center mb-5`}
              >
                <TextBody1>Stock actuel : </TextBody1>
                <TextBody1 extraClasses="font-bold">
                  {stock.stock.$numberDecimal}
                </TextBody1>
              </View>

              <View className="">
                <TextBody1 centered extraClasses="font-bold mb-1">
                  CHOIX DES TAGS
                </TextBody1>
                <TextBody2 centered extraClasses="mb-2">
                  (ces tags aident l'IA à comprendre le contexte du produit)
                </TextBody2>
                <View className="flex flex-row flex-wrap justify-center">
                  {tags &&
                    tags.map((tag) => (
                      <SelectableTag
                        key={tag._id}
                        tag={tag}
                        selected={false}
                        onPressFn={() => handleToggleTag(tag.name)}
                        extraClasses="mr-2 mb-2"
                      />
                    ))}
                  {tags && tags.length === 0 && (
                    <TextBody1 centered>
                      Aucun tag associé à ce produit
                    </TextBody1>
                  )}
                </View>
              </View>
            </View>
          )}

          {note && (
            <View className="pt-4 mb-5">
              <TextBody1 centered>Avis sélectionné</TextBody1>
              <TextHeading4 centered extraClasses="mb-2">
                {note.user.lastname} -{" "}
                {globalTools.formatDateToFr(note.createdAt)}
              </TextHeading4>
              <View className="flex flex-row justify-center items-center my-1">
                <StarsNotation
                  iconNames={["star", "star-half-o", "star-o"]}
                  note={note.note.$numberDecimal}
                  extraClasses=""
                />
              </View>

              <TextHeading4 centered extraClasses="mb-2">
                {note.comment}
              </TextHeading4>

              <View className="border rounded-lg bg-primary w-auto h-48 mb-2">
                <Image
                  source={
                    note.photo
                      ? { uri: note.photo }
                      : require("../../assets/images/visite.jpg")
                  }
                  className="rounded-lg"
                  alt={`photo de l'avis`}
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            </View>
          )}

          {activity && (
            <View className="pt-4 mb-5">
              <TextBody1 centered>Activité sélectionnée</TextBody1>
              <TextHeading4 centered extraClasses="mb-2">
                {activity?.title}
              </TextHeading4>
              <View className="flex flex-row justify-center mb-5">
                <View>
                  <ImageUploader
                    label="MEDIA"
                    message="Choisissez une photo ou une vidéo."
                    mediaTypes={["images", "videos", "livePhotos"]}
                    size={90}
                    defaultUri={null}
                    onImageSelected={(uri, mediaType) => {
                      setMedia(uri);
                      setMediaType(mediaType);
                    }}
                    displayImage={false}
                  />
                </View>
                <View className="justify-center w-48">
                  <TextBody1 extraClasses="ml-2">{`Choisissez une photo,\nune video ou prenez une photo.`}</TextBody1>
                </View>
              </View>

              {mediaType === "image" && (
                <View className="border rounded-lg border-ligthbg dark:border-darkbg w-auto h-80 mb-2">
                  <Image
                    source={
                      media ? { uri: media } : require("../../assets/icon.png")
                    }
                    className="rounded-lg"
                    alt={`média de l'activité`}
                    resizeMode="cover"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>
              )}

              {mediaType === "video" && (
                <View className="border rounded-lg border-lightbg dark:border-darkbg w-auto mb-2">
                  <VideoThumbnail
                    source={media!}
                    style={{
                      width: "100%",
                      aspectRatio: 16 / 9,
                      borderRadius: 8, // si tu veux arrondir comme ton conteneur
                      overflow: "hidden",
                    }}
                  />
                </View>
              )}
            </View>
          )}

          <View className="mb-5">
            <TextBody1 centered extraClasses="font-bold mb-2">
              CHOIX DU THEME
            </TextBody1>
            <OpenMenuButton
              label={selectedTheme?.title || "Choisissez un thème"}
              onPressFn={themeSection.toggle}
              extraClasses="mb-1"
            />
            <Animated.View
              style={[themeSection.animatedStyle]}
              className="overflow-hidden"
            >
              <View
                onLayout={themeSection.onLayout}
                style={themeSection.innerContainerStyle}
                className="px-3"
              >
                <View>
                  {themes.map((theme) => (
                    <Item key={theme._id} theme={theme} />
                  ))}
                </View>
              </View>
            </Animated.View>
          </View>

          <View className="mb-5">
            <TextBody1 centered extraClasses="font-bold mb-2">
              CHOIX DES RÉSEAUX
            </TextBody1>
            <View className="flex flex-row justify-center">
              <View className="shrink">
                <NetworkSelector
                  networks={socials}
                  selected={selectedSocials}
                  onToggle={handleToggleSocial}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ flex: 1 }} className="py-2">
        <View className="px-3">
          <ButtonPrimaryEnd
            label="Prévisualiser"
            iconName="arrow-right-long"
            iconFamily="FontAwesome6Icon"
            disabled={!previewEnable}
            onPressFn={handlePreview}
            extraClasses="h-14"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
