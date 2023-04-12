import React from 'react';
import { TinyButton, TimerProgress, Tooltag } from '../../../styled';

/**
 * A component that renders a button for playing a track on YouTube.
 * @param {object} track - The track to preview.
 * @param {object} tube - The YouTube API object.
 * @param {array} items - The list of tracks to include in the YouTube search.
 * @returns {JSX.Element} - The rendered TubeMenu component.
 */
const TubeMenu = ({ track, tube, items = [] }) => {
  const param = `${track.trackName} ${track.artistName}`;
  const busy = ['lookup', 'batch_lookup'].some((state) => tube.state.matches(state)) 
    && tube.track?.trackId === track.trackId;
  const queued = tube.batch?.some((item) => item.trackId === track.trackId) 
    && tube.param !== param;
  const disabled = !tube.state.can('FIND');
  const pinned = tube.contains(track);

  // Show a loading progress bar if the tube is busy.
  if (busy) {
    return <TimerProgress limit={20} size={18} />;
  }

  // Render the TubeMenu button.
  return (
    <Tooltag
      component={TinyButton}
      title={pinned ? 'Play YouTube preview' : 'Preview track on YouTube'}
      color={pinned ? 'error' : 'inherit'}
      disabled={(queued || disabled) && !pinned}
      onClick={(e) =>
        tube.send({
          // Send a FIND message to the tube with the track details and search items.
          type: 'FIND',
          param,
          track: {
            ...track,
            param,
          },
          items: items
            .map((item) => tube.pins?.find((f) => f.trackId === item.trackId))
            .filter((f) => !!f),
        })
      }
      icon={queued && !pinned ? 'AccessTime' : 'YouTube'}
    />
  );
};

// Set default props for the TubeMenu component.
TubeMenu.defaultProps = {
  track: {},
  tube: {},
  items: [],
};

export default TubeMenu;

// Critiques:
// - The named parameter `tube` might be better named as `youtube` for clarity.
// - The logic for disabling the button could be simplified for better readability.
// - The JSDoc comment block could include more details about the input and output of the function.