import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentsService from '@/services/enrollments-service';
import paymentService from '@/services/payment-service';
import { TicketPayment } from '@/protocols';

export async function readPaymentById(req: Request, res: Response) {
  const ticketId = Number(req.query.ticketId);
  const userId: number = res.locals.userId;

  if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const ticketIdExists = await ticketsRepository.ticketIdExists(userId);
    if (!ticketIdExists) return res.sendStatus(httpStatus.NOT_FOUND);

    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticket = await ticketsRepository.tickedIdAuthorization(enrollment.id, ticketId);
    if (!ticket) return res.sendStatus(httpStatus.UNAUTHORIZED);

    const payment = await paymentService.getPaymentById(ticketId);

    res.send(payment).status(httpStatus.OK);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

export async function endsPaymentProcess(req: Request, res: Response) {
  const data = req.body as TicketPayment;
  const userId: number = res.locals.userId;

  if (!data.cardData || !data.ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const ticketIdExists = await ticketsRepository.ticketIdExists(userId);
    if (!ticketIdExists) return res.sendStatus(httpStatus.NOT_FOUND);

    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticket = await ticketsRepository.tickedIdAuthorization(enrollment.id, data.ticketId);
    if (!ticket) return res.sendStatus(httpStatus.UNAUTHORIZED);

    const confirmedPayment = await paymentService.postPaymentProcess(data, userId);

    res.send(confirmedPayment).status(httpStatus.OK);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}
