import { FC, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setPromiseAlert, updatePromiseAlert } from '../../libs/toastify';
import {
  authErrorSelect,
  authStatusSelect,
} from '../../store/slices/auth/selectors';
import { changePassword } from '../../store/slices/auth/slice';
import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

import {
  CHANGE_PASSWORD_FORM_TOAST_ID,
  ChangePasswordFormNames,
} from './constants';
import { ChangePasswordFormSchema } from './helpers';
import './ChangePasswordForm.scss';

type FormValues = {
  [ChangePasswordFormNames.Password]: string;
  [ChangePasswordFormNames.NewPassword]: string;
  [ChangePasswordFormNames.PasswordConfirm]: string;
};

const ChangePasswordForm: FC = () => {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(authStatusSelect);
  const authError = useAppSelector(authErrorSelect);
  const {
    handleSubmit,
    control,
    formState: { submitCount, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(ChangePasswordFormSchema),
  });

  useEffect(() => {
    if (authStatus === 'loading') {
      setPromiseAlert(CHANGE_PASSWORD_FORM_TOAST_ID, 'Изменение пароля...');
    } else if (authStatus === 'rejected') {
      const errorMessage =
        typeof authError === 'string' ? authError : authError?.message;

      if (errorMessage)
        updatePromiseAlert(
          CHANGE_PASSWORD_FORM_TOAST_ID,
          'error',
          errorMessage
        );
    } else if (authStatus === 'resolved') {
      updatePromiseAlert(
        CHANGE_PASSWORD_FORM_TOAST_ID,
        'success',
        'Пароль успешно изменен'
      );
    }
  }, [authStatus, authError]);

  const handleFormSubmit: SubmitHandler<FormValues> = ({
    password,
    newPassword,
  }) => {
    dispatch(
      changePassword({
        password,
        newPassword,
      })
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="change-password-form"
    >
      <h1 className="change-password-form__title">Изменить пароль</h1>
      <div className="change-password-form__field">
        <Controller
          name={ChangePasswordFormNames.Password}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              type="password"
              title="Старый пароль"
              placeholder="Пароль"
              isInvalid={fieldState.invalid}
              value={field.value}
              name={field.name}
              onChange={field.onChange}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>
      <div className="change-password-form__field">
        <Controller
          name={ChangePasswordFormNames.NewPassword}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              type="password"
              title="Новый пароль"
              placeholder="Новый пароль"
              isInvalid={fieldState.invalid}
              value={field.value}
              name={field.name}
              onChange={field.onChange}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>
      <div className="change-password-form__field">
        <Controller
          name={ChangePasswordFormNames.PasswordConfirm}
          control={control}
          render={({ field, fieldState }) => (
            <Input
              type="password"
              title="Подтвердите новый пароль"
              placeholder="Новый пароль"
              isInvalid={fieldState.invalid}
              value={field.value}
              name={field.name}
              onChange={field.onChange}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>
      <SubmitButton
        disabled={(!!submitCount && !isValid) || authStatus === 'loading'}
        text="Сохранить изменения"
      />
    </form>
  );
};

export { ChangePasswordForm };
