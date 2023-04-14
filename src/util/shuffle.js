/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} unshuffled - The array to be shuffled
 * @returns {Array} - The shuffled array
 */
export const shuffle = (unshuffled = []) => {
  // Add sort property to each array element
  const shuffledWithSort = unshuffled.map(value => ({ value, sort: Math.random() }));

  // Sort the array by the sort property
  const sortedShuffled = shuffledWithSort.sort((a, b) => a.sort - b.sort);

  // Remove sort property and return the array values only
  const shuffled = sortedShuffled.map(({ value }) => value);

  return shuffled;
}

/*
  Critique:
  - The initial code was not very legible due to lack of line breaks and descriptive variable names
  - Adding default properties makes the function more robust and prevents errors if no array is passed
  - The JSDoc block helps document the function and makes it easier for others to understand and use
  - Verbose comments help to explain the purpose of each code block
*/