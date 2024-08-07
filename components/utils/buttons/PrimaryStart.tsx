import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

type ButtonProps = {
    name: string
}

export default function PrimaryStart(props: ButtonProps): JSX.Element {

	return (
		<TouchableOpacity className="flex flex-row rounded-lg bg-primary py-1 justify-end items-center px-4">
			<FontAwesome name="arrow-left" size={30} color="#FFFFFF" className="pe-2"/>
			<Text className="text-lightbg">{props.name}</Text>
		</TouchableOpacity>
	)
}