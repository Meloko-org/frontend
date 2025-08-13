import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { setShopData, ShopState } from "../../reducers/shop";

import { SheetManager } from "react-native-actions-sheet";

import { TagData } from "../../types/API";

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ScrollView } from "react-native-gesture-handler";

import TopBar from "../../components/TopBar";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import TextBody1 from "../../components/utils/texts/Body1";
import networksTools from "../../modules/networksTools";
import TextHeading3 from "../../components/utils/texts/Heading3";
import SelectableTag from "../../components/utils/badges/SelectableTag";
import KillableTag from "../../components/utils/badges/KillableTag";
import InputText from "../../components/utils/inputs/Text";

type PostHashtagsScreenRouteProp = RouteProp<
  RootStackParamList,
  "PostHashtags"
>;

type PostHashtagsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostHashtags"
>;

type Props = {
  navigation: PostHashtagsScreenNavigationProp;
};

export default function PostHashtagsScreen({ navigation }: Props) {
  const route = useRoute<PostHashtagsScreenRouteProp>();
  const { from, backLabel, screenTitle } = route.params || {};

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const { getToken } = useAuth();

  const [isSaveLoading, setSaveLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // tags récupérés depuis les produits
  const [suggestedTags, setSuggestedTags] = useState<TagData[]>([]);
  // tags personnalisés
  const [customizedTags, setCustomizedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  // tags à sauver dans la base
  const [customHashtags, setCustomHashtags] = useState<string[]>(
    shopStore?.socialPostSettings?.customHashtags ?? [],
  );
  // mentions existantes et personnaliées
  const [allMentions, setAllMentions] = useState<string[]>(
    shopStore?.socialPostSettings?.customMentions ?? [],
  );
  const [newMention, setNewMention] = useState<string>("");

  // mentions à sauver dans la base
  const [customMentions, setCustomMentions] = useState<string[]>(
    shopStore?.socialPostSettings?.customMentions ?? [],
  );

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const token = await getToken();
        const tagResponse = await networksTools.getAvailableHashtags(token);

        if (tagResponse.success) {
          setSuggestedTags(tagResponse.data);
        }
      } catch (error) {
        console.log("Impossible de récupérer les tags.", error);
      }
    };

    fetchTags();
  }, []);

  // détermine les tags personnalisés
  useEffect(() => {
    if (!shopStore || !suggestedTags.length) return;

    const suggestedTagNames = suggestedTags.map((t) => t.name);
    const customized = customHashtags.filter(
      (tag) => !suggestedTagNames.includes(tag),
    );
    setCustomizedTags(customized);
  }, [shopStore, suggestedTags]);

  // permet de mettre à jour hasChanges à chaque fois que customHashtags ou customMentions changent
  useEffect(() => {
    const originalHashtags =
      shopStore?.socialPostSettings?.customHashtags || [];
    const originalMentions =
      shopStore?.socialPostSettings?.customMentions || [];

    const sortArray = (arr: string[]) => [...arr].sort();

    const hasChanged =
      JSON.stringify(sortArray(customHashtags)) !==
        JSON.stringify(sortArray(originalHashtags)) ||
      JSON.stringify(sortArray(customMentions)) !==
        JSON.stringify(sortArray(originalMentions));

    setHasChanges(hasChanged);
  }, [customHashtags, customMentions, shopStore]);

  const toggleCustomHashtag = (tagName: string) => {
    setCustomHashtags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName],
    );
    // setHasChanges(true);
  };

  const addMention = (mention: string) => {
    if (!allMentions.includes("@" + mention)) {
      setAllMentions((prev) => [...prev, "@" + mention]);
    }
  };

  const removeMention = (mention: string) => {
    console.log(mention);
    setAllMentions((prev) => prev.filter((m) => m !== mention));
    setCustomMentions((prev) => prev.filter((m) => m !== mention));
  };

  const toggleCustomMention = (mentionName: string) => {
    setCustomMentions((prev) =>
      prev.includes(mentionName)
        ? prev.filter((t) => t !== mentionName)
        : [...prev, mentionName],
    );
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);

      const token = await getToken();
      const values = { customHashtags, customMentions };
      const updateResponse = await networksTools.updateSocialPostSettings(
        token,
        values,
      );

      if (updateResponse.success) {
        dispatch(setShopData(updateResponse.data));

        setHasChanges(false);

        SheetManager.show("alert", {
          payload: {
            message: "Mise à jour réussie.",
            alertType: "success",
          },
        });
      }
    } catch (error) {
      console.log(`Erreur `, error);
      SheetManager.show("alert", {
        payload: {
          message:
            "Un problème est survenu lors de la mise à jour des paramètres de fréquence.",
          alertType: "error",
        },
      });
    } finally {
      setSaveLoading(false);
    }
  };

  console.log("customMentions :", customMentions);
  console.log("customizedMentions :", allMentions);

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      <View className="" style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour aux paramètres"}
          screen={from || "PostHashtags"}
          label={screenTitle || "PARAMETRES"}
          extraClasses="mt-2"
        />
      </View>

      <View style={{ flex: 10 }}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={50}
        >
          <View className="px-3 mb-5">
            <TextBody1 centered extraClasses="px-5">
              {`Vous pouvez choisir les tags que l'IA pourra inclure dans vos posts parmi les tags existants sur vos produits. Vous pouvez aussi créer de nouveaux tags.`}
            </TextBody1>
          </View>

          <View className="px-3 mb-3">
            <View>
              <TextBody1 centered extraClasses="mb-3 font-bold">
                TAGS SUGGÉRÉS
              </TextBody1>
            </View>
            <View className="flex flex-row flex-wrap">
              {suggestedTags.map((tag) => (
                <SelectableTag
                  key={tag._id}
                  tag={tag}
                  selected={customHashtags.includes(tag.name)}
                  onPressFn={() => {
                    toggleCustomHashtag(tag.name);
                  }}
                  extraClasses="mr-2 mb-2"
                />
              ))}
            </View>
          </View>

          <View className="px-3 mb-5">
            <View>
              <TextBody1 centered extraClasses="mb-3 font-bold">
                TAGS PERSONNALISÉS
              </TextBody1>
            </View>
            <InputText
              label="Créer un hashtag"
              value={newTag}
              placeholder="Saisir un hashtag"
              iconName="plus"
              onChangeText={(newValue) => setNewTag(newValue)}
              onIconPressFn={() => {
                setCustomizedTags((prev) => [...prev, newTag]);
                setNewTag("");
              }}
            />
            <View className="flex flex-row flex-wrap my-3">
              {customizedTags.map((name, index) => (
                <KillableTag
                  key={index}
                  name={name}
                  selected={customHashtags.includes(name)}
                  onPressFn={() => {
                    toggleCustomHashtag(name);
                  }}
                  onKillFn={() => {
                    console.log("youpi");
                    setCustomizedTags((prev) => prev.filter((t) => t !== name));
                    toggleCustomHashtag(name);
                  }}
                  extraClasses="mr-2 mb-2"
                />
              ))}
            </View>
          </View>

          <View className="px-3">
            <View>
              <TextBody1 centered extraClasses="mb-3 font-bold">
                MENTIONS PERSONNALISÉES
              </TextBody1>
            </View>
            <InputText
              label="Créer une mention"
              value={newMention}
              placeholder="Saisir une mention"
              iconName="plus"
              onChangeText={(newValue) => setNewMention(newValue)}
              onIconPressFn={() => {
                if (newMention) {
                  if (
                    !allMentions.includes("@" + newMention) &&
                    !customMentions.includes("@" + newMention)
                  ) {
                    setAllMentions((prev) => [...prev, "@" + newMention]);
                  }
                  setNewMention("");
                }
              }}
            />
            <View className="flex flex-row flex-wrap my-3">
              {allMentions.map((name, index) => (
                <KillableTag
                  key={index}
                  name={name}
                  selected={customMentions.includes(name)}
                  onPressFn={() => {
                    toggleCustomMention(name);
                  }}
                  onKillFn={() => {
                    console.log("remove :", name);
                    removeMention(name);
                  }}
                  extraClasses="mr-2 mb-2"
                />
              ))}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>

      <View
        className="px-3 bg-lightbg dark:bg-darkbg h-full"
        style={{ flex: 1 }}
      >
        <ButtonPrimaryEnd
          label="Sauvegarder"
          iconName="sync-alt"
          iconFamily="FontAwesome5Icon"
          disabled={!hasChanges || isSaveLoading}
          onPressFn={handleSave}
          isLoading={isSaveLoading}
          extraClasses="h-14"
        />
      </View>
    </SafeAreaView>
  );
}
