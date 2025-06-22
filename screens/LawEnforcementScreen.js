// screens/LawEnforcementScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LawEnforcementMap from '../components/LawEnforcementMap';
import { AuthContext } from '../services/AuthService';
import { subscribeToEmergencies } from '../services/SAPSIntegration';

const LawEnforcementScreen = () => {
  const [activeEmergencies, setActiveEmergencies] = useState([]);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = subscribeToEmergencies((emergency) => {
      setActiveEmergencies(prev => [...prev, emergency]);
    });

    return () => unsubscribe();
  }, []);

  const handleRespond = (emergencyId) => {
    setActiveEmergencies(prev => 
      prev.filter(e => e.id !== emergencyId)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Emergencies</Text>
      
      <LawEnforcementMap emergencies={activeEmergencies} />

      <View style={styles.emergencyList}>
        {activeEmergencies.map(emergency => (
          <View key={emergency.id} style={styles.emergencyCard}>
            <Text style={styles.emergencyType}>{emergency.type.toUpperCase()}</Text>
            <Text style={styles.emergencyLocation}>
              {emergency.location.w3w || 
               `${emergency.location.coords.latitude.toFixed(4)}, ${emergency.location.coords.longitude.toFixed(4)}`}
            </Text>
            <Text style={styles.emergencyTime}>
              {new Date(emergency.timestamp).toLocaleTimeString()}
            </Text>
            <TouchableOpacity 
              style={styles.respondButton}
              onPress={() => handleRespond(emergency.id)}
            >
              <Text style={styles.respondButtonText}>RESPOND</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  emergencyList: {
    padding: 10,
  },
  emergencyCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 5,
  },
  emergencyLocation: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  emergencyTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  respondButton: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  respondButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#cc0000',
    padding: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default LawEnforcementScreen;