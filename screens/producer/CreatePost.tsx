import React from "react";
import { useState, useEffect } from "react";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import {
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TopBar from "../../components/TopBar";
import TextHeading3 from "../../components/utils/texts/Heading3";
import SelectableTag from "../../components/utils/badges/SelectableTag";
import { PostThemeData, TagData } from "../../types/API";
import TextBody1 from "../../components/utils/texts/Body1";
import { useSelector } from "react-redux";
import { ShopState } from "../../reducers/shop";
import IconButton from "../../components/utils/buttons/Icon";
import NetworkSelector from "../../components/NetworkSelector";
import TextHeading4 from "../../components/utils/texts/Heading4";
import { useCollapsibleSection } from "../../hooks/useCollapsibleSection";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import Animated from "react-native-reanimated";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";

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
  const { from, backLabel, screenTitle, shopCategoriesWithFamilies, stock } =
    route.params || {};

  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [customProduct, setCustomProduct] = useState<boolean>(false);
  const [socials, setSocials] = useState<string[]>([]);
  const [selectedSocials, setSelectedsocials] = useState<string[]>([]);
  const [tags, setTags] = useState<TagData[] | undefined>([]);

  const themeSection = useCollapsibleSection();
  const [sectionLabel, setSectionLabel] = useState<string>(
    "Choisissez un thème",
  );
  const [themes, setThemes] = useState<PostThemeData[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<PostTheme | null>(null);

  useEffect(() => {
    const fetchPostThemes = async () => {
      const response = await fetch(`${API_ROOT}/postThemes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
      });

      const themes = await response.json();

      setThemes(themes);
    };

    fetchPostThemes();
  }, []);

  const DATA = [
    {
      id: "1",
      title: "Mettre en avant la fraîcheur",
    },
    {
      id: "2",
      title: "Parler de la saison",
    },
    {
      id: "3",
      title: "Donner une idée recette",
    },
    {
      id: "4",
      title: "Urgence: écouler le stock",
    },
    {
      id: "5",
      title: "Mettre en avant une promo",
    },
  ];

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

  const handleToggleTag = () => {};

  useEffect(() => {
    if (stock) {
      setCustomProduct(stock.hasOwnProperty("productCustomName"));
      setTags(stock.tags);
      setSocials(Object.keys(shopStore?.socials));
    }
  }, []);

  console.log("CREATEPOST shopcat :", shopCategoriesWithFamilies);
  console.log("CREATEPOST le produit :", stock);
  console.log(customProduct);
  console.log(JSON.stringify(shopStore?.socials, null, 2));
  console.log(socials);
  console.log(themes);

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
          screenParams={{
            from: "PostType",
            backLabel: "Retour au type",
            screenTitle: "CHOISIR\nUN PRODUIT",
            shopCategoriesWithFamilies,
          }}
          extraClasses="mt-2"
        />
      </View>

      <View className="px-3 pt-5" style={{ flex: 9 }}>
        <ScrollView>
          {stock && (
            <View className="">
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
                      ? { uri: stock.image }
                      : { uri: stock.product.image }
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

              <View className="flex flex-row border rounded-lg p-1 bg-white border-white dark:bg-tertiary dark:border-tertiary justify-center mb-5">
                <TextBody1>Stock actuel : </TextBody1>
                <TextBody1 extraClasses="font-bold">
                  {stock.stock.$numberDecimal}
                </TextBody1>
              </View>

              <View className="flex flex-row flex-wrap justify-center mb-2">
                {tags &&
                  tags.map((tag) => (
                    <SelectableTag
                      key={tag._id}
                      tag={tag}
                      onPressFn={handleToggleTag}
                      extraClasses="mr-2 mb-2"
                    />
                  ))}
              </View>

              <View className="mb-3">
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
                    <FlatList
                      data={themes}
                      renderItem={({ item }) => <Item theme={item} />}
                      keyExtractor={(item) => item.id}
                    />
                  </View>
                </Animated.View>
              </View>

              <View className="">
                <TextHeading4 centered extraClasses="mb-2">
                  CHOIX DES RÉSEAUX
                </TextHeading4>
                <View className="flex flex-row justify-center">
                  <View className="shrink">
                    <NetworkSelector networks={socials} onPressFn={() => {}} />
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={{ flex: 1 }} className="py-2">
        <View className="px-3">
          <ButtonPrimaryEnd
            label="Prévisualiser"
            iconName="arrow-right-long"
            iconFamily="FontAwesome6Icon"
            onPressFn={() => {}}
            extraClasses="h-14"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
