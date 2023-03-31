import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { BookingForm } from '../../components/BookingForm/BookingForm';
import { BulletList } from '../../components/BulletList/BulletList';
import { FeatureList } from '../../components/FeatureList/FeatureList';
import { FeedbackForm } from '../../components/FeedbackForm/FeedbackForm';
import { FeedbackList } from '../../components/FeedbackList/FeedbackList';
import { ImageSlider } from '../../components/ImageSlider/ImageSlider';
import { Loader } from '../../components/Loader/Loader';
import { Modal } from '../../components/Modal/Modal';
import { PieChart } from '../../components/PieChart/PieChart';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setPromiseAlert, updatePromiseAlert } from '../../libs/toastify';
import { FEEDBACK_DECLENSIONS } from '../../shared/constants/feedbackDeclensions';
import { WindowSizes } from '../../shared/constants/WindowSizes';
import { getDateFromString } from '../../shared/helpers/getDateFromString/getDateFromString';
import { getWordDeclension } from '../../shared/helpers/getWordDeclension/getWordDeclension';
import { throttle } from '../../shared/helpers/throttle/throttle';
import {
  profilePictureUrlSelect,
  userIdSelect,
  userNameSelect,
  userSurnameSelect,
} from '../../store/slices/auth/selectors';
import { filterSelect } from '../../store/slices/filters/selectors';
import {
  bookedDatesSelect,
  feedbackErrorMessageSelect,
  feedbackStatusSelect,
  roomFeedbackSelect,
  roomSelect,
  statusSelect,
} from '../../store/slices/room/selectors';
import {
  addFeedback,
  changeLike,
  fetchRoomById,
} from '../../store/slices/room/slice';

import { ROOM_FEEDBACK_TOAST_ID } from './constants';
import {
  convertInformation,
  convertRules,
  getVotes,
  prepareUrl,
} from './helpers';
import './Room.scss';

const Room: FC = () => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isZoomActive, setIsZoomActive] = useState(
    window.innerWidth < WindowSizes.Medium
  );

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const aboutRoom = useSelector(roomSelect);
  const bookedDates = useSelector(bookedDatesSelect);
  const status = useSelector(statusSelect);
  const filters = useSelector(filterSelect);

  const user = useSelector(userIdSelect);
  const name = useSelector(userNameSelect);
  const surname = useSelector(userSurnameSelect);
  const profilePicture = useAppSelector(profilePictureUrlSelect);

  const feedback = Object.entries(useSelector(roomFeedbackSelect) ?? {});

  const feedbackCount = feedback.length;
  const feedbackStatus = useSelector(feedbackStatusSelect);
  const feedbackErrorMessage = useSelector(feedbackErrorMessageSelect);

  const isFeedbackAllowed = bookedDates
    ? Object.entries(bookedDates).find(
        ([, { dates, userId }]) =>
          getDateFromString(dates.to) <= new Date() && userId === user
      )
    : false;

  useEffect(() => {
    const handleWindowResize = () => {
      setIsZoomActive(window.innerWidth < WindowSizes.Medium);
      if (isModalActive && window.innerWidth >= WindowSizes.Medium)
        setIsModalActive(!isModalActive);
    };

    const throttledHandleWindowResize = throttle(handleWindowResize, 250);
    window.addEventListener('resize', throttledHandleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isModalActive, isZoomActive]);

  useEffect(() => {
    dispatch(fetchRoomById(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    switch (feedbackStatus) {
      case 'loading':
        setPromiseAlert(ROOM_FEEDBACK_TOAST_ID, 'Сохранение комментария...');
        break;
      case 'resolved':
        updatePromiseAlert(
          ROOM_FEEDBACK_TOAST_ID,
          'success',
          'Комментарий опубликован'
        );
        break;
      default:
        if (feedbackErrorMessage)
          updatePromiseAlert(
            ROOM_FEEDBACK_TOAST_ID,
            'error',
            feedbackErrorMessage
          );
    }
  }, [feedbackErrorMessage, feedbackStatus]);

  const votes = getVotes(Object.values(aboutRoom?.rates ?? {}));

  const handleRoomPreviewClick = () => {
    if (isZoomActive) setIsModalActive(true);
  };

  const handleFeedbackSubmit = (text: string, path = '') => {
    if (user && name && surname && id)
      dispatch(
        addFeedback({
          roomNumber: id,
          text,
          profilePicture: profilePicture ?? undefined,
          path: path ? prepareUrl(path) : 'feedback',
          userId: user,
          date: new Date(),
          userName: `${name} ${surname}`,
        })
      );
  };

  const handleFeedbackLike = (isLiked: boolean, path = '') => {
    const url = path ? prepareUrl(path, 'like') : 'likes';

    if (user && id && isLiked === true)
      dispatch(
        changeLike({
          roomNumber: id,
          path: url,
          userId: user,
          isLiked,
        })
      );

    if (user && id && isLiked === false)
      dispatch(
        changeLike({
          roomNumber: id,
          path: url,
          userId: user,
          isLiked,
        })
      );
  };

  return (
    <main className="room">
      {status === 'loading' && (
        <div className="room__loader">
          <Loader />
        </div>
      )}
      {status === 'rejected' && (
        <div className="room__error-message">
          произошла ошибка, повторите попытку позже
        </div>
      )}
      {status === 'resolved' && !aboutRoom && (
        <div className="room__error-message">данные о комнате не найдены</div>
      )}
      {status === 'resolved' && aboutRoom && (
        <>
          <button
            type="button"
            className={classNames('room__preview', {
              room__preview_zooming: isZoomActive,
            })}
            onClick={handleRoomPreviewClick}
          >
            {aboutRoom.imagesDetailed.map((path, index) => (
              <img
                key={path}
                src={path}
                className={classNames('room__preview-img', {
                  'room__preview-img_grid-area_first': index === 0,
                  'room__preview-img_grid-area_second': index === 1,
                  'room__preview-img_grid-area_third': index === 2,
                })}
                alt="комната отеля"
              />
            ))}
          </button>
          <Modal
            isActive={isModalActive}
            isPositionTop
            onClickClose={() => {
              setIsModalActive(!isModalActive);
            }}
          >
            <ImageSlider imgsSrc={aboutRoom.imagesDetailed} />
          </Modal>
          <section
            className={classNames('room__container', {
              'room__container_no-votes': !votes.length,
            })}
          >
            <div className="room__information">
              <h2 className="room__information-title">Сведения о номере</h2>
              <FeatureList
                featureItems={convertInformation(aboutRoom.information)}
              />
            </div>

            {!!votes.length && (
              <div className="room__votes">
                <h2 className="room__votes-title">Впечатления от номера</h2>
                <PieChart items={votes} />
              </div>
            )}

            <div className="room__booking-form">
              <BookingForm
                price={aboutRoom.price}
                roomNumber={aboutRoom.roomNumber}
                isLux={aboutRoom.isLux}
                selectedDate={filters.selectedDates}
                bookedDates={aboutRoom.bookedDates}
                guestItems={filters.capacity.items}
                userId={user}
              />
            </div>
            <div className="room__feedback">
              <h2 className="room__feedback-title">
                Отзывы посетителей номера
              </h2>
              {!!feedbackCount && (
                <span className="room__feedback-count">
                  {`${feedbackCount} ${getWordDeclension(
                    feedbackCount,
                    FEEDBACK_DECLENSIONS
                  )}`}
                </span>
              )}
              <div className="room__feedback-list">
                {feedback.length ? (
                  <FeedbackList
                    userId={user ?? ''}
                    feedbackItems={feedback}
                    path="/"
                    isReplyAllowed={user !== null}
                    withMargin
                    onSubmit={handleFeedbackSubmit}
                    onClick={handleFeedbackLike}
                  />
                ) : (
                  <span>
                    Еще никто не оставил отзыв
                    {isFeedbackAllowed && <span>, станьте первым</span>}
                  </span>
                )}
                {user && isFeedbackAllowed && (
                  <div className="room__feedback-form">
                    <FeedbackForm
                      onSubmit={handleFeedbackSubmit}
                      title="Отправить отзыв"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="room__rules">
              <h2 className="room__rules-title">Правила</h2>
              <BulletList listItems={convertRules(aboutRoom.details)} />
            </div>
            <div className="room__cancel">
              <h2 className="room__cancel-title">Отмена</h2>
              <p className="room__cancel-text">
                Бесплатная отмена в течение 48 ч. После этого при отмене не
                позднее чем за 5 дн. до прибытия вы получите полный возврат за
                вычетом сбора за услуги.
              </p>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export { Room };
