// components/CovertRecorder.js
import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import { View } from 'react-native';
import { uploadRecording } from '../services/SAPSIntegration';

const CovertRecorder = ({ isActive }) => {
  const [cameraRef, setCameraRef] = useState(null);
  const [audioRecording, setAudioRecording] = useState(null);

  useEffect(() => {
    let recordingInterval;
    
    const startRecording = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setAudioRecording(recording);

        if (cameraRef) {
          const video = await cameraRef.recordAsync({
            quality: Camera.Constants.VideoQuality['480p'],
            mute: true,
          });
          
          recordingInterval = setInterval(async () => {
            if (video) {
              await uploadRecording(video.uri, 'video');
            }
          }, 300000);
        }
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
    };

    const stopRecording = async () => {
      if (audioRecording) {
        await audioRecording.stopAndUnloadAsync();
        const uri = audioRecording.getURI();
        await uploadRecording(uri, 'audio');
        setAudioRecording(null);
      }
      
      if (cameraRef) {
        await cameraRef.stopRecording();
      }
      
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };

    if (isActive) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [isActive, cameraRef]);

  return (
    <View style={{ width: 0, height: 0 }}>
      <Camera
        ref={ref => setCameraRef(ref)}
        style={{ width: 0, height: 0 }}
        type={Camera.Constants.Type.back}
      />
    </View>
  );
};

export default CovertRecorder;