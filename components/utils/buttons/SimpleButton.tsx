import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

type ButtonProps = {
    name: string
}

export default function SimpleButton(props: ButtonProps): JSX.Element {

	return (
		<TouchableOpacity className="flex flex-row rounded-lg bg-primary py-1 justify-center items-center p-4">
			<FontAwesome name={props.name} size={25} color="#FFFFFF"/>
		</TouchableOpacity>
	)
}