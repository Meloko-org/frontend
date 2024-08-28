import React from "react";
import { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/Navigation";

/* Eléments graphiques */
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import Text from "../../components/utils/inputs/Text";
import InputTextarea from "../../components/utils/inputs/Textarea";
import SwitchInput from "../../components/utils/inputs/Switch";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import ButtonIcon from "../../components/utils/buttons/Icon";
import TextBody1 from "../../components/utils/texts/Body1";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
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
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [siret, setSiret] = useState("");
  const [types, setTypes] = useState([]);
  const [address, setAddress] = useState({
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
  });

  const [isShopSaveLoading, setShopSaveLoading] = useState(false);
  const [isReopenDateVisible, setReopenDateVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const [logoModalVisible, setLogoModalVisible] = useState(false);
  const [logoFile, setLogoFile] = useState();

  const fetchTypes = async () => {
    const response = await fetch(`${API_ROOT}/types`);
    const bddTypes = await response.json();

    return bddTypes;
  };

  let typesToDisplay = ["Maraîcher", "Fromager", "Viticulteur"];

  /*useEffect(() => {
    (async () => {
      const typesFromBdd = await fetchTypes()
      typesToDisplay = [...typesFromBdd]
    })()
    
  }, [])*/

  const typesList = typesToDisplay.map((item: String, i) => {
    return (
      <SwitchInput
        key={i}
        thumbColor="#215487"
        label={item}
        value={false}
        onValueChange={() => handleSwitchType()}
        extraClasses="pl-5 mb-2"
      />
    );
  });

  const handleSwitchType = () => {};

  const handleSelectFile = () => {};

  const handleUploadFile = () => {
    /* créer fonction d'upload du fichier */
    setLogoModalVisible(!logoModalVisible);
  };

  const handleShopUpdate = () => {};

  const handleActiveShop = () => {
    setReopenDateVisible(true);
    console.log("openDate :", isReopenDateVisible);
  };

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg p-3">
      <ScrollView className="w-full flex-1">
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
          value={desc}
          onChangeText={(value: string) => setDesc(value)}
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
          placeholder="Saisissez votre adresse"
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
          iconName="arrow-right"
          disabled={isShopSaveLoading}
          extraClasses="my-5"
          onPressFn={() => handleShopUpdate()}
          isLoading={isShopSaveLoading}
        />

        <View className="flex flex-row my-5 justify-center">
          <ButtonIcon
            iconName="photo"
            extraClasses="p-4 mr-3 h-[50px]"
            onPressFn={() => navigation.navigate("PhotoShopProducer")}
          />
          <ButtonIcon
            iconName="video-camera"
            extraClasses="p-4 mr-3"
            onPressFn={() => navigation.navigate("VideoShopProducer")}
          />
          <ButtonIcon
            iconName="shopping-bag"
            extraClasses="p-4 mr-3"
            onPressFn={() => navigation.navigate("ClickCollectShopProducer")}
          />
          <ButtonIcon
            iconName="globe"
            extraClasses="p-4 mr-3"
            onPressFn={() => navigation.navigate("MarketsShopProducer")}
          />
        </View>

        <View className="flex mt-5 pl-3 items-center">
          <SwitchInput
            thumbColor="#215487"
            label="Désactiver la boutique"
            value={false}
            extraClasses="pl-5 mb-2"
            onPressFn={handleActiveShop}
          />
          {isReopenDateVisible && (
            <View>
              <TextBody1>Sélectionner une date de réouverture</TextBody1>
              <DateTimePicker mode="date" display="spinner" value={date} />
            </View>
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={logoModalVisible}
          onRequestClose={() => {
            setLogoModalVisible(!logoModalVisible);
          }}
        >
          <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg p-3 items-center">
            <TouchableOpacity
              onPress={() => setLogoModalVisible(!logoModalVisible)}
            >
              <FontAwesome
                name="arrow-left"
                size={25}
                color="#98B66E"
                className="absolute"
                style={{ right: 20 }}
              />
            </TouchableOpacity>

            <View className="flex-1 justify-center">
              <TextHeading3 centered extraClasses="mb-5">
                Modifier le logo
              </TextHeading3>
              <Text
                value={logoFile}
                onChangeText={(value: string) => setLogoFile(value)}
                placeholder="Sélectionnez un fichier"
                label="Logo de la boutique"
                autoCapitalize="none"
                extraClasses="w-full mb-5"
                size="large"
                iconName="search"
                onIconPressFn={handleSelectFile}
              />
              <ButtonPrimaryEnd
                label="Sauvegarder"
                iconName="upload"
                onPressFn={handleUploadFile}
                isLoading={false}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
    // <Button title="Create my producer profile" onPress={() => navigation.navigate('ProfilProducer')}/>
  );
}
