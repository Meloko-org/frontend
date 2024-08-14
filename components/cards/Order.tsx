import React from "react";
import { Image, Text, TouchableOpacity, View } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome6'
import { GestureResponderEvent } from "react-native";
import PricePer from "../utils/badges/Dark";
import ButtonIcon from "../utils/buttons/Icon";
import BadgeGrey from "../utils/badges/Grey";
import TextHeading4 from "../utils/texts/Heading4";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, increaseCartQuantity, decreaseCartQuantity } from "../../reducers/cart";
import { OrderData } from "../../types/API";
import BadgeSecondary from "../utils/badges/Secondary";
import BadgeWithdrawStatus from "../utils/badges/WithdrawStatus";
import TextBody2 from "../utils/texts/Body2";
const FontAwesome = _Fontawesome as React.ElementType

type CardOrderProps = {
	orderData: OrderData
	onPressFn?: ((event: GestureResponderEvent) => void) | undefined
	extraClasses?: string
}

export default function CardOrder(props: CardOrderProps): JSX.Element {

	const nbProducts = () => {
		let total = 0
		props.orderData.details.forEach(d => {
			total += d.products.length
		})

		return total
	}

	const dateDisplay = () => {
		return new Date(props.orderData.createdAt).toLocaleDateString()
	}

	return (
		<TouchableOpacity onPress={(value) => props.onPressFn && props.onPressFn(value)}>
			<View className={`${props.extraClasses} rounded-lg shadow-sm bg-white p-2 flex flex-row w-full dark:bg-tertiary`}>
				<View className="flex flex-row justify-between items-center w-full">
					<View className={`h-full px-2 items-start`}>
						<TextHeading4>{ `Commande n° ${props.orderData._id.slice(0, 7)}` }</TextHeading4>
						<TextBody2 extraClasses="mb-2">{`${dateDisplay()}`}</TextBody2>
						<BadgeSecondary>{ `${nbProducts()} produit${nbProducts() > 1 ? 's' : ''} chez ${props.orderData.details.length} producteur${props.orderData.details.length > 1 ? 's' : ''}` }</BadgeSecondary>
					</View>
					<View className="pr-1 flex flex-column justify-center items-center">
						<BadgeWithdrawStatus 
							type='none'
						/>
					</View>
				</View>
			</View>
		</TouchableOpacity>

	)
}