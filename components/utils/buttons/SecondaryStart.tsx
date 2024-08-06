import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

export default function SecondaryStart(): JSX.Element {

	return (
		<TouchableOpacity className="w3/4 bg-lightbg p-2 justify-start border border-primary">
			<FontAwesome name="arrow-left" size={30} color="#98B66E" className="pe-2"/>
			<Text className="text-primary">secondary button start</Text>
		</TouchableOpacity>
	)
}