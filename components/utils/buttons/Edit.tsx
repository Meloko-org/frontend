import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

export default function Edit(): JSX.Element {

	return (
		<TouchableOpacity className="flex flex-row rounded-lg bg-primary py-1 justify-end items-center px-4">
			<FontAwesome name="pen" size={30} color="#FFFFFF"/>
			<Text className="text-lightbg">Edit</Text>
		</TouchableOpacity>
	)
}