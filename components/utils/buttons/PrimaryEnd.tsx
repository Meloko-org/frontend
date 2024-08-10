import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
import { GestureResponderEvent } from 'react-native'
const FontAwesome = _Fontawesome as React.ElementType

type ButtonPrimaryEndProps = {
	label: string,
	iconName: string,
	extraClasses?: string,
	onPressFn: ((event: GestureResponderEvent) => void) | undefined
}

export default function ButtonPrimaryEnd(props: ButtonPrimaryEndProps): JSX.Element {

	return (
		<TouchableOpacity className="flex flex-row rounded-lg bg-primary shadow-sm py-1 justify-between items-center px-4 w-min" onPress={props.onPressFn}>
			<View className='w-5/6 text-center'>
				<Text className="text-lightbg text-center m-2 font-bold text-[24px]">{props.label}</Text>
			</View>
				<FontAwesome name={props.iconName} size={25} color="#FFFFFF" className="ps-2"/>
		</TouchableOpacity>
	)
}