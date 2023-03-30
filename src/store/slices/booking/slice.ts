import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

import { FirebaseAPI } from '../../../FirebaseAPI';
import { getDateFromString } from '../../../shared/helpers/getDateFromString/getDateFromString';
import { BookingData, BookingRequestData } from '../../../types/BookingData';
import { Status } from '../../../types/Status';

import { sortDates } from './helpers';

type InitialState = {
  booking: BookingData[];
  status: Status;
  errorMessage: string | null;
};

const initialState: InitialState = {
  booking: [],
  status: 'idle',
  errorMessage: null,
};

const NAMESPACE = 'booking';

export const makeBooking = createAsyncThunk<
  BookingData,
  BookingRequestData,
  { rejectValue: string }
>(
  `${NAMESPACE}/makeBooking`,
  async (bookingRequestData, { rejectWithValue }) => {
    const {
      roomNumber,
      discount,
      additionalService,
      totalAmount,
      dates,
      guests,
      bookingStatus,
    } = bookingRequestData;

    const createRoomBooking = async () => {
      const data = await FirebaseAPI.makeBooking(bookingRequestData);
      if (!data) {
        throw new AxiosError('Бронирование не подтверждено');
      }

      return {
        roomNumber,
        discount,
        additionalService,
        totalAmount,
        dates,
        guests,
        bookingId: data.name,
        bookingStatus,
      };
    };

    try {
      const roomData = await FirebaseAPI.fetchRoomById(roomNumber);
      const { bookedDates } = Object.values(roomData.data)[0];
      const reservedDates = sortDates(
        Object.values(bookedDates ?? {})
          .map((item) => item.dates)
          .map(({ from, to }) => {
            return [getDateFromString(from), getDateFromString(to)];
          })
      );

      const previousDateRange = reservedDates.findIndex(
        (item, index, array) => {
          if (array.length > 1) {
            return array[index + 1]
              ? item[1] <= getDateFromString(dates.from) &&
                  array[index + 1][0] >= getDateFromString(dates.to)
              : item[1] >= getDateFromString(dates.from);
          }

          return item[1] <= getDateFromString(dates.from);
        }
      );

      if (!reservedDates.length) {
        return await createRoomBooking();
      }

      if (getDateFromString(dates.to) <= reservedDates[0][0]) {
        return await createRoomBooking();
      }

      if (
        getDateFromString(dates.from) >=
        reservedDates[reservedDates.length - 1][1]
      ) {
        return await createRoomBooking();
      }

      if (
        previousDateRange !== -1 &&
        reservedDates[previousDateRange + 1] &&
        getDateFromString(dates.to) <= reservedDates[previousDateRange + 1][0]
      ) {
        return await createRoomBooking();
      }
      return rejectWithValue(
        'На данный период проживания комната уже забронирована'
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Бронирование не подтверждено');
    }
  }
);

const slice = createSlice({
  name: NAMESPACE,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(makeBooking.fulfilled, (state, { payload }) => {
        state.status = 'resolved';
        state.booking.push(payload);
        state.errorMessage = null;
      })
      .addCase(makeBooking.pending, (state, { payload }) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(makeBooking.rejected, (state, { payload }) => {
        state.status = 'rejected';
        if (typeof payload === 'string') {
          state.errorMessage = payload;
        }
      });
  },
});

const bookingReducer = slice.reducer;

export { bookingReducer, initialState };
