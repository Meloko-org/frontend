import React from "react";
import { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";
import typesTools from "../../modules/typesTools";
import { useAuth } from "@clerk/clerk-expo";
import shopTools from "../../modules/shopTools";
import { useDispatch, useSelector } from "react-redux";
import { setShopData, ShopState } from "../../reducers/shop";
import { UserState } from "../../reducers/user";

/* Eléments graphiques */
import { View, TouchableOpacity, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextHeading3 from "../../components/utils/texts/Heading3";
import InputText from "../../components/utils/inputs/Text";
import InputTextarea from "../../components/utils/inputs/Textarea";
import SwitchInput from "../../components/utils/inputs/Switch";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import IconButton from "../../components/utils/buttons/Icon";
import TextBody1 from "../../components/utils/texts/Body1";
import ButtonBack from "../../components/utils/buttons/Back";

import LogoModal from "../../components/modals/producer/Logo";
import PhotoModal from "../../components/modals/producer/Photo";
import VideoModal from "../../components/modals/producer/Video";
import ClickCollectModal from "../../components/modals/producer/ClickCollect";
import MarketsModal from "../../components/modals/producer/Markets";
import { ProducerState } from "../../reducers/producer";

import _Fontawesome from "react-native-vector-icons/FontAwesome";
import TextHeading4 from "../../components/utils/texts/Heading4";
import BadgeSecondary from "../../components/utils/badges/Secondary";
import OpenMenuButton from "../../components/utils/buttons/OpenMenu";
import OpenScreenButton from "../../components/utils/buttons/OpenScreen";
import StarsNotation from "../../components/utils/StarsNotation";
import ThumbnailCarousel from "../../components/utils/ThumbnailCarousel";
import FontAwesome from "@expo/vector-icons/FontAwesome";
// const FontAwesome = _Fontawesome as React.ElementType;

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

  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );

  const [shopData, setShopData] = useState(shopStore);

  useEffect(() => {
    if (shopStore !== null && shopStore.description) {
      setDescription(shopStore.description);
    }
  }, []);

  const handleSaveShop = async () => {
    try {
      setShopSaveLoading(true);
      const token = await getToken();
      const values = reopenDate
        ? {
            name,
            description,
            siret,
            address,
            types,
            reopenDate,
            isOpen: false,
          }
        : {
            name,
            description,
            siret,
            address,
            types,
            isOpen: true,
            reopenDate: null,
          };
      const data = await shopTools.createOrUpdateShop(token, values);
      console.log("data de retour :", data);

      if (data.error) {
        Alert.alert("Profil non mis à jour", data.error);
      } else {
        Alert.alert(
          "Mise à jour de votre profil",
          "Votre profil à bien été mis à jour.",
        );
        dispatch(setShopData(data));
        setButtonLabel("Mettre à jour");
      }
      setShopSaveLoading(false);
    } catch (error) {
      console.log(error);
      setShopSaveLoading(false);
    }
  };

  // console.log(
  //   "------------------------------- SHOP --------------------------------------------------------------------",
  // );
  // console.log("SHOPSTORE -> ", shopStore);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 px-3"
      >
        <View className="flex flex-row justify-center items-center mb-1 mt-1">
          <View>
            <View className="flex-grow">
              <TextHeading4 centered>{`MA BOUTIQUE`}</TextHeading4>
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
            <FontAwesome
              name="github-alt"
              size={80}
              color="#FFFFFF"
              className=""
            />
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
          <ThumbnailCarousel images={fakeImages} />
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
