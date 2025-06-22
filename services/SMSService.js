// services/SMSService.js
import { sendSMS } from 'react-native-sms';
import { encryptData } from './EncryptionService';

export const sendEmergencySMS = async (emergencyData) => {
  const message = `EMERGENCY ALERT: ${emergencyData.type}\n` +
    `Location: ${emergencyData.location.coords.latitude}, ${emergencyData.location.coords.longitude}\n` +
    `Time: ${new Date(emergencyData.timestamp).toLocaleString()}`;

  const encrypted = encryptData(message);

  sendSMS({
    body: `BLACKOPS:${encrypted}`,
    recipients: ['+27820001111'],
    allowAndroidSendWithoutReadPermission: true
  });
};

export const sendUSSDRequest = async (code) => {
  // Platform-specific implementation required
};