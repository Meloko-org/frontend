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
const FontAwesome = _Fontawesome as React.ElementType;

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

  const [isOpenAddress, setOpenAddress] = useState(false);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [siret, setSiret] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);
  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
  });

  const { getToken } = useAuth();

  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const producerStore = useSelector(
    (state: { producer: ProducerState }) => state.producer.value,
  );
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const [shopData, setShopData] = useState(shopStore);

  const [isShopSaveLoading, setShopSaveLoading] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Créer le shop");

  /* Gestion de l'affichage des modals */
  const [isLogoModalVisible, setLogoModalVisible] = useState(false);
  const [isPhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const [isClickCollectModalVisible, setClickCollectModalVisible] =
    useState(false);
  const [isMarketsModalVisible, setMarketsModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      /* retrieve types shop from bdd */
      const token = await getToken();
      const response = await typesTools.getTypes(token);
      setShopTypes(response);
    })();

    /* retrieve shop infos if exists */
    if (shopStore !== null) {
      setName(shopStore.name);
      setDescription(shopStore.description);
      setSiret(shopStore.siret);
      setAddress({
        address1: shopStore.address.address1,
        address2: shopStore.address.address2,
        postalCode: shopStore.address.postalCode,
        city: shopStore.address.city,
        country: shopStore.address.country,
      });
      setTypes(shopStore.types.map((type) => type._id));

      setButtonLabel("Mettre à jour");
    }
  }, []);

  const toggleOpenAddress = () => {
    setOpenAddress(!isOpenAddress);
  };

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

  console.log(
    "------------------------------- SHOP --------------------------------------------------------------------",
  );
  console.log("USERSTORE -> ", userStore);
  console.log("PRODUCERSTORE -> ", producerStore);
  console.log("SHOPSTORE -> ", shopStore);
  console.log("");
  console.log("types :", types);
  console.log("buttonLabel :", buttonLabel);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1 px-3"
      >
        <View className="flex flex-row justify-center items-center mb-1 mt-1">
          <View className="flex-grow">
            <TextHeading4 centered>{`MA BOUTIQUE`}</TextHeading4>
          </View>
          <View className="absolute right-0 mr-2">
            <Text className="text-danger font-bold">{`HORS\nLIGNE`}</Text>
          </View>
        </View>

        <View className="flex flex-row justify-center mb-1">
          <StarsNotation
            iconNames={["star", "star-half", "star-o"]}
            shopData={shopData}
            extraClasses="pb-1"
          />
        </View>

        <View className="flex flex-row items-center w-full h-[80px]">
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

        <View className="flex flex-row items-center justify-center w-full mb-2">
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

        <View className="flex flex-row mb-2">
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
              navigation.navigate("Stock", {
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

        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row justify-center items-center w-2/6">
            <TouchableOpacity onPress={() => setLogoModalVisible(true)}>
              <View className="rounded-full bg-warning flex flex-row justify-center items-center mb-5 w-[100px] h-[100px]">
                <FontAwesome
                  name="github-alt"
                  size={80}
                  color="#FFFFFF"
                  className="absolute"
                />
              </View>
            </TouchableOpacity>
          </View>

          <View className="w-4/6">
            <InputText
              label="Nom"
              placeholder="Saisissez le nom de la boutique"
              value={name}
              onChangeText={(value: string) => setName(value)}
              extraClasses="mb-2"
            />
            <InputText
              label="Siret"
              placeholder="Saisissez le siret de la boutique"
              value={siret}
              onChangeText={(value: string) => setSiret(value)}
              extraClasses="mb-2"
            />
          </View>
        </View>

        <InputTextarea
          label="Description"
          placeholder="Décrivez votre boutique"
          value={description}
          onChangeText={(value: string) => setDescription(value)}
          extraClasses="mb-2 w-full"
        />

        <View className="flex flex-row justify-stretch mb-1">
          <View className="flex flex-grow">
            <TextHeading3 centered>Adresse</TextHeading3>
          </View>
          <IconButton
            iconName="arrow-down"
            extraClasses="p-3 bg-tertiary"
            onPressFn={toggleOpenAddress}
            animated={true}
          />
        </View>
        {isOpenAddress && (
          <>
            <InputText
              label="Adresse"
              placeholder="Saisissez votre adresse"
              value={address.address1}
              onChangeText={(value: string) =>
                setAddress({
                  address1: value,
                  address2: address.address2,
                  postalCode: address.postalCode,
                  city: address.city,
                  country: address.country,
                })
              }
              extraClasses="mb-2"
            />
            <InputText
              label="Adresse complément"
              placeholder="Complément d'adresse"
              value={address.address2}
              onChangeText={(value: string) =>
                setAddress({
                  address1: address.address1,
                  address2: value,
                  postalCode: address.postalCode,
                  city: address.city,
                  country: address.country,
                })
              }
              extraClasses="mb-2"
            />
            <InputText
              label="Code Postal"
              placeholder="Saisissez le code postal"
              value={address.postalCode}
              onChangeText={(value: string) =>
                setAddress({
                  address1: address.address1,
                  address2: address.address2,
                  postalCode: value,
                  city: address.city,
                  country: address.country,
                })
              }
              extraClasses="mb-2"
            />
            <InputText
              label="Ville"
              placeholder="Saisissez la ville"
              value={address.city}
              onChangeText={(value: string) =>
                setAddress({
                  address1: address.address1,
                  address2: address.address2,
                  postalCode: address.postalCode,
                  city: value,
                  country: address.country,
                })
              }
              extraClasses="mb-2"
            />
            <InputText
              label="Pays"
              placeholder="Saisissez le pays"
              value={address.country}
              onChangeText={(value: string) =>
                setAddress({
                  address1: address.address1,
                  address2: address.address2,
                  postalCode: address.postalCode,
                  city: address.city,
                  country: value,
                })
              }
              extraClasses="mb-1"
            />
          </>
        )}

        <ButtonPrimaryEnd
          label={buttonLabel}
          iconName="refresh"
          disabled={isShopSaveLoading}
          extraClasses="mb-3"
          onPressFn={() => handleSaveShop()}
          isLoading={isShopSaveLoading}
        />

        <ButtonPrimaryEnd
          label="Gestion des stocks"
          iconName="refresh"
          extraClasses="my-3"
          onPressFn={() =>
            navigation.navigate("TabNavigatorProducer", {
              screen: "Stock",
            })
          }
        />

        {buttonLabel === "Mettre à jour" && (
          <>
            <View className="flex flex-row my-3 justify-center">
              <IconButton
                iconName="photo"
                extraClasses="bg-primary p-4 mr-3 h-[50px]"
                onPressFn={() => setPhotoModalVisible(true)}
              />
              <IconButton
                iconName="video-camera"
                extraClasses="bg-primary p-4 mr-3"
                onPressFn={() => setVideoModalVisible(true)}
              />
              <IconButton
                iconName="shopping-bag"
                extraClasses="bg-primary p-4 mr-3"
                onPressFn={() => setClickCollectModalVisible(true)}
              />
              <IconButton
                iconName="globe"
                extraClasses="bg-primary p-4 mr-3"
                onPressFn={() => setMarketsModalVisible(true)}
              />
            </View>
          </>
        )}

        {/* <View className="h-[200px]"></View> */}

        <LogoModal
          isVisible={isLogoModalVisible}
          onCloseFn={() => setLogoModalVisible(false)}
        />

        <PhotoModal
          isVisible={isPhotoModalVisible}
          onCloseFn={() => setPhotoModalVisible(false)}
        />

        <VideoModal
          isVisible={isVideoModalVisible}
          onCloseFn={() => setVideoModalVisible(false)}
        />

        <ClickCollectModal
          data={shopStore?.clickCollect}
          isVisible={isClickCollectModalVisible}
          onCloseFn={() => setClickCollectModalVisible(false)}
        />

        <MarketsModal
          isVisible={isMarketsModalVisible}
          onCloseFn={() => setMarketsModalVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
