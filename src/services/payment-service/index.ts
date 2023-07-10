import { Payment } from '@prisma/client';
import paymentRepository from '@/repositories/payment-repository';

async function getPaymentById(ticketId: number): Promise<Payment> {
  const payment = await paymentRepository.getPayment(ticketId);

  return payment;
}

const paymentService = {
  getPaymentById,
};

export default paymentService;
