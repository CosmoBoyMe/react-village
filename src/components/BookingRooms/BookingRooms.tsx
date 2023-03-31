import { FC, useEffect, useRef, useState } from 'react';

import { sumConfirmedRooms } from '../../pages/Profile/helpers';
import { BookingErrorMessages } from '../../shared/constants/BookingErrorMessages';
import {
  ITEMS_PER_PAGE,
  ITEMS_PER_PAGE_MEDIUM,
} from '../../shared/constants/paginationItems';
import { WindowSizes } from '../../shared/constants/WindowSizes';
import { getRating } from '../../shared/helpers/getRating/getRating';
import { hasBookingDateExpired } from '../../shared/helpers/hasBookingDateExpired/hasBookingDateExpired';
import { throttle } from '../../shared/helpers/throttle/throttle';
import { BookingRoom } from '../../store/slices/profile/slice';
import { Message } from '../../types/Message';
import { Status } from '../../types/Status';
import { Loader } from '../Loader/Loader';
import { Pagination } from '../Pagination/Pagination';
import { RoomBookingCard } from '../RoomBookingCard/RoomBookingCard';
import { Tabs } from '../Tabs/Tabs';

import { TABS_BUTTONS_DATA, TabsProfileId } from './constants';
import './BookingRooms.scss';

type Props = {
  rooms: BookingRoom[];
  status: Status;
  errorMessage: Message;
  isRatingActive?: boolean;
  onClickRate?: (id: string, value: number) => void;
};

const BookingRooms: FC<Props> = ({
  rooms,
  status,
  errorMessage,
  isRatingActive = true,
  onClickRate,
}) => {
  const bookingRoomsHeaderRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState(TabsProfileId.ALL);
  const [page, setPage] = useState(1);
  const [confirmedRooms, setConfirmedRooms] = useState(0);
  const [roomsPerPage, setRoomsPerPage] = useState(
    window.innerWidth <= WindowSizes.Medium
      ? ITEMS_PER_PAGE_MEDIUM
      : ITEMS_PER_PAGE
  );

  const filteredRooms =
    filter === TabsProfileId.ALL
      ? rooms
      : rooms.filter((room) => {
          const { from, to } = room.dates;
          const dateFrom = new Date(from.split('.').reverse().join('.'));
          const dateTo = new Date(to.split('.').reverse().join('.'));
          const currentDate = new Date();

          if (filter === TabsProfileId.PAST) {
            if (currentDate > dateTo) {
              return room;
            }
          }

          if (filter === TabsProfileId.CURRENT) {
            if (currentDate >= dateFrom && currentDate <= dateTo) {
              return room;
            }
          }

          if (filter === TabsProfileId.FUTURE) {
            if (currentDate < dateFrom) {
              return room;
            }
          }

          return false;
        });

  const indexFrom = (page - 1) * roomsPerPage;
  const indexTo = page * roomsPerPage;

  const scrollToBookingRooms = () => {
    window.scrollTo(0, Number(bookingRoomsHeaderRef.current?.scrollHeight));
  };

  const handlePaginationPageClick = (pageNumber: number) => {
    setPage(pageNumber);
    setTimeout(() => scrollToBookingRooms(), 0);
  };

  const handleTabsOnChange = (id: TabsProfileId) => {
    setFilter(id);
    setPage(1);
  };

  useEffect(() => {
    setConfirmedRooms(sumConfirmedRooms(filteredRooms));
  }, [filteredRooms]);

  useEffect(() => {
    let roomPerPageIsChanged = window.innerWidth <= WindowSizes.Medium;

    const handleWindowResize = () => {
      if (window.innerWidth <= WindowSizes.Medium) {
        setRoomsPerPage(ITEMS_PER_PAGE_MEDIUM);

        if (!roomPerPageIsChanged) {
          setPage(page * 2 - 1);
          roomPerPageIsChanged = true;
        }
      } else {
        setRoomsPerPage(ITEMS_PER_PAGE);

        if (roomPerPageIsChanged) {
          setPage(Math.ceil(page / 2));
          roomPerPageIsChanged = false;
        }
      }
    };

    const throttledHandleWindowResize = throttle(handleWindowResize, 250);

    window.addEventListener('resize', throttledHandleWindowResize);

    return () => {
      window.removeEventListener('resize', throttledHandleWindowResize);
    };
  }, [page]);

  return (
    <div className="booking-rooms">
      <div className="booking-rooms__header" ref={bookingRoomsHeaderRef}>
        <h3 className="booking-rooms__header-title">Забронированные номера</h3>
        <div className="booking-rooms__header-tabs">
          <Tabs
            items={TABS_BUTTONS_DATA}
            activeItem={filter}
            onChange={handleTabsOnChange}
          />
        </div>
      </div>
      {status === 'loading' && (
        <div className="booking-rooms__loader">
          <Loader />
        </div>
      )}
      {status === 'resolved' && filteredRooms.length === 0 && (
        <p className="booking-rooms__error-message">У вас нет бронирований</p>
      )}
      {status === 'rejected' &&
        errorMessage === BookingErrorMessages.BOOKINGS_NOT_FOUND && (
          <p className="booking-rooms__error-message">У вас нет бронирований</p>
        )}
      {status === 'rejected' &&
        errorMessage !== BookingErrorMessages.BOOKINGS_NOT_FOUND && (
          <p className="booking-rooms__error-message">
            Произошла ошибка, повторите позже
          </p>
        )}
      {status === 'resolved' && filteredRooms.length > 0 && (
        <>
          <div className="booking-rooms__rooms">
            {filteredRooms
              .slice(indexFrom, indexTo)
              .map(
                ({
                  roomNumber,
                  price,
                  feedback,
                  rates,
                  images,
                  isLux,
                  bookingId,
                  totalAmount,
                  bookingStatus,
                  dates,
                  guests,
                }) => (
                  <RoomBookingCard
                    key={bookingId}
                    id={String(roomNumber)}
                    roomNumber={roomNumber}
                    price={price}
                    feedbackCount={Object.values(feedback ?? {}).length}
                    rateNumber={getRating(rates)}
                    imgsSrc={images}
                    totalAmount={totalAmount}
                    bookingStatus={bookingStatus}
                    bookingId={bookingId}
                    isLux={isLux}
                    bookedDates={dates}
                    isRatingActive={
                      hasBookingDateExpired(dates.to) && isRatingActive
                    }
                    onClickRate={onClickRate}
                    guests={guests}
                  />
                )
              )}
          </div>
          <div className="booking-rooms__bookings">
            <p className="booking-rooms__bookings-title">Подтверждено броней</p>
            <h3 className="booking-rooms__bookings-count">
              {`${confirmedRooms} / ${filteredRooms.length}`}
            </h3>
          </div>
          {filteredRooms.length > roomsPerPage && (
            <div className="booking-rooms__pagination">
              <Pagination
                totalRooms={filteredRooms.length}
                itemsPerPage={roomsPerPage}
                text="забронированных номеров"
                currentPageNumber={page}
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
