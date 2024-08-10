import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native'



export default function ProductsNumber(props): JSX.Element {
	return (
		<View className="rounded-lg border w-fit bg-lightbg dark:bg-ternary border-primary py-1 px-2">
			<Text className="text-darkbg dark:text-lightbg text-center w-fit">{props.children}</Text>
		</View>
	)
}