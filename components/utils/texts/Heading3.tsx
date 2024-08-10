import React from 'react'
import { Text } from 'react-native'

type TextHeading3Props = {
		children: string,
    extraClasses?: string
    centered?: boolean
}

export default function TextHeading3(props: TextHeading3Props): JSX.Element {
	return (
    <>
      <Text className={`${props.extraClasses} ${props.centered && 'text-center'} font-bold text-secondary text-[24px] w-full`}>{props.children}</Text>
    </>
	)
}