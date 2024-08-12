import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import ButtonPrimaryEnd from './PrimaryEnd';
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from '../../../reducers/user';
import { useAuth } from '@clerk/clerk-expo'

export default function StripePaymentButton(props) {
  const dispatch = useDispatch()
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [publishableKey, setPublishableKey] = useState('');
  const userStore = useSelector((state: { user }) => state.user.value)

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
        customer: props.user
      })
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
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
  };

  const openPaymentSheet = async () => {
    try {
      dispatch(updateUser({...userStore, firstname: props.user.firstname, lastname: props.user.lastname}))
      await initializePaymentSheet();
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        props.onPaymentSuccessFn()
      }
    } catch (error) {
      console.error(error)
    }

  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <ButtonPrimaryEnd 
        disabled={props.disabled} 
        label={props.label}
        iconName={props.iconName}
        onPressFn={openPaymentSheet} 
      />
    </StripeProvider>
  );
}