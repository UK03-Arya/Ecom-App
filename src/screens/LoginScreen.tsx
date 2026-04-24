import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, Animated } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [username, setUsername] = useState('emilys'); // Default for DummyJSON
  const [password, setPassword] = useState('emilyspass');
  const [validationError, setValidationError] = useState('');
  const { login, state } = useContext(AuthContext);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = () => {
    setValidationError('');
    if (!username.trim()) {
      setValidationError('Username is required');
      return;
    }
    if (!password.trim()) {
      setValidationError('Password is required');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    login(username, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.iconCircle}>
            <Ionicons name="cart" size={60} color="#ffffff" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your vibrant shopping</Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {(state.error || validationError) ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#FF3B30" />
              <Text style={styles.errorText}>{validationError || state.error}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputGroup}>
            <Ionicons name="person-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#8e8e93"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Ionicons name="lock-closed-outline" size={20} color="#8e8e93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8e8e93"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, state.isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={state.isLoading}
            activeOpacity={0.8}
          >
            {state.isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Login to Store</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F3FB', // Light vibrant purple tint
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6C5CE7', // Vibrant Purple
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EAE8F4',
  },
  inputIcon: {
    marginRight: 12,
    color: '#A29BFE',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
    height: '100%',
  },
  button: {
    backgroundColor: '#6C5CE7',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#A29BFE',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF767520',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF767550',
  },
  errorText: {
    color: '#D63031',
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
});

export default LoginScreen;
