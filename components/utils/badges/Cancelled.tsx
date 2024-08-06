import React from "react";
import { Text, View } from 'react-native'



export default function Cancelled(): JSX.Element {
	return (
		<View className="rounded-full px-3 bg-danger">
			<Text className="text-lightbg">ANNULÉE</Text>
		</View>
	)
}