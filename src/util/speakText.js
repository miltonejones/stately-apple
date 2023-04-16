/**
 * Uses browsers speech synthesis API to speak a given message using a random voice
 * @param {string} message - the message to be spoken
 * @param {boolean} useRandomVoice - whether or not to use a random voice
 * @param {function} onTextChange - optional callback function to be called when text is spoken
 */

const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

export const speakText = (message, useRandomVoice = true, onTextChange = null) => {
  const voices = synth.getVoices();
 
  // Filter available voices to only include those with local service and set to en-US
  const availableVoices = voices?.filter(voice => !!voice.localService && voice.lang === 'en-US');

  // Generate random voice if useRandomVoice = true
  const randomVoiceIndex = Math.floor(Math.random() * availableVoices?.length);
  const randomVoice = !availableVoices?.length ? null : availableVoices[randomVoiceIndex];
 

  utterance.lang = "en-US";
  utterance.text = message;


  utterance.onstart = () => {
    onTextChange && onTextChange(message);
  }; 

  utterance.onend = () => {
    onTextChange && onTextChange(null);
  };
  
  // Set voice to random voice if available and useRandomVoice is true
  if (randomVoice && useRandomVoice) {
    utterance.voice = randomVoice;
  }

  // Speak the message using the browser's speech synthesis API
  synth.speak(utterance); 
}

