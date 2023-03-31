import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';

import { ButtonEdit } from '../ButtonEdit/ButtonEdit';

import './InputEdit.scss';

type Props = {
  value: string;
  status: string;
  placeholder?: string;
  onChange?: (text: string) => void;
};

const InputEdit: FC<Props> = ({
  value,
  status,
  placeholder = '',
  onChange,
}) => {
  const [editable, setEditable] = useState(false);
  const [text, setText] = useState(value);

  const handleCancelClick = () => {
    setText(value);
    setEditable(false);
  };

  const handleApplyClick = () => {
    setEditable(false);
    if (value !== text) {
      onChange?.(text);
    }
  };

  const handleEditClick = () => {
    setText(value);
    setEditable(!editable);
  };

  useEffect(() => {
    if (status === 'rejected') {
      setText(value);
    }
  }, [status, value]);

  return (
    <div className="input-edit">
      <span
        className={classNames('input-edit__text', {
          'input-edit__text_hidden': editable,
        })}
      >
        {text}
      </span>
      <input
        type="text"
        className={classNames('input-edit__input', {
          'input-edit__input_disabled': !editable,
        })}
        placeholder={placeholder}
        value={text}
        disabled={!editable}
        onChange={(event) => setText(event.target.value)}
        data-testid="input-edit-input"
      />
      <div className="input-edit__buttons">
        <div
          className={classNames('input-edit__fun-btn-container', {
            'input-edit__fun-btn-container_hidden': !editable,
          })}
        >
          <button
            type="button"
            className="input-edit__save-edit material-icons-outlined"
            onClick={handleApplyClick}
            title="сохранить"
          >
            done
          </button>
        </div>
        <div
          className={classNames('input-edit__fun-btn-container', {
            'input-edit__fun-btn-container_hidden': !editable,
          })}
        >
          <button
            type="button"
            className="input-edit__close-edit material-icons-outlined"
            onClick={handleCancelClick}
            title="отмена"
          >
            close
          </button>
        </div>
      </div>
      <div
        className={classNames('input-edit__button-edit-container', {
          'input-edit__button-edit-container_hidden': editable,
        })}
      >
        <ButtonEdit onClick={handleEditClick} />
      </div>
    </div>
  );
};

export { InputEdit };
