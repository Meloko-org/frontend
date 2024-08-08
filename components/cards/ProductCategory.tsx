import React from "react";
import { Image, Text, View } from 'react-native'



export default function ProductCategory(): JSX.Element {
    return (
        <View className="flex rounded-lg shadow-lg bg-lightbg w-1/4">
            <View className="flex justify-center rounded-t-lg w-auto h-auto">
                <Image source={require('../../assets/images/tomate.webp')} className="rounded-t-lg w-24 h-16" alt="fgsd" resizeMode="cover" width={100} height={50}/>
            </View>
            <View className="py-2">
                <Text className="font-bold text-darkbg dark:text-lightbg text-center">Légumes</Text>
                <Text className="text-wrap text-slate-400 dark:text-slate-50 text-center">12 produits</Text>
            </View>
            
        </View>
    )
}