/**
 * Displays a menu of media types for the user to select from.
 *
 * @param {object} handler - An object containing a handler function and a boolean to indicate if the menu is idle.
 * @returns {jsx} - Returns JSX containing a text field and menu items for selection.
 */

import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { Flex, Nowrap, Pill } from '../../../styled';

const MediaMenu = ({ handler }) => {
  const { isIdle } = handler;

  // If the menu is not idle, display a text field and menu items for selection.
  if (!isIdle) {
    return (
      <Flex sx={{ p: 1 }}>
        <TextField
          label="Media type"
          name="entity"
          onChange={handler.setProp}
          size="small"
          select
          value={handler.entity}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="all">All</MenuItem>
          {Object.keys(entities).map(entity => (
            <MenuItem key={entity} value={entity}>{entities[entity]}</MenuItem>
          ))}
        </TextField>
      </Flex>
    );
  }

  // If the menu is idle, display an array of pills for media type selection.
  return (
    <Flex between spacing={1} sx={{ p: 1 }}>
      {Object.keys(entities).map(entity => (
        <Pill
          active={entity === handler.entity}
          onClick={() => handler.setProp({
            target: {
              name: 'entity',
              value: entity
            }
          })}
        >
          <Nowrap
            hover
            bold={entity === handler.entity}
            sx={{
              color: t => entity === handler.entity ? t.palette.common.white : t.palette.text.secondary
            }}
            muted
            tiny
          >
            {entities[entity]}
          </Nowrap>
        </Pill>
      ))}
    </Flex>
  );
};

// Set default props if necessary.
MediaMenu.defaultProps = {};

export default MediaMenu;

// Entities represents the various media types available.
const entities = {
  audiobook: "Audio Book",
  ebook: "eBook",
  movie: "Movie",
  music: "Music",
  musicVideo: "Music Video",
  podcast: "Podcast",
  software: "Software",
  tvShow: "TV"
};


