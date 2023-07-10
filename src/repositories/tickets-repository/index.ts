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

const ticketsRepository = {
  findTicketsType,
  findTicket,
  postTicket,
};

export default ticketsRepository;
