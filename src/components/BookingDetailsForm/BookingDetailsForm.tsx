import { FC, FormEvent } from 'react';

import { DAYS_DECLENSIONS } from '../../shared/constants/daysDeclensions';
import { RoomPrice } from '../../shared/constants/RoomServices';
import { getWordDeclension } from '../../shared/helpers/getWordDeclension/getWordDeclension';
import { moneyFormat } from '../../shared/helpers/moneyFormat/moneyFormat';
import { DropdownGuestsItemData } from '../../types/DropdownItemData';
import { Button } from '../Button/Button';
import { CardHeaderInfo } from '../CardHeaderInfo/CardHeaderInfo';

import { GUESTS_DECLENSIONS } from './constants';
import './BookingDetailsForm.scss';

type Props = {
  price: number;
  roomNumber: number;
  totalAmount: number;
  days: number;
  dates: {
    from: string;
    to: string;
  };
  guests: DropdownGuestsItemData[];
  isLux?: boolean;
  onSubmit?: () => void;
};

const BookingDetailsForm: FC<Props> = ({
  price,
  roomNumber,
  totalAmount,
  days,
  dates,
  guests,
  isLux = false,
  onSubmit,
}) => {
  const { discountServices, extraServices } = RoomPrice;
  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.();
  };
  return (
    <form onSubmit={handleFormSubmit} className="booking-details-form">
      <div className="booking-details-form__about">
        <CardHeaderInfo isLux={isLux} roomNumber={roomNumber} isLarge />
      </div>

      <div className="booking-details-form__services">
        <div className="booking-details-form__description">
          <p className="booking-details-form__text">
            {`с ${dates.from} по ${dates.to} `}
          </p>
        </div>
        <span className="booking-details-form__price">
          {`${days} ${getWordDeclension(days, DAYS_DECLENSIONS)}`}
        </span>

        <div
          className={`booking-details-form__description
          booking-details-form__description_wide`}
        >
          <p className="booking-details-form__text">
            {`${moneyFormat.to(price)} в сутки на день бронирования`}
          </p>
        </div>

        <div className="booking-details-form__description">
          <p className="booking-details-form__text">
            {`${moneyFormat.to(price)} x ${days} ${getWordDeclension(
              days,
              DAYS_DECLENSIONS
            )} `}
          </p>
        </div>
        <span className="booking-details-form__price">
          {moneyFormat.to(price * days)}
        </span>
        <div
          className={`booking-details-form__description
          booking-details-form__description_wide`}
        >
          <div className="booking-details-form__text">
            Гостей
            {guests.map(
              (item) =>
                !!item.amount && (
                  <div className="booking-details-form__guests" key={item.id}>
                    <span className="booking-details-form__guest-name">
                      {`${getWordDeclension(
                        item.amount,
                        GUESTS_DECLENSIONS[item.id]
                      )}`}
                    </span>
                    <span className="booking-details-form__guest-amount">
                      {item.amount}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>

        <div className="booking-details-form__description">
          <p className="booking-details-form__services-description-text">
            Скидка
          </p>
        </div>
        <span className="booking-details-form__price">
          {moneyFormat.to(discountServices)}
        </span>
        <div className="booking-details-form__description">
          <p className="booking-details-form__text">Дополнительные услуги</p>
        </div>
        <span className="booking-details-form__price">
          {moneyFormat.to(extraServices)}
        </span>
      </div>
      <div className="booking-details-form__result">
        Итого
        <span className="booking-details-form__result-line" />
        <span className="booking-details-form__result-price">
          {moneyFormat.to(totalAmount)}
        </span>
      </div>

      <Button withBackground text="закрыть" onClick={handleFormSubmit} />
    </form>
  );
};

export { BookingDetailsForm };
