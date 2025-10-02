import React, { useCallback } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";

// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../types/Navigation";

import { RouteProp, useRoute, useFocusEffect } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ProducerTabParamList } from "../../types/Navigation"; // <-- ton fichier de types

import { useDispatch, useSelector } from "react-redux";
import { setProducts, setShopData, ShopState } from "../../reducers/shop";

import { useCanPost } from "../../hooks/useCanPost";
import postTools from "../../modules/postTools";

/* Eléments graphiques */
import { View, TouchableOpacity, Alert, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextBody1 from "../../components/utils/texts/Body1";

import _Fontawesome from "react-native-vector-icons/FontAwesome";
import TextHeading4 from "../../components/utils/texts/Heading4";
import BadgeSecondary from "../../components/utils/badges/Secondary";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import StarsNotation from "../../components/utils/StarsNotation";
import ThumbnailCarousel from "../../components/utils/ThumbnailCarousel";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import stocksTools from "../../modules/stocksTools";
import TextHeading3 from "../../components/utils/texts/Heading3";
import { ProducerState } from "../../reducers/producer";

type ShopProducteurRouteProp = RouteProp<ProducerTabParamList, "ShopProducer">;

type ShopProducteurNavProp = BottomTabNavigationProp<
  ProducerTabParamList,
  "ShopProducer"
>;

type Props = {
  navigation: ShopProducteurNavProp;
  route: ShopProducteurRouteProp;
};

export default function ShopProducteurScreen({ navigation, route }: Props) {
  const [description, setDescription] = useState<string>("");

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const producerStore = useSelector(
    (state: { producer: ProducerState }) => state.producer.value,
  );

  const canPost = useCanPost();

  const [shopData, setShopData] = useState(shopStore);
  const [hasZeroStock, setHasZeroStock] = useState<boolean | undefined>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const fetchStocks = async (shopId: string) => {
    const stocksResponse = await stocksTools.getStocksByShop(shopId);

    if (!stocksResponse.success) {
      console.error(stocksResponse.message);
      return;
    }
    dispatch(setProducts(stocksResponse.data!));
  };

  useEffect(() => {
    if (shopStore !== null) {
      if (shopStore.shortDesc) {
        setDescription(shopStore.shortDesc);
      }
      fetchStocks(shopStore._id);
    }
  }, []);

  useEffect(() => {
    setHasZeroStock(
      shopStore?.products?.some((product) => {
        return Number(product.stock) === 0;
      }),
    );
  }, [shopStore?.products]);

  const [programmedPosts, setProgrammedPosts] = useState<Number>(0);

  const getProgrammedPosts = async () => {
    const token = await getToken();
    const postResponse = await postTools.getProgrammedPosts(token);

    if (!postResponse.success) console.log(postResponse.message);

    if (postResponse.data) setProgrammedPosts(postResponse.data.length);
  };

  useFocusEffect(
    useCallback(() => {
      setIsOnline(producerStore?.onboardingStep === 6);
      getProgrammedPosts();
    }, []),
  );

  // console.log("SHOP producerStore :", producerStore);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 px-3"
      >
        <View className="flex flex-row justify-center items-center mb-1 mt-1">
          <View>
            <View className="flex-grow">
              <TextHeading3 centered>{shopStore?.name}</TextHeading3>
            </View>
            <View className="flex flex-row justify-center">
              <StarsNotation
                iconNames={["star", "star-half", "star-o"]}
                shopData={shopData}
                extraClasses="pb-1"
              />
            </View>
          </View>
          <View className="absolute right-0 mr-2">
            <Text
              className={`${isOnline ? "text-primary" : "text-danger"} font-bold text-center`}
            >{`${isOnline ? "EN\nLIGNE" : "HORS\nLIGNE"}`}</Text>
          </View>
        </View>

        <View className="flex flex-row items-center w-full h-[80px] mb-2">
          <View className="flex justify-center items-center w-1/4">
            {shopStore?.logo ? (
              <Image
                source={{ uri: shopStore.logo }}
                className="rounded-xl w-20 h-20"
                alt={``}
                resizeMode="cover"
                // width={96}
                // height={64}
              />
            ) : (
              <FontAwesome
                name="github-alt"
                size={80}
                color="#FFFFFF"
                className=""
              />
            )}
          </View>
          <View className="w-3/4 ">
            <TextBody1 centered>{description}</TextBody1>
          </View>
        </View>

        <View className="flex flex-row items-center justify-center w-full mb-3">
          <BadgeSecondary
            uppercase
            textClasses="text-xs"
            extraClasses="px-1 mr-1"
          >
            click & collect
          </BadgeSecondary>
          <BadgeSecondary
            uppercase
            textClasses="text-xs"
            extraClasses="px-1 mr-1"
          >
            point de vente
          </BadgeSecondary>
          <BadgeSecondary
            uppercase
            textClasses="text-xs"
            extraClasses="px-1 mr-1"
          >
            livraison
          </BadgeSecondary>
        </View>

        <View className="flex flex-row mb-3">
          {/* {pictures} */}
          <ThumbnailCarousel images={shopStore!.photos} />
        </View>

        <View>
          <OpenScreenButton
            label="Informations de la boutique"
            onPressFn={() =>
              navigation.navigate("ShopDetails", {
                from: "ShopProducer",
                backLabel: "Retour à la boutique",
                screenTitle: "INFORMATIONS",
              })
            }
            extraClasses="mb-1"
          />
          <OpenScreenButton
            label="Paramètres de la boutique"
            onPressFn={() =>
              navigation.navigate("ShopParams", {
                from: "ShopProducer",
                backLabel: "Retour à la boutique",
                screenTitle: "PARAMETRES",
              })
            }
            extraClasses="mb-1"
          />
          <OpenScreenButton
            label="Mode de retrait"
            onPressFn={() =>
              navigation.navigate("ShopWithdrawModes", {
                from: "ShopProducer",
                backLabel: "Retour à la boutique",
                screenTitle: "MODES DE\nRETRAIT",
              })
            }
            extraClasses="mb-1"
          />
          <OpenScreenButton
            label="Gestion des stocks"
            redAlert={hasZeroStock}
            onPressFn={() =>
              navigation.navigate("StockCategories", {
                from: "ShopProducer",
                backLabel: "Retour à la boutique",
                screenTitle: "GESTION\nDES STOCKS",
              })
            }
            extraClasses="mb-1"
          />
          <OpenScreenButton
            label="Mettre en pause"
            onPressFn={() =>
              navigation.navigate("ShopOffline", {
                from: "ShopProducer",
                backLabel: "Retour à la boutique",
                screenTitle: "METTRE EN\nPAUSE",
              })
            }
            extraClasses="mb-1"
          />
          <OpenScreenButton
            label="Options Premium"
            bgColor="bg-premium"
            notice={programmedPosts.toString()}
            redAlert={!canPost}
            onPressFn={() =>
              navigation.navigate("PremiumOptions", {
                from: "ShopProducer",
                backLabel: "Retour à la boutique",
                screenTitle: "OPTIONS\nPREMIUM",
                programmedPosts: programmedPosts.toString(),
              })
            }
            extraClasses="mb-1"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
