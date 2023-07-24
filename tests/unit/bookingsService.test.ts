import { enrollmentWithAddress, ticketType, ticketWithTicketType } from '../factories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import bookingsService from '@/services/bookings-service';
import ticketsRepository from '@/repositories/tickets-repository';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking test unit', () => {
  it('should respond with status 404 when user has no enrollment', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(null);
    const booking = bookingsService.listBookings(userId);
    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should respond with status 404 when user has no ticket', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentWithAddress());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(null);
    const booking = bookingsService.listBookings(userId);
    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('POST /booking test unit', () => {
  it('should respond with status 404 when user has no enrollment', async () => {
    const userId = 1;
    const roomId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(null);
    const booking = bookingsService.createBooking(userId, roomId);
    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should respond with status 404 when user has no ticket', async () => {
    const userId = 1;
    const roomId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentWithAddress());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(null);
    const booking = bookingsService.createBooking(userId, roomId);
    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should respond with status 403 when user ticket is remote ', async () => {
    const userId = 1;
    const roomId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentWithAddress());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(ticketWithTicketType('PAID', true));
    jest.spyOn(ticketsRepository, 'findTicketTypeById').mockResolvedValueOnce(ticketType(true, true));
    const booking = bookingsService.createBooking(userId, roomId);
    expect(booking).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'You do not have acess to this content!',
    });
  });
});
