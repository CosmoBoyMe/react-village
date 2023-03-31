/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { rest } from 'msw';

import { server } from '../../../../shared/testUtils/server';
import {
  addFeedback as addFeedbackThunk,
  changeLike as changeLikeThunk,
  fetchRoomById as fetchRoomThunk,
  initialState as roomInitialState,
  roomReducer,
} from '../slice';

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const dispatch = jest.fn();

const roomData = {
  roomNumber: 2,
  furniture: [],
  capacity: [],
  reservedDates: [],
  details: {},
  images: [],
  imagesDetailed: [],
  isLux: false,
  price: 0,
  rating: 0,
  feedbackCount: 0,
  information: {},
};

const likeData = {
  roomNumber: '2',
  path: 'feedback/feedbackID/likes',
  userId: 'testUser',
};

const feedbackPayload = {
  text: 'feedback',
  userId: 'testUser',
  userName: 'Test User',
  date: '2023-01-01T00:00:00.000Z',
};

const feedbackData = {
  ...feedbackPayload,
  roomNumber: '2',
  path: 'feedback',
  date: new Date('2023-01-01'),
};

describe('Room', () => {
  it('Should fetch room successfully', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: roomData,
            })
          );
        }
      )
    );
    const thunk = fetchRoomThunk(1);
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('room/fetchRoomById/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('room/fetchRoomById/fulfilled');
    expect(end[0].payload).toMatchObject(roomData);
  });

  it('Should try to fetch room and get axios error', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );
    const thunk = fetchRoomThunk(1);
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('room/fetchRoomById/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('room/fetchRoomById/rejected');
    expect(end[0].payload).toBe('Request failed with status code 404');
  });

  it('Should add feedback successfully', async () => {
    const date = new Date('2023-01-01');
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: {
                roomNumber: 2,
                feedback: {
                  feedbackID: {
                    ...feedbackPayload,
                    date,
                  },
                },
              },
            })
          );
        }
      )
    );
    const thunk = addFeedbackThunk(feedbackData);
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('room/addFeedback/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('room/addFeedback/fulfilled');
    expect(end[0].payload).toMatchObject({
      roomNumber: 2,
      feedback: { feedbackID: feedbackPayload },
    });
  });

  it('Should try to add feedback and get axios error', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );
    const thunk = addFeedbackThunk(feedbackData);
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('room/addFeedback/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('room/addFeedback/rejected');
    expect(end[0].payload).toBe('Request failed with status code 404');
  });

  it('Should add like successfully', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: {
                roomNumber: 2,
                feedback: {
                  feedbackID: {
                    ...feedbackPayload,
                    likes: { likeID: 'testUser' },
                  },
                },
              },
            })
          );
        }
      )
    );
    const thunk = changeLikeThunk({ ...likeData, isLiked: true });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('room/changeLike/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('room/changeLike/fulfilled');
    expect(end[0].payload).toMatchObject({
      roomNumber: 2,
      feedback: {
        feedbackID: {
          ...feedbackPayload,
          likes: { likeID: 'testUser' },
        },
      },
    });
  });

  it('Should remove like successfully', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: {
                roomNumber: 2,
                feedback: {
                  feedbackID: feedbackPayload,
                },
              },
            })
          );
        }
      )
    );
    const thunk = changeLikeThunk({ ...likeData, isLiked: false });
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('room/changeLike/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('room/changeLike/fulfilled');
    expect(end[0].payload).toMatchObject({
      roomNumber: 2,
      feedback: {
        feedbackID: feedbackPayload,
      },
    });
  });

  it('Should try to add like and get axios error', async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );
    const thunk = changeLikeThunk(likeData);
    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    const [start, end] = dispatch.mock.calls;
    expect(start[0].type).toBe('room/changeLike/pending');
    expect(start[0].payload).toBe(undefined);
    expect(end[0].type).toBe('room/changeLike/rejected');
    expect(end[0].payload).toBe('Request failed with status code 404');
  });

  it(`should change state correctly 
  when promise status is pending`, async () => {
    const thunk = fetchRoomThunk(1);

    const state = roomReducer(
      roomInitialState,
      fetchRoomThunk.pending('', 1, null)
    );

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.status).toBe('loading');
    expect(state.errorMessage).toBe(null);
  });

  it(`should change state correctly 
  when promise status is fulfilled`, async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: roomData,
            })
          );
        }
      )
    );

    const thunk = fetchRoomThunk(1);

    const state = roomReducer(
      roomInitialState,
      fetchRoomThunk.fulfilled(roomData, '', 1)
    );

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.status).toBe('resolved');
    expect(state.errorMessage).toBe(null);
  });

  it(`should change state correctly 
  when promise status is rejected`, async () => {
    const thunk = fetchRoomThunk(1);

    const action = {
      type: fetchRoomThunk.rejected.type,
      payload: 'network error',
    };

    const state = roomReducer(roomInitialState, action);

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.status).toBe('rejected');
    expect(state.errorMessage).toBe('network error');
  });

  it(`should change state correctly when promise status is rejected
      and unknown error is occurred`, () => {
    const state = roomReducer(
      roomInitialState,
      fetchRoomThunk.rejected(null, '', 1)
    );

    expect(state.status).toBe('rejected');
    expect(state.errorMessage).toBe('Не удалось загрузить страницу');
  });

  it(`should change feedback state correctly 
  when promise status is pending`, async () => {
    const thunk = addFeedbackThunk(feedbackData);

    const state = roomReducer(
      roomInitialState,
      addFeedbackThunk.pending('', feedbackData, null)
    );

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.feedbackStatus).toBe('loading');
    expect(state.feedbackErrorMessage).toBe(null);
  });

  it(`should change feedback state correctly 
  when promise status is fulfilled`, async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: roomData,
            })
          );
        }
      )
    );

    const thunk = addFeedbackThunk(feedbackData);

    const state = roomReducer(
      roomInitialState,
      addFeedbackThunk.fulfilled(roomData, '', feedbackData)
    );

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.feedbackStatus).toBe('resolved');
    expect(state.feedbackErrorMessage).toBe(null);
  });

  it(`should change feedback state correctly 
  when promise status is rejected`, async () => {
    const thunk = addFeedbackThunk(feedbackData);

    const action = {
      type: addFeedbackThunk.rejected.type,
      payload: 'network error',
    };

    const state = roomReducer(roomInitialState, action);

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.feedbackStatus).toBe('rejected');
    expect(state.feedbackErrorMessage).toBe('network error');
  });

  it(`should change feedback state correctly when promise status is rejected
  and unknown error is occurred`, () => {
    const state = roomReducer(
      roomInitialState,
      addFeedbackThunk.rejected(null, '', feedbackData)
    );

    expect(state.feedbackStatus).toBe('rejected');
    expect(state.feedbackErrorMessage).toBe('Не удалось сохранить отзыв');
  });

  it(`should change like state correctly 
 when promise status is pending / LIKES`, async () => {
    const thunk = changeLikeThunk(likeData);

    const state = roomReducer(
      roomInitialState,
      changeLikeThunk.pending('', likeData, null)
    );

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.likeStatus).toBe('loading');
    expect(state.likeErrorMessage).toBe(null);
  });

  it(`should change like state correctly 
  when promise status is fulfilled`, async () => {
    server.use(
      rest.get(
        'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              1: roomData,
            })
          );
        }
      )
    );

    const thunk = changeLikeThunk(likeData);

    const state = roomReducer(
      roomInitialState,
      changeLikeThunk.fulfilled(roomData, '', likeData)
    );

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.likeStatus).toBe('resolved');
    expect(state.likeErrorMessage).toBe(null);
  });

  it(`should change like state correctly 
  when promise status is rejected`, async () => {
    const thunk = changeLikeThunk(likeData);

    const action = {
      type: changeLikeThunk.rejected.type,
      payload: 'network error',
    };

    const state = roomReducer(roomInitialState, action);

    await thunk(
      dispatch,
      () => {},
      () => {}
    );
    expect(state.likeStatus).toBe('rejected');
    expect(state.likeErrorMessage).toBe('network error');
  });

  it(`should change like state correctly when promise status is rejected
  and unknown error is occurred`, () => {
    const state = roomReducer(
      roomInitialState,
      changeLikeThunk.rejected(null, '', likeData)
    );

    expect(state.likeStatus).toBe('rejected');
    expect(state.likeErrorMessage).toBe('Не удалось установить лайк');
  });
});
