import { Hotel } from '@prisma/client';
import { prisma } from '@/config';
import { HotelWithRooms } from '@/protocols';

async function findHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findHotelById(hotelId: number): Promise<HotelWithRooms> {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  findHotels,
  findHotelById,
};

export default hotelsRepository;
