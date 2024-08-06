import { Text, StyleSheet, View } from 'react-native';
import React from "react";

export default function BusinessScreen() {
  return (
    <View style={styles.container}>
    <Text style={styles.texte}>Business Center</Text>
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