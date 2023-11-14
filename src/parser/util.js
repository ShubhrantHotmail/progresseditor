export function removeInvalidRightChar(text) {
  const regexValidWordEnd = new RegExp(/[\w\d]$/);
  while (!regexValidWordEnd.test(text)) {
    text = text.substring(0, text.length - 1);
  }
  return text;
}
