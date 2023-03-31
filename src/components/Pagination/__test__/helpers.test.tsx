/* eslint-disable max-len */
import { createMiddlePages, getCounterText } from '../helpers';

describe('createMiddlePages', () => {
  it('should return [2, 3, null] when active page number is 1', () => {
    const result = createMiddlePages(5, 1);
    expect(result).toEqual([2, 3, null]);
  });

  it('should return [2, 3, null] when active page number is 2', () => {
    const result = createMiddlePages(5, 2);
    expect(result).toEqual([2, 3, null]);
  });

  it('should return [2, 3, 4, null] when active page number is 3', () => {
    const result = createMiddlePages(5, 3);
    expect(result).toEqual([2, 3, 4, null]);
  });

  it('should return [null, 3, 4] when active page number is total', () => {
    const result = createMiddlePages(5, 5);
    expect(result).toEqual([null, 3, 4]);
  });

  it('should return [null, 3, 4] when active page number is total - 1', () => {
    const result = createMiddlePages(5, 4);
    expect(result).toEqual([null, 3, 4]);
  });

  it('should return [null, 3, 4, 5, null] when active page number is between 2 and total - 2', () => {
    const result = createMiddlePages(8, 4);
    expect(result).toEqual([null, 3, 4, 5, null]);
  });

  it('should return [2, 3, 4, null] when active page number is total - 2', () => {
    const result = createMiddlePages(5, 3);
    expect(result).toEqual([2, 3, 4, null]);
  });

  it('should return an array with the correct pages when active page is totalPage - 2', () => {
    const totalPage = 10;
    const activePageNumber = totalPage - 2;
    const result = createMiddlePages(totalPage, activePageNumber);
    expect(result).toEqual([
      null,
      activePageNumber - 1,
      activePageNumber,
      activePageNumber + 1,
    ]);
  });
});

describe('getCounterText', () => {
  it('returns the correct text for the first page', () => {
    const activePageNumber = 1;
    const itemsPerPage = 10;
    const totalItems = 25;
    const expectedText = '1 - 10 из 25';

    const result = getCounterText(activePageNumber, itemsPerPage, totalItems);

    expect(result).toEqual(expectedText);
  });

  it('returns the correct text for an intermediate page', () => {
    const activePageNumber = 3;
    const itemsPerPage = 10;
    const totalItems = 25;
    const expectedText = '21 - 25 из 25';

    const result = getCounterText(activePageNumber, itemsPerPage, totalItems);

    expect(result).toEqual(expectedText);
  });

  it('returns the correct text for the last page', () => {
    const activePageNumber = 3;
    const itemsPerPage = 10;
    const totalItems = 21;
    const expectedText = '21 - 21 из 21';

    const result = getCounterText(activePageNumber, itemsPerPage, totalItems);

    expect(result).toEqual(expectedText);
  });

  it('returns the correct text for a large number of total items', () => {
    const activePageNumber = 1;
    const itemsPerPage = 10;
    const totalItems = 150;
    const expectedText = '1 - 10 из 100+';

    const result = getCounterText(activePageNumber, itemsPerPage, totalItems);

    expect(result).toEqual(expectedText);
  });
});
