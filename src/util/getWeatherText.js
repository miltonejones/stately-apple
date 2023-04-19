/**
 * Returns a formatted string containing weather text data.
 *
 * @param {object} weather - Weather data object.
 * @param {object} [weather.current] - Current weather data.
 * @param {object} [weather.location] - Location data.
 * @returns {string} - Formatted string of weather data.
 */
export const getWeatherText = (weather = {}) => {
  if (!weather) {
    return '';
  }

  const { current = {}, location = {} } = weather;
  const { humidity, condition = {}, temp_f } = current;
  const { text = '' } = condition;

  return `Condition "${text}". Temperature: ${temp_f}. Humidity: ${humidity}. Location: ${location.name}`;
};

