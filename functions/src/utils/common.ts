export const truncate = (str: string, maxLength = 1800) =>
  str.length >= maxLength ? str.slice(0, maxLength - 3) + "..." : str;
