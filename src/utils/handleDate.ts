export function formatDateTime (date: Date): string {
  const day = (date.getDate()/100).toFixed(2).slice(2);
  const month = ((date.getMonth()+1)/100).toFixed(2).slice(2);
  const year = date.getFullYear();
  const hour = (date.getHours()/100).toFixed(2).slice(2);
  const minutes = (date.getMinutes()/100).toFixed(2).slice(2);
  const seconds = (date.getSeconds()/100).toFixed(2).slice(2);
  const dateTimeString = `${day}/${month}/${year}, ${hour}:${minutes}:${seconds}`
  return dateTimeString
}