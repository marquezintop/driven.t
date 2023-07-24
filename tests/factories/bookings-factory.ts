import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      hotelId,
      name: faker.name.firstName(),
      capacity: 1,
    },
  });
}

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}
