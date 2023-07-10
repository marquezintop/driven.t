import { Request, Response } from 'express';
import httpStatus from 'http-status';
import enrollmentsService from '@/services/enrollments-service';
import ticketsService from '@/services/tickets-service';

export async function readTicketsTypes(req: Request, res: Response) {
  try {
    const ticketsType = await ticketsService.getTicketsType();

    res.send(ticketsType).status(httpStatus.OK);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

export async function readTicket(req: Request, res: Response) {
  const userId: number = res.locals.userId;

  try {
    await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticket = await ticketsService.getTicket(userId);

    res.send(ticket).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

export async function createTicket(req: Request, res: Response) {
  const ticketTypeId: number = req.body.ticketTypeId;
  const userId: number = res.locals.userId;

  if (!ticketTypeId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticket = await ticketsService.postTicket(userId, ticketTypeId);

    res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}
