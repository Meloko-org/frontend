import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native'
import ProductsNumber from "../utils/badges/ProductsNumber";
import StarsNotation from "../utils/StarsNotation";
import _Fontawesome from 'react-native-vector-icons/FontAwesome6'
import { GestureResponderEvent } from "react-native";
import { ShopData } from '../../types/API';

const FontAwesome = _Fontawesome as React.ElementType

type CardProducerSearchResultProps = {
	shopData: ShopData
	onPressFn?: ((event: GestureResponderEvent) => void) | undefined
	extraClasses?: string
	displayMode?: 'bottomSheet' | 'mapCallout'
}

export default function CardProducerSearchResult(props: CardProducerSearchResultProps): JSX.Element {
	return (
		<TouchableOpacity onPress={props.onPressFn}>
		<View className={`${props.extraClasses} ${props.displayMode === 'bottomSheet' ? 'rounded-lg shadow-sm bg-white p-1 dark:bg-darkbg' : 'p-2'} flex flex-row w-full`}>
			<View className="flex flex-row items-center w-full">
				<View className="flex flex-row items-center rounded-lg w-28 h-full">
					<Image source={require('../../assets/images/tomate.webp')} className="rounded-lg w-full h-24" alt={`logo de la boutique ${props.shopData.name}`} resizeMode="cover" width={96} height={64}/>
				</View>
				<View className="h-full pl-2 items-start">
					<View className="flex flex-row items-center">
						<Text className="text-lg font-bold text-darkbg dar:text-lightbg">{ props.shopData.name }</Text>
						<Text className="text-xs text-darkbg dar:text-lightbg"> - {props.shopData.searchData.distance.toFixed(2)}km</Text>
					</View>
					<StarsNotation iconNames={['star', 'star-half', 'star-o']} shopData={props.shopData} extraClasses="pb-1"/>
					 { 
					 	props.shopData.searchData.relevantProducts && 
							<ProductsNumber>{ `${props.shopData.searchData.relevantProducts.length} produit que vous recherchez` }</ProductsNumber>
					 }
				</View>
			</View>
		</View>
		</TouchableOpacity>
	)
}