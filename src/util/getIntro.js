import { getRandomBoolean } from './getRandomBoolean';
import { generateText } from './generateText';
import moment from 'moment';
import { DJ_OPTIONS } from './djOptions';

 

export const getIntro = async (
    title, 
    artist, 
    upcoming = [],
    firstName, 
    options, 
    isNew,   
  ) => {
  const nextup = upcoming
    .slice(0, 2)
    .map(f => `${f.trackName} by ${f.artistName}`).join(' and ');

    const sayBoombot = options & DJ_OPTIONS.BOOMBOT;
    const sayUsername = options & DJ_OPTIONS.USERNAME;
    const sayTime = options & DJ_OPTIONS.TIME;
    const sayUpnext = options & DJ_OPTIONS.UPNEXT;

  const instructions = `for the song "${title}" by "${artist}" write an introduction to the song that a SpeechSynthesisUtterance object
        could read  before the vocals start.   
        ${!!isNew ? "remind user to add this song to favorites by clicking the pin icon" : ""}
        ${!!sayBoombot && getRandomBoolean() ? "Mention Boombot Radio in the introduction." : ""}
        ${!!sayTime && getRandomBoolean() ? ("The introduction should be topical to the time of day which is" + moment().format('hh:mm a')) : ""}
        ${!!sayUpnext && !!nextup?.length && getRandomBoolean() ?  ("Mention the upcoming tracks " + nextup) : ""} 
        ${!!sayUsername && !!firstName && 
          firstName !== undefined && 
          firstName !== 'undefined' && getRandomBoolean() ?  ("Mention a listener named " + firstName) : ""} 
        return the answer as in Intro in this format 
        interface Intro { 
          Introduction: string;  
          Speechtime: number; // number of seconds before vocals
        }.  
      return only the JSON object with no additional comment.`;

    const create = q => ([{"role": "user", "content": q}]);
    const intro = await generateText (create(instructions), 1, 128)
    const { choices } = intro;

    if (!choices?.length) return false;
    const { message } = choices[0]; 

    const dj = JSON.parse(message.content);

    console.log (dj.Introduction, dj.Introduction.length)

    return {
      ...dj,
      title,
      artist
    }
}