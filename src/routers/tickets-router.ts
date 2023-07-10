import { Router } from 'express';
import { createTicket, readTicket, readTicketsTypes } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.use(authenticateToken);
ticketsRouter.get('/types', readTicketsTypes);
ticketsRouter.get('/', readTicket);
ticketsRouter.post('/', createTicket);

export { ticketsRouter };
