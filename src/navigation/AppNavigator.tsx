import React, { useContext, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import ProductsScreen from '../screens/ProductsScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const VIBRANT_COLOR = '#6C5CE7';

const SplashScreen = () => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim, alignItems: 'center' }}>
        <View style={styles.splashIconCircle}>
          <Ionicons name="cart" size={80} color="#ffffff" />
        </View>
        <Text style={styles.splashTitle}>EcomApp</Text>
        <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
      </Animated.View>
    </View>
  );
};

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);

  const handleLogout = () => {
    clearCart();
    logout();
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={24} color="#FF7675" />
    </TouchableOpacity>
  );
};

const MainTabs = () => {
  const { state: cartState } = useContext(CartContext);
  const cartItemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => <LogoutButton />,
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#F4F3FB',
        },
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 20,
          color: '#2D3436',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Products') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: VIBRANT_COLOR,
        tabBarInactiveTintColor: '#B2BEC3',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F4F3FB',
          backgroundColor: '#ffffff',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#FF7675', color: 'white', fontWeight: 'bold' }
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { state } = useContext(AuthContext);

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: true }}>
        {state.isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: VIBRANT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  splashTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  logoutButton: {
    marginRight: 15,
    padding: 5,
  },
});

export default AppNavigator;
