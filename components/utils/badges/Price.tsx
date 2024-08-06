import React from "react";
import { Text, View } from 'react-native'



export default function Price(): JSX.Element {
	return (
		<View className="rounded-full w-1/3 py-1 px-3 bg-darkbg dark:bg-lightbg">
			<Text className="text-lightbg dark:text-darkbg text-center text-xs">3.80 €</Text>
		</View>
	)
}