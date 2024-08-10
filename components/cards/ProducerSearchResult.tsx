import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native'
import ProductsNumber from "../utils/badges/ProductsNumber";
import StarsNotation from "../utils/StarsNotation";
import _Fontawesome from 'react-native-vector-icons/FontAwesome6'


const FontAwesome = _Fontawesome as React.ElementType

type Props = {
	data: object
	onPressFn?: Function
	extraClasses?: string
	displayMode?: 'bottomSheet' | 'mapCallout'
}

export default function Producer(props: Props): JSX.Element {
	return (
		<TouchableOpacity onPress={props.onPressFn}>
		<View className={`${props.extraClasses} ${props.displayMode === 'bottomSheet' ? 'rounded-lg shadow-sm bg-white p-1 dark:bg-darkbg' : 'p-2'} flex flex-row w-full`}>
			<View className="flex flex-row items-center w-full">
				<View className="flex flex-row items-center rounded-lg w-28 h-full">
					<Image source={require('../../assets/images/tomate.webp')} className="rounded-lg w-full h-24" alt={`logo de la boutique ${props.data.name}`} resizeMode="cover" width={96} height={64}/>
				</View>
				<View className="h-full pl-2 items-start">
					<View className="flex flex-row items-center">
						<Text className="text-lg font-bold text-darkbg dar:text-lightbg">{ props.data.name }</Text>
						<Text className="text-xs text-darkbg dar:text-lightbg"> - {props.data.searchData.distance.toFixed(2)}km</Text>
					</View>
					<StarsNotation iconNames={['star', 'star-half', 'star-o']} shopData={props.data} extraClasses="pb-1"/>
					 { 
					 	props.data.searchData.relevantProducts && 
							<ProductsNumber>{ props.data.searchData.relevantProducts.length } produit que vous recherchez</ProductsNumber>
					 }
				</View>
			</View>
		</View>
		</TouchableOpacity>
	)
}