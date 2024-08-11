import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import _Fontawesome from 'react-native-vector-icons/FontAwesome'
const FontAwesome = _Fontawesome as React.ElementType
import { GestureResponderEvent } from 'react-native'

type InputRadioGroupData = {
  label: string
  value: string
  selected: boolean
  iconName?: string
}

type InputRadioGroupProps = {
    data: InputRadioGroupData[],
		extraClasses?: string,
    size: 'base' | 'large'
		onPressFn: ((event: GestureResponderEvent) => void) | undefined
}

export default function InputButtonGroup(props: InputRadioGroupProps): JSX.Element {
  const [radioData, setRadioData] = useState<InputRadioGroupData[]>([])

  useEffect(() => {
    setRadioData(props.data)
  }, [props.data])

  const handleRadioSelection = (value: string) => {
    const updatedData = radioData.map((d) =>
      d.value === value
        ? { ...d, selected: true }
        : { ...d, selected: false }
    );

    setRadioData(updatedData);
    props.onPressFn && props.onPressFn(value);
  };

  const buttons = radioData.map((b, i) => (
		<TouchableOpacity 
    key={b.value}
      className={
        `
          ${b.selected ? ' bg-primary' : 'bg-lightbg'} 
          ${i === 0 && 'rounded-l-lg'}
          ${i === radioData.length - 1 && 'rounded-r-lg'}
          flex flex-row p-2 justify-center items-center border border-primary
        `
      } 
      onPress={(event) => handleRadioSelection(b.value)}
    >
			<Text className={
        `
          ${b.selected && 'font-bold text-white'}
          ${props.size === 'large' ? 'text-lg' : 'text-base'}
        `
      }>{b.label}</Text>
		</TouchableOpacity>
  ))

	return (
    <View className={`${props.extraClasses} flex flex-row justify-center items-center w-full shadow-sm`}>
      {buttons}
    </View>

	)
}