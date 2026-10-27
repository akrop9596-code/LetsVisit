'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createTrip(data: {
  name: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Please login' };

  const trip = await prisma.trip.create({
    data: {
      userId: session.user.id,
      name: data.name,
      destination: data.destination,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      notes: data.notes,
    },
  });

  return { trip };
}

export async function getTrips() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.trip.findMany({
    where: { userId: session.user.id },
    include: {
      places: {
        include: {
          place: {
            include: { images: { take: 1 } },
          },
        },
        orderBy: [{ dayNumber: 'asc' }, { sequenceOrder: 'asc' }],
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addPlaceToTrip(tripId: string, placeId: string, dayNumber: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Please login' };

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip || trip.userId !== session.user.id) return { error: 'Trip not found' };

  // Get max sequence order for this day
  const maxOrder = await prisma.tripPlace.aggregate({
    where: { tripId, dayNumber },
    _max: { sequenceOrder: true },
  });

  const tripPlace = await prisma.tripPlace.create({
    data: {
      tripId,
      placeId,
      dayNumber,
      sequenceOrder: (maxOrder._max.sequenceOrder || 0) + 1,
    },
  });

  revalidatePath('/trip-planner');
  return { tripPlace };
}

export async function removePlaceFromTrip(tripId: string, placeId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Please login' };

  await prisma.tripPlace.deleteMany({
    where: { tripId, placeId },
  });

  revalidatePath('/trip-planner');
  return { success: true };
}

export async function deleteTrip(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Please login' };

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || trip.userId !== session.user.id) return { error: 'Unauthorized' };

  await prisma.trip.delete({ where: { id } });
  revalidatePath('/trip-planner');
  return { success: true };
}
