import { TicketStatus, TicketType } from '@prisma/client';
import enrollmentsService from '../enrollments-service';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import { joinTicket } from '@/protocols';

async function getTicketsType(): Promise<TicketType[]> {
  const ticketsType = await ticketsRepository.findTicketsType();

  return ticketsType;
}

async function getTicket(userId: number): Promise<joinTicket> {
  const ticket = (await ticketsRepository.findTicket(userId)) as joinTicket;

  if (!ticket) throw notFoundError();

  return ticket;
}

async function postTicket(userId: number, ticketTypeId: number): Promise<joinTicket> {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);

  const data = {
    status: TicketStatus.RESERVED,
    enrollmentId: enrollment.id,
    ticketTypeId: ticketTypeId,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  };

  const ticket = (await ticketsRepository.postTicket(data)) as joinTicket;

  return ticket;
}

const ticketsService = {
  getTicketsType,
  getTicket,
  postTicket,
};

export default ticketsService;
