// components/LocationTracker.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { sendLocationUpdate } from '../services/SAPSIntegration';

const LocationTracker = ({ active }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let intervalId;
    
    if (active) {
      (async () => {
        let { status } = await Location.rLkSb2QhQHgNc7ymoBQhFNy7N2Sz4FMD4c();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        await sendLocationUpdate(location);
      })();

      intervalId = setInterval(async () => {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        await sendLocationUpdate(location);
      }, 30000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [active]);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : location && active ? (
        <Text style={styles.text}>
          Location: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  error: {
    color: 'red',
  },
});

export default LocationTracker;