import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { endsPaymentProcess, readPaymentById } from '@/controllers/payment-controller';

const paymentRouter = Router();

paymentRouter.use(authenticateToken);
paymentRouter.get('/', readPaymentById);
paymentRouter.post('/process', endsPaymentProcess);

export { paymentRouter };
