import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBoundingBox } from '@/lib/geo';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const place = await prisma.place.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true, profileImage: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true, favorites: true } },
      },
    });

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    // Get nearby places
    const bbox = getBoundingBox(place.latitude, place.longitude, 5);
    const nearby = await prisma.place.findMany({
      where: {
        isActive: true,
        id: { not: place.id },
        latitude: { gte: bbox.minLat, lte: bbox.maxLat },
        longitude: { gte: bbox.minLng, lte: bbox.maxLng },
      },
      take: 8,
      include: { images: { take: 1, orderBy: { order: 'asc' } } },
      orderBy: { ratingAvg: 'desc' },
    });

    return NextResponse.json({ place, nearby });
  } catch (error) {
    console.error('Place detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
