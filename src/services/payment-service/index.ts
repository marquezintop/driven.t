import { Payment } from '@prisma/client';
import paymentRepository from '@/repositories/payment-repository';
import { PaymentParams, joinTicket, TicketPayment } from '@/protocols';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPaymentById(ticketId: number): Promise<Payment> {
  const payment = await paymentRepository.getPayment(ticketId);

  return payment;
}

async function postPaymentProcess(data: TicketPayment, userId: number): Promise<Payment> {
  const ticket: joinTicket = await ticketsRepository.findTicket(userId);

  const paymentParams: PaymentParams = {
    ticketId: data.ticketId,
    value: ticket.TicketType.price,
    cardDataIssuer: data.cardData.issuer,
    cardLastDigits: data.cardData.number.toString().slice(-4),
  };

  const confirmedPayment = await paymentRepository.postPayment(paymentParams);

  await ticketsRepository.updateTicketSatus(data.ticketId);

  return confirmedPayment;
}

const paymentService = {
  getPaymentById,
  postPaymentProcess,
};

export default paymentService;
