import React from "react";
import {  Text, View } from 'react-native'



export default function PricePer(): JSX.Element {
	return (
		<View className="rounded-full py-1 w-1/2 bg-darkbg dark:bg-lightbg">
			<Text className="text-lightbg text-xs dark:text-darkbg text-center">3.80 € / kg</Text>
		</View>
	)
}