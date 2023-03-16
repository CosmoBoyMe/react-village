import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setPromiseAlert, updatePromiseAlert } from '../../libs/toastify';
import { moneyFormat } from '../../shared/helpers/moneyFormat/moneyFormat';
import { userIdSelect } from '../../store/slices/auth/selectors';
import {
  errorMessageSelect,
  statusSelect,
} from '../../store/slices/profile/selectors';
import { removeUserBooking } from '../../store/slices/profile/slice';
import { Button } from '../Button/Button';
import { Props as RoomCardProps, RoomCard } from '../RoomCard/RoomCard';

import { hasBookingDateExpired } from './helpers';
import './RoomBookingCard.scss';

type RoomBookingProps = {
  bookedDates: { from: string; to: string };
  totalAmount: number;
  bookingStatus: boolean;
  bookingId: string;
  isRatingActive?: boolean;
};

export type Props = RoomCardProps & RoomBookingProps;

const RoomBookingCard: FC<Props> = ({
  id,
  roomNumber,
  price,
  feedbackCount,
  imgsSrc,
  rateNumber,
  bookedDates,
  totalAmount,
  bookingStatus,
  bookingId,
  isLux,
  isRatingActive = false,
  onClickRate,
}) => {
  const userId = String(useSelector(userIdSelect));
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(errorMessageSelect);
  const cancelBookingStatus = useAppSelector(statusSelect);
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    switch (cancelBookingStatus) {
      case 'loading':
        setDisabledButton(true);
        break;
      case 'rejected':
        updatePromiseAlert(bookingId, 'error', 'Бронирование не отменено');
        setDisabledButton(false);
        break;
      default:
        if (errorMessage) updatePromiseAlert(bookingId, 'error', errorMessage);
        setDisabledButton(false);
    }
  }, [errorMessage, cancelBookingStatus, bookingId]);

  const handleCancelClick = async () => {
    setDisabledButton(true);
    setPromiseAlert(bookingId, 'Отмена брони...');

    await dispatch(
      removeUserBooking({ userId, roomId: bookingId, roomNumber })
    ).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        updatePromiseAlert(bookingId, 'success', 'Бронирование отменено');
      }
    });
  };

  return (
    <div className="room-booking-card">
      <div className="room-booking-card__room-card">
        <RoomCard
          key={roomNumber}
          id={id}
          roomNumber={roomNumber}
          price={price}
          feedbackCount={feedbackCount}
          rateNumber={rateNumber}
          imgsSrc={imgsSrc}
          isLux={isLux}
          isRatingActive={isRatingActive}
          onClickRate={onClickRate}
        />
      </div>
      <div className="room-booking-card__about-booking">
        <div className="room-booking-card__payment-booking">
          <div className="room-booking-card__total-cost-info">
            <div className="room-booking-card__total-cost-title">
              Общая стоимость
            </div>
            <div className="room-booking-card__total-cost">
              {moneyFormat.to(totalAmount)}
            </div>
          </div>
          <div
            className={classNames(
              'room-booking-card__payment-status',
              'material-icons-outlined',
              {
                'room-booking-card__payment-status_confirmed': bookingStatus,
                'room-booking-card__payment-status_rejected': !bookingStatus,
              }
            )}
          >
            {bookingStatus ? 'check_circle' : 'cancel'}
            <div
              className={classNames('room-booking-card__payment-status-tab', {
                'room-booking-card__payment-status-tab_confirmed':
                  bookingStatus,
                'room-booking-card__payment-status-tab_rejected':
                  !bookingStatus,
              })}
            >
              {bookingStatus
                ? 'Бронирование подтверждено'
                : 'Бронирование не подтверждено'}
            </div>
          </div>
        </div>
        <div className="room-booking-card__buttons-reservation">
          <div
            className={classNames('room-booking-card__button-container', {
              'room-booking-card__button-container_extended':
                hasBookingDateExpired(bookedDates.to),
            })}
          >
            <Button withBackground text="Подробнее" />
          </div>
          {!hasBookingDateExpired(bookedDates.to) && (
            <div className="room-booking-card__button-container">
              <Button
                withBorder
                text="Отмена"
                onClick={handleCancelClick}
                disabled={disabledButton}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { RoomBookingCard };
