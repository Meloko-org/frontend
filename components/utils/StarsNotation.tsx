import React, { useState } from 'react'
import { View, Text } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

type ShopData = {
  name: string;
  logo: string;
  description: string;
  notes: { note: { $numberDecimal: string } | number | any }[]; 
  product?: any;
  [key: string]: any;
}

type StarsNotationProps = {
    iconNames: string[];
		extraClasses?: string;
    shopData: ShopData;
		onPressFn: Function
}

export default function StarsNotation(props: StarsNotationProps): JSX.Element {
  // Note calculation  
  const calculNote = (shopData: ShopData) => { 
    let calcul: number = 0;
    const path = shopData.notes;
    for (let i = 0; i < path.length; i++) {
      calcul += parseFloat(path[i].note.$numberDecimal);
    }
    calcul /= path.length;
    return calcul
  }

  // Star formatting  
  const renderStars = (shopData: ShopData) => {
    const rating = calculNote(shopData)
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FontAwesome key={i} name={props.iconNames[0]} className='text-primary pr-0.5' />);
      } else if (i < rating) {
        stars.push(<FontAwesome key={i} name={props.iconNames[1]} className='text-primary pr-0.5' />);
      } else {
        stars.push(<FontAwesome key={i} name={props.iconNames[2]} className='text-primary pr-0.5' />);
      }
    }
    return stars;
  };



	return (
		<View className={`${props.extraClasses} flex flex-row w-1/4 justify-between items-center`}>
      {renderStars(props.shopData)} 
      <Text className='text-xs'>({props.shopData.notes.length})</Text>
    </View>
	)
}














