import React from "react";
import { Image, Text, TouchableOpacity, View, GestureResponderEvent } from 'react-native'
import TextHeading4 from "../utils/texts/Heading4";
import TextBody1 from "../utils/texts/Body1";
import ButtonIcon from "../utils/buttons/Icon";
import { MarketData } from "../../types/API";
import _Fontawesome from 'react-native-vector-icons/FontAwesome6'


const FontAwesome = _Fontawesome as React.ElementType

type CardMarketProps = {
	marketData: MarketData
	onPressFn?: ((arg0: MarketData) => void) | undefined
	extraClasses?: string
	displayMode?: 'withdrawMode' | 'order'
	showDirectionButton?: boolean
}

export default function Market(props: CardMarketProps): JSX.Element {
	const handleMarketRoutePress = () => {
		console.log("open google map")
	}
	
	return (
		<TouchableOpacity onPress={(event) => props.onPressFn && props.onPressFn(props.marketData)}>
		<View className={`${props.extraClasses} flex rounded-lg p-2 shadow-lg bg-white dark:bg-darkbg w-full`}>
			<View className="flex flex-row w-full mb-2">
				<View className="flex-none justify-center rounded-lg w-auto h-16">
					<Image source={require('../../assets/images/tomate.webp')} className="rounded-full w-16 h-16" alt="fgsd" resizeMode="cover" width={100} height={50}/>
				</View>
				<View className="grow px-1 w-3/5">
					<TextHeading4>{ props.marketData.name }</TextHeading4>
					<TextBody1>{ props.marketData.description }</TextBody1>
				</View>
				<View className="flex flew-row w-1/5 justify-center">
					<ButtonIcon 
						iconName="location-arrow"
						extraClasses='w-full h-16'
						onPressFn={handleMarketRoutePress}
					/>
				</View>
			</View>
			<View className="flex flex-row justify-start items-center ms-1">
				<FontAwesome name="clock" size={20} color="#262E20" className="mr-1"/>
				<Text className="text-darkbg dark:text-lightbg">A partir du 23/07/2024 à 9h00</Text>
			</View>
				
		</View>
		</TouchableOpacity>

	)
}