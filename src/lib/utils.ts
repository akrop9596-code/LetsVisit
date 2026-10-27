type ClassValue = string | undefined | null | false | Record<string, boolean>;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Format price in INR
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format rating for display
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Slugify text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Category display names & icons
 */
export const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
  TOURIST_ATTRACTION: { label: 'Tourist Attraction', icon: '🎯', color: '#14b8a6' },
  PICNIC_SPOT: { label: 'Picnic Spot', icon: '🧺', color: '#22c55e' },
  MUSEUM: { label: 'Museum', icon: '🖼️', color: '#a855f7' },
  ZOO: { label: 'Zoo', icon: '🦁', color: '#f97316' },
  PARK: { label: 'Park', icon: '🌳', color: '#22c55e' },
  HISTORICAL: { label: 'Historical Place', icon: '🏛️', color: '#f59e0b' },
  RELIGIOUS: { label: 'Religious Place', icon: '🛕', color: '#ef4444' },
  BEACH: { label: 'Beach', icon: '🏖️', color: '#06b6d4' },
  LAKE: { label: 'Lake', icon: '💧', color: '#3b82f6' },
  WATERFALL: { label: 'Waterfall', icon: '🌊', color: '#0ea5e9' },
  MOUNTAIN: { label: 'Mountain', icon: '🏔️', color: '#6366f1' },
  RESTAURANT: { label: 'Restaurant', icon: '🍴', color: '#ef4444' },
  CAFE: { label: 'Café', icon: '☕', color: '#92400e' },
  HOTEL: { label: 'Hotel', icon: '🏨', color: '#3b82f6' },
  HOSTEL: { label: 'Hostel', icon: '🛏️', color: '#8b5cf6' },
  HOMESTAY: { label: 'Homestay', icon: '🏠', color: '#f43f5e' },
  SHOPPING: { label: 'Shopping', icon: '🛍️', color: '#ec4899' },
  ENTERTAINMENT: { label: 'Entertainment', icon: '🎭', color: '#d946ef' },
  GARDEN: { label: 'Garden', icon: '🌺', color: '#10b981' },
  FORT: { label: 'Fort', icon: '🏰', color: '#b45309' },
  MONUMENT: { label: 'Monument', icon: '🗿', color: '#78716c' },
  TEMPLE: { label: 'Temple', icon: '🛕', color: '#dc2626' },
  WILDLIFE: { label: 'Wildlife', icon: '🐾', color: '#65a30d' },
};

/**
 * Property type display names
 */
export const propertyTypeConfig: Record<string, { label: string; icon: string }> = {
  HOTEL: { label: 'Hotel', icon: '🏨' },
  HOSTEL: { label: 'Hostel', icon: '🛏️' },
  HOMESTAY: { label: 'Homestay', icon: '🏠' },
  GUEST_HOUSE: { label: 'Guest House', icon: '🏡' },
  APARTMENT: { label: 'Apartment', icon: '🏢' },
  VILLA: { label: 'Villa', icon: '🏖️' },
  ROOM: { label: 'Room', icon: '🚪' },
  VACATION_HOME: { label: 'Vacation Home', icon: '🌴' },
};

/**
 * Interest categories for personalization
 */
export const interestOptions = [
  { id: 'nature', label: 'Nature', icon: '🌿', color: '#22c55e' },
  { id: 'adventure', label: 'Adventure', icon: '🧗', color: '#f97316' },
  { id: 'history', label: 'History', icon: '🏛️', color: '#f59e0b' },
  { id: 'photography', label: 'Photography', icon: '📸', color: '#8b5cf6' },
  { id: 'family', label: 'Family Trips', icon: '👨‍👩‍👧‍👦', color: '#3b82f6' },
  { id: 'couples', label: 'Couples', icon: '💑', color: '#ec4899' },
  { id: 'budget', label: 'Budget Travel', icon: '💰', color: '#10b981' },
  { id: 'luxury', label: 'Luxury', icon: '✨', color: '#d946ef' },
  { id: 'food', label: 'Food', icon: '🍜', color: '#ef4444' },
  { id: 'culture', label: 'Culture', icon: '🎭', color: '#6366f1' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#f43f5e' },
  { id: 'religious', label: 'Religious', icon: '🛕', color: '#b45309' },
];
