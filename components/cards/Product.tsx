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
import { addProductToCart, increaseCartQuantity, decreaseCartQuantity } from "../../reducers/cart";
import { ProductData } from "../../types/API";

const FontAwesome = _Fontawesome as React.ElementType

type CardProductProps = {
	stockData: StockData
	onPressFn?: ((event: GestureResponderEvent) => void) | undefined
	extraClasses?: string
	displayMode: 'cart' | 'shop'
	quantityControllable?: boolean	
	showImage?: boolean
}

export default function CardProduct(props: CardProductProps): JSX.Element {
  const dispatch = useDispatch()
  const cartStore = useSelector((state: { cart }) => state.cart.value)
  const handleAddCartPress = async ():Promise<void> => {
    dispatch(addProductToCart({
			shop: props.stockData.shop,
      stockData: props.stockData
    }))

  }

	const isInCart = () => {
		return cartStore.find(c => c.shop._id === props.stockData.shop._id) 
		&& cartStore.find(c => c.shop._id == props.stockData.shop._id).products.find(p => p.stockData._id === props.stockData._id)
	}

	const cartButton = (isInCart()) ? (
		<>
			{ 
				props.quantityControllable && 
					<TouchableOpacity 
						onPress={() => dispatch(increaseCartQuantity({
									shopId: props.stockData.shop._id, 
									stockId: props.stockData._id
								})
							)}
					>
						<Text className="text-3xl dark:text-lightbg">+</Text>
					</TouchableOpacity> }
			<BadgeGrey>{cartStore.find(c => c.shop._id == props.stockData.shop._id).products.find(p => p.stockData._id === props.stockData._id).quantity}</BadgeGrey>
			{ 
				props.quantityControllable && 
					<TouchableOpacity 
					onPress={() => dispatch(decreaseCartQuantity({
						shopId: props.stockData.shop._id, 
						stockId: props.stockData._id
					})
					)}
					>
						<Text className="text-3xl dark:text-lightbg">-</Text>
					</TouchableOpacity> }
		</>
	) : (
		props.stockData.quantity ? (
			<BadgeGrey>{props.stockData.quantity}</BadgeGrey>
		) : (
			<ButtonIcon 
				iconName="cart-plus"
				onPressFn={() => handleAddCartPress()}
				extraClasses="h-20 w-full"
			/>
		)

	)

	const tags = props.stockData.tags && props.stockData.tags.map(s => {
			// console.log("s", s)
		return (
				<BadgeSecondary key={s._id} uppercase extraClasses="mt-1">{ `${s.name}` }</BadgeSecondary>
	)})
	// console.log(props.stockData)
	return (
		<View className={`${props.extraClasses} rounded-lg shadow-sm bg-white p-2 dark:bg-tertiary flex flex-row w-full`}>
			<View className="flex flex-row items-center w-full">
				{
					props.showImage && (
						<View className="flex flex-row items-center rounded-lg w-auto h-full">
							<Image 
								source={
									props.stockData.product.image ? 
									{uri: props.stockData.product.image} :
									require('../../assets/icon.png')
								} 
								className="rounded-full w-20 h-20" 
								alt={`Illustration du produit ${props.stockData.product.name}`} 
								resizeMode="cover" width={96} height={64}
							/>
						</View>
					)
				}

				<View className={`${props.showImage ? 'w-3/5' : 'w-4/5' } h-full px-2 items-start`}>
					<TextHeading4>{ `${props.stockData.product.family.name} ${props.stockData.product.name}` }</TextHeading4>
					<PricePer>{
						`${props.stockData.price.$numberDecimal}€ / ${props.stockData.product.weight.measurement.$numberDecimal}${props.stockData.product.weight.unit}`
					}</PricePer>
					<View className="flex flex-row justify-start items-center">
						{tags}
					</View>
					

				</View>
				<View className="w-1/5 pr-1 flex flex-column justify-center items-center">
 					{cartButton}
				</View>
			</View>
		</View>
	)
}