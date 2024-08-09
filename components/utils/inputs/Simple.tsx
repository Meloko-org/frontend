import React from 'react'
import { View, Text, TextInput } from 'react-native'

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
}

export default function Simple(props: SimpleProps): JSX.Element {
	return (
		<View className={`${props.class} rounded-lg p-2 border border-secondary dark:border-primary`}>
      <Text className={`${props.size === 'large' ? 'text-lg' : 'text-xs'} font-bold text-secondary/50 uppercase p-0`}>{props.label}</Text>
			<TextInput 
				value={props.value}
				className={props.size === 'large' ? 'text-lg' : 'text-base'}
				placeholder={props.placeholder}
				onChangeText={(value) => props.onChangeText(value)}
				autoCapitalize={props.autoCapitalize ? 'none' : props.autoCapitalize}
			>
			</TextInput>
		</View>
	)
}