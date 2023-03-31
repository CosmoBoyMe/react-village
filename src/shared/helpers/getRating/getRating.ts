import { RateData } from '../../../types/RateData';

const getRating = (rates?: { [key: string]: RateData }) => {
  let rate = 0;
  if (rates) {
    const values = Object.values(rates);

    rate = Math.round(
      values.reduce((acc, item) => acc + item.rate, 0) / values.length
    );
  }
  return rate;
};

export { getRating };
