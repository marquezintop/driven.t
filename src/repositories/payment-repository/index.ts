import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function postPayment(paymentParams: PaymentParams): Promise<Payment> {
  return prisma.payment.create({
    data: {
      ticketId: paymentParams.ticketId,
      value: paymentParams.value,
      cardIssuer: paymentParams.cardDataIssuer,
      cardLastDigits: paymentParams.cardLastDigits,
    },
  });
}

const paymentRepository = {
  getPayment,
  postPayment,
};

export default paymentRepository;
