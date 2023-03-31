import React from 'react';
import { styled, Card, Avatar, Stack, IconButton, LinearProgress, Box } from '@mui/material';
import { Nowrap, Columns, Flex, Spacer, TextIcon } from '../../../styled';
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1)
 }));

 const Player = styled(Card)(({ open, theme }) => ({
   position: 'fixed',
   bottom:  open ? 'var(--bottom-bar-offset)' : -400,
   transition: "bottom 0.2s linear",
   height: 116,
   width: '100vw',
   backgroundColor: 'white'
 }));
   
 
const AudioPlayer = ({ handler }) => {
  const paused = handler.state.matches('opened.paused')
 return (
  <Player anchor="bottom" open={handler.state.matches('opened')}>
    
   <Layout data-testid="test-for-AudioPlayer">
    <Columns spacing={2} columns="100px 300px 80px 1fr 400px">
    <Avatar sx={{ width: 100, height: 100 }} src={handler.artworkUrl100} alt={handler.trackName} />
      <Stack>
        <Nowrap>{handler.trackName}</Nowrap>
        <Nowrap small muted>{handler.collectionName}</Nowrap>
        <Nowrap small muted>{handler.artistName}</Nowrap>
      </Stack>
      <IconButton color="primary" onClick={() => handler.send('PAUSE')}>
        <TextIcon sx={{ width: 40, height: 40 }} icon={paused ? "PlayCircle" : "PauseCircle"} />
      </IconButton>
      <Stack>
        <LinearProgress value={handler.progress} variant={!handler.progress ? "indeterminate" : "determinate"} />
        <Flex>
          <Nowrap small>{handler.current_time_formatted}</Nowrap>
          <Spacer />
          <Nowrap small muteds>{handler.duration_formatted}</Nowrap>
        </Flex>
      </Stack>
      <Box >{JSON.stringify(handler.state.value)}</Box>
    </Columns>
  
   </Layout>
  </Player>
 );
}
AudioPlayer.defaultProps = {};
export default AudioPlayer;
