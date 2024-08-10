import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'

const FontAwesome = _Fontawesome as React.ElementType

type ButtonProps = {
    name: string
}

export default function SecondaryEnd(props: ButtonProps): JSX.Element {

	return (
		<TouchableOpacity className="flex flex-row rounded-lg py-1 justify-end items-center px-4 border border-primary">
			<View className='w-full text-center'>
				<Text className="text-primary">{props.name}</Text>
			</View>
      <FontAwesome name="arrow-right" size={30} color="#98B66E" className="ps-2"/>
		</TouchableOpacity>
	)
}