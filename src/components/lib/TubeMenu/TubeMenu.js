import React from 'react';
import { styled, CircularProgress, Box } from '@mui/material';
import {  TinyButton } from '../../../styled';
import { useMenu, useTube } from '../../../machines';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(1),
 width: 600,
 display: 'flex', 
 justifyContent: 'center'
}));
 
 
const TubeMenu = ({ track, tube }) => {

  const param = `${track.trackName} ${track.artistName}`;
  const trackPin = {
    ...track,
    param
  }


  const menu = useMenu();
 
  const { response } = tube;
 
  const busy = tube.state.matches("lookup") && tube.param === param;
  const ready = !!response?.pages?.length && !busy;

  if (busy) {
    return  <CircularProgress size={18} />
  }

 return (
   <>
    
    <Box className={busy ? "App-logo" : ""}>
    <TinyButton 
   
    onClick={e => tube.send({
      type: 'FIND',
      param,
      track 
    })} icon={busy ? "Sync" : "YouTube" }/>
    </Box>
 

   </>
 );
}

 
TubeMenu.defaultProps = {};
export default TubeMenu;
