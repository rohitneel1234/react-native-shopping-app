import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

/**
 * Renders the Profile icon and Cart icon (with item-count badge),
 * meant to sit in the top-right corner of the Product List header.
 */
export default function HeaderIcons({ onProfilePress, onCartPress }) {
  const { cartCount } = useCart();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityLabel="Go to profile"
        onPress={onProfilePress}
        style={styles.iconButton}
      >
        <Text style={styles.icon}>👤</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityLabel="Go to cart"
        onPress={onCartPress}
        style={styles.iconButton}
      >
        <Text style={styles.icon}>🛒</Text>
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },
  icon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
