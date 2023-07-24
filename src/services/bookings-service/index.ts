import { TicketStatus } from '@prisma/client';
import { forbiddenError, notFoundError, requestError } from '../../errors';
import enrollmentRepository from '../../repositories/enrollment-repository';
import ticketsRepository from '../../repositories/tickets-repository';
import bookingsRepository from '../../repositories/bookings-repository';

async function listBookings(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const result = await bookingsRepository.findBookings(userId);
  if (!result) throw notFoundError();

  return {
    id: result.id,
    Room: result.Room,
  };
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw forbiddenError();

  const room = await bookingsRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const quantityOfRooms = await bookingsRepository.findBookingsByRoomId(roomId);
  if (room.capacity === quantityOfRooms.length) throw forbiddenError();

  const booking = await bookingsRepository.createBooking(userId, roomId);

  return booking.id;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const isBooking = await bookingsRepository.findBookingByUserId(userId);
  if (!isBooking) throw forbiddenError();

  const room = await bookingsRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const quantityOfRooms = await bookingsRepository.findBookingsByRoomId(roomId);
  if (room.capacity === quantityOfRooms.length) throw forbiddenError();

  const booking = await bookingsRepository.updateBooking(roomId, bookingId);

  return booking.id;
}

export default {
  listBookings,
  createBooking,
  updateBooking,
};
