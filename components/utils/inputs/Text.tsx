import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
const FontAwesome = _Fontawesome as React.ElementType
import { GestureResponderEvent } from 'react-native'
import { useColorScheme } from "nativewind";

type InputTextProps = {
		placeholder: string,
		label: string,
		autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined,
		keyboardType?: null | string,
		textContentType?: string,
		autoComplete?: string,
		onChangeText: Function,
		value?: string,
		size?: string
		extraClasses?: string
		iconName?: string
		secureTextEntry?: boolean
		onIconPressFn?: ((event: GestureResponderEvent) => void) | undefined
}

export default function InputText(props: InputTextProps): JSX.Element {
  const { colorScheme, toggleColorScheme } = useColorScheme();


	return (
		<View className={`${props.extraClasses} flex flex-row rounded-lg p-2 shadow-sm border border-secondary bg-white ${props.size === 'large' ? 'h-[70px]' : 'text-xs'} dark:border-primary/20 dark:bg-tertiary`}>
			<View className={`flex ${props.iconName ? 'w-4/6' : 'w-full'}`}>
				<Text className={`${props.size === 'large' ? 'text-lg' : 'text-sm'} font-bold text-secondary/50 uppercase p-0 dark:text-lightbg/50`}>{props.label}</Text>
				<TextInput 
					value={props.value}
					className={`${props.size === 'large' ? 'text-lg' : 'text-base h-7'} ${props.iconName ? 'w-80' : 'w-full'} dark:text-lightbg`}
					placeholder={props.placeholder}
					placeholderTextColor={colorScheme === 'dark' ? '#FCFFF0' : '#444C3D' }
					onChangeText={(value) => props.onChangeText(value)}
					autoCapitalize={props.autoCapitalize ? 'none' : props.autoCapitalize}
					secureTextEntry={props.secureTextEntry}
				>
				</TextInput>
			</View>

			{
				(props.iconName && props.onIconPressFn) && (
					<View className='w-2/6 h-full pr-1'>
						<TouchableOpacity className='flex flex-row justify-end items-center h-full m-0 p-0' onPress={props.onIconPressFn}>
							<FontAwesome name={props.iconName} size={35} color="#98B66E" />
						</TouchableOpacity>
					</View>
				)
			}

		</View>
	)
}