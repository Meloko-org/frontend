import React from 'react'
import { Text } from 'react-native'

type TextHeading2Props = {
		children: string,
    extraClasses?: string
    centered?: boolean
}

export default function TextHeading2(props: TextHeading2Props): JSX.Element {
	return (
    <>
      <Text className={`${props.extraClasses} font-bold text-secondary text-[34px] w-full text-center dark:text-lightbg`}>{props.children}</Text>
    </>
	)
}