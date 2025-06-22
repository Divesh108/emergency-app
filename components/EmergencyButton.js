// components/EmergencyButton.js
import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const EmergencyButton = ({ icon, label, color, onPress, active }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color, opacity: active ? 1 : 0.7 }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={icon} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '45%',
    aspectRatio: 1,
    margin: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  label: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default EmergencyButton;