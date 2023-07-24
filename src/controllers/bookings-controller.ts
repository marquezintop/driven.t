import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import bookingsService from '../services/bookings-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  try {
    const bookings = await bookingsService.listBookings(userId);
    return res.status(200).send(bookings);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { roomId } = req.body as { roomId: number };

  try {
    const id = await bookingsService.createBooking(userId, roomId);
    return res.status(200).send({ bookingId: id });
  } catch (error) {
    if (error.statusText === 'Outside business rules') return res.sendStatus(httpStatus.FORBIDDEN);
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  try {
    const id = await bookingsService.updateBooking(userId, roomId, Number(bookingId));
    return res.status(200).send({ bookingId: id });
  } catch (error) {
    if (error.statusText === 'Outside business rules') return res.sendStatus(httpStatus.FORBIDDEN);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
