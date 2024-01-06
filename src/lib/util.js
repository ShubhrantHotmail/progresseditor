export function logger(logs) {
  const now = new Date();
  const dateTimeStamp =
    now.toLocaleDateString("en-US") +
    " " +
    now.toLocaleTimeString("en-US") +
    " > ";
  console.log(dateTimeStamp, logs);
}
