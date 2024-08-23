import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { GestureResponderEvent } from 'react-native'

type CustomProps = {
	label: string
	extraClasses?: string
	textClasses?: string
	onPressFn: ((event: GestureResponderEvent) => void) | undefined
}

export default function Custom(props: CustomProps): JSX.Element {

	return (
		<TouchableOpacity 
			className={`
					${props.extraClasses} 
					 flex justify-center items-center w-min
				`} 
			onPress={props.onPressFn}
		>
			<Text 
				className={`
						${props.textClasses}
						text-center
					`}>
						{props.label}
					</Text>
		</TouchableOpacity>
	)
}