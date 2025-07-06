import React from "react";
import { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import { useAuth } from "@clerk/clerk-expo";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setShopData, ShopState } from "../../reducers/shop";

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

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopProducer"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ShopProducteurScreen({ navigation }: Props) {
  // à remplacer par les images du producteur
  const fakeImages = [
    require("../../assets/images/image1.jpg"),
    require("../../assets/images/image2.png"),
    require("../../assets/images/image3.jpg"),
    require("../../assets/images/image4.jpg"),
  ];

  const [description, setDescription] = useState<string>("");

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [shopData, setShopData] = useState(shopStore);
  const [hasZeroStock, setHasZeroStock] = useState<boolean | undefined>(false);

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
        return Number(product.stock.$numberDecimal) === 0;
      }),
    );
  }, [shopStore?.products]);

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
            <Text className="text-danger font-bold">{`HORS\nLIGNE`}</Text>
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
            notice="2"
            redAlert={true}
            onPressFn={() =>
              navigation.navigate("PremiumOptions", {
                from: "ShopProducer",
                backLabel: "Retour à la boutique",
                screenTitle: "OPTIONS\nPREMIUM",
              })
            }
            extraClasses="mb-1"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
