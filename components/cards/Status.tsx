import React from "react";
import { Text, View } from 'react-native'
import Price from "../utils/badges/Price";
import Cancelled from "../utils/badges/Cancelled";



export default function Status(): JSX.Element {
	return (
		<View className="flex flex-row w-full rounded-lg p-2 shadow-lg bg-lightbg dark:bg-darkbg">
			<View className="grow flex px-1 align-center">
				<Text className="font-bold text-wrap text-darkbg dar:text-lightbg">Nom du producteur</Text>
				<View className="flex-row justify-between items-center ">
					<Text className="text-darkbg dark:text-lightbg me-2">21/07/2024</Text>
					<Price></Price>
				</View>
			</View>
			<View className="flex justify-center px-4">
				<Cancelled></Cancelled>
				<Text className="text-darkbg dark:text-lightbg text-xs mt-1">Click and Collect</Text>
			</View>
		</View>
	)
}