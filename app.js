// App.js
import React from 'react';
import { AuthProvider } from './services/AuthService';
import AppNavigator from './Navigation/AppNavigator';
import { SecurityProvider } from './services/SecurityService';

export default function App() {
  return (
    <SecurityProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SecurityProvider>
  );
}