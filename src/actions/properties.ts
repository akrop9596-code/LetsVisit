'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { propertySchema } from '@/lib/validators';
import { getBoundingBox } from '@/lib/geo';
import { revalidatePath } from 'next/cache';

export async function createProperty(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Please login to list a property' };
  }

  if ((session.user as any).role !== 'PROPERTY_OWNER' && (session.user as any).role !== 'ADMIN') {
    return { error: 'Only property owners can list properties' };
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    propertyType: formData.get('propertyType') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    latitude: parseFloat(formData.get('latitude') as string),
    longitude: parseFloat(formData.get('longitude') as string),
    pricePerNight: parseFloat(formData.get('pricePerNight') as string),
    maxGuests: parseInt(formData.get('maxGuests') as string),
    bedrooms: parseInt(formData.get('bedrooms') as string) || 1,
    beds: parseInt(formData.get('beds') as string) || 1,
    bathrooms: parseInt(formData.get('bathrooms') as string) || 1,
    houseRules: formData.get('houseRules') as string,
    amenityIds: formData.getAll('amenityIds') as string[],
  };

  const validated = propertySchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { amenityIds, ...propertyData } = validated.data;

  const property = await prisma.property.create({
    data: {
      ...propertyData,
      propertyType: propertyData.propertyType as any,
      ownerId: session.user.id,
      amenities: amenityIds?.length
        ? {
            create: amenityIds.map((id) => ({ amenityId: id })),
          }
        : undefined,
    },
  });

  // Handle image URLs
  const imageUrls = formData.getAll('imageUrls') as string[];
  if (imageUrls.length > 0) {
    await prisma.propertyImage.createMany({
      data: imageUrls.map((url, i) => ({
        propertyId: property.id,
        imageUrl: url,
        order: i,
      })),
    });
  }

  revalidatePath('/owner');
  return { property };
}

export async function updateProperty(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Please login' };
  }

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property || (property.ownerId !== session.user.id && (session.user as any).role !== 'ADMIN')) {
    return { error: 'Property not found or unauthorized' };
  }

  const data: any = {};
  const fields = ['title', 'description', 'address', 'city', 'state', 'houseRules'];
  fields.forEach((f) => {
    const val = formData.get(f);
    if (val !== null) data[f] = val;
  });

  const numFields = ['pricePerNight', 'latitude', 'longitude'];
  numFields.forEach((f) => {
    const val = formData.get(f);
    if (val !== null) data[f] = parseFloat(val as string);
  });

  const intFields = ['maxGuests', 'bedrooms', 'beds', 'bathrooms'];
  intFields.forEach((f) => {
    const val = formData.get(f);
    if (val !== null) data[f] = parseInt(val as string);
  });

  const propertyType = formData.get('propertyType');
  if (propertyType) data.propertyType = propertyType;

  const isActive = formData.get('isActive');
  if (isActive !== null) data.isActive = isActive === 'true';

  await prisma.property.update({ where: { id }, data });

  revalidatePath('/owner');
  revalidatePath(`/property/${id}`);
  return { success: true };
}

export async function deleteProperty(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Please login' };

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property || (property.ownerId !== session.user.id && (session.user as any).role !== 'ADMIN')) {
    return { error: 'Unauthorized' };
  }

  await prisma.property.delete({ where: { id } });
  revalidatePath('/owner');
  return { success: true };
}

export async function togglePropertyActive(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Please login' };

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property || property.ownerId !== session.user.id) {
    return { error: 'Unauthorized' };
  }

  await prisma.property.update({
    where: { id },
    data: { isActive: !property.isActive },
  });

  revalidatePath('/owner');
  return { success: true, isActive: !property.isActive };
}

export async function searchProperties(params: {
  city?: string;
  type?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  guests?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
}) {
  const { city, type, lat, lng, radius = 25, minPrice, maxPrice, minRating, guests, amenities, page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;

  const where: any = {
    isActive: true,
    verificationStatus: 'APPROVED',
  };

  if (city) where.city = { contains: city };
  if (type) where.propertyType = type;
  if (minPrice || maxPrice) {
    where.pricePerNight = {};
    if (minPrice) where.pricePerNight.gte = minPrice;
    if (maxPrice) where.pricePerNight.lte = maxPrice;
  }
  if (minRating) where.ratingAvg = { gte: minRating };
  if (guests) where.maxGuests = { gte: guests };

  if (lat && lng && radius) {
    const bbox = getBoundingBox(lat, lng, radius);
    where.latitude = { gte: bbox.minLat, lte: bbox.maxLat };
    where.longitude = { gte: bbox.minLng, lte: bbox.maxLng };
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      include: {
        images: { take: 1, orderBy: { order: 'asc' } },
        owner: { select: { name: true, profileImage: true } },
        amenities: { include: { amenity: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: [{ ratingAvg: 'desc' }, { pricePerNight: 'asc' }],
    }),
    prisma.property.count({ where }),
  ]);

  return { properties, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getProperty(id: string) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      owner: { select: { id: true, name: true, profileImage: true, createdAt: true } },
      amenities: { include: { amenity: true } },
      reviews: {
        include: { user: { select: { id: true, name: true, profileImage: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true, favorites: true } },
    },
  });
}

export async function getOwnerProperties() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.property.findMany({
    where: { ownerId: session.user.id },
    include: {
      images: { take: 1, orderBy: { order: 'asc' } },
      _count: { select: { reviews: true, favorites: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
