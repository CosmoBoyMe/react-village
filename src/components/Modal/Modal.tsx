import { FC, ReactNode } from 'react';
import classNames from 'classnames';

import './Modal.scss';

type Props = {
  isActive: boolean;
  onClickClose: () => void;
  children?: ReactNode;
  isPositionTop?: boolean;
};

const Modal: FC<Props> = ({
  isActive,
  onClickClose,
  children,
  isPositionTop = false,
}) => {
  const handleModalCloseClick = () => {
    onClickClose();
  };

  return (
    <div
      className={classNames('modal', {
        modal_active: isActive,
      })}
      data-testid="booking-details-modal"
    >
      <div
        className={classNames('modal__overlay', {
          modal__overlay_position_top: isPositionTop,
        })}
        onClick={handleModalCloseClick}
        role="none"
        data-testid="modal-overlay"
      >
        <div
          role="none"
          className="modal__content"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="modal__close-btn"
            onClick={handleModalCloseClick}
            type="button"
            data-testid="modal-close-btn"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export { Modal };
