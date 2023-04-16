/**
 * Returns a randomly generated boolean value
 * @return {boolean}
 */
export const getRandomBoolean = () => {
  return Math.random() < 0.5;
}

/**
 * Determines if a condition is true and randomly generated boolean is true
 * @param  {boolean} cond - A condition to check
 * @return {boolean} - True if randomly generated boolean is true and condition is true, false otherwise
 */
export const isRandomlyTrue = (cond) => {
  const randomBool = getRandomBoolean();
  return randomBool && cond;
}

/**
 * Returns a random type of poem from a pre-defined list of types
 * @return {string} - A random type of poem
 */
export const getRandomPoemType = () => {
  const poemTypes = ['haiku', 'limerick', 'pun', 'epigram', 'cinquain'];
  const randomIndex = Math.floor(Math.random() * poemTypes.length);
  return poemTypes[randomIndex];
}
 