import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
const FontAwesome = _Fontawesome as React.ElementType

type SimpleProps = {
		placeholder: string,
		label: string,
		autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined,
		keyboardType?: null | string,
		textContentType?: string,
		autoComplete?: string,
		onChangeText: Function,
		value?: string,
		style?: {},
		class?: string
		size?: string
		className?: string
		iconName?: string
		onIconPressFn?: Function
}

export default function Simple(props: SimpleProps): JSX.Element {


	return (
		<View className={`${props.class} flex flex-row rounded-lg p-2 shadow-sm border border-secondary bg-white ${props.size === 'large' ? 'h-[70px]' : 'text-xs'} dark:border-primary`}>
			<View className='flex w-4/6'>
				<Text className={`${props.size === 'large' ? 'text-lg' : 'text-xs'} font-bold text-secondary/50 uppercase p-0`}>{props.label}</Text>
				<TextInput 
					value={props.value}
					className={`${props.size === 'large' ? 'text-lg' : 'text-xs'} ${props.iconName ? 'w-80' : 'w-full'}`}
					placeholder={props.placeholder}
					onChangeText={(value) => props.onChangeText(value)}
					autoCapitalize={props.autoCapitalize ? 'none' : props.autoCapitalize}
				>
				</TextInput>
			</View>

			{
				props.iconName && (
					<View className='w-2/6 h-full pr-1'>
						<TouchableOpacity className='flex flex-row justify-end items-center h-full m-0 p-0' onPress={() => props.onIconPressFn && props.onIconPressFn()}>
							<FontAwesome name={props.iconName} size={35} color="#98B66E" />
						</TouchableOpacity>
					</View>
				)
			}

		</View>
	)
}