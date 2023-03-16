import { FC } from 'react';
import classNames from 'classnames';

import { moneyFormat } from '../../shared/helpers/moneyFormat/moneyFormat';

import './CardHeaderInfo.scss';

type Props = {
  roomNumber: number;
  price?: number;
  isLux?: boolean;
  isLarge?: boolean;
};

const CardHeaderInfo: FC<Props> = ({
  roomNumber,
  price = 0,
  isLux = true,
  isLarge = false,
}) => {
  return (
    <div className="card-header-info">
      <div className="card-header-info__room-number">
        <span className="card-header-info__symbol">№</span>
        <span
          className={classNames('card-header-info__number', {
            'card-header-info__number_size_large': isLarge,
          })}
        >
          {roomNumber}
        </span>
        {isLux && <span className="card-header-info__status">люкс</span>}
      </div>
      {!!price && (
        <div className="card-header-info__price">
          <span className="card-header-info__value">
            {moneyFormat.to(price)}
          </span>
          <span className="card-header-info__days">в сутки</span>
        </div>
      )}
    </div>
  );
};

export { CardHeaderInfo };
