import React from "react";
import { Text, View } from "react-native";
import { AddressData } from "../../types/API";

type AddressProps = {
  address: AddressData;
  extraClasses?: string;
};

export default function Address(props: AddressProps): JSX.Element {
  return (
    <View className="mb-2">
      <View className="bg-primary p-3 rounded-t-lg">
        <Text className=" text-white font-bold text-lg">Maison</Text>
      </View>
      <View className="bg-tertiary rounded-b-lg p-3">
        <Text className="text-white">{props.address.address1}</Text>
        <Text className="text-white">{props.address.address2}</Text>
        <Text className="text-white">{props.address.postalCode}</Text>
      </View>
    </View>
  );
}
