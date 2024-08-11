import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
import { GestureResponderEvent } from 'react-native'
const FontAwesome = _Fontawesome as React.ElementType

type ButtonPrimaryEndProps = {
	label: string
	iconName: string
	extraClasses?: string
	disabled: boolean
	onPressFn: ((event: GestureResponderEvent) => void) | undefined
}

export default function ButtonPrimaryEnd(props: ButtonPrimaryEndProps): JSX.Element {

	return (
		<TouchableOpacity 
			className={
				`
					${props.extraClasses} 
					${props.disabled ? 'bg-primary/60' : 'bg-primary'}
					relative flex flex-row rounded-lg shadow-sm py-1 justify-center items-center px-4 w-min
				`
			} 
			onPress={props.onPressFn}
			disabled={props.disabled}
		>
				<Text className="text-lightbg text-center m-2 font-bold text-[24px]">{props.label}</Text>
				<FontAwesome name={props.iconName} size={25} color="#FFFFFF" className="absolute" style={{right: 20}} />
		</TouchableOpacity>
	)
}