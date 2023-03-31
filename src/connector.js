const API_ENDPOINT = 'https://itunes.apple.com/search';



export const findMusic = async (term) => {
  const response = await fetch(API_ENDPOINT + `?term=${term}&limit=200`);
  return await response.json();
};


