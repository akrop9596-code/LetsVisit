import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['TOURIST', 'PROPERTY_OWNER']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  propertyType: z.enum(['HOTEL', 'HOSTEL', 'HOMESTAY', 'GUEST_HOUSE', 'APARTMENT', 'VILLA', 'ROOM', 'VACATION_HOME']),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  pricePerNight: z.number().min(1, 'Price must be at least ₹1'),
  maxGuests: z.number().min(1).max(50),
  bedrooms: z.number().min(1).max(20),
  beds: z.number().min(1).max(50),
  bathrooms: z.number().min(1).max(20),
  houseRules: z.string().optional(),
  amenityIds: z.array(z.string()).optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  visitDate: z.string().optional(),
});

export const placeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.string(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(200).optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  entryFee: z.number().optional(),
  estimatedDuration: z.string().optional(),
  bestTimeToVisit: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const tripSchema = z.object({
  name: z.string().min(2, 'Trip name is required'),
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

export const reportSchema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason'),
  details: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type PlaceInput = z.infer<typeof placeSchema>;
export type TripInput = z.infer<typeof tripSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
