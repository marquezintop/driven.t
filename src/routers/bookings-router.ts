import { Router } from 'express';
import { getBooking, postBooking, putBooking } from '../controllers/bookings-controller';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBooking).post('/', postBooking).put('/:bookingId', putBooking);

export { bookingRouter };
