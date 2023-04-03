import React from 'react';
import {  CircularProgress } from '@mui/material';
import {  TinyButton, Tooltag } from '../../../styled'; 
  
const TubeMenu = ({ track, tube, items = [] }) => {

  const param = `${track.trackName} ${track.artistName}`; 
  const busy = ['lookup', 'batch_lookup'].some(tube.state.matches) && tube.param === param; 
  const disabled = ['lookup', 'batch_lookup'].some(tube.state.matches) && tube.param !== param; 
  const pinned = tube.contains(track) 

  if (busy) {
    return  <CircularProgress size={18} />
  }

 return ( 
  <Tooltag component={TinyButton}
    title={pinned ? "Play YouTube video" : "Find track on YouTube"} 
    color={pinned ?  "error" : "inherit"}
    disabled={disabled}
    onClick={e => tube.send({
      type: 'FIND',
      param,
      track,
      items: items.map(item => tube.pins?.find(f => f.trackId === item.trackId))
        .filter(f => !!f),
    })} icon={"YouTube"}/>
 );
}

 
TubeMenu.defaultProps = {};
export default TubeMenu;
