import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native'
import ProductsNumber from "../utils/badges/ProductsNumber";
import _Fontawesome from 'react-native-vector-icons/FontAwesome6'


const FontAwesome = _Fontawesome as React.ElementType

export default function Producer(): JSX.Element {
	return (
		<TouchableOpacity>
		<View className="flex rounded-lg p-2 shadow-lg bg-lightbg dark:bg-darkbg w-full">
			<View className="flex flex-row w-full mb-2">
				<View className="flex-none justify-center rounded-lg w-24 h-16">
					<Image source={require('../../assets/images/tomate.webp')} className="rounded-lg w-24 h-16" alt="fgsd" resizeMode="cover" width={100} height={50}/>
				</View>
				<View className="grow px-1">
					<Text className="font-bold text-wrap text-darkbg dar:text-lightbg mb-1">Nom du producteur</Text>
					<ProductsNumber></ProductsNumber>
				</View>
			</View>
		</View>
		</TouchableOpacity>
	)
}