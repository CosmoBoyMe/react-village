import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authReducer } from './slices/auth/slice';
import { bookingReducer } from './slices/booking/slice';
import { filtersReducer } from './slices/filters/slice';
import { profileReducer } from './slices/profile/slice';
import { roomReducer } from './slices/room/slice';
import { roomsReducer } from './slices/rooms/slice';

const rootReducer = combineReducers({
  auth: authReducer,
  filters: filtersReducer,
  rooms: roomsReducer,
  room: roomReducer,
  booking: bookingReducer,
  profile: profileReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { rootReducer, store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
