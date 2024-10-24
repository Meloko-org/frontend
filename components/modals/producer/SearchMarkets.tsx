import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { ShopState } from "../../../reducers/shop";
import { addMarket } from "../../../reducers/shop";

import shopTools from "../../../modules/shopTools";

import { View, Modal, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextHeading2 from "../../utils/texts/Heading2";
import ButtonBack from "../../utils/buttons/Back";
import TextHeading4 from "../../utils/texts/Heading4";
import TextHeading3 from "../../utils/texts/Heading3";
import { Slider } from "@miblanchard/react-native-slider";
import TextBody1 from "../../utils/texts/Body1";
import TextBody2 from "../../utils/texts/Body2";
import InputText from "../../utils/inputs/Text";
import ButtonPrimaryEnd from "../../utils/buttons/PrimaryEnd";
import MarketSelector from "../../cards/MarketSelector";
import { useColorScheme } from "nativewind";

type SearchMarketsModalProps = {
  isVisible: boolean;
  onCloseFn: (bool: boolean) => void;
};

export default function SearchMarketsModal(
  props: SearchMarketsModalProps,
): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const shopStore = useSelector(
    (state: { shop: ShopState }) => state.shop.value,
  );
  const dispatch = useDispatch();

  const bgStyle = colorScheme === "light" ? styles.light : styles.dark;

  const [city, setCity] = useState<string>();
  const [radius, setRadius] = useState<number[]>([10]);
  const [marketsList, setMarketsList] = useState<string[]>();
  const [errmess, setErrmess] = useState();

  const [marketSelected, setMarketSelected] = useState<string[]>([]);
  const [isAddMarketLoading, setAddMarketLoading] = useState(false);

  const handleSwitch = (marketId: string, isEnabled: boolean) => {
    setMarketSelected((prevSelected) => {
      if (isEnabled) {
        return [...prevSelected, marketId];
      } else {
        return prevSelected.filter((id) => id !== marketId);
      }
    });
  };

  const onSearchPress = async () => {
    try {
      if (city) {
        const data = await shopTools.getMarkets(city, radius);

        if (data.error) {
          setErrmess(data.error);
        }

        if (data) {
          setMarketsList(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMarket = async () => {
    try {
      setAddMarketLoading(true);
      const values = { shopId: shopStore?._id, marketIds: marketSelected };

      const data = await shopTools.addShopMarkets(values);

      if (data.error) {
        Alert.alert("Ajout de place de marché", data.error);
        setAddMarketLoading(false);
        return;
      }

      if (data) {
        Alert.alert("Ajout de place de marché", data.message);
        dispatch(addMarket(data.markets.markets));
      }

      setAddMarketLoading(false);
      setMarketSelected([]);
      setMarketsList([]);
      setCity("");
      Alert.alert(
        "",
        "Rendez vous sur l'ecran\nprécédent pour paramétrer\nles places de marché que\nvous venez d'ajouter.",
      );
    } catch (error) {
      console.log(error);
    }
  };

  console.log(
    "------------------------------- SEARCHMARKET --------------------------------------------------------------------",
  );
  console.log(marketSelected);
  // console.log(shopStore)

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isVisible}
      onRequestClose={() => {
        props.onCloseFn(!props.isVisible);
      }}
    >
      <SafeAreaView style={bgStyle}>
        <View>
          <ButtonBack onPressFn={() => props.onCloseFn(false)} />
        </View>

        <View>
          <TextHeading4 centered={true} extraClasses="mt-2 mb-5">
            Rechercher des places de marché
          </TextHeading4>

          <InputText
            value={city}
            onChangeText={setCity}
            placeholder="Entrez une ville"
            label="Votre recherche"
            autoCapitalize="none"
            extraClasses="w-full mb-3"
            size="large"
            iconName="search"
            onIconPressFn={onSearchPress}
          />

          <View style={styles.distanceContainer}>
            <View style={styles.distanceTitle}>
              <TextBody2 extraClasses="" centered>
                Distance
              </TextBody2>
            </View>
            <View style={styles.distanceSlider}>
              <Slider
                containerStyle={{ width: "90%" }}
                value={radius}
                step={5}
                minimumValue={0}
                maximumValue={100}
                onValueChange={(value) => setRadius(value)}
                minimumTrackTintColor="#98B66E"
                thumbTintColor="#98B66E"
              />
            </View>
            <View style={styles.distanceKm}>
              <TextBody1 className="dark:text-lightbg">{radius} km</TextBody1>
            </View>
          </View>
        </View>

        {marketsList && marketsList.length > 0 && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}
          >
            <View>
              <TextHeading4 centered={true} extraClasses="mb-1">
                Place marché trouvées
              </TextHeading4>
              <TextBody2 centered={true} extraClasses="mb-5">
                Cochez pour sélectionner
              </TextBody2>
              {marketsList.length > 0 ? (
                marketsList.map((market) => (
                  <MarketSelector
                    key={market._id}
                    market={market}
                    value={marketSelected.includes(market._id)}
                    extraClasses="mb-5"
                    onSwitchChange={(isEnabled) =>
                      handleSwitch(market._id, isEnabled)
                    }
                  />
                ))
              ) : (
                <TextBody1 centered={true}>{errmess}</TextBody1>
              )}
            </View>

            <ButtonPrimaryEnd
              label="Ajouter"
              iconName="plus"
              disabled={isAddMarketLoading}
              extraClasses="my-5"
              onPressFn={() => handleAddMarket()}
              isLoading={isAddMarketLoading}
            />
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

/* impossible d'appliquer du styling avec la propriété className et des classes tailwind,
		obligé de créer des styles pour styliser en fonction du dark mode
 */
const styles = StyleSheet.create({
  dark: {
    flex: 1,
    backgroundColor: "#262E20",
    padding: 10,
  },
  light: {
    flex: 1,
    backgroundColor: "#FCFFF0",
    padding: 10,
  },
  scrollContainer: {
    height: "80%",
    marginTop: 20,
  },
  distanceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 5,
  },
  distanceTitle: {
    width: "20%",
    display: "flex",
    alignItems: "center",
  },
  distanceSlider: {
    width: "70%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  distanceKm: {
    width: "15%",
  },
});
