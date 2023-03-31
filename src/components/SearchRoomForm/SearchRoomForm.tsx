import { FC, FormEvent, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { SCREENS } from '../../routes/endpoints';
import { filterSelect } from '../../store/slices/filters/selectors';
import { filtersActions } from '../../store/slices/filters/slice';
import { roomsSelect } from '../../store/slices/rooms/selectors';
import { fetchRooms } from '../../store/slices/rooms/slice';
import { DropdownGuestsItemData } from '../../types/DropdownItemData';
import { DateDropdown } from '../DateDropdown/DateDropdown';
import { DropdownGuests } from '../DropdownGuests/DropdownGuests';
import { SubmitButton } from '../SubmitButton/SubmitButton';

import './SearchRoomForm.scss';

const SearchRoomForm: FC = () => {
  const rooms = useAppSelector(roomsSelect);
  const { capacity, selectedDates } = useAppSelector(filterSelect);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (rooms.length === 0) {
      dispatch(fetchRooms());
    }
  }, [dispatch, rooms]);

  useEffect(() => {
    dispatch(filtersActions.syncFilters(rooms));
  }, [rooms, dispatch]);

  const handleDateDropdownSelect = useCallback(
    (date: Date[]) => {
      dispatch(filtersActions.updateSelectedDate(date));
    },
    [dispatch]
  );

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(SCREENS.SEARCH_ROOMS);
  };

  const handleGuestDropdownChange = (items: DropdownGuestsItemData[]) => {
    dispatch(filtersActions.updateCapacity(items));
  };

  return (
    <form onSubmit={handleFormSubmit} className="search-rooms-form">
      <h1 className="search-rooms-form__title">
        Найдём номера под ваши пожелания
      </h1>
      <div className="search-rooms-form__calendar">
        <DateDropdown
          hasTwoInputs
          onSelect={handleDateDropdownSelect}
          selectedDates={selectedDates}
        />
      </div>
      <div className="search-rooms-form__dropdown">
        <DropdownGuests
          items={capacity.items}
          onChange={handleGuestDropdownChange}
          guestsLimit={capacity.guestsLimit}
          babiesLimit={capacity.babiesLimit}
        />
      </div>
      <SubmitButton text="подобрать номер" />
    </form>
  );
};

export { SearchRoomForm };
