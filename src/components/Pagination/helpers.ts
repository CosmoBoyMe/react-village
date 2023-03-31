import { FIRST_PAGE_NUMBER, MAX_MIDDLE_BUTTONS_COUNT } from './constants';

const getCounterText = (
  activePageNumber: number,
  itemsPerPage: number,
  totalItems: number
) => {
  const lastItem = activePageNumber * itemsPerPage;
  const lastItemsNumber = lastItem > totalItems ? totalItems : lastItem;
  const totalCountText = totalItems > 100 ? '100+' : totalItems;
  const textCounter = `${
    itemsPerPage * (activePageNumber - 1) + 1
  } - ${lastItemsNumber} из ${totalCountText}`;
  return textCounter;
};

const createMiddlePages = (totalPage: number, activePageNumber: number) => {
  const result = [];
  const leftPageNumber = activePageNumber - 1;
  const rightPageNumber = activePageNumber + 1;

  switch (activePageNumber) {
    case 1:
    case 2:
      result.push(2);
      result.push(3);
      result.push(null);
      break;
    case 3:
      result.push(leftPageNumber);
      result.push(activePageNumber);
      result.push(rightPageNumber);
      result.push(null);
      break;
    case totalPage - 1:
      result.push(null);
      result.push(leftPageNumber);
      result.push(activePageNumber);
      break;
    case totalPage - 2:
      result.push(null);
      result.push(leftPageNumber);
      result.push(activePageNumber);
      result.push(rightPageNumber);
      break;
    case totalPage:
      result.push(null);
      result.push(activePageNumber - 2);
      result.push(leftPageNumber);
      break;

    default:
      result.push(null);
      result.push(leftPageNumber);
      result.push(activePageNumber);
      result.push(rightPageNumber);
      result.push(null);
  }
  return result;
};

const getPageNumbers = (totalPage: number, activePageNumber: number) => {
  if (totalPage <= MAX_MIDDLE_BUTTONS_COUNT) {
    const pageNumbers = [];
    for (let i = FIRST_PAGE_NUMBER; i <= totalPage; i += 1) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }
  const firstPage = FIRST_PAGE_NUMBER;
  const lastPage = totalPage;
  const middlePage = createMiddlePages(totalPage, activePageNumber);
  return [firstPage, ...middlePage, lastPage];
};

export { createMiddlePages, getCounterText, getPageNumbers };
