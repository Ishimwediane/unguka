import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './src/i18n';
import { theme } from './src/styles/theme';
import SplashScreen from './src/screens/auth/SplashScreen';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient();

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" />
        <SplashScreen />
      </ThemeProvider>
    </QueryClientProvider>
  );
}