import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@product_app/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load persisted cart on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (raw) setCartItems(JSON.parse(raw));
      } catch (e) {
        // If storage is corrupted/unavailable, just start with an empty cart.
        console.warn('Failed to load cart from storage', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persist cart whenever it changes
  useEffect(() => {
    if (!loaded) return; // avoid overwriting storage with [] before initial load finishes
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems)).catch((e) =>
      console.warn('Failed to save cart to storage', e)
    );
  }, [cartItems, loaded]);

  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.id === productId),
    [cartItems]
  );

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const toggleCartItem = useCallback(
    (product) => {
      if (isInCart(product.id)) {
        removeFromCart(product.id);
      } else {
        addToCart(product);
      }
    },
    [isInCart, addToCart, removeFromCart]
  );

  const value = {
    cartItems,
    cartCount: cartItems.length,
    isInCart,
    addToCart,
    removeFromCart,
    toggleCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
