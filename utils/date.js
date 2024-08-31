const getWeekNumber = (date) => {
  const currentDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = (currentDate.getUTCDay() + 6) % 7;

  currentDate.setUTCDate(currentDate.getUTCDate() - dayNumber + 3);

  const firstThursday = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));

  firstThursday.setUTCDate(firstThursday.getUTCDate() + ((4 - firstThursday.getUTCDay()) + 7) % 7);

  return Math.ceil(((currentDate - firstThursday) / 86400000 + 1) / 7);
}

module.exports = {
  getWeekNumber,
}
