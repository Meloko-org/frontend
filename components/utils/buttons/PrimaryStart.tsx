import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

export default function PrimaryStart(): JSX.Element {

	return (
		<TouchableOpacity className="w3/4 bg-primary p-2 justify-start">
			<FontAwesome name="arrow-left" size={30} color="#FFFFFF" className="pe-2"/>
			<Text className="text-lightbg">Primary button start</Text>
		</TouchableOpacity>
	)
}