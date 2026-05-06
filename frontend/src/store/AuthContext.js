import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ token: null, user: null, isLoading: true });

  useEffect(() => {
    const loadStorage = async () => {
      const stored = await AsyncStorage.getItem('@Unguka:auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuthState({ ...parsed, isLoading: false });
        apiClient.defaults.headers.Authorization = `Bearer ${parsed.token}`;
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    loadStorage();
  }, []);

  const authenticate = async (data) => {
    const state = { token: data.token, user: data.user, isLoading: false };
    setAuthState(state);
    apiClient.defaults.headers.Authorization = `Bearer ${data.token}`;
    await AsyncStorage.setItem('@Unguka:auth', JSON.stringify(state));
  };

  const logout = async () => {
    setAuthState({ token: null, user: null, isLoading: false });
    delete apiClient.defaults.headers.Authorization;
    await AsyncStorage.removeItem('@Unguka:auth');
  };

  return (
    <AuthContext.Provider value={{ ...authState, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);