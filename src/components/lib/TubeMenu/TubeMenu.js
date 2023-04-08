import React from 'react'; 
import { TinyButton, TimerProgress, Tooltag } from '../../../styled';

const TubeMenu = ({ track, tube, items = [] }) => {
  const param = `${track.trackName} ${track.artistName}`;
  const busy =
    ['lookup', 'batch_lookup'].some(tube.state.matches) &&
    tube.track?.trackId === track.trackId;
  const queued =
    tube.batch?.some((item) => item.trackId === track.trackId) &&
    tube.param !== param;
  const disabled = !tube.state.can('FIND');
  const pinned = tube.contains(track);

  if (busy) {
    return <TimerProgress limit={20} size={18} />;
  }

  return (
    <Tooltag
      component={TinyButton}
      title={pinned ? 'Play YouTube video' : 'Find track on YouTube'}
      color={pinned ? 'error' : 'inherit'}
      disabled={(queued || disabled) && !pinned}
      onClick={(e) =>
        tube.send({
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

TubeMenu.defaultProps = {};
export default TubeMenu;
