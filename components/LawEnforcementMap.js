// components/LawEnforcementMap.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';

const LawEnforcementMap = ({ emergencies }) => {
  const [region, setRegion] = useState({
    latitude: -26.2041,
    longitude: 28.0473,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (emergencies.length > 0) {
      const latest = emergencies[emergencies.length - 1];
      setRegion({
        latitude: latest.location.coords.latitude,
        longitude: latest.location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [emergencies]);

  const getMarkerColor = (type) => {
    switch (type) {
      case 'robbery': return 'red';
      case 'ambulance': return 'blue';
      case 'fire': return 'orange';
      case 'breakdown': return 'green';
      default: return 'purple';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {emergencies.map(emergency => (
          <Marker
            key={emergency.id}
            coordinate={{
              latitude: emergency.location.coords.latitude,
              longitude: emergency.location.coords.longitude,
            }}
            pinColor={getMarkerColor(emergency.type)}
            title={emergency.type.toUpperCase()}
            description={`${new Date(emergency.timestamp).toLocaleTimeString()}`}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default LawEnforcementMap;