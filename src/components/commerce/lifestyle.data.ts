import type { Drop, Product } from '@/types/commerce'

const now = new Date()
const EARLY_WINDOW_MS = 41 * 3_600_000 + 12 * 60_000 + 8_000

export const RADIANCE_SET_PRODUCT: Product = {
  id: 'the-radiance-set',
  name: 'The Radiance Set',
  slug: 'the-radiance-set',
  description:
    'A limited three-piece glow ritual — cleanser, serum, and balm. Yours before it hits the public shop.',
  imageUrl: 'https://picsum.photos/seed/radiance-set/900/1100',
  price: 28000,
  compareAtPrice: 35000,
  currency: 'NGN',
  category: 'Skincare',
  tags: ['Limited'],
  inStock: true,
  memberDiscountEligible: true,
  isNewDrop: true,
  createdAt: now,
  updatedAt: now,
}

export const FEATURED_DROP: Drop = {
  id: 'radiance-set-drop',
  title: RADIANCE_SET_PRODUCT.name,
  slug: RADIANCE_SET_PRODUCT.slug,
  coverUrl: RADIANCE_SET_PRODUCT.imageUrl,
  description: RADIANCE_SET_PRODUCT.description,
  memberOnlyStartsAt: now,
  publicStartsAt: new Date(Date.now() + EARLY_WINDOW_MS),
  endsAt: new Date(Date.now() + EARLY_WINDOW_MS + 7 * 24 * 3_600_000),
  productIds: [RADIANCE_SET_PRODUCT.id],
  currentPhase: 'member-only',
  createdAt: now,
  updatedAt: now,
}

export const TESTER_INTERESTS = ['Skincare', 'Fragrance', 'Body care', 'Hair']
export const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal']

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`
}

export function discountPercent(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round((1 - price / compareAtPrice) * 100)
}
