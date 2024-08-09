import React, { useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native'
import Simple from '../utils/inputs/Simple';

type Props = {
  search: object
}

export default function MapSearchBox(props: Props): JSX.Element {
  const [userPosition, setUserPosition] = useState({
    latitude: 0.0,
    longitude: 0.0
  });

  const [radius, setRadius] = useState({ value: [20] })
  const [query, setQuery] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [search, setSearch] = useState(false)

  useEffect(() => {
    if(props.search) {
      setQuery(props.search.query)
    }
  }, [])

	return (
		<View className={`rounded-lg w-96 bg-lightbg p-2 dark:bg-ternary`}>
      <Simple 
        value={query}
        onChangeText={setQuery}
        placeholder="Fruits moche, legume bio, pomme, banane ..." 
        label="Votre recherche"
        autoCapitalize="none"
        class="w-90"
        size="base"
      />
		</View>
	)
}