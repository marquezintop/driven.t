import { Hotel, TicketStatus } from '@prisma/client';
import { notFoundError, paymentRequired } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { HotelWithRooms } from '@/protocols';

async function readHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (
    ticket.status === TicketStatus.RESERVED ||
    ticket.TicketType.includesHotel === false ||
    ticket.TicketType.isRemote === true
  )
    throw paymentRequired();

  const hotels: Hotel[] = await hotelsRepository.findHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();

  return hotels;
}

async function readHotelById(userId: number, hotelId: number): Promise<HotelWithRooms> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  console.log(enrollment);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  console.log(ticket);
  if (!ticket) throw notFoundError();

  if (
    ticket.status === TicketStatus.RESERVED ||
    ticket.TicketType.includesHotel === false ||
    ticket.TicketType.isRemote === true
  )
    throw paymentRequired();

  const hotels: Hotel[] = await hotelsRepository.findHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();

  const hotel: HotelWithRooms = await hotelsRepository.findHotelById(hotelId);
  console.log(hotel);
  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = {
  readHotels,
  readHotelById,
};

export default hotelsService;
