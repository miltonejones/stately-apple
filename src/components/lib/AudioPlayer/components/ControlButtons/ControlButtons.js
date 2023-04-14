import React from 'react';
import { IconButton } from '@mui/material';
import { Flex, TextIcon } from '../../../../../styled';
import TrackList from '../TrackList/TrackList';

/**
 * A component for rendering control buttons for the player.
 * @param {Object} props - The props object containing the state machine handler.
 * @returns {JSX.Element} The JSX representation of the component.
 */
const ControlButtons = ({ stateMachineHandler }) => {
  const isPaused = stateMachineHandler.state.matches('opened.paused');
  const isShuffleOn = stateMachineHandler.shuffle;

  const handleShuffleClick = () => {
    stateMachineHandler.send({
      type: 'TOGGLE',
      key: 'shuffle'
    });
  };

  const handleSkipPreviousClick = () => {
    stateMachineHandler.send({
      type: 'MOVE',
      index: -1
    });
  };

  const handlePauseClick = () => {
    stateMachineHandler.send('PAUSE');
  };

  const handleSkipNextClick = () => {
    stateMachineHandler.send({
      type: 'MOVE',
      index: 1
    });
  };

  return (
    <Flex>
      <IconButton color="primary" onClick={handleShuffleClick}>
        <TextIcon icon={isShuffleOn ? "ShuffleOn" : "Shuffle"} />
      </IconButton>

      <IconButton color="primary" onClick={handleSkipPreviousClick}>
        <TextIcon icon="SkipPrevious" />
      </IconButton>

      <IconButton color="primary" onClick={handlePauseClick}>
        <TextIcon sx={{ width: 40, height: 40 }} icon={isPaused ? "PlayCircle" : "PauseCircle"} />
      </IconButton>

      <IconButton color="primary" onClick={handleSkipNextClick}>
        <TextIcon icon="SkipNext" />
      </IconButton>

      <TrackList stateMachineHandler={stateMachineHandler} />
    </Flex>
  );
};

ControlButtons.defaultProps = {};

export default ControlButtons;
 