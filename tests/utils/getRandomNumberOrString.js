// random number between 100-999
export const getRandomNumber = () => {
  return Math.floor(Math.random() * (999 - 100 + 1) + 100);
};

// random number between 100-999 as string
export const getRandomNumberAsString = () => {
  return String(Math.floor(Math.random() * (999 - 100 + 1) + 100));
};

// random string
export const getRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};
