import { DropdownGuestsIds } from '../../shared/constants/DropdownGuestsIds';
import {
  Availability,
  Convenience,
  Rules,
} from '../../store/slices/filters/types';
import {
  DropdownGuestsItemData,
  DropdownItemData,
} from '../../types/DropdownItemData';
import type { RoomData } from '../../types/RoomData';

const hasRoomAllSelectedRules = (room: RoomData, rules: Rules) => {
  const selectedRules = rules.filter((item) => item.isChecked);
  return selectedRules.every(
    (item) =>
      Object.hasOwn(room.details, item.name) &&
      room.details[item.name as keyof typeof room.details]
  );
};

const hasRoomSelectedAvailability = (
  room: RoomData,
  availability: Availability
) => {
  const selectedAvailability = availability.filter((item) => item.isChecked);
  return selectedAvailability.every(
    (item) =>
      Object.hasOwn(room.details, item.name) &&
      room.details[item.name as keyof typeof room.details]
  );
};

const hasRoomSelectedConvenience = (
  room: RoomData,
  convenience: Convenience
) => {
  const selectedConvenience = convenience.filter((item) => item.isChecked);
  return selectedConvenience.every(
    (item) =>
      Object.hasOwn(room.details, item.name) &&
      room.details[item.name as keyof typeof room.details]
  );
};

const hasRoomSelectedDates = (room: RoomData, selectedDates: Date[]) => {
  const { reservedDates } = room;
  const selectedFromDate = selectedDates[0];
  const selectedToDate = selectedDates[1];
  for (let i = 0; i < reservedDates.length - 1; i += 1) {
    const { from, to } = reservedDates[i];
    if (
      new Date(from.split('.').reverse().join('.')) >= selectedFromDate &&
      new Date(from.split('.').reverse().join('.')) < selectedToDate
    ) {
      return false;
    }

    if (
      new Date(to.split('.').reverse().join('.')) > selectedFromDate &&
      new Date(to.split('.').reverse().join('.')) <= selectedToDate
    ) {
      return false;
    }
  }

  return true;
};

const isRoomMatchFurnitureLimit = (
  room: RoomData,
  furniture: DropdownItemData[]
) => {
  for (let i = 0; i < room.furniture.length; i += 1) {
    const currentFurniture = room.furniture[i];
    const foundedFurnitureWithSameId = furniture.find(
      ({ id }) => id === currentFurniture.id
    );
    if (foundedFurnitureWithSameId) {
      if (foundedFurnitureWithSameId?.amount > currentFurniture.limit) {
        return false;
      }
    }
  }
  return true;
};

const isRoomMatchCapacityLimit = (
  room: RoomData,
  capacity: {
    items: DropdownGuestsItemData[];
  }
) => {
  const guestAmount = capacity.items.reduce((acc, item) => {
    if (
      item.id === DropdownGuestsIds.ADULTS ||
      item.id === DropdownGuestsIds.CHILDREN
    ) {
      return acc + item.amount;
    }
    return acc;
  }, 0);

  const foundedRoomGuest = room.capacity.find((item) => item.id === 'guest');

  if (foundedRoomGuest) {
    if (foundedRoomGuest.limit < guestAmount) {
      return false;
    }
  }

  const foundedBabies = capacity.items.find(
    (item) => item.id === DropdownGuestsIds.BABIES
  );
  const foundedRoomBabies = room.capacity.find((item) => item.id === 'baby');

  if (foundedRoomBabies && foundedBabies) {
    if (foundedRoomBabies.limit < foundedBabies.amount) {
      return false;
    }
  }

  return true;
};

const isRoomPassToPrice = (
  room: RoomData,
  price: { to: number; from: number }
) => room.price > price.to || price.from > room.price;

export {
  hasRoomAllSelectedRules,
  hasRoomSelectedAvailability,
  hasRoomSelectedConvenience,
  hasRoomSelectedDates,
  isRoomMatchCapacityLimit,
  isRoomMatchFurnitureLimit,
  isRoomPassToPrice,
};
