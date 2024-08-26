import React, { useState } from "react";
import { View, Text } from "react-native";
import _Fontawesome from "react-native-vector-icons/FontAwesome";
import { ShopData } from "../../types/API";

const FontAwesome = _Fontawesome as React.ElementType;

type StarsNotationProps = {
  iconNames: string[];
  extraClasses?: string;
  shopData?: ShopData;
  note?: number;
};

export default function StarsNotation(props: StarsNotationProps): JSX.Element {
  // Note calculation
  const calculNote = (): number => {
    if (props.shopData !== undefined) {
      let calcul: number = 0;
      const path = props.shopData.notes;
      for (let i = 0; i < path.length; i++) {
        calcul += parseFloat(path[i].note.$numberDecimal);
      }
      calcul /= path.length;
      return calcul;
    } else {
      return 0;
    }
  };

  // Star formatting
  const renderStars = () => {
    const rating: number = props.note ? props.note : calculNote();
    const stars: JSX.Element[] = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(
          <FontAwesome
            key={i}
            name={props.iconNames[0]}
            size={20}
            className="text-primary pr-0.5"
          />,
        );
      } else if (i < rating) {
        stars.push(
          <FontAwesome
            key={i}
            name={props.iconNames[1]}
            size={20}
            className="text-primary pr-0.5"
          />,
        );
      } else {
        stars.push(
          <FontAwesome
            key={i}
            name={props.iconNames[2]}
            size={20}
            className="text-primary pr-0.5"
          />,
        );
      }
    }
    return stars;
  };

  return (
    <View
      className={`${props.extraClasses} flex flex-row w-fit justify-center items-center`}
    >
      {renderStars()}
      {!props.note && props.shopData && (
        <Text className="text-sm dark:text-lightbg">
          ({props.shopData.notes.length})
        </Text>
      )}
    </View>
  );
}
