import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { FirebaseAPI } from '../../../FirebaseAPI';
import { RoomData } from '../../../types/RoomData';
import { Status } from '../../../types/Status';

type InitialState = {
  rooms: RoomData[];
  roomsAmount: number;
  activePageNumber: number;
  status: Status;
  errorMessage: string | null;
};

export const initialState: InitialState = {
  rooms: [],
  roomsAmount: 0,
  activePageNumber: 1,
  status: 'idle',
  errorMessage: null,
};

const NAMESPACE = 'rooms';

export const fetchRooms = createAsyncThunk<
  RoomData[],
  void,
  { rejectValue: string }
>(`${NAMESPACE}/fetchRooms`, async (_, { rejectWithValue }) => {
  try {
    const { data } = await FirebaseAPI.fetchRooms();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unexpected error occurred');
  }
});

const slice = createSlice({
  name: NAMESPACE,
  initialState,

  reducers: {
    setActivePageNumber(state, { payload }: PayloadAction<number>) {
      state.activePageNumber = payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.fulfilled, (state, { payload }) => {
        state.status = 'resolved';
        state.rooms = payload;
        state.roomsAmount = payload.length;
        state.errorMessage = null;
      })
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(fetchRooms.rejected, (state, { payload }) => {
        state.status = 'rejected';
        if (payload) state.errorMessage = payload;
        else state.errorMessage = 'An unexpected error occurred';
      });
  },
});

const { setActivePageNumber } = slice.actions;
const roomsReducer = slice.reducer;

export { roomsReducer, setActivePageNumber };
