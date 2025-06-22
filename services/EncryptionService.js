// services/EncryptionService.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'YOUR_ENCRYPTION_SECRET_KEY';

export const encryptData = (data) => {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  try {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};

export const hashData = (data) => {
  return CryptoJS.SHA256(data).toString();
};