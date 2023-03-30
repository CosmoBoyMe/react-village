import AirDatepicker, { AirDatepickerViewsSingle } from 'air-datepicker';

type ReservedDates<T> = {
  from: T;
  to: T;
}[];

type DatepickerOnRenderCellParams = {
  date: Date;
  cellType: AirDatepickerViewsSingle;
  datepicker: AirDatepicker;
};

const filterReservedDates = (reservedDates: ReservedDates<string>) => {
  const currentDate = new Date();

  return reservedDates.filter((dates) => {
    const { to } = dates;

    const toDate = new Date(to.split('.').reverse().join('.'));

    return currentDate < toDate;
  });
};

const getCorrectReservedDates = (
  reservedDates: ReservedDates<string>
): ReservedDates<Date> =>
  filterReservedDates(reservedDates)
    .map((dates) => {
      const from = new Date(dates.from.split('.').reverse().join('.'));
      const to = new Date(dates.to.split('.').reverse().join('.'));

      return { from, to };
    })
    .sort((currDates, nextDates) => {
      return currDates.from < nextDates.from ? -1 : 1;
    });

const setReservedDates = (
  { date, cellType }: DatepickerOnRenderCellParams,
  dates: ReservedDates<Date>
) => {
  if (cellType === 'day') {
    let isReservedDate = false;
    let isReservedDateEnd = false;
    let isReservedDateStart = false;

    dates.forEach(({ from, to }, index, arr) => {
      const fromMs = from.getTime();
      const toMs = to.getTime();
      const dateMs = date.getTime();

      if (index < arr.length - 1) {
        if (toMs === dateMs && toMs !== arr[index + 1].from.getTime()) {
          isReservedDateEnd = true;
          return;
        }
      } else if (dateMs === toMs) {
        isReservedDateEnd = true;
        return;
      }

      if (index > 0) {
        if (fromMs === dateMs && fromMs !== arr[index - 1].to.getTime()) {
          isReservedDateStart = true;
          return;
        }
      } else if (dateMs === fromMs) {
        isReservedDateStart = true;
        return;
      }

      if (fromMs <= dateMs && dateMs <= toMs) {
        isReservedDate = true;
      }
    });

    if (isReservedDate) {
      return {
        classes: 'air-datepicker-cell_reserved',
      };
    }
    if (isReservedDateEnd) {
      return {
        classes: 'air-datepicker-cell_reserved-end',
      };
    }
    if (isReservedDateStart) {
      return {
        classes: 'air-datepicker-cell_reserved-start',
      };
    }
  }
  return {};
};

export { getCorrectReservedDates, setReservedDates };
