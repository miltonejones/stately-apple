/**
 * Renders an audio player
 *
 * @param {object} props - Props for the audio player
 * @param {object} props.handler - The state machine handler for the audio player
 * @param {boolean} props.small - Whether or not to render the small version of the player
 * @returns {JSX.Element} - The audio player component
 */
import React from 'react';
import { Avatar, Stack, LinearProgress, Box } from '@mui/material';
import { Nowrap, Columns } from '../../../styled';
import Equalizer from './components/Equalizer/Equalizer'; 
import SmallPlayer from './components/SmallPlayer/SmallPlayer';
import ControlButtons from './components/ControlButtons/ControlButtons';
import TrackDetails from './components/TrackDetails/TrackDetails';
import { Player } from './components/styled';  

const AudioPlayer = ({ handler, small = false }) => { 
  // Destructure the coords property from the handler
  const { coords = [] } = handler;

  // Render the small player if the small prop is true
  if (small) {
    return <SmallPlayer handler={handler} />
  }

  // Otherwise, render the fullsized player
  return (
    <Player elevation={4} anchor="bottom" open={['opened', 'replay'].some(handler.state.matches)}>
      <Box sx={{ m: 1 }}>
        <Columns spacing={2} columns="100px 180px 220px 1fr 420px">
          {/* Track avatar */}
          <Avatar variant="rounded" sx={{ width: 100, height: 100 }} src={handler.artworkUrl100} alt={handler.trackName} />

          {/* Track details */}
          <TrackDetails handler={handler} />

          {/* Control buttons */}
          <ControlButtons stateMachineHandler={handler} />

          {/* Progress bar */}
          <Stack>
            <Columns columns="32px 1fr 32px">
              <Nowrap wrap small>{handler.current_time_formatted}</Nowrap>
              <LinearProgress value={handler.progress} variant={!handler.progress ? "indeterminate" : "determinate"} />
              <Nowrap wrap small muteds>{handler.duration_formatted}</Nowrap>
            </Columns>
          </Stack>

          {/* Equalizer */}
          <Box>
            <Equalizer coords={coords} /> 
          </Box>
        </Columns>
      </Box>
    </Player>
  );
}

export default AudioPlayer;
 