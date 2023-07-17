import supertest from 'supertest';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketTypeWithHotel, createUser } from '../factories';
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
    const token = 'Loremipsumdolorsitamet';

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
});

// it('should respond with status 200 and return the hotel if hotelId is valid', async () => {
//     const user = await createUser();
//     const token = await generateValidToken(user);
//     const ticketType = await createTicketTypeWithHotel();
//     const enrollment = await createEnrollmentWithAddress(user);
//     await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

//     const hotel = await createHotel();

//     const { status, body } = await api.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

//     console.log(body);

//     expect(status).toBe(httpStatus.OK);
//     expect(body).toHaveProperty('name', hotel.name);
// });
