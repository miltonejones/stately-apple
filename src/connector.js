const API_ENDPOINT = 'https://itunes.apple.com/search';



export const findMusic = async (term, media = 'all') => {
  const response = await fetch(API_ENDPOINT + `?term=${term}&media=${media}&limit=200`);
  return await response.json();
};


