import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBoundingBox } from '@/lib/geo';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        owner: { select: { id: true, name: true, profileImage: true, createdAt: true } },
        amenities: { include: { amenity: true } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { id: true, name: true, profileImage: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true, favorites: true } },
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Get nearby properties
    const bbox = getBoundingBox(property.latitude, property.longitude, 10);
    const nearby = await prisma.property.findMany({
      where: {
        isActive: true,
        verificationStatus: 'APPROVED',
        id: { not: property.id },
        latitude: { gte: bbox.minLat, lte: bbox.maxLat },
        longitude: { gte: bbox.minLng, lte: bbox.maxLng },
      },
      take: 4,
      include: { images: { take: 1, orderBy: { order: 'asc' } } },
      orderBy: { ratingAvg: 'desc' },
    });

    return NextResponse.json({ property, nearby });
  } catch (error) {
    console.error('Property detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
