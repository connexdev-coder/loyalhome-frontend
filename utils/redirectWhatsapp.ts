export default function (phone: string) {
  const url = `https://api.whatsapp.com/send?phone=%2B964${phone}`;
  window.open(url, "_blank");
}
