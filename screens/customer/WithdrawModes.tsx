import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { useDispatch, useSelector } from "react-redux";
import { CartState, updateWithdrawMode } from "../../reducers/cart";

import { MarketData, ShopData } from "../../types/API";

import { View, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import CardProduct from "../../components/cards/Product";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import StripePaymentButton from "../../components/utils/buttons/StripePayment";
import InputRadioGroup from "../../components/utils/inputs/radioGroup";
import ButtonBack from "../../components/utils/buttons/Back";
import Market from "../../components/cards/Market";
import TextHeading4 from "../../components/utils/texts/Heading4";
import ButtonSecondaryStart from "../../components/utils/buttons/SecondaryStart";

import SignInScreen from "../Signin";
import SelectMarketModal from "../../components/modals/user/SelectMarket";
import TextBody1 from "../../components/utils/texts/Body1";

type SelectedMarkets = {};

export default function WithdrawModesScreen({ navigation }) {
  // Import the Clerk Auth functions
  const { isSignedIn, getToken } = useAuth();
  const dispatch = useDispatch();
  const cartStore = useSelector(
    (state: { cart: CartState }) => state.cart.value,
  );
  const [cartTotal, setCartTotal] = useState<number>(0);

  const [isSelectMarketModalVisible, setSelectMarketModalVisible] =
    useState<boolean>(false);

  // const [isMarketSelectModalVisible, setIsMarketSelectModalVisible] =
  // useState<boolean>(false);
  const [isSigninModalVisible, setIsSigninModalVisible] =
    useState<boolean>(false);
  const [selectedShop, setSelectedShop] = useState<ShopData | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [isPaymentDisabledButton, setIsPaymentDisabledButton] = useState(false);

  useEffect(() => {
    if (cartStore.length > 0) {
      let allShopsCost = 0;
      cartStore.forEach((c) => {
        const cartTotalCost = c.products.reduce((accumulator, currentValue) => {
          const quantity =
            currentValue.stockData.product.weight.unit === "gr"
              ? currentValue.quantity / 1000
              : currentValue.quantity;

          return (
            quantity * Number(currentValue.stockData.price.$numberDecimal) +
            accumulator
          );
        }, 0);
        allShopsCost += cartTotalCost;
      });
      setCartTotal(allShopsCost);
      setIsPaymentDisabledButton(cartStore.some((c) => !c.withdrawMode));
    } else {
      navigation.navigate("TabNavigatorUser", {
        screen: "Accueil",
        params: {
          search: {
            address: null,
            query: null,
            radius: null,
            userPosition: null,
          },
          searchResults: [],
        },
      });
    }
  }, [cartStore]);

  const handleSelectedModePress = (
    shopName: string | undefined,
    value: string,
    market = null,
  ) => {
    const selectedShop = cartStore.find((c) => c.shop?.name === shopName);

    /*dispatch(
      updateWithdrawMode({
        shopId: selectedShop.shop._id,
        withdrawMode: value,
        // market: null,
      }),
    );*/

    if (value === "market") {
      dispatch(
        updateWithdrawMode({
          shopId: selectedShop.shop._id,
          withdrawMode: value,
          // market: null,
        }),
      );
      setSelectedShop(selectedShop.shop);
      setSelectMarketModalVisible(true);
    } else {
      dispatch(
        updateWithdrawMode({
          shopId: selectedShop.shop._id,
          withdrawMode: value,
          withdrawMarket: null,
          withdrawDay: null,
          // market: null,
        }),
      );
      // setSelectedMarket(null)
    }
  };

  const products = cartStore.map((cart) => {
    if (cart) {
      const productsByShop = cart.products.map((p) => {
        return (
          <CardProduct
            stockData={p.stockData}
            key={p.stockData._id}
            extraClasses="mb-1"
            displayMode="cart"
          />
        );
      });

      const withdrawModeButtonData = [];

      cart.shop?.markets.length > 0 &&
        withdrawModeButtonData.push({
          label: "Marchés locaux",
          value: "market",
          selected: cart.withdrawMode === "market" ? true : false,
        });

      cart.shop?.clickCollect &&
        withdrawModeButtonData.push({
          label: "Click & Collect",
          value: "clickCollect",
          selected: cart.withdrawMode === "clickCollect" ? true : false,
        });

      return (
        <View className="mb-3" key={cart.shop._id}>
          <View className="flex-row justify-center items-center mb-1">
            <View className="flex flex-row w-3/12 justify-end items-end h-full">
              <TextBody1 extraClasses="">Vendeur: </TextBody1>
            </View>
            <View className="w-9/12">
              <TextHeading3>{cart.shop?.name}</TextHeading3>
            </View>
          </View>

          <View className="flex">
            <InputRadioGroup
              data={withdrawModeButtonData}
              size="base"
              onPressFn={(value) =>
                handleSelectedModePress(cart.shop?.name, value)
              }
            />
            {cart.withdrawMode === "market" && cart.market && (
              <Market
                key={cart.market._id}
                marketData={cart.market}
                extraClasses="mt-3"
              />
            )}
          </View>
          <View className="mt-3">{productsByShop}</View>
        </View>
      );
    }
  });

  const markets =
    selectedShop &&
    selectedShop.markets.map((m) => {
      console.log("m", m);
      return (
        <Market
          key={m._id}
          marketData={m}
          onPressFn={(market) => {
            dispatch(
              updateWithdrawMode({
                shopId: selectedShop._id,
                withdrawMode: "market",
                // market,
              }),
            );
            // setSelectedMarket(market)
            setIsMarketSelectModalVisible(false);
          }}
        />
      );
    });

  console.log(
    "------------------------------- WITHDRAWMODES --------------------------------------------------------------------",
  );
  console.log("CARTSTORE -> ", cartStore);

  return (
    <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
      <View className="p-3 flex-1">
        <View>
          <TextHeading2 extraClasses="mb-4" centered>
            Vos modes de retrait
          </TextHeading2>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {products}
          <TextHeading3 extraClasses="py-3 text-right">{`TOTAL : ${cartTotal.toFixed(2)}€`}</TextHeading3>

          <ButtonPrimaryEnd
            disabled={isPaymentDisabledButton}
            label="Passer au paiement"
            iconName="arrow-right"
            extraClasses=" mb-3"
            onPressFn={() => {
              !isSignedIn
                ? setIsSigninModalVisible(true)
                : navigation.navigate("TabNavigatorUser", {
                    screen: "PaymentCustomer",
                  });
            }}
          />
          <ButtonSecondaryStart
            label="Retour au panier"
            iconName="arrow-left"
            disabled={false}
            isLoading={false}
            onPressFn={() =>
              navigation.navigate("TabNavigatorUser", { screen: "Panier" })
            }
            extraClasses="mb-3"
          />
        </ScrollView>
      </View>

      {/* <Modal
        visible={isMarketSelectModalVisible}
        animationType="slide"
        onRequestClose={() => setIsMarketSelectModalVisible(false)}
        className=""
      >
        <SafeAreaView className="flex-1 bg-lightbg dark:bg-darkbg">
          <View className="p-3">
            <ButtonBack
              onPressFn={() => setIsMarketSelectModalVisible(false)}
            />
            <TextHeading2 extraClasses="mb-4">
              Choisissez un marché
            </TextHeading2>
            {markets}
          </View>
        </SafeAreaView>
      </Modal> */}

      <SelectMarketModal
        isVisible={isSelectMarketModalVisible}
        shop={selectedShop}
        onCloseFn={() => setSelectMarketModalVisible(false)}
      />

      <SignInScreen
        showModal={isSigninModalVisible}
        onCloseFn={() => setIsSigninModalVisible(false)}
      />
    </SafeAreaView>
  );
}
