/**
 * Returns an object URL for the given JSON object.
 * @param {Object} jsonObject - The JSON object to create a URL for.
 * @returns {string} - The object URL.
 */
export const jsonLink = (jsonObject) => { 
  const jsonString = JSON.stringify(jsonObject);
  const blob = new Blob([jsonString], { type: "application/json" });
  return URL.createObjectURL(blob);
}

