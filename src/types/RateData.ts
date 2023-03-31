type RateData = {
  userId: string;
  rate: number;
};

type CurrentRates = {
  currentRates?: {
    [key: string]: RateData;
  };
};

export type { CurrentRates, RateData };
