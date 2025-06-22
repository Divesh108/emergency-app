import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Vibration } from 'react-native';
import EmergencyButton from '../components/EmergencyButton';
import LocationTracker from '../components/LocationTracker';
import CovertRecorder from '../components/CovertRecorder';
import { sendEmergencyAlert } from '../services/SAPSIntegration';
import { sendEmergencySMS } from '../services/SMSService';

const MainScreen = ({ location, onDisguise, sound }) => {
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecording, setAudioRecording] = useState(null);

  const emergencyTypes = [
    { id: 'robbery', icon: require('../assets/icons/robbery.png'), label: 'Robbery', color: '#ff0000' },
    { id: 'ambulance', icon: require('../assets/icons/ambulance.png'), label: 'Medical', color: '#00a8ff' },
    { id: 'fire', icon: require('../assets/icons/fire.png'), label: 'Fire', color: '#ff9500' },
    { id: 'breakdown', icon: require('../assets/icons/breakdown.png'), label: 'Breakdown', color: '#4cd137' },
  ];

  const handleEmergencyPress = async (type) => {
    Vibration.vibrate(500);
    setActiveEmergency(type);
    
    // Play alert sound if available
    if (sound) {
      await sound.replayAsync();
    }

    // Start recording
    setIsRecording(true);

    // Send emergency alert with current location
    const emergencyData = {
      type,
      location,
      timestamp: new Date().toISOString(),
      status: 'ACTIVE'
    };

    try {
      await sendEmergencyAlert(emergencyData);
    } catch (error) {
      console.error('Failed to send alert, falling back to SMS');
      await sendEmergencySMS(emergencyData);
    }
  };

  const cancelEmergency = () => {
    setActiveEmergency(null);
    setIsRecording(false);
    if (audioRecording) {
      audioRecording.stopAndUnloadAsync();
      setAudioRecording(null);
    }
  };

  return (
    <View style={styles.container}>
      <LocationTracker active={!!activeEmergency} />
      <CovertRecorder isActive={isRecording} />
      
      <View style={styles.emergencyButtonsContainer}>
        {emergencyTypes.map((emergency) => (
          <EmergencyButton
            key={emergency.id}
            icon={emergency.icon}
            label={emergency.label}
            color={emergency.color}
            onPress={() => handleEmergencyPress(emergency.id)}
            active={activeEmergency === emergency.id}
          />
        ))}
      </View>

      {activeEmergency && (
        <View style={styles.activeEmergencyContainer}>
          <Text style={styles.activeEmergencyText}>
            {emergencyTypes.find(e => e.id === activeEmergency)?.label} ALERT ACTIVE
          </Text>
          <Text style={styles.locationText}>
            Location tracking active
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={cancelEmergency}>
            <Text style={styles.cancelButtonText}>CANCEL ALERT</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.disguiseButton} onPress={onDisguise}>
        <Text style={styles.disguiseButtonText}>HIDE APP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  activeEmergencyContainer: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeEmergencyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  disguiseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 5,
  },
  disguisieButtonText: {
    color: 'white',
  },
});

export default MainScreen;