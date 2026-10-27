'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getBoundingBox } from '@/lib/geo';

interface SearchParams {
  query?: string;
  category?: string;
  city?: string;
  lat?: number;
  lng?: number;
  radius?: number; // km
  minRating?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export async function searchPlaces(params: SearchParams) {
  const {
    query,
    category,
    city,
    lat,
    lng,
    radius = 25,
    minRating = 0,
    sortBy = 'relevance',
    page = 1,
    limit = 20,
  } = params;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    isActive: true,
  };

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { city: { contains: query } },
      { address: { contains: query } },
      { tags: { contains: query.toLowerCase() } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (city) {
    where.city = { contains: city };
  }

  if (minRating > 0) {
    where.ratingAvg = { gte: minRating };
  }

  // Bounding box filter for radius search
  if (lat && lng && radius) {
    const bbox = getBoundingBox(lat, lng, radius);
    where.latitude = { gte: bbox.minLat, lte: bbox.maxLat };
    where.longitude = { gte: bbox.minLng, lte: bbox.maxLng };
  }

  // Build orderBy
  let orderBy: any = {};
  switch (sortBy) {
    case 'rating':
      orderBy = { ratingAvg: 'desc' };
      break;
    case 'name':
      orderBy = { name: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    default:
      orderBy = [{ isFeatured: 'desc' }, { ratingAvg: 'desc' }];
  }

  const [places, total] = await Promise.all([
    prisma.place.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: { take: 1, orderBy: { order: 'asc' } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.place.count({ where }),
  ]);

  return {
    places,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPlace(id: string) {
  const place = await prisma.place.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      reviews: {
        include: { user: { select: { id: true, name: true, profileImage: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true, favorites: true } },
    },
  });

  return place;
}

export async function getNearbyPlaces(
  lat: number,
  lng: number,
  radiusKm: number = 5,
  excludeId?: string,
  category?: string,
  limit: number = 10
) {
  const bbox = getBoundingBox(lat, lng, radiusKm);

  const where: any = {
    isActive: true,
    latitude: { gte: bbox.minLat, lte: bbox.maxLat },
    longitude: { gte: bbox.minLng, lte: bbox.maxLng },
  };

  if (excludeId) {
    where.id = { not: excludeId };
  }

  if (category) {
    where.category = category;
  }

  const places = await prisma.place.findMany({
    where,
    take: limit,
    include: {
      images: { take: 1, orderBy: { order: 'asc' } },
    },
    orderBy: { ratingAvg: 'desc' },
  });

  return places;
}

export async function getFeaturedPlaces(limit: number = 8) {
  return prisma.place.findMany({
    where: { isActive: true, isFeatured: true },
    take: limit,
    include: {
      images: { take: 1, orderBy: { order: 'asc' } },
    },
    orderBy: { ratingAvg: 'desc' },
  });
}

export async function getPopularCities() {
  const cities = await prisma.place.groupBy({
    by: ['city', 'state'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 12,
    where: { isActive: true },
  });

  return cities;
}

export async function getPlacesByCity(city: string, limit: number = 20) {
  return prisma.place.findMany({
    where: {
      city: { contains: city },
      isActive: true,
    },
    take: limit,
    include: {
      images: { take: 1, orderBy: { order: 'asc' } },
    },
    orderBy: [{ isFeatured: 'desc' }, { ratingAvg: 'desc' }],
  });
}
