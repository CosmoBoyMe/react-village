import { FC, MouseEvent } from 'react';
import classNames from 'classnames';

import { FIRST_PAGE_NUMBER } from './constants';
import { getCounterText, getPageNumbers } from './helpers';
import './Pagination.scss';

type Props = {
  itemsPerPage: number;
  totalRooms: number;
  currentPageNumber: number;
  text?: string;
  onClickPage?: (pageNumber: number) => void;
};

const Pagination: FC<Props> = ({
  itemsPerPage,
  totalRooms,
  text = 'вариантов аренды',
  currentPageNumber = FIRST_PAGE_NUMBER,
  onClickPage,
}) => {
  const totalPage = Math.ceil(totalRooms / itemsPerPage);

  const handleNextButtonClick = () => {
    onClickPage?.(currentPageNumber + 1);
  };

  const handlePrevButtonClick = () => {
    onClickPage?.(currentPageNumber - 1);
  };

  const handlePageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    const pageNumber = Number(event.currentTarget.textContent);
    onClickPage?.(pageNumber);
  };

  const pageNumbers = getPageNumbers(totalPage, currentPageNumber);

  return (
    <div className="pagination" data-testid="pagination">
      <div className="pagination__buttons">
        <button
          type="button"
          disabled={currentPageNumber === FIRST_PAGE_NUMBER}
          className="pagination__button pagination__button_type_prev"
          onClick={handlePrevButtonClick}
        >
          arrow_back
        </button>
        {pageNumbers.map((pageNumber, index) =>
          pageNumber ? (
            <button
              type="button"
              className={classNames('pagination__button', {
                pagination__button_active: currentPageNumber === pageNumber,
              })}
              onClick={handlePageButtonClick}
              disabled={pageNumber === currentPageNumber}
              key={pageNumber}
            >
              {pageNumber}
            </button>
          ) : (
            <span
              className="pagination__dots"
              key={`dots:${currentPageNumber + index}`}
            >
              ...
            </span>
          )
        )}
        <button
          type="button"
          disabled={totalPage === currentPageNumber}
          className="pagination__button pagination__button_type_next"
          onClick={handleNextButtonClick}
        >
          arrow_forward
        </button>
      </div>
      <p className="pagination__text">
        {getCounterText(currentPageNumber, itemsPerPage, totalRooms)} {text}
      </p>
    </div>
  );
};

export { Pagination };
