import { createEnrollmentWithAddress } from '../factories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import bookingsService from '@/services/bookings-service';
import ticketsRepository from '@/repositories/tickets-repository';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking test unit', () => {
  it('should respond with status 404 if enrollment does not exists', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(null);
    const booking = bookingsService.listBookings(userId);
    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should respond with status 404 if ticket does not exists', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(createEnrollmentWithAddress());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(null);
    const booking = bookingsService.listBookings(userId);
    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});
