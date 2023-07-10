import { Ticket } from '@prisma/client';
import { prisma } from '@/config';
import { dataTicket } from '@/protocols';

async function findTicketsType() {
  return prisma.ticketType.findMany();
}

async function findTicket(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: userId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function postTicket(data: dataTicket) {
  return prisma.ticket.create({
    data: {
      status: data.status,
      enrollmentId: data.enrollmentId,
      ticketTypeId: data.ticketTypeId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
    include: {
      TicketType: true,
    },
  });
}

async function ticketIdExists(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: userId,
    },
  });
}

async function tickedIdAuthorization(enrollmentId: number, ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
      id: ticketId,
    },
  });
}

async function updateTicketSatus(ticketId: number) {
  return prisma.ticket.update({
    data: {
      status: 'PAID',
    },
    where: {
      id: ticketId,
    },
  });
}

const ticketsRepository = {
  findTicketsType,
  findTicket,
  postTicket,
  ticketIdExists,
  tickedIdAuthorization,
  updateTicketSatus,
};

export default ticketsRepository;
