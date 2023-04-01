import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { Flex, Nowrap, Pill } from '../../../styled';
  
 
const MediaMenu = ({ handler }) => {
  const { isIdle } = handler;
  if (!isIdle) {
    return <Flex sx={{p:1}}>
      <TextField
      label="Media type"
      name="entity"
      onChange={handler.setProp}
      size="small"
      select
      value={handler.entity}
      sx={{minWidth: 120}}
    >
      <MenuItem value="all">All</MenuItem>
      {Object.keys(entities).map(e => <MenuItem key={e} value={e}>{entities[e]}</MenuItem>)}
    </TextField>
    </Flex>
  }
 return (
  <Flex between spacing={1} sx={{p:1}}>
  {Object.keys(entities).map(e => <Pill
    active={e === handler.entity}
    onClick={() => {
      handler.setProp({ target: {
        name: 'entity',
        value: e
      }})
    }} 
  >
    <Nowrap hover bold={e === handler.entity} 
    sx={{   color: t => e === handler.entity ? t.palette.common.white : t.palette.text.secondary, }}
    muted tiny>{entities[e]}</Nowrap>
  </Pill>)}
</Flex>
 );
}
MediaMenu.defaultProps = {};
export default MediaMenu;

const entities = {
  movie: "Movie",
  podcast: "Podcast",
  music: "Music",
  musicVideo: "Music Video",
  audiobook: "Audio Book",
  // shortFilm: "Short  Film",
  tvShow: "TV",
  software: "Software",
  ebook: "eBook"
}
