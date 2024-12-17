export default function () {
  const currentYear = new Date().getFullYear();
  const startYear = 1980;
  const years = [];

  for (let year = currentYear + 1; year >= startYear; year--) {
    years.push(year);
  }
  return years;
}
