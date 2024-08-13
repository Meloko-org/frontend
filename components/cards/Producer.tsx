import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native'
import ProductsNumber from "../utils/badges/Secondary";
import _Fontawesome from 'react-native-vector-icons/FontAwesome6'


const FontAwesome = _Fontawesome as React.ElementType

export default function CardProducer(): JSX.Element {
	return (
		<View className="flex rounded-lg p-2 shadow-lg bg-lightbg dark:bg-darkbg w-full">
			<View className="flex flex-row w-full mb-2">
				<View className="flex-none justify-center rounded-lg w-24 h-16">
					<Image source={require('../../assets/images/tomate.webp')} className="rounded-lg w-24 h-16" alt="fgsd" resizeMode="cover" width={100} height={50}/>
				</View>
				<View className="grow px-1">
					<Text className="font-bold text-wrap text-darkbg dar:text-lightbg mb-1">Nom du producteur</Text>
					<ProductsNumber>1 produit que vous recherchez</ProductsNumber>
				</View>
				<View className="flex-none w-12 justify-center">
					<TouchableOpacity className="bg-primary rounded-sm justify-center items-center w-12 h-16">
						<FontAwesome name="location-arrow" size={30} color="#FCFFF0"/>
					</TouchableOpacity>
				</View>
			</View>
			<View className="flex flex-row justify-center items-center ms-1">
				<FontAwesome name="clock" size={20} color="#262E20" className="me-2"/>
				<Text className="text-darkbg dark:text-lightbg">A partir du 23/07/2024 à 9h00</Text>
			</View>
				
		</View>
	)
}