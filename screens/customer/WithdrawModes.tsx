import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/clerk-expo";

import {
  CompositeNavigationProp,
  RouteProp,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, UserTabParamList } from "../../types/Navigation";

import { useDispatch, useSelector } from "react-redux";
import { CartState, updateWithdrawMode } from "../../reducers/cart";

import { MarketData, MarketsData, ShopData, StockData } from "../../types/API";

import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { View, Image, Modal } from "react-native";
import TextHeading2 from "../../components/utils/texts/Heading2";
import TextHeading3 from "../../components/utils/texts/Heading3";
import CardProduct from "../../components/cards/Product";
import ButtonPrimaryEnd from "../../components/utils/buttons/PrimaryEnd";
import StripePaymentButton from "../../components/utils/buttons/StripePayment";
import InputRadioGroup, {
  InputRadioGroupData,
} from "../../components/utils/inputs/radioGroup";
import Market from "../../components/cards/Market";
import TextHeading4 from "../../components/utils/texts/Heading4";
import ButtonSecondaryStart from "../../components/utils/buttons/SecondaryStart";
import SignInScreen from "../Signin";
import SelectMarketModal from "../../components/modals/user/SelectMarket";
import TextBody1 from "../../components/utils/texts/Body1";
import { NativeStackNavigatorProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import TopBar from "../../components/TopBar";

type SelectedMarkets = {};

type WithdrawShopView = {
  shopId: string;
  shopName: string;
  products: {
    stockData: StockData;
    name: string;
    quantity: number;
  }[];
  modes: InputRadioGroupData<"market" | "clickCollect" | "shipping">[];
  markets?: MarketsData[];
  withdrawMode?: "market" | "clickCollect" | "shipping" | null;
  withdrawMarket?: string | null;
  withdrawDay?: number | null;
};

type WithdrawModesRouteProp = RouteProp<UserTabParamList, "WithdrawModes">;

type WithdrawModesNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList, "WithdrawModes">,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: WithdrawModesNavProp;
  route: WithdrawModesRouteProp;
};

export default function WithdrawModesScreen({ navigation, route }: Props) {
  const { from, backLabel, screenTitle } = route.params || [];
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

  const weekDays = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  /* PREPARATION DES DONNEES POUR CHAQUE SHOP DU CART */
  const shopsDisplayData: WithdrawShopView[] = useMemo(() => {
    return cartStore.map((cart) => {
      const shop = cart.shop;

      // modes disponibles
      const modes: InputRadioGroupData<
        "market" | "clickCollect" | "shipping"
      >[] = [];
      if (shop!.markets.length > 0) {
        modes.push({
          label: "Points de vente",
          value: "market",
          selected: cart.withdrawMode === "market",
        });
      }
      if (shop!.clickCollect) {
        modes.push({
          label: "Click&Collect",
          value: "clickCollect",
          selected: cart.withdrawMode === "clickCollect",
        });
      }
      if (shop!.shipping) {
        modes.push({
          label: "Livraison",
          value: "shipping",
          selected: cart.withdrawMode === "shipping",
        });
      }

      // produits
      const products = cart.products.map((p) => ({
        stockData: p.stockData,
        name:
          p.stockData.productCustomName ||
          p.stockData.product.family.name + " " + p.stockData.product.name,
        quantity: p.quantity,
      }));

      return {
        shopId: shop!._id,
        shopName: shop!.name,
        products,
        modes,
        markets: shop?.markets || [],
        withdrawMode: cart.withdrawMode,
        withdrawMarket: cart.withdrawMarket || null,
        withdrawDay: cart.withdrawDay || null,
      };
    });
  }, [cartStore]);

  useEffect(() => {
    if (cartStore.length > 0) {
      let allShopsCost = 0;
      cartStore.forEach((c) => {
        const cartTotalCost = c.products.reduce((accumulator, currentValue) => {
          const quantity =
            currentValue.stockData.product.weight.unit === "gr"
              ? currentValue.quantity / 1000
              : currentValue.quantity;

          return quantity * Number(currentValue.stockData.price) + accumulator;
        }, 0);
        allShopsCost += cartTotalCost;
      });
      setCartTotal(allShopsCost);
      setIsPaymentDisabledButton(cartStore.some((c) => !c.withdrawMode));
    }
    // else {
    //   navigation.navigate("TabNavigatorUser", {
    //     screen: "Accueil",
    //     params: {
    //       search: {
    //         address: null,
    //         query: null,
    //         radius: null,
    //         userPosition: null,
    //       },
    //       searchResults: [],
    //     },
    //   });
    // }
  }, [cartStore]);

  const handleSelectedModePress = (
    shopId: string | undefined,
    value: string,
  ) => {
    console.log("shopId :", shopId);
    console.log("value :", value);

    const selectedShop = cartStore.find((c) => c.shop?._id === shopId)?.shop;

    console.log("selectedShop :", selectedShop?.name);

    if (value === "market") {
      if (selectedShop) {
        setSelectedShop(selectedShop);
        setSelectMarketModalVisible(true);
      }
    } else if (value === "clickCollect") {
      console.log("youpi");
      dispatch(
        updateWithdrawMode({
          shopId: selectedShop?._id!,
          withdrawMode: value,
          withdrawMarket: null,
          withdrawDay: null,
          // market: null,
        }),
      );
      // setSelectedMarket(null)
    } else if (value === "shipping") {
      dispatch(
        updateWithdrawMode({
          shopId: selectedShop?.shop?._id!,
          withdrawMode: value,
        }),
      );
    }
  };

  const products = cartStore.map((cart) => {
    if (cart) {
      const shopData = cart.shop;
      const productsByShop = cart.products.map((p) => {
        return (
          <CardProduct
            stockData={p.stockData}
            shopData={shopData}
            key={p.stockData._id}
            extraClasses="mb-1"
            displayMode="withdraw"
            showImage={true}
          />
        );
      });

      const withdrawModeButtonData = [];

      cart.shop?.markets &&
        cart.shop?.markets.length > 0 &&
        withdrawModeButtonData.push({
          label: "Points de vente",
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
        <View className="mb-3" key={cart.shop?._id}>
          <TextHeading4
            centered
            extraClasses="mb-2 pb-1 bg-night/20 dark:bg-night rounded-lg"
          >
            {cart.shop?.name}
          </TextHeading4>

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

  console.log(
    "------------------------------- WITHDRAWMODES --------------------------------------------------------------------",
  );
  console.log("cartStore:");
  console.log(
    "withdrawMode: ",
    cartStore.find((cart) => cart.shop?._id === selectedShop?._id)
      ?.withdrawMode,
  );
  console.log(
    "withdrawMarket: ",
    cartStore.find((cart) => cart.shop?._id === selectedShop?._id)
      ?.withdrawMarket,
  );
  console.log(
    "withdrawDay: ",
    cartStore.find((cart) => cart.shop?._id === selectedShop?._id)?.withdrawDay,
  );
  // console.log(cartStore)

  return (
    <SafeAreaView
      className="flex-1 bg-lightbg dark:bg-darkbg"
      edges={["right", "left", "top"]}
    >
      {/* TopBar */}
      <View style={{ flex: 1 }}>
        <TopBar
          backLabel={backLabel || "Retour au panier"}
          screen={from || "Cart"}
          label={screenTitle || "MODEs DE RETRAIT"}
          extraClasses="mt-2 mb-5"
        />
      </View>

      <View style={{ flex: 9 }} className="p-3">
        <TextBody1 centered extraClasses="mb-5">
          Choisissez le mode de retrait pour chaque vendeur
        </TextBody1>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* {products} */}

          {shopsDisplayData.map((s) => (
            <View
              key={s.shopId}
              className="mb-5 bg-night/20 dark:bg-lightbg/20 rounded-lg"
            >
              <TextHeading4
                centered
                extraClasses="mb-2 pb-1 bg-night/20 dark:bg-night rounded-lg"
              >
                {s.shopName}
              </TextHeading4>

              <InputRadioGroup
                data={s.modes}
                size="base"
                onPressFn={(value) => handleSelectedModePress(s.shopId, value)}
                extraClasses="mb-3"
              />

              {s.withdrawMarket && s.withdrawDay && (
                <View className="px-1 mb-3">
                  <View className="flex flex-row bg-success rounded-lg px-2 py-1">
                    <TextBody1 extraClasses="font-bold">Retrait: </TextBody1>
                    <TextBody1>{s.withdrawMarket}, </TextBody1>
                    <TextBody1>
                      {weekDays[s.withdrawDay - 1]} prochain
                    </TextBody1>
                  </View>
                </View>
              )}

              <View className="mt-3 flex flex-row flex-wrap justify-center gap-x-2 gap-y-2 mb-3">
                {s.products.map((p) => (
                  <View className="flex flex-row items-center rounded-sm">
                    <Image
                      source={
                        p.stockData.productCustomName
                          ? { uri: p.stockData.image }
                          : p.stockData?.product?.image
                            ? { uri: p.stockData.product.image }
                            : require("../../assets/icone_la_charrue.png")
                      }
                      className="rounded-lg w-20 h-20"
                      alt={`Illustration du produit ${p.name}`}
                      resizeMode="cover"
                      width={72}
                      height={48}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
          {/* <TextHeading3 extraClasses="py-3 text-right">{`TOTAL : ${cartTotal.toFixed(2)}€`}</TextHeading3> */}

          <View className="px-3 bg-night rounded-lg my-5">
            <TextHeading3
              centered
              extraClasses="py-2"
            >{`TOTAL: ${cartTotal?.toFixed(2)}€`}</TextHeading3>
          </View>
        </ScrollView>
      </View>

      <View style={{ flex: 1 }} className="p-3">
        <ButtonPrimaryEnd
          disabled={isPaymentDisabledButton}
          label="Passer au paiement"
          iconName="arrow-right"
          extraClasses=" mb-3 h-14"
          onPressFn={() => {
            !isSignedIn
              ? navigation.navigate("SignIn", {
                  from: "WithdrawModes",
                  backLabel: "Retour aux modes de retrait",
                  screenTitle: `CONNEXION\nINSCRIPTION`,
                  next: "PaymentCustomer",
                })
              : navigation.navigate("PaymentCustomer", {
                  from: "WithdrawModes",
                  backLabel: "Retour aux modes de retrait",
                  screenTitle: "PAIEMENT",
                });
          }}
        />
      </View>

      <SelectMarketModal
        isVisible={isSelectMarketModalVisible}
        shop={selectedShop}
        onCloseFn={() => setSelectMarketModalVisible(false)}
      />
    </SafeAreaView>
  );
}
