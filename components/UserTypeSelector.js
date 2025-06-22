import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const UserTypeSelector = ({ userType, setUserType }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          userType === 'pedestrian' && styles.selectedButton
        ]}
        onPress={() => setUserType('pedestrian')}
      >
        <Text style={[
          styles.buttonText,
          userType === 'pedestrian' && styles.selectedText
        ]}>
          Pedestrian
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          userType === 'lawEnforcement' && styles.selectedButton
        ]}
        onPress={() => setUserType('lawEnforcement')}
      >
        <Text style={[
          styles.buttonText,
          userType === 'lawEnforcement' && styles.selectedText
        ]}>
          Law Enforcement
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  buttonText: {
    color: '#666',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserTypeSelector;