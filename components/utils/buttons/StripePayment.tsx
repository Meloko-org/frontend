import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import ButtonPrimaryEnd from './PrimaryEnd';
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from '../../../reducers/user';
import { emptyCart } from '../../../reducers/cart';
import { useAuth } from '@clerk/clerk-expo'
import userTools from '../../../modules/userTools'

export default function StripePaymentButton(props) {
  const dispatch = useDispatch()
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [publishableKey, setPublishableKey] = useState('');
  const userStore = useSelector((state: { user }) => state.user.value)
  const cartStore = useSelector((state: { cart }) => state.cart.value)
  const [isPaymentScreenLoading, setIsPaymentScreenLoading] = useState(false)

  // Import the public api root address
  const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!

  const { getToken } = useAuth()


  const fetchPublishableKey = async () => {
    const key = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    setPublishableKey(key);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  const fetchPaymentSheetParams = async () => {
    const token = await getToken() 
    const response = await fetch(`${API_ROOT}/stripe/paymentIntent`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors'
      },
      body: JSON.stringify({
        amount: props.totalCartAmount,
        customer: props.user,
        cart: cartStore
      })
    });
    const { paymentIntent, ephemeralKey, customer, order } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
      order
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
      order
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Meloko SAS",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      // allowsDelayedPaymentMethods: true,
      // defaultBillingDetails: {
      //   name: `${props.user.firstname} ${props.user.lastname}`,
      // }
    });
    if (!error) {
      setLoading(true);
    }

    return order
  };

  const openPaymentSheet = async () => {
    try {
      setIsPaymentScreenLoading(true)
      dispatch(updateUser({...userStore, firstname: props.user.firstname, lastname: props.user.lastname}))
      const order = await initializePaymentSheet();
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
        setIsPaymentScreenLoading(false)
      } else {
        dispatch(emptyCart())
        await fetchData()  
        setIsPaymentScreenLoading(false)

        props.navigation.navigate('TabNavigatorUser', { screen: 'OrderCustomer',
          params: {
            orderId: order._id
          }
         })
      }
    } catch (error) {
      console.error(error)
    }

  };

  const fetchData = async () => {
    try {
      // store user's info in the store
      const token = await getToken() 
      const user = await userTools.getUserInfos(token)

      if(user) {
        dispatch(updateUser(user))
      }
    } catch (error) {
      console.error(error)
    }
  }
  // useEffect(() => {
  //   initializePaymentSheet();
  // }, []);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <ButtonPrimaryEnd 
        disabled={props.disabled || isPaymentScreenLoading} 
        label={props.label}
        iconName={props.iconName}
        onPressFn={() => openPaymentSheet()} 
        isLoading={isPaymentScreenLoading}
        extraClasses='mb-3'
      />
    </StripeProvider>
  );
}