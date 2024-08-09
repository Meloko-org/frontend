import React from 'react'
import { View, Text, TextInput } from 'react-native'

type SimpleProps = {
		placeholder: string,
		label: string,
		autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined,
		keyboardType?: null | string,
		textContentType?: string,
		autoComplete?: string,
		onChangeText?: {},
		value?: string,
		style?: {},
		className?: string
}

export default function Simple(props: SimpleProps): JSX.Element {

	return (
		<View className="w-full rounded-lg mx-1 px-2 py-1 border border-secondary dark:border-primary">
      <Text className="text-xs font-bold text-secondary/50">{props.label}</Text>
			<TextInput 
				className={props.className}
				placeholder={props.placeholder}
				autoCapitalize={props.autoCapitalize ? 'none' : props.autoCapitalize}
				>
			</TextInput>
		</View>
	)
}