import { FC } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { BookingErrorMessages } from '../../shared/constants/BookingErrorMessages';
import { ITEMS_PER_PAGE } from '../../shared/constants/paginationItems';
import { getDateFromString } from '../../shared/helpers/getDateFromString/getDateFromString';
import { getRating } from '../../shared/helpers/getRating/getRating';
import {
  errorMessageSelect,
  profileSelect,
  statusSelect,
} from '../../store/slices/profile/selectors';
import { activePageNumberSelect } from '../../store/slices/rooms/selectors';
import { setActivePageNumber } from '../../store/slices/rooms/slice';
import { Loader } from '../Loader/Loader';
import { Pagination } from '../Pagination/Pagination';
import { RoomBookingCard } from '../RoomBookingCard/RoomBookingCard';

import './BookingRooms.scss';

type Props = {
  onClickRate?: (id: string, value: number) => void;
};

const BookingRooms: FC<Props> = ({ onClickRate }) => {
  const dispatch = useAppDispatch();
  const currentPage = useSelector(activePageNumberSelect);
  const bookedRooms = useAppSelector(profileSelect);
  const status = useAppSelector(statusSelect);
  const errorMessage = useAppSelector(errorMessageSelect);

  const indexFrom = (currentPage - 1) * ITEMS_PER_PAGE;
  const indexTo = currentPage * ITEMS_PER_PAGE;

  const handlePaginationPageClick = (pageNumber: number) => {
    dispatch(setActivePageNumber(pageNumber));
  };

  return (
    <div className="booking-rooms">
      {status === 'loading' && (
        <div className="booking-rooms__loader">
          <Loader />
        </div>
      )}
      {status === 'resolved' && bookedRooms.length === 0 && (
        <div className="booking-rooms__error-message">
          У вас нет бронирований
        </div>
      )}
      {status === 'rejected' &&
        errorMessage === BookingErrorMessages.BOOKINGS_NOT_FOUND && (
          <div className="booking-rooms__error-message">
            У вас нет бронирований
          </div>
        )}
      {status === 'rejected' &&
        errorMessage !== BookingErrorMessages.BOOKINGS_NOT_FOUND && (
          <div className="booking-rooms__error-message">
            Произошла ошибка, повторите позже
          </div>
        )}
      {status === 'resolved' && bookedRooms.length > 0 && (
        <>
          <div className="booking-rooms__container">
            {bookedRooms.slice(indexFrom, indexTo).map((room) => (
              <RoomBookingCard
                key={room.bookingId}
                id={String(room.roomNumber)}
                roomNumber={room.roomNumber}
                price={room.price}
                feedbackCount={room.feedbackCount}
                rateNumber={getRating(room.rates)}
                imgsSrc={room.images}
                totalAmount={room.totalAmount}
                bookingStatus={room.bookingStatus}
                bookingId={room.bookingId}
                isLux={room.isLux}
                bookedDates={room.dates}
                isRatingActive={getDateFromString(room.dates.to) <= new Date()}
                onClickRate={onClickRate}
              />
            ))}
          </div>
          {bookedRooms.length > ITEMS_PER_PAGE && (
            <div className="booking-rooms__pagination-container">
              <Pagination
                totalRooms={bookedRooms.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onClickPage={handlePaginationPageClick}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { BookingRooms };
