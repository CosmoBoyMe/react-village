import { FC, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import { SCREENS } from '../../routes/endpoints';
import { FEEDBACK_DECLENSIONS } from '../../shared/constants/feedbackDeclensions';
import { getWordDeclension } from '../../shared/helpers/getWordDeclension/getWordDeclension';
import { CardHeaderInfo } from '../CardHeaderInfo/CardHeaderInfo';
import { ImageSlider } from '../ImageSlider/ImageSlider';
import { Rate } from '../Rate/Rate';

import './RoomCard.scss';
import 'swiper/swiper.min.css';

export type Props = {
  id: string;
  roomNumber: number;
  price: number;
  feedbackCount: number;
  rateNumber: number;
  imgsSrc: string[];
  isLux?: boolean;
  isRatingActive?: boolean;
  onClickRate?: (id: string, value: number) => void;
};

const RoomCard: FC<Props> = ({
  id,
  roomNumber,
  price,
  feedbackCount,
  imgsSrc,
  rateNumber,
  isLux = false,
  isRatingActive = false,
  onClickRate,
}) => {
  const handleRateWrapperClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRateClick = (value: number) => {
    onClickRate?.(id, value);
  };

  return (
    <div className="room-card" data-testid="room-card">
      <ImageSlider imgsSrc={imgsSrc} />
      <div className="room-card__description">
        <Link
          to={`${SCREENS.ROOM}${id}`}
          className="room-card__description-link"
        >
          <div className="room-card__description-header">
            <CardHeaderInfo
              isLux={isLux}
              price={price}
              roomNumber={roomNumber}
            />
          </div>
          <div className="room-card__description-footer">
            <div
              role="none"
              className="room-card__rate"
              onClick={handleRateWrapperClick}
            >
              <Rate
                rateNumber={rateNumber}
                isActive={isRatingActive}
                onClick={handleRateClick}
              />
            </div>
            <p className="room-card__description-footer-feedback-text">
              <span className="room-card__description-footer-feedback-count">
                {feedbackCount}
              </span>{' '}
              {getWordDeclension(feedbackCount, FEEDBACK_DECLENSIONS)}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export { RoomCard };
