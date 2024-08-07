import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

type ButtonProps = {
    name: string
}

export default function PrimaryEnd(props: ButtonProps): JSX.Element {

	return (
		<TouchableOpacity className="flex flex-row rounded-lg bg-primary py-1 justify-end items-center px-4">
			<Text className="text-lightbg text-center">{props.name}</Text>
            <FontAwesome name="arrow-right" size={30} color="#FFFFFF" className="ps-2"/>
		</TouchableOpacity>
	)
}