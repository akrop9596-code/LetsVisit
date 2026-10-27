'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { reviewSchema } from '@/lib/validators';

export async function createReview(
  data: { rating: number; reviewText: string; visitDate?: string },
  placeId?: string,
  propertyId?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Please login to write a review' };
  }

  const validated = reviewSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const { rating, reviewText, visitDate } = validated.data;

  // Check for duplicate review
  if (placeId) {
    const existing = await prisma.review.findFirst({
      where: { userId: session.user.id, placeId },
    });
    if (existing) {
      return { error: 'You have already reviewed this place' };
    }
  }

  if (propertyId) {
    const existing = await prisma.review.findFirst({
      where: { userId: session.user.id, propertyId },
    });
    if (existing) {
      return { error: 'You have already reviewed this property' };
    }
  }

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      placeId,
      propertyId,
      rating,
      reviewText,
      visitDate: visitDate ? new Date(visitDate) : null,
    },
    include: {
      user: { select: { id: true, name: true, profileImage: true } },
    },
  });

  // Update average rating
  if (placeId) {
    const agg = await prisma.review.aggregate({
      where: { placeId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.place.update({
      where: { id: placeId },
      data: {
        ratingAvg: agg._avg.rating || 0,
        reviewCount: agg._count.rating,
      },
    });
  }

  if (propertyId) {
    const agg = await prisma.review.aggregate({
      where: { propertyId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        ratingAvg: agg._avg.rating || 0,
        reviewCount: agg._count.rating,
      },
    });
  }

  return { review };
}

export async function getReviews(placeId?: string, propertyId?: string, page = 1) {
  const limit = 10;
  const skip = (page - 1) * limit;

  const where: any = { isApproved: true };
  if (placeId) where.placeId = placeId;
  if (propertyId) where.propertyId = propertyId;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, profileImage: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  return { reviews, total, totalPages: Math.ceil(total / limit) };
}
