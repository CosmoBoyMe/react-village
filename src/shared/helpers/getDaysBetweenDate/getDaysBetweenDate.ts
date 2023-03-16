const getDaysBetweenDate = (date: Date[]) => {
  if (date.length <= 1) {
    return 0;
  }

  const startDate = date[0];
  const endDate = date[1];

  const days = Math.floor((endDate.getTime() - startDate.getTime()) / 86400000);
  return days;
};

export { getDaysBetweenDate };
