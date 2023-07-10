import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { readPaymentById } from '@/controllers/payment-controller';

const paymentRouter = Router();

paymentRouter.use(authenticateToken);
paymentRouter.get('/', readPaymentById);

export { paymentRouter };
