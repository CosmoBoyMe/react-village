type BookedDateData = {
  dates: { from: string; to: string };
  userId: string;
};

type BookedDatesData = {
  [key: string]: BookedDateData;
};

export type { BookedDateData, BookedDatesData };
