/**
 * Determines if a given string contains another given string.
 *
 * @param {string} targetString - The string we will search within.
 * @param {string} searchString - The string we will look for.
 *
 * @returns {boolean} - True if the targetString includes the searchString, false otherwise.
 */
export const contains = (targetString, searchString) => {
  const targetLower = targetString?.toLowerCase();
  const searchLower = searchString?.toLowerCase();
  return typeof targetString === 'string' &&
         typeof searchString === 'string' && 
         targetLower.indexOf(searchLower) > -1;
}
 