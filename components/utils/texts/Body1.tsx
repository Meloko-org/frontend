import React from 'react'
import { Text } from 'react-native'

type TextBody1Props = {
		children: string,
    extraClasses?: string
}

export default function TextBody1(props: TextBody1Props): JSX.Element {
	return (
    <>
      <Text className={`${props.extraClasses} text-left text-secondary text-base`}>{props.children}</Text>
    </>
	)
}