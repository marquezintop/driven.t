import { Booking, Room } from '@prisma/client';
import { prisma } from '../../config';

async function findBookings(userId: number): Promise<Booking & { Room: Room }> {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function updateBooking(roomId: number, bookingId: number) {
  return prisma.booking.update({
    data: {
      roomId,
    },
    where: {
      id: bookingId,
    },
  });
}

async function findRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function findBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

// async function findBookingByRoomId(roomId:number) {
//     return prisma.booking.findFirst({
//         where:{
//             roomId
//         },
//         include:{
//             Room:true
//         }
//     })
// }

export default {
  findBookings,
  createBooking,
  updateBooking,
  findRoomById,
  findBookingsByRoomId,
  findBookingByUserId,
  // findBookingByRoomId,
};
