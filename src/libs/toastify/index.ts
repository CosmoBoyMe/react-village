import { toast } from 'react-toastify';

import { AuthErrorMessages } from '../../shared/constants/AuthErrorMessages';
import { AxiosErrorMessages } from '../../shared/constants/AxiosErrorMessages';
import { BookingErrorMessages } from '../../shared/constants/BookingErrorMessages';

type PromiseType = 'success' | 'error';

const errorMessages = {
  [AuthErrorMessages.EMAIL_EXISTS]: 'Пользователь с таким email уже существует',
  [AuthErrorMessages.EMAIL_NOT_FOUND]: 'Пользователь с таким email не найден',
  [AuthErrorMessages.INVALID_PASSWORD]: 'Введен неверный пароль',
  [AuthErrorMessages.MISSING_PASSWORD]: 'Необходимо ввести пароль',
  [AuthErrorMessages.WEAK_PASSWORD]:
    'Пароль должен состоять из 6 символов или более',
  [AuthErrorMessages.TOKEN_EXPIRED]:
    'Учетные данные устарели, необходимо заново авторизоваться',
  [AuthErrorMessages.INVALID_ID_TOKEN]:
    'Учетные данные устарели, необходимо заново авторизоваться',
  [AuthErrorMessages.USER_NOT_FOUND]: 'Пользователь с такими данными не найден',
  [AuthErrorMessages.INVALID_REFRESH_TOKEN]:
    'Учетные данные устарели, необходимо заново авторизоваться',
  [AuthErrorMessages.TOO_MANY_ATTEMPTS_TRY_LATER]:
    'Слишком много запросов, попробуйте позже',
  [AuthErrorMessages.CREDENTIAL_TOO_OLD_LOGIN_AGAIN]:
    'Учетные данные устарели, необходимо заново авторизоваться',
  [AxiosErrorMessages.NETWORK_ERROR]: 'Произошла ошибка, попробуйте позже',
  [BookingErrorMessages.NO_BOOKING_FOR_THIS_USER]:
    'У вас нет бронирования этого номера',
  [BookingErrorMessages.BOOKINGS_NOT_FOUND]: 'Бронирования не найдены',
};

const setPromiseAlert = (toastId: string, text: string) => {
  toast(text, {
    toastId,
    isLoading: true,
    draggable: false,
    closeButton: false,
    theme: 'colored',
  });
};

const updatePromiseAlert = (
  toastId: string,
  type: PromiseType,
  text: string
) => {
  let message = text;
  let errorType = text;

  if (text.includes(':')) {
    errorType = text.split(':')[0].trim();
  }

  if (errorMessages[errorType as keyof typeof errorMessages])
    message = errorMessages[errorType as keyof typeof errorMessages];

  toast.update(toastId, {
    render: message,
    type,
    autoClose: 5000,
    hideProgressBar: true,
    isLoading: false,
  });
};

export { AxiosErrorMessages, setPromiseAlert, updatePromiseAlert };
