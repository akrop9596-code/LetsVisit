import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getBoundingBox } from '@/lib/geo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');

    const where: any = { isActive: true };

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { city: { contains: query } },
        { address: { contains: query } },
      ];
    }
    if (type) where.propertyType = type;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { take: 1, orderBy: { order: 'asc' } },
          owner: { select: { name: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: [{ ratingAvg: 'desc' }, { pricePerNight: 'asc' }],
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({ properties, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Property search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
