/**
 * Renders a small player component
 * @param {object} props - React props
 * @param {object} props.handler - State machine handler
 */
import React from 'react';
import { styled, Avatar, Stack, IconButton, LinearProgress, Box } from '@mui/material';
import { Nowrap, Columns, TinyButton, Flex, Spacer, TextIcon } from '../../../../../styled';
import { Player } from '../styled';

/**
 * Wrapper for small player component
 */
const SmallPlayerWrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1)
}));

/**
 * Small player component
 */
const SmallPlayer = ({ handler }) => {
  // Determine if player is paused
  const isPaused = handler.state.matches('opened.paused');

  // Maximum width for player
  const maxWidth = 'calc(100vw - 142px)';

  // Render small player
  return (
    <Player small elevation={4} anchor="bottom" open={['opened', 'replay'].some(handler.state.matches)}>
      <SmallPlayerWrapper data-testid="test-for-SmallPlayer">
        <Columns columns="56px 1fr">
          <Avatar variant="rounded" sx={{ width: 56, height: 56 }} src={handler.artworkUrl100} alt={handler.trackName} />
          <Stack>
            <Columns sx={{ m: theme => theme.spacing(0, 1) }} columns="32px 1fr 32px 24px">
              <Nowrap wrap small>{handler.current_time_formatted}</Nowrap>
              <LinearProgress value={handler.progress} variant={!handler.progress ? "indeterminate" : "determinate"} />
              <Nowrap wrap small muted>{handler.duration_formatted}</Nowrap>
              <TinyButton icon="Close" onClick={() => handler.send('CLOSE')} />
            </Columns>
            <Flex sx={{ m: theme => theme.spacing(0, 1) }}>
              <Stack>
                <Nowrap sx={{ maxWidth }} small>{handler.trackName}</Nowrap>
                <Nowrap sx={{ maxWidth }} small muted>{handler.collectionName} - {handler.artistName}</Nowrap>
              </Stack>
              <Spacer />
              <IconButton color="primary" onClick={() => handler.send('PAUSE')}>
                <TextIcon sx={{ width: 32, height: 32 }} icon={isPaused ? "PlayCircle" : "PauseCircle"} />
              </IconButton>
            </Flex>
          </Stack>
        </Columns>
      </SmallPlayerWrapper>
    </Player>
  );
};

// Set default props if needed
SmallPlayer.defaultProps = {};

export default SmallPlayer;

// Critique: Variable name "handler" could be more descriptive, such as "audioPlayerStateMachine". Additionally, the "isOpen" state could be extracted as a separate variable for better readability. Instead of using array.some to check state matches, a separate state check function could be created for reusability. Finally, instead of hardcoding "PAUSE" and "CLOSE" event names, constants or an enum could be used for better maintainability.