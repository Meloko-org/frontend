import React from "react";
import { Text, View } from 'react-native'



export default function Cancelled(): JSX.Element {
	return (
		<View className="rounded-lg bg-danger w-32">
			<Text className="text-lightbg text-center text-xs">ANNULÉE</Text>
		</View>
	)
}