import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

type ButtonProps = {
    name: string,
	onPressFn?: Function
}

export default function PrimaryEnd(props: ButtonProps): JSX.Element {

	return (
		<TouchableOpacity className="flex flex-row rounded-lg bg-primary py-1 justify-between items-center px-4 w-min" onPress={props.onPressFn}>
			<View>
				<Text className="text-lightbg text-center m-2">{props.name}</Text>

			</View>
			<View>
				<FontAwesome name="arrow-right" size={25} color="#FFFFFF" className="ps-2"/>

			</View>
		</TouchableOpacity>
	)
}