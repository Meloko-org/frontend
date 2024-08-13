import React from "react";
import { Text, View } from 'react-native'
import TextBody1 from "../utils/texts/Body1";
import StarsNotation from "../utils/StarsNotation";

export default function CardNote(props): JSX.Element {
	return (
		<View className={`${props.extraClasses} flex justify-center items-center rounded-lg p-2 shadow-sm bg-gray-100 w-[200px] h-[100px] dark:bg-darkbg`}>
			<TextBody1 extraClasses="italic font-bold mb-1">{`"${props.note.comment}"`}</TextBody1>
			<StarsNotation iconNames={['star', 'star-half', 'star-o']} note={Number(props.note.note.$numberDecimal)} extraClasses="pb-1"/>
		</View>
	)
}