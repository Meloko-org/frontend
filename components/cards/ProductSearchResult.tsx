import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native'
import BadgeSecondary from "../utils/badges/Secondary";
import StarsNotation from "../utils/StarsNotation";
import _Fontawesome from 'react-native-vector-icons/FontAwesome6'
import { GestureResponderEvent } from "react-native";
import { StockData } from '../../types/API';
import TextBody1 from "../utils/texts/Body1";
import PricePer from "../utils/badges/Dark";
import ButtonIcon from "../utils/buttons/Icon";
import TextHeading3 from "../utils/texts/Heading3";
import TextHeading4 from "../utils/texts/Heading4";

const FontAwesome = _Fontawesome as React.ElementType

type CardProductSearchResultProps = {
	stockData: StockData
	onPressFn?: ((event: GestureResponderEvent) => void) | undefined
	extraClasses?: string
}

export default function CardProductSearchResult(props: CardProductSearchResultProps): JSX.Element {

	const handleAddCartPress = () => {
		console.log("add to cart")
	}
	return (
		<TouchableOpacity onPress={props.onPressFn}>
		<View className={`${props.extraClasses} rounded-lg shadow-sm bg-white p-2 dark:bg-darkbg flex flex-row w-full`}>
			<View className="flex flex-row items-center w-full">
				<View className="flex flex-row items-center rounded-lg w-auto h-full">
					<Image source={require('../../assets/images/tomate.webp')} className="rounded-full w-20 h-20" alt={`logo de la boutique ${props.stockData.product.name}`} resizeMode="cover" width={96} height={64}/>
				</View>
				<View className="h-full px-2 items-start w-3/5">
					<TextHeading4>{ `${props.stockData.product.family.name} ${props.stockData.product.name}` }</TextHeading4>
						<TextBody1>{ props.stockData.product.description }</TextBody1>
						<PricePer>{props.stockData.price.$numberDecimal}€ / 100gr</PricePer>
				</View>
				<View className="w-1/5 h-full pr-1">
					<ButtonIcon 
						iconName="cart-plus"
						onPressFn={handleAddCartPress}
						extraClasses="h-20"
					/>
				</View>
			</View>
		</View>
		</TouchableOpacity>
	)
}