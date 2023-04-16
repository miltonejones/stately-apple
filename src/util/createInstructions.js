/**
 * Generates the introduction for a song as a SpeechSynthesisUtterance object could read before the vocals start.
 *
 * @param {string} title - The title of the song.
 * @param {string} artist - The artist of the song.
 * @param {Array} upcoming - Array of upcoming tracks to mention.
 * @param {string} firstName - The name of the listener to mention.
 * @param {number} options - Options for what to include in the introduction.
 * @param {boolean} isNew - Whether the song is new and should be added to favorites.
 * @param {boolean} addedInfo - Additional information to include in the introduction.
 *
 * @return {Array} An array containing an object with the role of "user" and the content of the instructions.
 */
import { getRandomPoemType, isRandomlyTrue } from './getRandomBoolean'; 
import { DJ_OPTIONS } from './djOptions'; 
import moment from 'moment';

const dotless = str => str?.replace(/\./g, '');

export const createInstructions = (title, artist, upcoming = [], firstName, options, isNew, addedInfo = false) => {
  const nextUpcoming = upcoming.slice(0, 2).map(({ trackName, artistName }) => `${dotless(trackName)} by ${dotless(artistName)}`).join(' and ');

  const shouldSayBoombot = options & DJ_OPTIONS.BOOMBOT;
  const shouldSayUsername = addedInfo && (options & DJ_OPTIONS.USERNAME);
  const shouldSayTime = addedInfo && (options & DJ_OPTIONS.TIME);
  const shouldSayUpnext = options & DJ_OPTIONS.UPNEXT;
  const randomPoemType = getRandomPoemType();

  const instructions = `Write an introduction to the song "${dotless(title)}" by "${dotless(artist)}" that a SpeechSynthesisUtterance object could read before the vocals start.
      ${isNew ? 'Remind user to add this song to favorites by clicking the pin icon.' : ''}
      ${isRandomlyTrue(true) && `Format the intro as a ${randomPoemType}`}
      ${isRandomlyTrue(shouldSayBoombot) && 'Mention Boombot Radio in the introduction.'}
      ${isRandomlyTrue(shouldSayTime) && `The introduction should be topical to the time of day which is ${moment().format('hh:mm a')}.`}
      ${isRandomlyTrue(shouldSayUpnext && !!nextUpcoming?.length) && `Mention the upcoming tracks: ${nextUpcoming}.`}
      ${isRandomlyTrue(shouldSayUsername && firstName !== undefined && firstName !== 'undefined') && `Mention a listener named ${firstName}.`}
      Return the answer as an Intro in this format:
      
      interface Intro {
        Introduction: string;
      }

      Do not declare a variable.
      Do not return the interface.

      Your response is intended to be parsed as JSON.`;

  const create = (content) => ([{ role: 'user', content }]);
  return create(instructions);
}

