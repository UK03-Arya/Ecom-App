# E-Commerce Mini App

A React Native e-commerce mini-app built with Expo.

## Features
- Login (mock authentication using DummyJSON API)
- Home Page with Bottom Tab Navigation (Products & Cart)
- Fetch and display products
- Add/Remove products to cart with quantity controls
- Logout functionality

## Tech Stack
- React Native (Expo)
- React Navigation (Bottom Tabs, Stack)
- State Management: Context API + `useReducer`
- Axios for API requests
- AsyncStorage for token persistence

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app:**
   ```bash
   npx expo start
   ```

## State Management Explanation

This app uses **Context API with `useReducer`** for state management, which provides a predictable state container similar to Redux but with less boilerplate.

1. **`AuthContext`**: Manages the authentication state (`isAuthenticated`, `token`, `isLoading`, `error`). It handles login, logout, and token restoration using `AsyncStorage`.
2. **`CartContext`**: Manages the shopping cart state (`items`). It handles adding items, removing items, updating quantities, and clearing the cart on logout.

Using Context + `useReducer` is a great choice for this app as it avoids prop drilling and keeps state logic centralized and testable without the heavy overhead of external libraries.

## Assumptions & Trade-offs
- Used standard `react-native` components instead of a UI library for simplicity and lower footprint.
- Mocked authentication with DummyJSON means the token isn't a real JWT, but the flow mimics a real-world scenario.
- Images are loaded from external URLs directly; in a production app, caching mechanisms (like `expo-image` or `react-native-fast-image`) would be used.
