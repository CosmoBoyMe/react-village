/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { rest } from 'msw';

import { DropdownGuestsIds } from '../../../../shared/constants/DropdownGuestsIds';
import { server } from '../../../../shared/testUtils/server';
import {
  bookingReducer,
  initialState as bookingInitialState,
  makeBooking as makeBookingThunk,
} from '../slice';

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const dispatch = jest.fn();

const bookingData = {
  roomNumber: 1,
  discount: 800,
  additionalService: 1500,
  totalAmount: 6500,
  dates: { from: '01.04.2023', to: '03.04.2023' },
  guests: [{ id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 2 }],
  bookingStatus: true,
};

describe('Booking', () => {
  it(`Should make booking successfully - 
  first booking of the room`, async () => {
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('booking/makeBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('booking/makeBooking/fulfilled');
    expect(end[0].payload).toMatchObject(bookingData);
    expect(end[0].payload).toHaveProperty('bookingId');
  });

  it(`Should make booking successfully - 
  booking before existing bookings`, async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: {
                bookedDates: {
                  bookingID1: {
                    dates: { from: '03.04.2023', to: '06.04.2023' },
                    userId: 'testUser',
                  },

                  bookingID2: {
                    dates: { from: '14.04.2023', to: '16.04.2023' },
                    userId: 'testUser',
                  },
                },
              },
            })
          );
        }
      )
    );
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('booking/makeBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('booking/makeBooking/fulfilled');
    expect(end[0].payload).toMatchObject(bookingData);
    expect(end[0].payload).toHaveProperty('bookingId');
  });

  it(`Should make booking successfully - 
  booking after existing bookings`, async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: {
                bookedDates: {
                  bookingID1: {
                    dates: { from: '04.03.2023', to: '06.03.2023' },
                    userId: 'testUser',
                  },

                  bookingID2: {
                    dates: { from: '30.03.2023', to: '01.04.2023' },
                    userId: 'testUser',
                  },
                },
              },
            })
          );
        }
      )
    );
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('booking/makeBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('booking/makeBooking/fulfilled');
    expect(end[0].payload).toMatchObject(bookingData);
    expect(end[0].payload).toHaveProperty('bookingId');
  });

  it(`Should make booking successfully - 
  booking between existing bookings`, async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: {
                bookedDates: {
                  bookingID1: {
                    dates: { from: '30.03.2023', to: '01.04.2023' },
                    userId: 'testUser',
                  },

                  bookingID2: {
                    dates: { from: '03.04.2023', to: '05.04.2023' },
                    userId: 'testUser',
                  },
                },
              },
            })
          );
        }
      )
    );
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('booking/makeBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('booking/makeBooking/fulfilled');
    expect(end[0].payload).toMatchObject(bookingData);
    expect(end[0].payload).toHaveProperty('bookingId');
  });

  it(`Should try to make booking and fail - 
  booking range is available partially`, async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: {
                bookedDates: {
                  bookingID: {
                    dates: { from: '01.04.2023', to: '02.04.2023' },
                    userId: 'testUser',
                  },
                },
              },
            })
          );
        }
      )
    );
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('booking/makeBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('booking/makeBooking/rejected');
    expect(end[0].payload).toBe(
      'На данный период проживания комната уже забронирована'
    );
  });

  it(`Should try to make booking and fail - 
  room already booked on the same dates`, async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: {
                bookedDates: {
                  bookingID: {
                    dates: { from: '01.04.2023', to: '03.04.2023' },
                    userId: 'testUser',
                  },
                },
              },
            })
          );
        }
      )
    );
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('booking/makeBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('booking/makeBooking/rejected');
    expect(end[0].payload).toBe(
      'На данный период проживания комната уже забронирована'
    );
  });

  it('Should try to make booking and fail - data is undefined', async () => {
    server.use(
      rest.post(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms/1/bookedDates.json',
        (req, res, ctx) => {
          return res(ctx.status(200));
        }
      )
    );
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('booking/makeBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('booking/makeBooking/rejected');
    expect(end[0].payload).toBe('Бронирование не подтверждено');
  });

  it('Should try to make booking and fail - unknown server error', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('booking/makeBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('booking/makeBooking/rejected');
    expect(end[0].payload).toBe('Request failed with status code 404');
  });

  it('Should try to make booking and fail - unknown error', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: {
                bookedDates: 'error',
              },
            })
          );
        }
      )
    );
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('booking/makeBooking/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('booking/makeBooking/rejected');
    expect(end[0].payload).toBe('Бронирование не подтверждено');
  });

  it(`Should change state correctly 
  when promise status is pending`, async () => {
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });

    const state = bookingReducer(
      bookingInitialState,
      makeBookingThunk.pending(
        '',
        {
          ...bookingData,
          userId: 'testUser',
        },
        null
      )
    );

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.status).toBe('loading');
    expect(state.errorMessage).toBe(null);
  });

  it(`Should change state correctly 
  when promise status is fulfilled`, async () => {
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });

    const state = bookingReducer(
      bookingInitialState,
      makeBookingThunk.fulfilled(
        {
          ...bookingData,
          bookingId: 'bookingId',
        },
        '',
        {
          ...bookingData,
          userId: 'testUser',
        }
      )
    );

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.status).toBe('resolved');
    expect(state.errorMessage).toBe(null);
  });

  it(`Should change state correctly 
  when promise status is rejected`, async () => {
    const thunk = makeBookingThunk({
      ...bookingData,
      userId: 'testUser',
    });

    const action = {
      type: makeBookingThunk.rejected.type,
      payload: 'network error',
    };

    const state = bookingReducer(bookingInitialState, action);

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.status).toBe('rejected');
    expect(state.errorMessage).toBe('network error');
  });
});
