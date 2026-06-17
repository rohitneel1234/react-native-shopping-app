import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useCart } from '../context/CartContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { isInCart, toggleCartItem } = useCart();
  const favorited = isInCart(product.id);

  // Favorite icon at the top-right of the header.
  // Tapping it adds the product to the cart, or removes it if already added.
  useEffect(() => {
    navigation.setOptions({
      title: product.name,
      headerRight: () => (
        <TouchableOpacity
          accessibilityLabel={favorited ? 'Remove from cart' : 'Add to cart'}
          onPress={() => toggleCartItem(product)}
          style={styles.favoriteButton}
        >
          <Text style={[styles.favoriteIcon, favorited && styles.favoriteIconActive]}>
            {favorited ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, favorited, product, toggleCartItem]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.row}>
          <Text style={styles.price}>${product.price}</Text>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>★ {product.rating}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity
          style={[styles.cartButton, favorited && styles.cartButtonRemove]}
          onPress={() => toggleCartItem(product)}
        >
          <Text style={styles.cartButtonText}>
            {favorited ? 'Remove from Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 320, backgroundColor: '#f0f0f0' },
  content: { padding: 20 },
  name: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  price: { fontSize: 22, fontWeight: '700', color: '#2E7D32', marginRight: 12 },
  ratingPill: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: { fontSize: 13, fontWeight: '600', color: '#8a6d1f' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 6 },
  description: { fontSize: 14, color: '#555', lineHeight: 21, marginBottom: 28 },
  cartButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cartButtonRemove: { backgroundColor: '#C62828' },
  cartButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  favoriteButton: { marginRight: 16, padding: 4 },
  favoriteIcon: { fontSize: 24 },
  favoriteIconActive: {},
});
