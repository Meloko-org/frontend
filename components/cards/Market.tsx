import React, { JSX, useEffect, useState } from "react";

// import { MarketData, MarketsData, OpeningHoursData } from "../../types/API";
import { MarketData, MarketsData, OpeningHourData } from "../../types/API";
import Planning from "../Planning";

import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import TextHeading4 from "../utils/texts/Heading4";
import TextBody1 from "../utils/texts/Body1";
import TextBody2 from "../utils/texts/Body2";
import IconButton from "../utils/buttons/Icon";

import { useColorScheme } from "nativewind";
import _Fontawesome from "react-native-vector-icons/FontAwesome6";

const FontAwesome = _Fontawesome as unknown as React.ElementType;

type CardMarketProps = {
  marketData: MarketData;
  openingHoursData?: OpeningHourData[];
  isActiveData?: boolean;
  onPressFn?: ((arg0: MarketData) => void) | undefined;
  extraClasses?: string;
  displayMode?: "withdrawMode" | "order";
  showDirectionButton?: boolean;
  pickup?: string;
  showDescription?: boolean;
  showAddress?: boolean;
  goto?: boolean;
  highlightEnable?: boolean;
  highlightFn?: Function;
  radioButtonMode?: boolean;
  isRadioButtonActive?: boolean;
  onRadioButtonPress?: () => void;
  planning?: boolean;
  onMarketDataChange?: (newMarketData: {
    market: MarketData;
    openingHours: OpeningHourData[];
    isActive: boolean;
  }) => void;
};

// type OpeningHourData = {
//   day: number;
//   periods: PeriodData[];
// };

// type PeriodData = {
//   openingTime: string | null;
//   closingTime: string | null;
// };

export default function Market(props: CardMarketProps): JSX.Element {
  const [isHighlighted, setHighlighted] = useState(false);

  const [marketInfos, setMarketInfos] = useState<{
    market: MarketData;
    openingHours: OpeningHourData[];
    isActive: boolean;
  }>({
    market: props.marketData,
    isActive: props.isActiveData ? props.isActiveData : false,
    openingHours: props.openingHoursData?.length ? props.openingHoursData : [],
  });

  const highlightClassForOuter = props.radioButtonMode
    ? isHighlighted || props.isRadioButtonActive
      ? "bg-primary"
      : ""
    : "";

  const highlightClassForInner = !props.radioButtonMode
    ? isHighlighted || props.isRadioButtonActive
      ? "bg-primary"
      : ""
    : "";

  useEffect(() => {
    if (props.isActiveData) {
      setHighlighted(props.isActiveData);
    }
  }, []);

  useEffect(() => {
    setMarketInfos((prevMarketInfos) => ({
      ...prevMarketInfos,
      isActive: isHighlighted,
    }));
  }, [isHighlighted]);

  useEffect(() => {
    if (props.onMarketDataChange) {
      props.onMarketDataChange(marketInfos);
    }
  }, [marketInfos]);

  const handlePlanningChange = (newOpeningHours: OpeningHourData[]) => {
    // console.log("openingHours in market:", JSON.stringify(newOpeningHours, null, 2))
    // console.log("openingHours in market:", newOpeningHours)
    setMarketInfos((prevMarketInfos) => ({
      ...prevMarketInfos,
      openingHours: newOpeningHours,
    }));
  };

  const handleMarketRoutePress = () => {
    console.log("open google map");
  };

  const handleHighlight = () => {
    /* si Market est utilisé en mode withdraw */
    if (props.radioButtonMode) {
      console.log("radio Mode");
      props.onRadioButtonPress && props.onRadioButtonPress();
    } else {
      /* si Market est utilisé pour paramétrer le shop */
      // gestion du highlight en local: impossible d'highlighter sans periodes définies
      let hasDefinedPeriod;
      let canHighlight = false;
      marketInfos.openingHours.forEach((openingHour) => {
        hasDefinedPeriod = openingHour.periods.some(
          (period) => period.openingTime !== null,
        );
        if (hasDefinedPeriod) {
          canHighlight = true;
        }
      });

      if (!canHighlight) {
        Alert.alert(
          "Erreur",
          "Vous ne pouvez pas activer une place de marché si vous n'avez pas défini d'horaires.",
        );
      } else {
        setHighlighted(!isHighlighted);
        // si une fonction highlight est passée depuis le parent
        props.highlightFn && props.highlightFn();
      }
    }
  };

  // console.log("openingHoursData:", JSON.stringify(props.openingHoursData, null, 2))
  // console.log("length props :", props.openingHoursData?.length)
  // console.log("length :", marketInfos.openingHours.length)
  // console.log("marketInfos.open :", JSON.stringify(marketInfos.openingHours, null, 2))
  // console.log("marketInfos :", JSON.stringify(marketInfos, null, 2))
  // console.log("marketInfos :",marketInfos)
  console.log("radioButtonMode :", props.radioButtonMode);
  console.log("isHighlighted:", isHighlighted);

  return (
    <TouchableOpacity
      onPress={(event) =>
        props.highlightEnable
          ? handleHighlight()
          : props.onPressFn && props.onPressFn(props.marketData)
      }
      style={{ shadowColor: "#000" }}
      className={`
          ${props.extraClasses}
          rounded-lg shadow-md bg-white dark:bg-tertiary
        `}
    >
      <View
        className={`
          ${props.radioButtonMode && (isHighlighted || props.isRadioButtonActive) ? "bg-primary" : ""} 
          flex rounded-lg p-2 w-full`}
      >
        <View
          className={`
            ${!props.radioButtonMode && (isHighlighted || props.isRadioButtonActive) ? "bg-primary" : ""} 
            flex flex-row w-full p-1 rounded-lg mb-2 items-center`}
        >
          <View className="flex-none justify-center rounded-lg mr-1">
            <Image
              source={require("../../assets/images/tomate.webp")}
              className="rounded-full w-16 h-16"
              alt="fgsd"
              resizeMode="cover"
              width={100}
              height={50}
            />
          </View>
          <View className="px-1 w-3/5">
            <TextHeading4>{props.marketData.name}</TextHeading4>
            {props.showDescription && (
              <TextBody1>{props.marketData.description}</TextBody1>
            )}
            {props.showAddress && (
              <>
                <TextBody2>{props.marketData.address.address1}</TextBody2>
                <View className="flex flex-row">
                  <TextBody1>{props.marketData.address.postalCode}</TextBody1>
                  <TextBody1 extraClasses="px-5">
                    {props.marketData.address.city}
                  </TextBody1>
                </View>
              </>
            )}
          </View>
          <View className="flex flew-row w-1/5 justify-center">
            {props.goto && (
              <IconButton
                iconName="location-arrow"
                extraClasses="w-full h-16"
                onPressFn={handleMarketRoutePress}
              />
            )}
          </View>
        </View>
        {props.pickup && (
          <View className="flex flex-row justify-start items-center ms-1">
            <FontAwesome
              name="clock"
              size={20}
              color="#262E20"
              className="mr-1"
            />
            <Text className="text-darkbg dark:text-lightbg">
              A partir du 23/07/2024 à 9h00
            </Text>
          </View>
        )}
        {props.planning && (
          <Planning
            key={marketInfos.market._id}
            openingHoursValues={
              props.openingHoursData
                ? props.openingHoursData
                : marketInfos?.openingHours
            }
            onOpeningHoursChange={handlePlanningChange}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
