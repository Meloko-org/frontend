import { Text, StyleSheet, View } from 'react-native';
import React from "react";
import Simple from '../components/utils/inputs/Simple'
import PrimaryEnd from '../components/utils/buttons/PrimaryEnd'

export default function ProfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.texte}>Profil</Text>
      <Simple 
        placeholder="Saisissez votre nom"
        label="Nom"
        ></Simple>
      <Simple 
        placeholder="Saisissez votre prénom"
        label="Prénom"
        ></Simple>
      <PrimaryEnd 
        name="Valider"></PrimaryEnd>
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