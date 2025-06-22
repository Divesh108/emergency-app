// services/SecurityService.js
import React, { createContext, useContext, useEffect } from 'react';
import { DeviceInfo } from 'react-native-device-info';
import { wipeDevice } from './SecureWipe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthService';

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const { logout } = useContext(AuthContext);

  const checkDeviceSecurity = async () => {
    const securityChecks = {
      isJailbroken: await DeviceInfo.isJailbroken(),
      isRooted: await DeviceInfo.isRooted(),
      isEmulator: await DeviceInfo.isEmulator(),
    };

    const isCompromised = Object.values(securityChecks).some(Boolean);
    
    if (isCompromised) {
      await wipeDevice();
      await logout();
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    checkDeviceSecurity();
  }, []);

  return (
    <SecurityContext.Provider value={{ checkDeviceSecurity }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);