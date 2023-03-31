import { ChangeEvent, forwardRef, useEffect } from 'react';
import classNames from 'classnames';

import { dateMask } from '../../libs/inputmask';
import { Message } from '../Message/Message';

import './Input.scss';

type InputTypes = 'email' | 'password' | 'text';

type Props = {
  type?: InputTypes;
  name?: string;
  title?: string;
  hasArrow?: boolean;
  arrowIsRotated?: boolean;
  isSubscribe?: boolean;
  arrowButtonDataType?: string;
  dataType?: string;
  placeholder?: string;
  value?: string;
  readOnly?: boolean;
  spellcheck?: boolean;
  autoComplete?: string;
  hasDateMask?: boolean;
  isLowerCase?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      type = 'text',
      name = '',
      title = '',
      hasArrow = false,
      arrowIsRotated = false,
      isSubscribe = false,
      arrowButtonDataType = '',
      dataType = '',
      placeholder = '',
      value = '',
      readOnly = false,
      spellcheck = false,
      autoComplete = 'off',
      hasDateMask = false,
      isLowerCase = false,
      isInvalid = false,
      errorMessage = '',
      onChange,
    },
    ref
  ) => {
    useEffect(() => {
      if (hasDateMask) {
        dateMask.mask('.js-input_date-masked');
      }
      return () => {
        dateMask.remove();
      };
    }, [hasDateMask]);
    return (
      <div className="input">
        {title && <h3 className="input__heading">{title}</h3>}
        <div className="input__wrapper">
          <input
            ref={ref}
            className={classNames('input__input', {
              'input__input_with-button': isSubscribe,
              input__input_lowercase: isLowerCase,
              'js-input_date-masked': hasDateMask,
              input__input_invalid: isInvalid,
            })}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            data-type={dataType}
            autoComplete={autoComplete}
            spellCheck={spellcheck}
            readOnly={readOnly}
            onChange={onChange}
          />
          {isInvalid && errorMessage && (
            <>
              <button className="input__error-info-button" type="button">
                i
              </button>
              <div className="input__error-message">
                <Message type="invalid" text={errorMessage} />
              </div>
            </>
          )}
          {hasArrow && (
            <button
              type="button"
              className={classNames('input__arrow-button', 'material-icons', {
                'input__arrow-button_rotate': arrowIsRotated,
              })}
              data-type={arrowButtonDataType}
            >
              expand_more
            </button>
          )}
          {isSubscribe && (
            <button type="submit" className="input__button material-icons">
              arrow_forward
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
