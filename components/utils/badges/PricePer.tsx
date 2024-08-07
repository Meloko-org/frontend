import React from "react";
import {  Text, View } from 'react-native'



export default function PricePer(): JSX.Element {
	return (
		<View className="rounded-lg w-24 bg-darkbg dark:bg-lightbg px-2">
			<Text className="text-lightbg text-xs dark:text-darkbg text-center">3.80 € / kg</Text>
		</View>
	)
}