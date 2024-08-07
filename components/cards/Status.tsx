import React from "react";
import { Text, View } from 'react-native'
import Price from "../utils/badges/Price";
import Cancelled from "../utils/badges/Cancelled";
import Partial from "../utils/badges/Partial";



export default function Status(): JSX.Element {
	return (
		<View className="flex flex-row rounded-lg p-2 shadow-lg bg-lightbg dark:bg-darkbg">
			<View className="grow align-center">
				<Text className="font-bold text-darkbg dar:text-lightbg py-1">Nom du producteur</Text>
				<View className="flex-row justify-space items-center ">
					<Text className="text-darkbg dark:text-lightbg me-2">21/07/2024</Text>
					<Price></Price>
				</View>
			</View>
			<View className="flex justify-center">
				<Partial></Partial>
				<Text className="text-darkbg dark:text-lightbg text-xs text-center mt-1">Click and Collect</Text>
			</View>
		</View>
	)
}