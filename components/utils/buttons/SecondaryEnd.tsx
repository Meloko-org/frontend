import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

export default function SecondaryEnd(): JSX.Element {

	return (
		<TouchableOpacity className="w3/4 bg-lightbg p-2 justify-start border border-primary">
			<Text className="text-primary">Primary button start</Text>
            <FontAwesome name="arrow-right" size={30} color="#98B66E" className="ps-2"/>
		</TouchableOpacity>
	)
}