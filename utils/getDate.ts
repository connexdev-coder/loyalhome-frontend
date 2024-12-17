export default function (dateToFormat: any) {
  const date = new Date(dateToFormat);

  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleTimeString("en-US", options);
}
