import React from 'react'
import { Text } from 'react-native'

type TextHeading1Props = {
		children: string,
    extraClasses?: string
    centered?: boolean
}

export default function TextHeading1(props: TextHeading1Props): JSX.Element {
	return (
    <>
      <Text className={`${props.extraClasses} font-bold text-secondary text-[48px] w-full text-center dark:text-lightbg`}>{props.children}</Text>
    </>
	)
}