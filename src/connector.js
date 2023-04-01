const API_ENDPOINT = 'https://itunes.apple.com';



export const findMusic = async (term, media = 'all') => {
  const response = await fetch(API_ENDPOINT + `/search?term=${term}&media=${media}&limit=200`);
  return await response.json();
};

export const lookupMusic = async (id, entity) => {
  const response = await fetch(API_ENDPOINT + `/lookup?id=${id}&entity=${entity}&limit=200`);
  return await response.json();
};


