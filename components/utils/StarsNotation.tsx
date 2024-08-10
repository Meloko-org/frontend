import React, { useState } from 'react'
import { View, Text } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
import { ShopData } from '../../types/API';

const FontAwesome = _Fontawesome as React.ElementType

type StarsNotationProps = {
    iconNames: string[];
		extraClasses?: string;
    shopData: ShopData;
}

export default function StarsNotation(props: StarsNotationProps): JSX.Element {
  // Note calculation  
  const calculNote = (shopData: ShopData): number => { 
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
    const rating: number = calculNote(shopData)
    const stars: JSX.Element[] = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FontAwesome key={i} name={props.iconNames[0]} size={15} className='text-primary pr-0.5' />);
      } else if (i < rating) {
        stars.push(<FontAwesome key={i} name={props.iconNames[1]} size={15} className='text-primary pr-0.5' />);
      } else {
        stars.push(<FontAwesome key={i} name={props.iconNames[2]} size={15} className='text-primary pr-0.5' />);
      }
    }
    return stars;
  };



	return (
		<View className={`${props.extraClasses} flex flex-row w-auto justify-between items-center`}>
      {renderStars(props.shopData)} 
      <Text className='text-sm'>({props.shopData.notes.length})</Text>
    </View>
	)
}














