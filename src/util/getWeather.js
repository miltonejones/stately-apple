/**
 * Get the current weather at the user's location
 * @return {Promise<object>} - The weather data
 */
import { getLocation } from './getLocation';

export const getWeather = async () => {
  // Get the user's location
  const { latitude, longitude } = await getLocation();
  
  const API_KEY = process.env.REACT_APP_API_KEY.split(',')[2]

  // API options
  const apiOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  };
  
  // Get the weather data from the API
  const response = await fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`, apiOptions);
  
  // Return the weather data
  return await response.json(); 
}
 