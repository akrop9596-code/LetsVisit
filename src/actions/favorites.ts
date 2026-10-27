'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(placeId?: string, propertyId?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Please login to save favorites' };
  }

  const userId = session.user.id;

  if (placeId) {
    const existing = await prisma.favorite.findFirst({
      where: { userId, placeId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { saved: false };
    } else {
      await prisma.favorite.create({
        data: { userId, placeId },
      });
      return { saved: true };
    }
  }

  if (propertyId) {
    const existing = await prisma.favorite.findFirst({
      where: { userId, propertyId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return { saved: false };
    } else {
      await prisma.favorite.create({
        data: { userId, propertyId },
      });
      return { saved: true };
    }
  }

  return { error: 'No place or property specified' };
}

export async function getFavorites() {
  const session = await auth();
  if (!session?.user?.id) return { places: [], properties: [] };

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      place: {
        include: { images: { take: 1 } },
      },
      property: {
        include: { images: { take: 1 } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    places: favorites.filter((f) => f.place).map((f) => ({ ...f.place!, favoriteId: f.id })),
    properties: favorites.filter((f) => f.property).map((f) => ({ ...f.property!, favoriteId: f.id })),
  };
}

export async function checkFavorite(placeId?: string, propertyId?: string) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const where: any = { userId: session.user.id };
  if (placeId) where.placeId = placeId;
  if (propertyId) where.propertyId = propertyId;

  const fav = await prisma.favorite.findFirst({ where });
  return !!fav;
}
