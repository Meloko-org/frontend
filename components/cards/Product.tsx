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
import BadgeGrey from "../utils/badges/Grey";
import TextHeading4 from "../utils/texts/Heading4";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, increaseCartQuantity, decreaseCartQuantity } from "../../reducers/user";
import { ProductData } from "../../types/API";

const FontAwesome = _Fontawesome as React.ElementType

type CardProductProps = {
	stockData: StockData
	onPressFn?: ((event: GestureResponderEvent) => void) | undefined
	extraClasses?: string
	displayMode: 'cart' | 'shop'
}

export default function CardProduct(props: CardProductProps): JSX.Element {
  const dispatch = useDispatch()
  const cartStore = useSelector((state: { cart }) => state.user.cart)

	console.log(cartStore)
	// console.log(props.stockData)

  const handleAddCartPress = async ():Promise<void> => {
    dispatch(addProductToCart({
      stockData: { 
				_id: props.stockData._id,
				product: props.stockData.product,
				stock: props.stockData.stock,
				price: props.stockData.price,
				shop: props.stockData.shop 
			},
      quantity: 1
    }))
  }

	return (
		<View className={`${props.extraClasses} rounded-lg shadow-sm bg-white p-2 dark:bg-darkbg flex flex-row w-full`}>
			<View className="flex flex-row items-center w-full">
				<View className="flex flex-row items-center rounded-lg w-auto h-full">
					<Image source={require('../../assets/images/tomate.webp')} className="rounded-full w-20 h-20" alt={`logo de la boutique ${props.stockData.product.name}`} resizeMode="cover" width={96} height={64}/>
				</View>
				<View className="h-full px-2 items-start w-3/5">
					<TextHeading4>{ `${props.stockData.product.family.name} ${props.stockData.product.name}` }</TextHeading4>
					<PricePer>{props.stockData.price.$numberDecimal}€ / 100gr</PricePer>
				</View>
				<View className="w-1/5 pr-1 flex flex-column justify-center items-center">
 					{
						cartStore.some(c => {
							return c.stockData._id === props.stockData._id
						}) ? (
							<>
								<TouchableOpacity onPress={() => dispatch(increaseCartQuantity(props.stockData))}><Text className="text-2xl">+</Text></TouchableOpacity>
								<BadgeGrey>{cartStore.find(c => c.stockData._id === props.stockData._id).quantity}</BadgeGrey>
								<TouchableOpacity onPress={() => dispatch(decreaseCartQuantity(props.stockData))}><Text className="text-2xl">-</Text></TouchableOpacity>
							</>
						) : (
							<ButtonIcon 
								iconName="cart-plus"
								onPressFn={() => handleAddCartPress()}
								extraClasses="h-20 w-full"
							/>
						)
					}

				</View>
			</View>
		</View>
	)
}