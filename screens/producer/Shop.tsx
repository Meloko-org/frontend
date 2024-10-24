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
import { View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import Text from "../../components/utils/inputs/Text";
import InputTextarea from "../../components/utils/inputs/Textarea";
import SwitchInput from "../../components/utils/inputs/Switch";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import ButtonIcon from "../../components/utils/buttons/Icon";
import TextBody1 from "../../components/utils/texts/Body1";
import ButtonBack from "../../components/utils/buttons/Back";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
import LogoModal from "../../components/modals/producer/Logo";
import PhotoModal from "../../components/modals/producer/Photo";
import VideoModal from "../../components/modals/producer/Video";
import ClickCollectModal from "../../components/modals/producer/ClickCollect";
import MarketsModal from "../../components/modals/producer/Markets";
import { ProducerState } from "../../reducers/producer";

const FontAwesome = _Fontawesome as React.ElementType;

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ShopProducer"
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ShopProducteurScreen({ navigation }: Props) {
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

  const [isShopSaveLoading, setShopSaveLoading] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Créer le shop");

  /* gestion du switch de désactivation de la boutique */
  const [isReopenDateVisible, setReopenDateVisible] = useState(false);
  const [reopenDate, setReopenDate] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  /* Gestion de l'affichage des modals */
  const [isLogoModalVisible, setLogoModalVisible] = useState(false);
  const [isPhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const [isClickCollectModalVisible, setClickCollectModalVisible] =
    useState(false);
  const [isMarketsModalVisible, setMarketsModalVisible] = useState(false);

  // Contient les différents types de shop
  const [shopTypes, setShopTypes] = useState([]);

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
      if (shopStore.reopenDate !== null) {
        setReopenDate(shopStore.reopen);
        setReopenDateVisible(true);
      }
      setButtonLabel("Mettre à jour");
    }
  }, []);

  /**
   * Permet d'ajouter ou supprimer les id des types de shop en fonction des clics sur les switch
   * @param typeId string
   */
  const handleSwitchType = (typeId: string) => {
    setTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(typeId)
        ? prevSelectedTypes.filter((id) => id !== typeId)
        : [...prevSelectedTypes, typeId],
    );
  };

  // Créer des switch en fonction des types de shop
  const typesList = shopTypes.map((item) => {
    return (
      <SwitchInput
        key={item._id}
        thumbColor="#215487"
        label={item.name}
        value={types.includes(item._id)}
        onValueChange={(isSelected) => handleSwitchType(item._id, isSelected)}
        extraClasses="pl-5 mb-2"
      />
    );
  });

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

  const handleReopenDate = () => {
    setReopenDateVisible(!isReopenDateVisible);
    setReopenDate(undefined);
  };

  const handleDateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);
      toggleDatePicker();
      setReopenDate(currentDate.toDateString());
      // if (Platform.OS === "android") {
      //   toggleDatePicker()
      //   setReopenDate(currentDate.toDateString())
      // }
    } else {
      toggleDatePicker();
    }
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
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
        className="w-full flex-1 p-3"
      >
        <TextHeading2 extraClasses="my-1" centered>
          Boutique
        </TextHeading2>

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
            <Text
              label="Nom"
              placeholder="Saisissez le nom de la boutique"
              value={name}
              onChangeText={(value: string) => setName(value)}
              extraClasses="mb-2"
            />
            <Text
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

        <View className="p-5">{typesList}</View>
        <TextHeading3 centered={true}>Adresse</TextHeading3>
        <Text
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
        <Text
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
        <Text
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
        <Text
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
        <Text
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
          extraClasses="mb-2"
        />

        {buttonLabel === "Mettre à jour" && (
          <>
            <View className="flex flex-row my-5 justify-center">
              <ButtonIcon
                iconName="photo"
                extraClasses="bg-primary p-4 mr-3 h-[50px]"
                onPressFn={() => setPhotoModalVisible(true)}
              />
              <ButtonIcon
                iconName="video-camera"
                extraClasses="bg-primary p-4 mr-3"
                onPressFn={() => setVideoModalVisible(true)}
              />
              <ButtonIcon
                iconName="shopping-bag"
                extraClasses="bg-primary p-4 mr-3"
                onPressFn={() => setClickCollectModalVisible(true)}
              />
              <ButtonIcon
                iconName="globe"
                extraClasses="bg-primary p-4 mr-3"
                onPressFn={() => setMarketsModalVisible(true)}
              />
            </View>

            <View className="flex my-5 pl-3 items-center">
              <SwitchInput
                thumbColor="#215487"
                label="Désactiver la boutique"
                value={isReopenDateVisible}
                extraClasses="pl-5 mb-2"
                onValueChange={handleReopenDate}
              />
              {isReopenDateVisible && (
                <View>
                  <TextBody1>Sélectionner une date de réouverture</TextBody1>
                  <Text
                    placeholder="Choisissez une date"
                    label="Date de réouverture"
                    editable={false}
                    onChangeText={(value: string) => setReopenDate(value)}
                    value={reopenDate}
                    iconName="calendar"
                    onIconPressFn={toggleDatePicker}
                    size="large"
                  />

                  {showPicker && (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={date}
                      onChange={handleDateChange}
                    />
                  )}
                </View>
              )}
            </View>
          </>
        )}

        <ButtonPrimaryEnd
          label={buttonLabel}
          iconName="refresh"
          disabled={isShopSaveLoading}
          extraClasses="my-5"
          onPressFn={() => handleSaveShop()}
          isLoading={isShopSaveLoading}
        />

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
