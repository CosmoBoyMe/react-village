import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import defaultAvatar from '../../assets/img/big-default-avatar.jpg';
import { BookingRooms } from '../../components/BookingRooms/BookingRooms';
import { Button } from '../../components/Button/Button';
import { ChangePasswordForm } from '../../components/ChangePasswordForm/ChangePasswordForm';
import { DeleteAccountForm } from '../../components/DeleteAccountForm/DeleteAccountForm';
import { InputEdit } from '../../components/InputEdit/InputEdit';
import { Modal } from '../../components/Modal/Modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setPromiseAlert, updatePromiseAlert } from '../../libs/toastify';
import { SCREENS } from '../../routes/endpoints';
import { moneyFormat } from '../../shared/helpers/moneyFormat/moneyFormat';
import {
  changeProfilePictureErrorMessageSelect,
  changeProfilePictureStatusSelect,
  changeUserNameErrorMessageSelect,
  changeUserNameStatusSelect,
  isAuthSelect,
  profilePictureUrlSelect,
  userIdSelect,
  userNameSelect,
  userSurnameSelect,
} from '../../store/slices/auth/selectors';
import {
  authActions,
  updateProfilePicture,
  updateUserName,
} from '../../store/slices/auth/slice';
import {
  errorMessageSelect,
  profileSelect,
  rateErrorMessageSelect,
  rateStatusSelect,
  statusSelect,
} from '../../store/slices/profile/selectors';
import { fetchBookedRooms, setRate } from '../../store/slices/profile/slice';

import {
  CHANGE_PROFILE_NAME_ID,
  CHANGE_PROFILE_PICTURE_ID,
  SET_RATING,
  validFileTypes,
} from './constants';
import {
  accommodationPriceSum,
  additionalAmountService,
  discountSum,
} from './helpers';
import './Profile.scss';

const Profile: FC = () => {
  const userId = useSelector(userIdSelect);
  const isAuth = useSelector(isAuthSelect);
  const bookedRooms = useAppSelector(profileSelect);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profileStatus = useAppSelector(statusSelect);
  const profileErrorMessage = useAppSelector(errorMessageSelect);
  const profilePictureUrl = useAppSelector(profilePictureUrlSelect);
  const changeProfilePictureStatus = useAppSelector(
    changeProfilePictureStatusSelect
  );
  const changeProfilePictureErrorMessage = useAppSelector(
    changeProfilePictureErrorMessageSelect
  );
  const userName = useAppSelector(userNameSelect);
  const userSurname = useAppSelector(userSurnameSelect);
  const changeUserNameStatus = useAppSelector(changeUserNameStatusSelect);
  const changeUserNameErrorMessage = useAppSelector(
    changeUserNameErrorMessageSelect
  );
  const rateStatus = useAppSelector(rateStatusSelect);
  const rateErrorMessage = useAppSelector(rateErrorMessageSelect);

  const [totalDiscount, setTotalDiscount] = useState(0);
  const [priceAccommodation, setPriceAccommodation] = useState(0);
  const [additionalService, setAdditionalService] = useState(0);

  const [currentModalName, setCurrentModalName] = useState<
    null | 'delete' | 'change'
  >(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchBookedRooms(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    setTotalDiscount(discountSum(bookedRooms));
    setPriceAccommodation(accommodationPriceSum(bookedRooms));
    setAdditionalService(additionalAmountService(bookedRooms));
  }, [bookedRooms]);

  const handleSignOutButtonPointerDown = () => {
    dispatch(authActions.signOut());
    navigate(SCREENS.LANDING);
  };

  const handleEditPhotoInputChange = ({
    currentTarget,
  }: FormEvent<HTMLInputElement>) => {
    const { files } = currentTarget;
    const file = files ? files[0] : null;
    if (file) {
      dispatch(updateProfilePicture(file));
    }
  };

  const handleEditNameInputChange = (text: string) => {
    dispatch(updateUserName({ name: text }));
  };

  const handleEditSurnameInputChange = (text: string) => {
    dispatch(updateUserName({ surname: text }));
  };

  const handleStarIconClick = useCallback(
    async (roomNumber: string, rate: number) => {
      if (userId) {
        await dispatch(
          setRate({
            userId,
            roomNumber,
            rate,
          })
        );
      }
    },
    [dispatch, userId]
  );

  useEffect(() => {
    if (changeProfilePictureStatus === 'loading') {
      setPromiseAlert(
        CHANGE_PROFILE_PICTURE_ID,
        'Подождите идёт загрузка фотографии '
      );
    } else if (changeProfilePictureStatus === 'resolved') {
      updatePromiseAlert(
        CHANGE_PROFILE_PICTURE_ID,
        'success',
        'Фото успешно изменено'
      );
    } else if (changeProfilePictureStatus === 'rejected') {
      const errorMessage =
        typeof changeProfilePictureErrorMessage === 'string'
          ? changeProfilePictureErrorMessage
          : 'Произошла неизвестная ошибка';
      if (errorMessage)
        updatePromiseAlert(CHANGE_PROFILE_PICTURE_ID, 'error', errorMessage);
    }
  }, [changeProfilePictureStatus, dispatch, changeProfilePictureErrorMessage]);

  useEffect(() => {
    if (changeUserNameStatus === 'loading') {
      setPromiseAlert(CHANGE_PROFILE_NAME_ID, 'Происходит изменение имени...');
    } else if (changeUserNameStatus === 'rejected') {
      const errorMessage =
        typeof changeUserNameErrorMessage === 'string'
          ? changeUserNameErrorMessage
          : changeUserNameErrorMessage?.message;

      if (errorMessage)
        updatePromiseAlert(CHANGE_PROFILE_NAME_ID, 'error', errorMessage);
    } else if (changeUserNameStatus === 'resolved') {
      updatePromiseAlert(
        CHANGE_PROFILE_NAME_ID,
        'success',
        'Имя успешно изменено'
      );
    }
  }, [changeUserNameStatus, changeUserNameErrorMessage]);

  useEffect(() => {
    if (rateStatus === 'loading') {
      setPromiseAlert(SET_RATING, 'Происходит изменение рейтинга...');
    } else if (rateStatus === 'rejected') {
      if (rateErrorMessage)
        updatePromiseAlert(SET_RATING, 'error', rateErrorMessage);
    } else if (rateStatus === 'resolved') {
      updatePromiseAlert(SET_RATING, 'success', 'Рейтинг установлен');
    }
  }, [rateStatus, rateErrorMessage]);

  return (
    <main className="profile">
      {isAuth ? (
        <div className="profile__container">
          <div className="profile__about-user">
            <div className="profile__all-about-user">
              <div className="profile__avatar-user-container">
                <img
                  src={profilePictureUrl || defaultAvatar}
                  className="profile__avatar-user"
                  alt="Аватар пользователя"
                />
                <label className="profile__avatar-edit-label">
                  <input
                    disabled={changeProfilePictureStatus === 'loading'}
                    onChange={handleEditPhotoInputChange}
                    className="profile__avatar-edit-input"
                    type="file"
                    accept={validFileTypes.join(', ')}
                  />
                  <span className="material-icons-outlined">edit</span>
                </label>
              </div>
              <div className="profile__user-details">
                <div className="profile__user-name-section">
                  <div className="profile__user-name-paragraph">
                    <h3 className="profile__user-name-caption">Имя</h3>
                    {userName && (
                      <InputEdit
                        value={userName}
                        status={changeUserNameStatus}
                        placeholder="Введите имя"
                        onChange={handleEditNameInputChange}
                      />
                    )}
                  </div>
                  <div className="profile__user-name-paragraph">
                    <h3 className="profile__user-name-caption">Фамилия</h3>
                    {userSurname && (
                      <InputEdit
                        value={userSurname}
                        status={changeUserNameStatus}
                        placeholder="Введите фамилию"
                        onChange={handleEditSurnameInputChange}
                      />
                    )}
                  </div>
                </div>
                <div className="profile__all-expenses">
                  <p className="profile__all-expenses-title">
                    Расходы за все время
                  </p>
                  <div className="profile__expenses-container">
                    <span className="profile__expenses-title">Скидка</span>
                    <span className="profile__discount">
                      {moneyFormat.to(totalDiscount)}
                    </span>
                  </div>
                  <div className="profile__expenses-container">
                    <span className="profile__expenses-title">
                      Дополнительные услуги
                    </span>
                    <span className="profile__additional-services">
                      {moneyFormat.to(additionalService)}
                    </span>
                  </div>
                  <div className="profile__expenses-container">
                    <span className="profile__expenses-title">Проживание</span>
                    <span className="profile__accommodation">
                      {moneyFormat.to(priceAccommodation)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile__function-container">
              <button
                type="button"
                className={classNames(
                  'profile__settings',
                  'material-icons-outlined'
                )}
                onClick={() => {
                  setCurrentModalName('change');
                }}
              >
                settings
              </button>
              <button
                type="button"
                className={classNames('profile__delete', 'material-icons')}
                onClick={() => {
                  setCurrentModalName('delete');
                }}
              >
                delete_outline
              </button>
              <Modal
                isActive={!!currentModalName}
                onClickClose={() => setCurrentModalName(null)}
              >
                {currentModalName === 'delete' ? (
                  <DeleteAccountForm />
                ) : (
                  <ChangePasswordForm />
                )}
              </Modal>
            </div>
          </div>
          <div className="profile__booking-rooms">
            <BookingRooms
              rooms={bookedRooms}
              status={profileStatus}
              errorMessage={profileErrorMessage}
              isRatingActive={rateStatus !== 'loading'}
              onClickRate={handleStarIconClick}
            />
          </div>
          <div className="profile__button-exit-container">
            <Button
              onPointerDown={handleSignOutButtonPointerDown}
              onClick={handleSignOutButtonPointerDown}
              withBorder
              text="Выйти"
            />
          </div>
        </div>
      ) : (
        <Navigate replace to={SCREENS.SIGN_IN} />
      )}
    </main>
  );
};

export { Profile };
