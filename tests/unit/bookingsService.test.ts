import faker from '@faker-js/faker';
import bookingsRepositories from '../../src/repositories/bookings-repository';
import bookingsService from '../../src/services/bookings-service';
import enrollmentRepository from '../../src/repositories/enrollment-repository';
import ticketsRepository from '../../src/repositories/tickets-repository';

describe('GET /booking', () => {
  it('Should return send Not Found status when user has no bookings', async () => {
    jest.spyOn(bookingsRepositories, 'getBookings').mockImplementationOnce(() => {
      return undefined;
    });

    const promise = bookingsService.listBookings();

    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('POST /booking', () => {
  it('Should send Not Found status if user is not enrolled', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(() => {
      return undefined;
    });

    const roomId = faker.datatype.number();
    const userId = faker.datatype.number();

    const promise = bookingsService.makeBooking(roomId, userId);
    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('Should send Not Found status if user does not have a ticket', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
      return true;
    });

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(() => {
      return undefined;
    });

    const roomId = faker.datatype.number();
    const userId = faker.datatype.number();

    const promise = bookingsService.makeBooking(roomId, userId);
    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});
