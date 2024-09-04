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
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
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

const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!;

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
  const [types, setTypes] = useState([]);
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

  const [shopTypes, setShopTypes] = useState([]);

  let typesToDisplay = ["Maraîcher", "Fromager", "Viticulteur"];

  useEffect(() => {
    (async () => {
      /* retrieve types shop from bdd */
      const token = await getToken();
      const response = await typesTools.getTypes(token);
      setShopTypes(response);

      /* retrieve shop infos if exists */
      if (shopStore === null) {
        console.log("shopstore null");
        const shopInfos = await shopTools.getShopInfos(
          token,
          producerStore.producer._id,
        );

        if (shopInfos) {
          console.log("shop infos reçues");
          dispatch(setShopData(shopInfos));
          //fillFields()
          console.log("SHOP -> shopStore: ", shopStore);
        }
      } else {
        //fillFields()
      }
    })();
  }, []);

  const fillFields = () => {
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
  };

  const typesList = shopTypes.map((item, i) => {
    return (
      <SwitchInput
        key={i}
        thumbColor="#215487"
        label={item.name}
        value={false}
        onValueChange={() => handleSwitchType()}
        extraClasses="pl-5 mb-2"
      />
    );
  });

  const handleSwitchType = () => {};

  const handleSaveShop = async () => {
    try {
      setShopSaveLoading(true);
      const token = await getToken();
      const values = { name, description, siret, address };
      const data = await shopTools.createNewShop(token, values);
      if (data) {
        Alert.alert(
          "Mise à jour de votre profil",
          "Votre profil à bien été mis à jour.",
        );
        dispatch(setShopData(data));
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

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <ScrollView className="w-full flex-1 p-3">
        <TextHeading2 extraClasses="my-3">Boutique</TextHeading2>

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
        <ButtonPrimaryEnd
          label="Mettre à jour"
          iconName="refresh"
          disabled={isShopSaveLoading}
          extraClasses="my-5"
          onPressFn={() => handleSaveShop()}
          isLoading={isShopSaveLoading}
        />

        <View className="flex flex-row my-5 justify-center">
          <ButtonIcon
            iconName="photo"
            extraClasses="p-4 mr-3 h-[50px]"
            onPressFn={() => setPhotoModalVisible(true)}
          />
          <ButtonIcon
            iconName="video-camera"
            extraClasses="p-4 mr-3"
            onPressFn={() => setVideoModalVisible(true)}
          />
          <ButtonIcon
            iconName="shopping-bag"
            extraClasses="p-4 mr-3"
            onPressFn={() => setClickCollectModalVisible(true)}
          />
          <ButtonIcon
            iconName="globe"
            extraClasses="p-4 mr-3"
            onPressFn={() => setMarketsModalVisible(true)}
          />
        </View>

        <View className="flex my-5 pl-3 items-center">
          <SwitchInput
            thumbColor="#215487"
            label="Désactiver la boutique"
            value={false}
            extraClasses="pl-5 mb-2"
            onPressFn={handleReopenDate}
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

        <View className="h-[200px]"></View>

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
