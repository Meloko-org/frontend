import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native'



export default function ProductsNumber(): JSX.Element {
	return (
		<View className="rounded-full border w-1/2 bg-lightbg dark:bg-ternary border-primary">
			<Text className="text-darkbg dark:text-lightbg text-center">3 produits</Text>
		</View>
	)
}