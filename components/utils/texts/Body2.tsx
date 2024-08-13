import React from 'react'
import { Text } from 'react-native'

type TextBody2Props = {
		children: string,
    extraClasses?: string
}

export default function TextBody2(props: TextBody2Props): JSX.Element {
	return (
    <>
      <Text className={`${props.extraClasses} text-left text-xs`}>{props.children}</Text>
    </>
	)
}