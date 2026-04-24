import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Animated } from 'react-native';
import { getProducts } from '../api/products';
import { Product } from '../types';
import { CartContext } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

const VIBRANT_COLOR = '#6C5CE7';
const ACCENT_COLOR = '#FF7675';

const ProductCard = ({ item, cartItem, addItem, updateQuantity, index }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 6,
        delay: index * 50,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY }] }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
        {item.discountPercentage > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{Math.round(item.discountPercentage)}% OFF</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FDCB6E" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        
        {cartItem ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, cartItem.quantity - 1)}
            >
              <Ionicons name="remove" size={20} color={VIBRANT_COLOR} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{cartItem.quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, cartItem.quantity + 1)}
            >
              <Ionicons name="add" size={20} color={VIBRANT_COLOR} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => addItem(item)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { state: cartState, addItem, updateQuantity } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, []);

  const renderProduct = ({ item, index }: { item: Product; index: number }) => {
    const cartItem = cartState.items.find(cartItem => cartItem.id === item.id);
    return (
      <ProductCard 
        item={item} 
        cartItem={cartItem} 
        addItem={addItem} 
        updateQuantity={updateQuantity} 
        index={index} 
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={VIBRANT_COLOR} />
        <Text style={{marginTop: 10, color: VIBRANT_COLOR, fontWeight: '600'}}>Loading amazing products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={VIBRANT_COLOR} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3FB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F3FB',
  },
  listContainer: {
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: VIBRANT_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#F4F3FB',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#636E72',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: VIBRANT_COLOR,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#636E72',
    marginLeft: 4,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: VIBRANT_COLOR,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F3FB',
    borderRadius: 10,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D3436',
  },
});

export default ProductsScreen;
