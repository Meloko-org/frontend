import React, { JSX, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { UserAddressData } from "../../types/API";
import { useAuth } from "@clerk/clerk-expo";

import MainButton from "../utils/buttons/MainButton";
import userTools from "../../modules/userTools";
import { updateUserAddresses, UserState } from "../../reducers/user";
import { useSelector, useDispatch } from "react-redux";
import { SheetManager } from "react-native-actions-sheet";

type AddressProps = {
  address: UserAddressData;
  onPressFn?: (id: string) => void;
  onSelectAddressFn?: (address: UserAddressData) => void;
  deletable?: boolean;
  extraClasses?: string;
};

export default function Address({
  address,
  onPressFn,
  onSelectAddressFn,
  deletable = true,
  extraClasses,
}: AddressProps): JSX.Element {
  const { signOut, isSignedIn, getToken } = useAuth();

  const dispatch = useDispatch();
  const userStore = useSelector(
    (state: { user: UserState }) => state.user.value,
  );

  const removeUserAddress = async () => {
    try {
      const token = await getToken();
      // store producer info in the store
      const removeResponse = await userTools.removeUserAddress(
        token,
        address._id!,
      );

      if (!removeResponse.success) {
        SheetManager.show("alert", {
          payload: {
            message: removeResponse.message!,
            alertType: "error",
          },
        });
        return;
      }

      dispatch(updateUserAddresses(removeResponse.data));

      SheetManager.show("alert", {
        payload: {
          message: "Adresse supprimée.",
          alertType: "success",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePress = () => {
    if (onSelectAddressFn) {
      onSelectAddressFn(address);
    } else if (!address.isDefault && onPressFn) {
      onPressFn(address._id!);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className={`${extraClasses}`}>
      <View
        className={`${address.isDefault ? "bg-primary" : "bg-night"} p-3 rounded-t-lg`}
      >
        <View className="flex-row justify-between">
          <Text className=" text-white font-bold text-lg">{address.name}</Text>
          {deletable && (
            <MainButton
              buttonType="icon"
              iconName="trash"
              iconColor="#FFFFFF"
              onPressFn={removeUserAddress}
            />
          )}
        </View>
      </View>
      <View className="bg-tertiary rounded-b-lg p-3">
        <Text className="text-white">{address.address.address1}</Text>
        {address.address.address2 && (
          <Text className="text-white">{address.address.address2}</Text>
        )}
        <Text className="text-white">
          {address.address.postalCode}, {address.address.city}
        </Text>
        <Text className="text-white">{address.address.country}</Text>
      </View>
    </TouchableOpacity>
  );
}
