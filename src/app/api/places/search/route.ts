import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBoundingBox } from '@/lib/geo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const city = searchParams.get('city') || '';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const countriesParam = searchParams.get('countries') || '';
    const countries = countriesParam ? countriesParam.split(',') : [];
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '0');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const sortBy = searchParams.get('sortBy') || 'relevance';

    const skip = (page - 1) * limit;
    const where: any = { isActive: true };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { city: { contains: query } },
        { state: { contains: query } },
        { address: { contains: query } },
      ];
    }

    if (category) where.category = category;
    if (city) where.city = { contains: city };
    if (minRating > 0) where.ratingAvg = { gte: minRating };
    if (countries.length > 0) where.country = { in: countries };

    if (lat && lng && radius) {
      const bbox = getBoundingBox(lat, lng, radius);
      where.latitude = { gte: bbox.minLat, lte: bbox.maxLat };
      where.longitude = { gte: bbox.minLng, lte: bbox.maxLng };
    }

    let orderBy: any = [{ isFeatured: 'desc' }, { ratingAvg: 'desc' }];
    if (sortBy === 'rating') orderBy = { ratingAvg: 'desc' };
    if (sortBy === 'name') orderBy = { name: 'asc' };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where, orderBy, skip, take: limit,
        include: {
          images: { take: 1, orderBy: { order: 'asc' } },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.place.count({ where }),
    ]);

    return NextResponse.json({
      places,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
