import { Hotel, TicketStatus } from '@prisma/client';
import { notFoundError, paymentRequired } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function findHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (
    ticket.status !== TicketStatus.RESERVED ||
    ticket.TicketType.includesHotel === false ||
    ticket.TicketType.isRemote === true
  )
    throw paymentRequired();

  const hotels: Hotel[] = await hotelsRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

const hotelsService = {
  findHotels,
};

export default hotelsService;
