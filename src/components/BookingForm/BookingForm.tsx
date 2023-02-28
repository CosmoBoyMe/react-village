import { FC, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getFormattedDate } from '../../shared/helpers/getFormattedDate/getFormattedDate';
import { getWordDeclension } from '../../shared/helpers/getWordDeclension/getWordDeclension';
import { moneyFormat } from '../../shared/helpers/moneyFormat/moneyFormat';
import {
  errorMessageSelect,
  statusSelect,
} from '../../store/slices/booking/selectors';
import { makeBooking } from '../../store/slices/booking/slice';
import { DropdownGuestsItemData } from '../../types/DropdownItemData';
import { CardHeaderInfo } from '../CardHeaderInfo/CardHeaderInfo';
import { DateDropdown } from '../DateDropdown/DateDropdown';
import { DropdownGuests } from '../DropdownGuests/DropdownGuests';
import { SubmitButton } from '../SubmitButton/SubmitButton';

import { DAYS_DECLINATIONS, TOAST_ID } from './constants';
import { getDaysBetweenDate } from './helpers';
import './BookingForm.scss';
import 'react-toastify/dist/ReactToastify.css';

const services = 0;
const extraServices = 300;
const discountServices = 2179;
type Props = {
  price: number;
  roomNumber: number;
  isLux: boolean;
  selectedDate: Date[];
  guestItems: DropdownGuestsItemData[];
  userId: string | null;
  sequenceNumber: number;
};

const BookingForm: FC<Props> = ({
  price,
  roomNumber,
  isLux,
  selectedDate,
  guestItems,
  userId,
  sequenceNumber,
}) => {
  const dispatch = useAppDispatch();

  const status = useAppSelector(statusSelect);
  const errorMessage = useAppSelector(errorMessageSelect);

  const ref = useRef<HTMLDialogElement>(null);

  const [isBookingMade, setIsBookingMade] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [days, setDays] = useState(getDaysBetweenDate(selectedDate));
  const [dates, setDates] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });
  const [guests, setGuests] = useState<
    { id: string; name: string; amount: number }[]
  >([]);

  useEffect(() => {
    const handleDocumentClick = (event: PointerEvent) => {
      const targetElement = event.target;
      const currentInstance = ref.current;
      if (!(targetElement instanceof Node) || !currentInstance) {
        return;
      }
      if (currentInstance.contains(targetElement)) {
        return;
      }
      setIsModalActive(false);
    };

    document.addEventListener('pointerdown', handleDocumentClick);
    return () =>
      document.removeEventListener('pointerdown', handleDocumentClick);
  }, []);

  useEffect(() => {
    if (isBookingMade && (status === 'resolved' || status === 'rejected')) {
      setIsModalActive(true);
      setIsBookingMade(false);
    }
  }, [status, isBookingMade]);

  useEffect(() => {
    if (status === 'loading') {
      toast.update(TOAST_ID, {
        render: 'Идёт бронирование ...',
        isLoading: true,
      });

      toast.loading('Идёт бронирование ...', {
        toastId: TOAST_ID,
        draggable: false,
      });
    } else {
      toast.dismiss(TOAST_ID);
    }
  }, [errorMessage, status]);

  let message = '';
  if (status === 'resolved') message = 'Бронирование подтверждено';
  if (status === 'rejected')
    message =
      errorMessage === 'Dates are not available for booking'
        ? 'На данный период проживания комната уже забронирована'
        : 'Бронирование не подтверждено';

  const totalAmount = Math.max(
    0,
    price * days - discountServices - services + extraServices
  );

  const handleDateDropdownOnSelect = useCallback((date: Date[]) => {
    const datesRange = getFormattedDate(date, true);
    setDates({
      from: datesRange[0],
      to: datesRange[1],
    });
    setDays(getDaysBetweenDate(date));
  }, []);

  const handleDropdownOnSelect = useCallback(
    (people: { id: string; name: string; amount: number }[]) => {
      setGuests(people);
    },
    []
  );

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (userId && sequenceNumber !== -1) {
      dispatch(
        makeBooking({
          roomNumber,
          userId,
          discount: 0,
          additionalService: false,
          totalAmount,
          dates,
          guests,
          sequenceNumber,
        })
      );
      setIsBookingMade(true);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="booking-form">
      <dialog
        open={isModalActive}
        ref={ref}
        className={classNames('booking-form__dialog', {
          'booking-form__dialog_status_accepted': status === 'resolved',
          'booking-form__dialog_status_rejected':
            errorMessage === 'Dates are not available for booking',
          'booking-form__dialog_status_declined':
            status === 'rejected' &&
            errorMessage !== 'Dates are not available for booking',
        })}
      >
        {message}
      </dialog>
      <div className="booking-form__about">
        <CardHeaderInfo
          isLux={isLux}
          price={price}
          roomNumber={roomNumber}
          isLarge
        />
      </div>
      <div className="booking-form__calendar">
        <DateDropdown
          hasTwoInputs
          initialDates={selectedDate}
          onSelect={handleDateDropdownOnSelect}
        />
      </div>
      <div className="booking-form__dropdown">
        <DropdownGuests items={guestItems} onChange={handleDropdownOnSelect} />
      </div>
      <div className="booking-form__services">
        <div className="booking-form__services-descriptions">
          <p className="booking-form__services-text">
            {`${moneyFormat.to(price)} x ${days} ${getWordDeclension(
              days,
              DAYS_DECLINATIONS
            )} `}
          </p>
        </div>
        <span className="booking-form__services-price">
          {moneyFormat.to(price * days)}
        </span>
        <div className="booking-form__services-descriptions">
          <p className="booking-form__services-description-text">
            Сбор за услуги: скидка {moneyFormat.to(discountServices)}
          </p>
          <button
            title="Услуги"
            type="button"
            className="booking-form__services-info-button"
          >
            i
          </button>
        </div>
        <span className="booking-form__services-price">
          {moneyFormat.to(services)}
        </span>
        <div className="booking-form__services-descriptions">
          <p className="booking-form__services-text">
            Сбор за дополнительные услуги
          </p>
          <button
            title="Услуги"
            type="button"
            className="booking-form__services-info-button"
          >
            i
          </button>
        </div>
        <span className="booking-form__services-price">
          {moneyFormat.to(extraServices)}
        </span>
      </div>
      <div className="booking-form__result">
        Итого
        <span className="booking-form__result-line" />
        <span className="booking-form__result-price">
          {moneyFormat.to(totalAmount)}
        </span>
      </div>
      <SubmitButton
        disabled={days === 0 || status === 'loading'}
        text="забронировать"
      />
      <ToastContainer position="top-right" />
    </form>
  );
};

export { BookingForm };
