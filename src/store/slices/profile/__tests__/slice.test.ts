/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { rest } from 'msw';

import '@testing-library/jest-dom';

import { DropdownGuestsIds } from '../../../../shared/constants/DropdownGuestsIds';
import { server } from '../../../../shared/testUtils/server';
import { makeBooking as makeBookingThunk } from '../../booking/slice';
import { fetchBookedRooms, removeUserBooking, setRate } from '../slice';

const dispatch = jest.fn();

const bookingData = {
  roomNumber: 1,
  discount: 800,
  additionalService: 1500,
  totalAmount: 6500,
  dates: { from: '28.03.2023', to: '29.03.2023' },
  guests: [{ id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 2 }],
  bookingStatus: true,
};

beforeAll(async () => {
  server.listen();

  const thunk = makeBookingThunk({
    ...bookingData,
    userId: 'Tester',
  });
  await thunk(
    dispatch,
    () => {},
    () => {}
  );
});
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

let globalBookingId: string;
let globalRoomNumber: number;

describe('profile slice', () => {
  it(`cancellation failure if user have rooms,
      but data not correct`, async () => {
    const thunkCancel = removeUserBooking({
      userId: 'Tester',
      roomId: '',
      roomNumber: 0,
    });

    await thunkCancel(
      dispatch,
      () => {},
      () => {}
    );

    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('profile/removeUserBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('profile/removeUserBooking/rejected');
    expect(end[0].payload).toBe('An unexpected error occurred');
  });

  it('fetch success', async () => {
    const thunkFetchBooking = fetchBookedRooms('Tester');
    await thunkFetchBooking(
      dispatch,
      () => {},
      () => {}
    );

    const [start, end] = dispatch.mock.calls;

    expect(start[0].type).toBe('profile/fetchBookedRooms/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('profile/fetchBookedRooms/fulfilled');
    expect(end[0].payload).not.toBeNull();
    expect(end[0].payload).not.toBe([]);

    const { bookingId, roomNumber } = end[0].payload[0];
    expect(roomNumber).toBe(bookingData.roomNumber);

    globalBookingId = bookingId;
    globalRoomNumber = roomNumber;
  });

  it('fetch failure', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );
    const thunkFetchBooking = fetchBookedRooms('Tester');
    await thunkFetchBooking(
      dispatch,
      () => {},
      () => {}
    );

    const [start, end] = dispatch.mock.calls;

    expect(start[0].type).toBe('profile/fetchBookedRooms/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('profile/fetchBookedRooms/rejected');
    expect(end[0].payload).toBe('Request failed with status code 404');
  });

  it('fetch error, if bookings by user not found', async () => {
    const thunkFetchBooking = fetchBookedRooms('TesterX');
    await thunkFetchBooking(
      dispatch,
      () => {},
      () => {}
    );

    const [start, end] = dispatch.mock.calls;

    expect(start[0].type).toBe('profile/fetchBookedRooms/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('profile/fetchBookedRooms/rejected');
    expect(end[0].payload).toBe('BOOKINGS_NOT_FOUND');
  });

  it('fetch network error if network crashed', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res.networkError('');
        }
      )
    );
    const thunkFetchBooking = fetchBookedRooms('Tester');
    await thunkFetchBooking(
      dispatch,
      () => {},
      () => {}
    );

    const [start, end] = dispatch.mock.calls;

    expect(start[0].type).toBe('profile/fetchBookedRooms/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('profile/fetchBookedRooms/rejected');
    expect(end[0].payload).toBe('Network Error');
  });

  it('set rate success', async () => {
    const thunkSetRate = setRate({
      roomNumber: '1',
      userId: 'Tester',
      rate: 4,
    });

    await thunkSetRate(
      dispatch,
      () => {},
      () => {}
    );

    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('profile/setRate/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('profile/setRate/fulfilled');
    expect(end[0].payload).toStrictEqual({
      currentRates: undefined,
      rate: 4,
      roomNumber: '1',
      userId: 'Tester',
    });
  });

  // it('cancellation success', async () => {
  //   const thunkCancel = removeUserBooking({
  //     userId: 'Tester',
  //     roomId: globalBookingId,
  //     roomNumber: globalRoomNumber,
  //   });

  //   await thunkCancel(
  //     dispatch,
  //     () => {},
  //     () => {}
  //   );

  //   const [start, end] = dispatch.mock.calls;
  //   expect(start[0].type).toBe('profile/removeUserBooking/pending');
  //   expect(start[0].payload).toBe(undefined);
  //   expect(end[0].type).toBe('profile/removeUserBooking/fulfilled');
  //   expect(end[0].payload).toBe(globalBookingId);
  // });
});
