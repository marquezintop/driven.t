import { ApplicationError } from '@/protocols';

export function paymentRequired(): ApplicationError {
  return {
    name: 'PaymentRequired',
    message: `You haven't payed yet! To acess this page, pay the ticket.`,
  };
}
