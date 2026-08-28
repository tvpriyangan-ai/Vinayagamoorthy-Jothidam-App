import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('access_token').then((token) => {
      setIsLoggedIn(!!token);
      setIsLoading(false);
    });
    setUnauthorizedHandler(() => setIsLoggedIn(false));
  }, []);

  const signIn = useCallback(async (accessToken, userId) => {
    await AsyncStorage.multiSet([
      ['access_token', accessToken],
      ['user_id', userId],
    ]);
    setIsLoggedIn(true);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['access_token', 'user_id']);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
