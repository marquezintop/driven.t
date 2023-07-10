import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentsService from '@/services/enrollments-service';
import paymentService from '@/services/payment-service';
import ticketsService from '@/services/tickets-service';

export async function readPaymentById(req: Request, res: Response) {
  const ticketId = Number(req.query.ticketId);
  const userId: number = res.locals.userId;

  if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const ticketIdExist = await ticketsRepository.ticketIdExists(userId);
    if (!ticketIdExist) return res.sendStatus(httpStatus.NOT_FOUND);

    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticket = await ticketsRepository.tickedIdAuthorization(enrollment.id, ticketId);
    if (!ticket) return res.sendStatus(httpStatus.UNAUTHORIZED);

    const payment = await paymentService.getPaymentById(ticketId);

    res.send(payment).status(httpStatus.OK);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}
