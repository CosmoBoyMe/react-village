import { FC, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { DropdownGuestsIds } from '../../shared/constants/DropdownGuestsIds';
import { ITEMS_PER_PAGE } from '../../shared/constants/paginationItems';
import { getRating } from '../../shared/helpers/getRating/getRating';
import { filterSelect } from '../../store/slices/filters/selectors';
import {
  activePageNumberSelect,
  roomsSelect,
} from '../../store/slices/rooms/selectors';
import { setActivePageNumber } from '../../store/slices/rooms/slice';
import { RoomData } from '../../types/RoomData';
import { Pagination } from '../Pagination/Pagination';
import { RoomCard } from '../RoomCard/RoomCard';

import './Rooms.scss';

const Rooms: FC = () => {
  const dispatch = useAppDispatch();
  const rooms = useSelector(roomsSelect);
  const {
    rules,
    price,
    convenience,
    availability,
    furniture,
    capacity,
    selectedDates,
  } = useAppSelector(filterSelect);
  const currentPage = useSelector(activePageNumberSelect);

  const indexFrom = (currentPage - 1) * ITEMS_PER_PAGE;
  const indexTo = currentPage * ITEMS_PER_PAGE;

  const handlePaginationPageClick = (pageNumber: number) => {
    dispatch(setActivePageNumber(pageNumber));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    dispatch(setActivePageNumber(1));
  }, [
    rules,
    price,
    convenience,
    availability,
    furniture,
    capacity,
    selectedDates,
    dispatch,
  ]);

  const filteredRooms: RoomData[] = useMemo(
    () =>
      rooms.filter((room) => {
        const selectedRules = rules.filter((item) => item.isChecked);
        const hasRoomAllSelectedRules = selectedRules.every((item) =>
          Object.hasOwn(room.details, item.name)
        );
        if (!hasRoomAllSelectedRules) return false;

        const selectedAvailability = availability.filter(
          (item) => item.isChecked
        );
        const hasRoomSelectedAvailability = selectedAvailability.every((item) =>
          Object.hasOwn(room.details, item.name)
        );
        if (!hasRoomSelectedAvailability) return false;

        const selectedConvenience = convenience.filter(
          (item) => item.isChecked
        );
        const hasRoomSelectedConvenience = selectedConvenience.every((item) =>
          Object.hasOwn(room.details, item.name)
        );
        if (!hasRoomSelectedConvenience) return false;

        if (price) {
          if (room.price > price.to || price.from > room.price) {
            return false;
          }
        }

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

        const guestAmount = capacity.items.reduce((acc, item) => {
          if (
            item.id === DropdownGuestsIds.ADULTS ||
            item.id === DropdownGuestsIds.CHILDREN
          ) {
            return acc + item.amount;
          }
          return acc;
        }, 0);

        const foundedRoomGuest = room.capacity.find(
          (item) => item.id === 'guest'
        );

        if (foundedRoomGuest) {
          if (foundedRoomGuest.limit < guestAmount) {
            return false;
          }
        }

        const foundedBabies = capacity.items.find(
          (item) => item.id === DropdownGuestsIds.BABIES
        );
        const foundedRoomBabies = room.capacity.find(
          (item) => item.id === 'baby'
        );
        if (foundedRoomBabies && foundedBabies) {
          if (foundedRoomBabies.limit < foundedBabies.amount) {
            return false;
          }
        }

        if (selectedDates.length === 2) {
          const { bookedDates } = room;
          const reservedDates = Object.values(bookedDates ?? {});
          const selectedFromDate = selectedDates[0];
          const selectedToDate = selectedDates[1];
          for (let i = 0; i < reservedDates.length - 1; i += 1) {
            const { from, to } = reservedDates[i].dates;
            if (
              new Date(from.split('.').reverse().join('.')) >=
                selectedFromDate &&
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
        }

        return true;
      }),
    [
      availability,
      capacity,
      convenience,
      furniture,
      price,
      rooms,
      rules,
      selectedDates,
    ]
  );

  return (
    <div className="rooms">
      {!filteredRooms.length && (
        <div className="rooms__error-message">
          нет комнат, соответствующих параметрам поиска
        </div>
      )}
      <div className="rooms__container">
        {filteredRooms.slice(indexFrom, indexTo).map((room) => (
          <RoomCard
            key={room.roomNumber}
            id={String(room.roomNumber)}
            roomNumber={room.roomNumber}
            price={room.price}
            feedbackCount={Object.values(room.feedback ?? {}).length}
            rateNumber={getRating(room.rates)}
            imgsSrc={room.images}
          />
        ))}
      </div>
      {filteredRooms.length > ITEMS_PER_PAGE && (
        <div className="rooms__pagination-container">
          <Pagination
            totalRooms={filteredRooms.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPageNumber={currentPage}
            onClickPage={handlePaginationPageClick}
          />
        </div>
      )}
    </div>
  );
};

export { Rooms };
