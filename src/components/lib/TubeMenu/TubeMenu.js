import React from 'react';
import {  CircularProgress } from '@mui/material';
import {  TinyButton } from '../../../styled'; 
  
const TubeMenu = ({ track, tube }) => {

  const param = `${track.trackName} ${track.artistName}`; 
  const busy = ['lookup', 'batch_lookup'].some(tube.state.matches) && tube.param === param; 
  const pinned = tube.contains(track) 

  if (busy) {
    return  <CircularProgress size={18} />
  }

 return ( 
  <TinyButton 
    color={pinned ?  "error" : "inherit"}
    onClick={e => tube.send({
      type: 'FIND',
      param,
      track 
    })} icon={"YouTube"}/>
 );
}

 
TubeMenu.defaultProps = {};
export default TubeMenu;
