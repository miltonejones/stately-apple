/**
 * @description Creates an introduction for a song using its title,
 * artist, and additional arguments. Returns the introduction, or false if
 * no introduction can be created.
 * @param {string} title - The title of the song.
 * @param {string} artist - The name of the artist or band.
 * @param {string} ...args - Additional arguments to use for text generation.
 * @returns {Object|Boolean} - The introduction object with title, artist, and
 * introduction properties, or false if no introduction can be created.
 */
import { createInstructions } from './createInstructions';
import { generateText } from './generateText'; 

export const getIntro = async (title, artist, ...args) => {
  // Create instructions for text generation.
  const curatedInstructions = createInstructions(title, artist, ...args); 

  // Generate text based on instructions.
  const intro = await generateText(curatedInstructions, 1, 128); 

  // Extract choices from generated text.
  const { choices } = intro; 

  // If no choices exist, return false.
  if (!choices?.length) {
    return false;
  }

  // Parse introduction from first message in choices.
  const { message } = choices[0];  
  const dj = JSON.parse(message.content); 

  // Log introduction length.
  console.log(dj.Introduction, dj.Introduction.length);

  // Return introduction object with title, artist, and introduction properties.
  return {
    ...dj,
    title,
    artist
  };
};

