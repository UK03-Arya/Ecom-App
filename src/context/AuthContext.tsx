import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin } from '../api/auth';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: string }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_TOKEN'; payload: string | null };

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, token: action.payload, isLoading: false, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, token: null, isLoading: false, error: null };
    case 'RESTORE_TOKEN':
      return {
        ...state,
        token: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<{
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  state: initialState,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }
      dispatch({ type: 'RESTORE_TOKEN', payload: userToken || null });
    };

    bootstrapAsync();
  }, []);

  const login = async (username: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await apiLogin(username, password);
      const token = response.data.accessToken || response.data.token; // Changed to match DummyJSON API structure
      if (!token) {
        throw new Error('No token received from server');
      }
      await AsyncStorage.setItem('userToken', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: token });
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message || 'Login failed' });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
