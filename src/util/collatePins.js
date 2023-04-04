export const collatePins = pins => {

  
  const groupNames = {
    artistName: "Artists",
    collectionName: "Albums",
    primaryGenreName: "Genres",
  };

  const playlists = pins.reduce((out, pin) => {
    if (!pin.playlists) return out;

    pin.playlists.map((name) => {
      if (!out[name]) {
        Object.assign(out, {
          [name]: [],
        });
      }
      return out[name].push(pin);
    });

    return out;
  }, {});

  const groups = Object.keys(groupNames).reduce((collated, name) => {
    const group = pins.reduce((out, pin) => {
      if (!out[pin[name]]) {
        Object.assign(out, {
          [pin[name]]: [],
        });
      }
      out[pin[name]].push(pin);
      return out;
    }, {});

    Object.assign(collated, {
      [groupNames[name]]: group,
    });
    return collated;
  }, {});

  return {
    pins,
    groups,
    playlists,
  };
};