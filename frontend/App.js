import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './src/i18n';
import { theme } from './src/styles/theme';
import { AuthProvider } from './src/store/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}