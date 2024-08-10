import React from "react";
import { Text, View } from 'react-native'

type BadgeSecondaryProps = {
	children: string
	uppercase?: boolean
}

export default function BadgeSecondary(props: BadgeSecondaryProps): JSX.Element {
	return (
		<View className={`rounded-lg border w-fit bg-lightbg dark:bg-ternary border-primary p-1`}>
			<Text className={`${props.uppercase && 'uppercase'} text-[11px] text-darkbg dark:text-lightbg text-center w-fit`}>{props.children}</Text>
		</View>
	)
}