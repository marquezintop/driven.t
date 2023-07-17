import supertest from 'supertest';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import faker from '@faker-js/faker';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketStatusReserved,
  createTicketType,
  createTicketTypeIsRemote,
  createTicketTypeWithHotel,
  createTicketTypeWithoutHotel,
  createUser,
} from '../factories';
import { createHotel } from '../factories/hotels-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const api = supertest(app);

describe('GET hotels with invalid token', () => {
  it('should respond with status 401 if no token is given', async () => {
    const result = await api.get('/hotels');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.sentence();

    const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 404 if the user associated with the token is not in session', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });
});

describe('GET hotels with valid token', () => {
  it('should respond with status 404 if enrollment does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if ticket does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 402 when ticket status is Reserved', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicketStatusReserved(enrollment.id, ticketType.id);
    await createHotel();

    const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 when hotel is not included', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithoutHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    createHotel();

    const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 when ticket type is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIsRemote();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    createHotel();

    const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 200 and return the hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    createHotel();

    const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.OK);
    expect(result.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });
});

describe('GET hotels/:hotelId with invalid token', () => {
  it('should respond with status 401 if no token is given', async () => {
    const result = await api.get('/hotels/1');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.sentence();

    const result = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 404 if the user associated with the token is not in session', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const result = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });
});

describe('GET /hotels/:id with valid token', () => {
  it('should respond with status 404 if enrollment does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();

    const result = await api.get(`/hotels${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if ticket does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const hotel = await createHotel();

    const result = await api.get(`/hotels${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 402 when ticket status is Reserved', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicketStatusReserved(enrollment.id, ticketType.id);
    const hotel = await createHotel();

    const result = await api.get(`/hotels${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 when hotel is not included', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithoutHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();

    const result = await api.get(`/hotels${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 when ticket type is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeIsRemote();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();

    const result = await api.get(`/hotels${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 400 if the id of the hotel is not valid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const fakeHotelId = faker.lorem.sentence();

    const result = await api.get(`/hotels/${fakeHotelId}`).set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.BAD_REQUEST);
  });
  it('should respond with status 200 and return the hotel if hotelId is valid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();

    const result = await api.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.OK);
  });
});
