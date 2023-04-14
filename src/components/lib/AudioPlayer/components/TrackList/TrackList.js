import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Drawer, Stack, IconButton } from '@mui/material';
import { Nowrap, Flex, Spacer, TextIcon } from '../../../../../styled';
import { useMenu } from '../../../../../machines';

/**
 * Component representing a playlist.
 * @param {Object} props - Props for the component.
 * @param {Object} props.handler - Handler object for the playlist.
 */
const TrackList = ({ handler }) => {
  // Get the index of the current track in the playlist.
  const currentTrackIndex = handler.trackList?.findIndex(track => track.previewUrl === handler.src);
  
  // Handle playing a track.
  const handlePlay = (selectedTrack) => {
    handler.handlePlay(selectedTrack.previewUrl, {
      src: selectedTrack.previewUrl,
      Title: selectedTrack.trackName,
      trackList: handler.trackList,
      ...selectedTrack,
    });
  };

  // Get the menu for selecting tracks.
  const trackMenu = useMenu(track => !!track && handlePlay(track));

  return (
    <>
      {/* Button for opening the track selection menu. */}
      <IconButton color="primary" onClick={trackMenu.handleClick}>
        <TextIcon icon="QueueMusic" />
      </IconButton>

      {/* Drawer containing the track selection menu. */}
      <Drawer
        anchor="left"
        onClose={trackMenu.handleClose()}
        open={Boolean(trackMenu.anchorEl)}
      >
        <Flex sx={{ p: theme => theme.spacing(0, 2)}}>
          <Nowrap>Playlist</Nowrap>
          <Spacer />
          <IconButton>
            <TextIcon icon="Close" />
          </IconButton>
        </Flex>
        <Stack sx={{ width: 400, p: 2 }}>
          {/* Map over the track list to display each track. */}
          {handler.trackList?.map((track, index) => (
            <Flex
              onClick={trackMenu.handleClose(track)}
              spacing={1}
              key={track.trackId}
            >
              <Avatar src={track.artworkUrl100} alt={track.trackName} />
              <Stack>
                <Flex spacing={1}>
                  {currentTrackIndex === index && <TextIcon icon="VolumeUp" />}
                  <Nowrap hover bold={currentTrackIndex === index}>
                    {track.trackName}
                  </Nowrap>
                </Flex>
                <Nowrap small muted>
                  {track.artistName}
                </Nowrap>
              </Stack>
            </Flex>
          ))}
        </Stack>
      </Drawer>
    </>
  );
};

TrackList.defaultProps = {
  handler: {},
};

TrackList.propTypes = {
  handler: PropTypes.object,
};


export default TrackList;
 