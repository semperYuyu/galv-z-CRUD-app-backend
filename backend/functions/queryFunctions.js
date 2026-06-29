export const verifyAll = (...items) => {
  items.forEach((item) => {
    if (!item) return false;
  });

  return true;
};
