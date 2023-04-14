/**
 * Returns a function that can sort an array of objects based on a specified key.
 * @param {string} key - The key to sort the array of objects by.
 * @param {number} [off=1] - The offset to multiply the result by (-1 for descending order).
 * @returns {function} - A function to sort an array of objects.
 */
export const sorter = (key, off = 1) => {
  return (first, second) => {
    if (first[key] > second[key]) {
      return 1 * off;
    } else {
      return -1 * off;
    }
  }
};

 