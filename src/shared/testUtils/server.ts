import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get(
    'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms.json',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          1: {},
        })
      );
    }
  ),

  rest.post(
    'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms/1/bookedDates.json',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ bookingID: '123' }));
    }
  ),

  rest.post(
    'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms/1/feedback.json',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    }
  ),

  rest.post(
    'https://react-village-d5bce-default-rtdb.firebaseio.com/rooms/1/feedback/feedbackID/likes.json',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({}));
    }
  ),

  rest.post(
    'https://react-village-d5bce-default-rtdb.firebaseio.com/users/testUser/booking.json',
    (req, res, ctx) => {
      return res(ctx.status(200));
    }
  )
);

export { server };
