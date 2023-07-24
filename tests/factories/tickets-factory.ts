import faker from '@faker-js/faker';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithoutHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: false,
    },
  });
}

export async function createTicketTypeIsRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: false,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export function ticketWithTicketType(status: any, isRemote: boolean) {
  return {
    id: 1,
    ticketTypeId: 1,
    enrollmentId: 1,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
    TicketType: {
      id: 1,
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote,
      includesHotel: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  } as Ticket & { TicketType: TicketType };
}

export function ticketType(isRemote: boolean, includesHotel: boolean) {
  return {
    id: 1,
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote,
    includesHotel,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as TicketType;
}
