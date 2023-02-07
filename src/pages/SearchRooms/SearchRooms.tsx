/* eslint-disable @typescript-eslint/no-floating-promises */
import { FC, useEffect } from 'react';

import { Filters } from '../../components/Filters/Filters';
import { Pagination } from '../../components/Pagination/Pagination';
import { SearchResults } from '../../components/SearchResults/SearchResults';
import { useAppDispatch } from '../../hooks/redux';
import { fetchRoomCards } from '../../store/slices/rooms/slice';

import './SearchRooms.scss';

const SearchRooms: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchRoomCards());
  }, [dispatch]);

  const itemsPerPage = 12;

  return (
    <div className="search-rooms">
      <div className="search-rooms__filters-container">
        <Filters />
      </div>
      <div className="search-rooms__rooms-container">
        <h2 className="search-rooms__title">
          Номера, которые мы для вас подобрали
        </h2>
        <SearchResults />
        <div className="search-rooms__pagination-container">
          <Pagination itemsPerPage={itemsPerPage} />
        </div>
      </div>
    </div>
  );
};

export { SearchRooms };
