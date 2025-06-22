import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const DisguisedScreen = ({ onLongPress }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

  const handleButtonPress = (value) => {
    if (displayValue === '0') {
      setDisplayValue(value);
    } else {
      setDisplayValue(displayValue + value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{displayValue}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {buttons.map((button) => (
          <TouchableOpacity
            key={button}
            style={styles.button}
            onPress={() => handleButtonPress(button)}
            onLongPress={onLongPress}
            delayLongPress={1500}
          >
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-end',
  },
  display: {
    padding: 20,
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  displayText: {
    fontSize: 48,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: '25%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 24,
  },
});

export default DisguisedScreen;