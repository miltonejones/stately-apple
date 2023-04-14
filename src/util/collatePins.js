/**
 * Takes an array of pins and groups them by artist, album, genre, and playlist.
 * @param {Array} pins - Array of pin objects with various properties.
 * @returns {Object} - Object containing original pins array, groups object by artist, album, genre, and playlist, and playlists object.
 */
export const collatePins = (pins = []) => {
  // create an object to hold group names for display purposes
  const groupNames = {
    artistName: "Artists",
    collectionName: "Albums",
    primaryGenreName: "Genres",
  };

  // create an object of playlists and the corresponding pins
  const playlists = pins.reduce((out, pin) => {
    // skip any pins without playlists
    if (!pin.playlists) return out;

    // add each playlist name to the output object if it's not already there
    pin.playlists.forEach((name) => {
      if (!out[name]) {
        Object.assign(out, {
          [name]: [],
        });
      }
      // add the current pin to the output array for the specific playlist name
      return out[name].push(pin);
    });

    return out;
  }, {});

  // create an object of group objects (artist, album, genre) with corresponding pins
  const groups = Object.keys(groupNames).reduce((collated, name) => {
    // create an object to hold pins for each specific group
    const group = pins.reduce((out, pin) => {
      // add each unique group name to the output object if it's not already there
      if (!out[pin[name]]) {
        Object.assign(out, {
          [pin[name]]: [],
        });
      }
      // add the current pin to the output array for the specific group name
      out[pin[name]].push(pin);
      return out;
    }, {});

    // add the current group to the groups object with the corresponding group name for display purposes
    Object.assign(collated, {
      [groupNames[name]]: group,
    });
    return collated;
  }, {});

  // add the playlists object to the groups object
  Object.assign(groups, {
    Playlists: playlists
  });

  // return an object with the original pins array, groups object, and playlists object
  return {
    pins,
    groups,
    playlists,
  };
};
