import React from "react";
import { Text, View } from 'react-native'



export default function Partial(): JSX.Element {
	return (
		<View className="rounded-lg px-1 w-32 bg-warning">
			<Text className="text-lightbg text-center text-xs">RETRAIT PARTIEL</Text>
		</View>
	)
}