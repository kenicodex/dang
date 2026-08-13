import React from 'react'
import { View, Pressable, StyleSheet, Image } from 'react-native'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/ui/Text'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types/commerce'

interface ProductCardProps {
  product: Product
  onPress?: () => void
  memberDiscount?: number
}

export function ProductCard({ product, onPress, memberDiscount = 0 }: ProductCardProps) {
  const finalPrice = memberDiscount ? product.price * (1 - memberDiscount / 100) : product.price
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.imageWrap}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.fallbackEmoji}>{product.emoji || '🛍️'}</Text>
            </View>
          )}
          {product.tags?.map(tag => (
            <View key={tag} style={styles.tagWrap}>
              <Badge label={tag} tone="danger" />
            </View>
          ))}
        </View>
        <View style={styles.body}>
          <Text variant="h3" style={styles.name} numberOfLines={2}>{product.name}</Text>
          <View style={styles.priceRow}>
            {memberDiscount > 0 ? (
              <>
                <Text style={styles.price}>₦{finalPrice.toFixed(0)}</Text>
                <Text style={styles.priceStrike}>₦{product.price.toFixed(0)}</Text>
                <Badge label={`-${memberDiscount}%`} tone="success" />
              </>
            ) : (
              <Text style={styles.price}>₦{product.price.toFixed(0)}</Text>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageWrap: {
    height: 180,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: {
    fontSize: 64,
  },
  tagWrap: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  body: {
    padding: 12,
  },
  name: {
    fontSize: 15,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
  },
  priceStrike: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
})
