import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

export default function PrimaryEnd(): JSX.Element {

	return (
		<TouchableOpacity className="w3/4 bg-primary p-2 justify-end">
			<Text className="text-lightbg">Primary button start</Text>
            <FontAwesome name="arrow-right" size={30} color="#FFFFFF" className="ps-2"/>
		</TouchableOpacity>
	)
}