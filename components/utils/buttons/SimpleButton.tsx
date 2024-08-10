import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
const FontAwesome = _Fontawesome as React.ElementType

type ButtonSimpleProps = {
    iconName: string,
		extraClasses?: string,
		onPressFn: Function
}

export default function SimpleButton(props: ButtonSimpleProps): JSX.Element {

	return (
		<TouchableOpacity className={`${props.extraClasses} flex flex-row rounded-lg shadow-sm bg-primary py-1 justify-center items-center`} onPress={props.onPressFn}>
			<FontAwesome name={props.iconName} size={25} color="#FFFFFF"/>
		</TouchableOpacity>
	)
}