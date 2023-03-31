import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DropdownGuestsIds } from '../../../shared/constants/DropdownGuestsIds';
import { FurnitureIds } from '../../../shared/constants/FurnitureIds';
import {
  DropdownGuestsItemData,
  DropdownItemData,
} from '../../../types/DropdownItemData';
import { ParsedSearchParamsOptions } from '../../../types/ParsedSearchParamsOptions';
import { RoomData } from '../../../types/RoomData';

import { Availability, Convenience, Rules } from './types';

export type InitialState = {
  selectedDates: Date[];
  price: null | {
    min: number;
    max: number;
    from: number;
    to: number;
  };
  rules: Rules;
  availability: Availability;
  capacity: {
    items: DropdownGuestsItemData[];
    guestsLimit: number;
    babiesLimit: number;
  };
  furniture: DropdownItemData[];
  convenience: Convenience;
};

export const initialState: InitialState = {
  selectedDates: [],
  price: null,
  rules: [
    { name: 'canSmoke', label: 'Можно курить', isChecked: false },
    { name: 'withPets', label: 'Можно с питомцами', isChecked: false },
    {
      name: 'withGuests',
      label: 'Можно пригласить гостей (до 10 человек)',
      isChecked: false,
    },
  ],

  capacity: {
    items: [
      { id: DropdownGuestsIds.ADULTS, name: 'Взрослые', amount: 0 },
      { id: DropdownGuestsIds.CHILDREN, name: 'Дети', amount: 0 },
      { id: DropdownGuestsIds.BABIES, name: 'Младенцы', amount: 0 },
    ],
    guestsLimit: 0,
    babiesLimit: 0,
  },

  furniture: [
    { id: FurnitureIds.BEDROOMS, name: 'спальни', amount: 0, maxValue: 0 },
    { id: FurnitureIds.BEDS, name: 'кровати', amount: 0, maxValue: 0 },
    {
      id: FurnitureIds.BATHROOMS,
      name: 'ванные комнаты',
      amount: 0,
      maxValue: 0,
    },
  ],

  availability: [
    {
      name: 'withAssistance',
      label: 'Широкий коридор',
      description: 'Ширина коридоров в номере не менее 91 см.',
      isChecked: false,
    },
    {
      name: 'withWideHallway',
      label: 'Помощник для инвалидов',
      description: 'На 1 этаже вас встретит специалист  и проводит до номера.',
      isChecked: false,
    },
  ],

  convenience: [
    { name: 'withBreakfast', label: 'Завтрак', isChecked: false },
    { name: 'withDesk', label: 'Письменный стол', isChecked: false },
    { name: 'withBabyChair', label: 'Стул для кормления', isChecked: false },
    { name: 'withBabyBed', label: 'Кроватка', isChecked: false },
    { name: 'withTV', label: 'Телевизор', isChecked: false },
    { name: 'withShampoo', label: 'Шампунь', isChecked: false },
  ],
};

const slice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    syncFilters: (state, { payload }: PayloadAction<RoomData[]>) => {
      payload.forEach(({ furniture, price, capacity }) => {
        state.furniture.forEach((item) => {
          const foundedFurniture = furniture.find(({ id }) => item.id === id);
          if (foundedFurniture) {
            if (item.maxValue < foundedFurniture.limit) {
              item.maxValue = foundedFurniture.limit;
            }
          }
        });
        capacity.forEach((item) => {
          if (item.id === 'guest') {
            if (item.limit > state.capacity.guestsLimit) {
              state.capacity.guestsLimit = item.limit;
            }
          }
          if (item.id === 'baby') {
            if (item.limit > state.capacity.babiesLimit)
              state.capacity.babiesLimit = item.limit;
          }
        });

        if (state.price === null) {
          state.price = {
            max: price,
            min: price,
            to: price,
            from: price,
          };
        } else if (price > state.price.max) {
          state.price.max = price;
          state.price.to = price;
        } else if (price < state.price.min) {
          state.price.min = price;
          state.price.from = price;
        }
      });
    },

    syncFiltersWithUrl: (
      state,
      { payload }: PayloadAction<ParsedSearchParamsOptions>
    ) => {
      payload.rules.forEach((name) => {
        const foundedRule = state.rules.find((item) => item.name === name);
        if (foundedRule) {
          foundedRule.isChecked = true;
        }
      });

      payload.availability.forEach((name) => {
        const foundedAvailability = state.availability.find(
          (item) => item.name === name
        );
        if (foundedAvailability) {
          foundedAvailability.isChecked = true;
        }
      });

      payload.convenience.forEach((name) => {
        const foundedConvenience = state.convenience.find(
          (item) => item.name === name
        );
        if (foundedConvenience) {
          foundedConvenience.isChecked = true;
        }
      });

      if (state.price) {
        if (payload.price.from && payload.price.from > state.price.min) {
          state.price.from = payload.price.from;
        }
        if (payload.price.to && payload.price.to < state.price.max) {
          state.price.to = payload.price.to;
        }
      }

      payload.capacity.forEach(({ id, amount }) => {
        const foundedCapacity = state.capacity.items.find(
          (item) => item.id === id
        );
        if (foundedCapacity) {
          if (id === DropdownGuestsIds.ADULTS) {
            if (amount > 0 && state.capacity.guestsLimit >= amount) {
              foundedCapacity.amount = amount;
            }
          } else if (id === DropdownGuestsIds.CHILDREN) {
            if (amount > 0 && state.capacity.guestsLimit >= amount) {
              foundedCapacity.amount = amount;
            }
          } else if (id === DropdownGuestsIds.BABIES) {
            if (amount > 0 && state.capacity.babiesLimit >= amount) {
              foundedCapacity.amount = amount;
            }
          }
        }
      });

      payload.furniture.forEach(({ id, amount }) => {
        const foundedCapacity = state.furniture.find((item) => item.id === id);
        if (foundedCapacity) {
          if (amount > 0 && foundedCapacity.maxValue >= amount) {
            foundedCapacity.amount = amount;
          }
        }
      });
      if (payload.selectedDates.length > 0) {
        state.selectedDates = payload.selectedDates;
      }
    },

    updatePrice: (state, { payload }: PayloadAction<number[]>) => {
      if (state.price) {
        const [from, to] = payload;
        state.price.from = from;
        state.price.to = to;
      }
    },

    toggleRule: (state, { payload }: PayloadAction<string>) => {
      const foundedRule = state.rules.find((item) => item.name === payload);
      if (foundedRule) {
        foundedRule.isChecked = !foundedRule.isChecked;
      }
    },

    updateSelectedDate: (state, { payload }: PayloadAction<Date[]>) => {
      state.selectedDates = payload.map((item) => new Date(item));
    },

    toggleConvenience: (state, { payload }: PayloadAction<string>) => {
      const currentConvenienceItem = state.convenience.find(
        (item) => item.name === payload
      );
      if (currentConvenienceItem) {
        currentConvenienceItem.isChecked = !currentConvenienceItem.isChecked;
      }
    },

    toggleAvailability: (state, { payload }: PayloadAction<string>) => {
      const foundedAvailability = state.availability.find(
        (item) => item.name === payload
      );
      if (foundedAvailability) {
        foundedAvailability.isChecked = !foundedAvailability.isChecked;
      }
    },

    updateFurniture: (
      state,
      { payload }: PayloadAction<DropdownItemData[]>
    ) => {
      state.furniture = payload;
    },

    updateCapacity: (
      state,
      { payload }: PayloadAction<DropdownGuestsItemData[]>
    ) => {
      state.capacity.items = payload;
    },
  },
});

export const { reducer: filtersReducer, actions: filtersActions } = slice;
