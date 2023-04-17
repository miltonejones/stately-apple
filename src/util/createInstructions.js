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


let ssmlProp = "";

if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
  // SpeechSynthesis API is supported
  var msg = new SpeechSynthesisUtterance();
  if ('SpeechSynthesisMarkupLanguage' in msg) {
    // SSML is supported
    console.log('This browser supports SSML');
    ssmlProp = "// format as SSML";
  } else {
    // SSML is not supported
    console.log('This browser does not support SSML');
  }
} else {
  // SpeechSynthesis API is not supported
  console.log('This browser does not support the SpeechSynthesis API');
}




export const createInstructions = (title, artist, upcoming = [], firstName, options, isNew, addedInfo = false, lang = 'en-US') => {
  const nextUpcoming = upcoming.slice(0, 2).map(({ trackName, artistName }) => `${dotless(trackName)} by ${dotless(artistName)}`).join(' and ');

  const shouldSayBoombot = options & DJ_OPTIONS.BOOMBOT;
  const shouldSayUsername = addedInfo && (options & DJ_OPTIONS.USERNAME);
  const shouldSayTime = addedInfo && (options & DJ_OPTIONS.TIME);
  const shouldSayUpnext = options & DJ_OPTIONS.UPNEXT;
  
  const when = {
    poem: isRandomlyTrue(true) ? getRandomPoemType() : null,
    boom: isRandomlyTrue(shouldSayBoombot),
    time: isRandomlyTrue(shouldSayTime),
    next: isRandomlyTrue(shouldSayUpnext && !!nextUpcoming?.length),
    name: isRandomlyTrue(shouldSayUsername && firstName !== undefined && firstName !== 'undefined'),  
  };
 
  //  log positive conditions
  console.table(Object.keys(when).reduce((out, key) => {
    if (when[key]) {
      out[key] = when[key];
    }
    return out;
  }, {}))

  const instructions = `Write an introduction to the song "${dotless(title)}" by "${dotless(artist)}" that a SpeechSynthesisUtterance object could read before the vocals start.
      ${isNew ? 'Remind user to add this song to favorites by clicking the pin icon.' : ''}
      ${when.poem && `Format the introduction as a ${when.poem}.`}
      ${when.boom && 'The introduction must menttion Boombot Radio in the introduction.'}
      ${when.time && `The introduction should be topical to the time of day which is ${moment().format('hh:mm a')}.`}
      ${when.next && `The introduction must menttion the upcoming tracks: ${nextUpcoming}.`}
      ${when.name && `The introduction must menttion a listener named ${firstName}.`}
      
      The listeners locale setting is "${lang}"
      
      Return the answer as an Intro in this format:
      
      interface Intro {
        Introduction: string; ${ssmlProp}
      }

      Do not declare a variable.
      Do not return the interface.


      Your response is intended to be parsed as JSON.`;

  const create = (content) => ([{ role: 'user', content }]);
  return create(instructions);
}

