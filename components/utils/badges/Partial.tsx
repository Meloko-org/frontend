import React from "react";
import { Text, View } from 'react-native'



export default function Partial(): JSX.Element {
	return (
		<View className="rounded-full px-2 w-1/3 bg-warning">
			<Text className="text-lightbg font-bold">RETRAIT PARTIEL</Text>
		</View>
	)
}