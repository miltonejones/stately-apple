/**
* Returns a random boolean value.
* 
* @returns {boolean} - A randomly generated boolean.
*/
export const getRandomBoolean = () =>  Math.random() < 0.5;


export const isRandomlyTrue = cond => getRandomBoolean() && cond;

export const getRandomPoemType = () => {
  const poems = ['haiku', 'limerick', 'pun', 'epigram', 'cinquain'];
  const randomIndex = Math.floor(Math.random() * poems.length);
  return poems[randomIndex];
}
 
