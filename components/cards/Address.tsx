import React from "react";
import { Text, View } from "react-native";
import { UserAddressData } from "../../types/API";
import { useAuth } from "@clerk/clerk-expo";

import MainButton from "../utils/buttons/MainButton";
import userTools from "../../modules/userTools";
import { updateUserAddresses, UserState } from "../../reducers/user";
import { useSelector, useDispatch } from "react-redux";

type AddressProps = {
  address: UserAddressData;
  extraClasses?: string;
};

export default function Address(props: AddressProps): JSX.Element {
  const { signOut, isSignedIn, getToken } = useAuth();

  const dispatch = useDispatch();
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );
  const removeUserAddress = async () => {
    try {
      const token = await getToken();
      // store producer info in the store
      const newAddressResponse = await userTools.removeUserAddress(
        token,
        props.address._id,
      );

      if (!newAddressResponse.success) {
        console.error(newAddressResponse.message);
        return;
      }

      dispatch(updateUserAddresses(newAddressResponse.user.addresses));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View className="mb-2">
      <View className="bg-primary p-3 rounded-t-lg">
        <View className="flex-row justify-between">
          <Text className=" text-white font-bold text-lg">
            {props.address.name}
          </Text>
          <MainButton
            buttonType="icon"
            iconName="trash"
            iconColor="#FFFFFF"
            onPressFn={removeUserAddress}
          ></MainButton>
        </View>
      </View>
      <View className="bg-tertiary rounded-b-lg p-3">
        <Text className="text-white">{props.address.address.address1}</Text>
        <Text className="text-white">{props.address.address.address2}</Text>
        <Text className="text-white">
          {props.address.address.postalCode}, {props.address.address.city}
        </Text>
        <Text className="text-white">{props.address.address.country}</Text>
      </View>
    </View>
  );
}
