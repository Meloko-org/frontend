import { Text, StyleSheet, View } from 'react-native';
import React from "react";

export default function FavoritesScreen() {
  return (
    <View style={styles.container} className=' dark:bg-darkbg'>
    <Text style={styles.texte}>Favorites</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    texte: {
        textAlign: 'center',
        marginTop: '70%'
  },
});