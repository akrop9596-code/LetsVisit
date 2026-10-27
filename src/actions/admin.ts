'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getAdminStats() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const [users, properties, places, reviews, reports, pendingProperties] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.place.count(),
    prisma.review.count(),
    prisma.report.count(),
    prisma.property.count({ where: { verificationStatus: 'PENDING' } }),
  ]);

  return { users, properties, places, reviews, reports, pendingProperties };
}

export async function getAdminUsers() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') return [];

  return prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, isActive: true, createdAt: true,
      _count: { select: { reviews: true, properties: true, favorites: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export async function getAdminProperties() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') return [];

  return prisma.property.findMany({
    include: {
      owner: { select: { name: true, email: true } },
      images: { take: 1, orderBy: { order: 'asc' } },
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export async function getAdminPlaces() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') return [];

  return prisma.place.findMany({
    select: {
      id: true, name: true, category: true, city: true, state: true,
      ratingAvg: true, reviewCount: true, isActive: true, isFeatured: true, createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

export async function getAdminReviews() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') return [];

  return prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      place: { select: { name: true } },
      property: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function updatePropertyVerification(id: string, status: 'APPROVED' | 'REJECTED') {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  await prisma.property.update({
    where: { id },
    data: { verificationStatus: status },
  });

  return { success: true };
}

export async function toggleUserActive(id: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { error: 'User not found' };

  await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
  });

  return { success: true, isActive: !user.isActive };
}
