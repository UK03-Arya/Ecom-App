import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { CartContext, CartItem } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VIBRANT_COLOR = '#6C5CE7';
const ACCENT_COLOR = '#FF7675';

const CartScreen = () => {
  const { state, removeItem, updateQuantity } = useContext(CartContext);
  const navigation = useNavigation();

  const calculateTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.itemDetails}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={ACCENT_COLOR} />
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.actionsContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color={VIBRANT_COLOR} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color={VIBRANT_COLOR} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  if (state.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="cart-outline" size={80} color={VIBRANT_COLOR} />
        </View>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Looks like you haven't added anything yet.</Text>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => navigation.navigate('Products' as never)}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={state.items}
          renderItem={renderCartItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalText}>${calculateTotal()}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F3FB',
  },
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F4F3FB',
  },
  emptyIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2D3436',
    marginTop: 8,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#636E72',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  shopButton: {
    backgroundColor: VIBRANT_COLOR,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: VIBRANT_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    shadowColor: VIBRANT_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 16,
    backgroundColor: '#F4F3FB',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginRight: 8,
  },
  price: {
    fontSize: 15,
    color: '#636E72',
    marginTop: 4,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F3FB',
    borderRadius: 10,
    padding: 4,
  },
  quantityButton: {
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3436',
  },
  subtotal: {
    fontSize: 18,
    fontWeight: '900',
    color: VIBRANT_COLOR,
  },
  removeButton: {
    padding: 4,
    backgroundColor: '#FF767515',
    borderRadius: 8,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F4F3FB',
    shadowColor: VIBRANT_COLOR,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#636E72',
  },
  totalText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2D3436',
  },
  checkoutButton: {
    backgroundColor: VIBRANT_COLOR,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: VIBRANT_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default CartScreen;
