import React from 'react';
import {
  styled,
  Box, 
  Card,
  Stack,
  MenuItem,
  TextField,
  Divider,
  Avatar,
  LinearProgress,
  Collapse,
  Popover,
  Drawer,
} from '@mui/material';

import {
  Nowrap,
  FlexMenu,
  ConfirmPop,
  Btn,
  Spacer,
  Flex,
  Columns,
  TinyButton,
  MessageSnackbar,
  TimerProgress,
  // TimedSnackbar,
  Shield
} from '../../../styled';
// import moment from 'moment';

import { useMenu, DJ_OPTIONS } from '../../../machines';
import { collatePins } from '../../../util/collatePins';
import { getIntro } from '../../../util/getIntro';
import { speakText } from '../../../util/speakText';
import Login from '../Login/Login';

import YouTube from 'react-youtube';

const BASE_WIDTH = 500;
const PLAYER_WIDTH = BASE_WIDTH + 32;
const PLAYER_HEIGHT = Math.floor(BASE_WIDTH * 0.7);
const IFRAME_WIDTH = BASE_WIDTH - 40;
const IFRAME_HEIGHT = Math.floor(IFRAME_WIDTH * 0.5625);

// responsive typography tag to control layout better
const Sizewrap = ({ children, size, offset = 0, mobile, ...props }) => {
  const baseWidth = mobile ? window.innerWidth - 32 : IFRAME_WIDTH;
  const wrapWidth = baseWidth - offset;

  return (
    <Nowrap
      {...props}
      sx={{
        ...props.sx,
        width: wrapWidth,
      }}
    >
      {children}
    </Nowrap>
  );
};

const Layout = styled(Box)(({ theme, small }) => ({
  margin: theme.spacing(small ? 0 : 1),
  // width: BASE_WIDTH,
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100vw',
    height: 500,
  },
}));

const Video = styled(Card)(
  ({ theme, folded, calculatedHeight, small, open, offset = 0 }) => ({
    position: 'fixed',
    bottom: open ? 'var(--bottom-bar-offset)' : -1400,
    right: 0,
    transition: 'all 0.2s linear',
    height: folded || small ? 40 : PLAYER_HEIGHT + offset,
    width: PLAYER_WIDTH,
    backgroundColor: 'white',
    zIndex: 100,
    [theme.breakpoints.down('md')]: {
      width: '100vw',
      height:
        folded || small
          ? 40
          : `calc(${calculatedHeight}px + ${offset}px + 80px)`,
    },
  })
);

const ResultList = ({ tube, selectedItem }) => {
  const { response = {}, response_index } = tube;
  const { pages = [] } = response;

  const menu = useMenu(
    (index) =>
      index !== undefined &&
      tube.send({
        type: 'CHANGE',
        key: 'response_index',
        value: index,
      })
  );

  return (
    <>
      <Flex spacing={1}>
        {/* [{tube.response_index}] */}
        <>
          <TinyButton
            icon="KeyboardArrowLeft"
            disabled={response_index < 1}
            onClick={() => {
              tube.send({
                type: 'CHANGE',
                key: 'response_index',
                value: response_index - 1,
              });
            }}
          />
          <TinyButton
            icon="KeyboardArrowRight"
            onClick={() => {
              tube.send({
                type: 'CHANGE',
                key: 'response_index',
                value: response_index + 1,
              });
            }}
          />
        </>

        <Nowrap onClick={menu.handleClick} small muted hover>
          Result {response_index + 1} of {pages.length}
        </Nowrap>
      </Flex>

      <FlexMenu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >
        <Flex spacing={1} sx={{ p: 2 }}>
          <TinyButton icon="YouTube" />
          <Nowrap small muted>
            YouTube Results
          </Nowrap>
          <Spacer />
          <TinyButton icon="Close" onClick={menu.handleClose()} />
        </Flex>

        <Divider />

        {pages?.map((item, k) => (
          <MenuItem key={k}>
            <Flex spacing={1}>
              <img 
                src={item.image}
                alt={item.page}
                style={{
                  height: 40,
                  aspectRatio: '16 / 9'
                }}
              />
              <Stack>
              <Nowrap
                small
                bold={k === tube.response_index}
                onClick={menu.handleClose(k)}
              >
                {item.page}
              </Nowrap>
              <Nowrap tiny muted>
                {item.href}
              </Nowrap>
              </Stack>
            </Flex>
          </MenuItem>
        ))}
      </FlexMenu>
    </>
  );
};

const TubeList = ({ tube, selectedItem }) => {
  const menu = useMenu(
    (index) =>
      index !== undefined &&
      tube.send({
        type: 'GOTO',
        index,
      })
  );

  if (!tube.items) return <i />;
  const current_index = tube.items
    ?.map((item) => item.tubekey)
    .indexOf(selectedItem?.href);

  return (
    <>
      <TinyButton onClick={menu.handleClick} icon="MoreVert" />

      <FlexMenu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >
        <Flex spacing={1} sx={{ p: 2 }}>
          <TinyButton icon="YouTube" />
          <Nowrap small muted>
            Video Playlist
          </Nowrap>
          <TinyButton
            disabled={current_index < 1}
            icon="SkipPrevious"
            onClick={menu.handleClose(current_index - 1)}
          />
          <TinyButton
            icon="SkipNext"
            onClick={menu.handleClose(current_index + 1)}
          />
          <Spacer />
          <TinyButton icon="Close" onClick={menu.handleClose()} />
        </Flex>

        <Divider />

        {tube.items?.map((item, k) => (
          <MenuItem key={item.tubekey}>
            <Flex>
              <Nowrap
                bold={item.tubekey === selectedItem?.href}
                onClick={menu.handleClose(k)}
              >
                {item.title}
              </Nowrap>
            </Flex>
          </MenuItem>
        ))}
      </FlexMenu>
    </>
  );
};

export const PlayListMenu = ({ tube, playlists, pinnedItem }) => {
  const listNames = Object.keys(playlists);

  const handleAdd = (param) => {
    const { playlists = [] } = pinnedItem;
    tube.send({
      type: 'UPDATE',
      pin: {
        ...pinnedItem,
        playlists: playlists.indexOf(param) > -1
          ? playlists.filter(item => item !== param)
          : playlists.concat(param),
      },
    });
  };

  const menu = useMenu((listname) => !!listname && handleAdd(listname));

  return (
    <>
      <TinyButton
        onClick={menu.handleClick}
        color={pinnedItem.playlists?.length ? 'error' : 'inherit'}
        icon={pinnedItem.playlists?.length ? 'Favorite' : 'FavoriteBorder'}
      />

      <FlexMenu
        component={Popover}
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >
        <Flex spacing={1} sx={{ p: 2 }}>
          <TinyButton icon="YouTube" />
          <Nowrap small muted>
            Add to Playlist
          </Nowrap>
          <Spacer />
          <TinyButton icon="Close" onClick={menu.handleClose()} />
        </Flex>

        <Divider />
        <Columns
          columns="1fr 1fr 1fr 1fr 1fr"
          sx={{ p: 2, justifyContent: 'center', minWidth: 400 }}
        >
          {listNames.map((name) => (
            <Shield
              color="primary"
              badgeContent={playlists[name].length}
              overlap="circular"
            >
              <Nowrap
                sx={{
                  border: 1,
                  p: 1,
                  textAlign: 'center',
                  borderColor: 'white',
                  backgroundColor: (theme) => theme.palette.grey[200],
                  '&:hover': {
                    borderColor: 'divider',
                  },
                }}
                fullWidth
                hover
                onClick={() => handleAdd(name)}
                bold={pinnedItem.playlists?.indexOf(name) > -1}
                small
              >
                {name}{' '}
              </Nowrap>
            </Shield>
          ))}
        </Columns>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd(menu.listparam);
          }}
        >
          <Flex spacing={1} sx={{ p: 2 }}>
            <TextField
              fullWidth
              value={menu.listparam}
              name="listparam"
              onChange={(e) => {
                menu.send({
                  type: 'prop',
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              size="small"
              label="New Playlist"
            />
          
          </Flex>
        </form>
      </FlexMenu>
    </>
  );
};

const TubeDrawer = ({ small, menu, tube }) => {
  const { response, track } = tube;

  const busy = tube.state.matches('lookup');
  const no_access = tube.state.matches('no_access');
  const ready = !!response?.pages?.length && !busy;

  const param = !!track.trackName
    ? `${track.trackName} ${track.artistName}`
    : 'Sorry!' + JSON.stringify(tube.state.value);
  const trackPin = {
    ...track,
    param,
  };

  const selectedItem = !response?.pages
    ? {}
    : response.pages[tube.response_index];
  const itemIsPinned = !!selectedItem?.pinned;
  const pin = tube.items?.find((f) => f.tubekey === selectedItem?.href);
  const { playlists } = collatePins(tube.pins);
  const calculatedHeight = window.innerWidth * 0.5625;
  const showResultList = !pin && tube.response?.pages?.length > 1;

  const selectedIndex = tube.items?.map(i => i.tubekey).indexOf(selectedItem.href);

  const firstName = tube.user?.attributes?.given_name;

  const getUpcoming = (index) => {
    const nextTracks = tube.items?.slice(selectedIndex + index);
    return nextTracks?.slice(0, 10);
  } 

  const talk = (text) => { 
    !!text && speakText(text, tube.options & DJ_OPTIONS.RANDOM, (value) => {
      if (!(tube.options & DJ_OPTIONS.SHOW)) return; 
      tube.send({
        type: 'CHANGE',
        key: 'vocab',
        value
      })
    })
  }

  const introduce = async () => { 

    if(tube.options & DJ_OPTIONS.OFF) return;

    if (!pin) { 
      if (track) {  
        // if track is not pinned, load an intro for new tracks 
        const { Introduction } = await getIntro(track.trackName, track.artistName, [], firstName, tube.options, true, true);    
        !!Introduction && talk(Introduction)
      }
      return
    };

    if (tube.intros && tube.intros[pin.trackName]) {
      // if intro has already been written, speak it noww
      const { Introduction } = tube.intros[pin.trackName];
      !!Introduction && talk(Introduction)
    } else { 
      // write intro for this song
      const { Introduction } = await getIntro(pin.trackName, pin.artistName, getUpcoming(1), firstName, tube.options, false, true);    
      !!Introduction && talk(Introduction)
    } 

    if (!tube.items) return;

    // get intro text for next song while this one plays 
    const nextPin = tube.items[selectedIndex + 1];
    if (!nextPin) return;

    const nextIntro = await getIntro(nextPin.trackName, nextPin.artistName, getUpcoming(2), firstName, tube.options);

    // save intro for the next track to context
    !!nextIntro && tube.send({
      type: 'CHANGE',
      key: 'intros',
      value: {
        ...tube.intros,
        [nextIntro.title]: nextIntro
      }
    }) 
  }

  return (
    <>

      <Drawer anchor="bottom" open={!!tube.vocab}>
        <Box sx={{ p: 2, fontSize: '0.85rem', color: 'text.secondary'}}>
         <b>Boombot DJ: </b> {tube.vocab}
        </Box> 
      </Drawer>

      <Video
        folded={tube.folded}
        small={busy}
        calculatedHeight={calculatedHeight}
        offset={!!pin ? 40 : showResultList ? 20 : 0}
        open={Boolean(menu.open) || busy || no_access}
        onClose={menu.handleClose()}
      >
        {!!busy && <TimerProgress component={LinearProgress} />}
        <Flex spacing={1} sx={{ p: (theme) => theme.spacing(1, 2) }}>
          <TinyButton
            color={itemIsPinned && !busy ? 'error' : 'inherit'}
            icon="YouTube"
          />

          {!!busy && !!track.trackName && (
            <Nowrap small muted>
              Finding {param}...
            </Nowrap>
          )}

          {!busy && !!selectedItem && (
            <Sizewrap mobile={small} offset={124} small bold={itemIsPinned}>
              {selectedItem.page || param}
            </Sizewrap>
          )}

          <Spacer />

          {/* pin video button */}
          {!!ready && (
            <ConfirmPop
              onChange={(ok) =>
                !!ok &&
                tube.send({
                  type: 'PIN',
                  pin: {
                    ...trackPin,
                    title: selectedItem?.page,
                    tubekey: selectedItem?.href,
                  },
                })
              }
              message={
                itemIsPinned
                  ? 'Unpin video from your collection?'
                  : 'Pin video to your collection?'
              }
              label="Confirm action"
            >
              <TinyButton
                disabled={!tube.user?.userDataKey}
                color={itemIsPinned && !busy ? 'error' : 'inherit'}
                deg={itemIsPinned ? 270 : 0}
                icon="PushPin"
              />
            </ConfirmPop>
          )}

          {/* current playlist menu  */}
          <TubeList tube={tube} selectedItem={selectedItem} />

          {/* minimize video window button  */}
          <TinyButton
            onClick={() => {
              tube.send({
                type: 'CHANGE',
                key: 'folded',
                value: !tube.folded,
              });
            }}
            icon={tube.folded ? 'UnfoldMore' : 'UnfoldLess'}
          />

          {/* close window button  */}
          <TinyButton icon="Close" onClick={menu.handleClose(-1)} />
        </Flex>

        {/* if user tries to save with no access, give them a form to log in  */}
        {!!no_access && (
          <Stack sx={{ p: 2 }}>
            <Nowrap bold>Sorry.</Nowrap>
            <Nowrap small>You must be logged in to use this function.</Nowrap>
            <Nowrap small muted wrap>
              You can come back and try again after you log in..
            </Nowrap>

            <Flex sx={{ mt: 2 }} spacing={1}>
              <Btn onClick={() => tube.send('OK')}>Cancel</Btn>
              <Login tube={tube} />
            </Flex>
          </Stack>
        )}

        <Collapse in={!tube.folded}>
          {!no_access && (
            <Layout small={small}>
              {!!response?.pages?.length && !busy && (
                <Stack spacing={2}>
               
                  <Embed
                    onStart={introduce}
                    small={small}
                    onEnd={() => {
                      tube.send('NEXT');
                    }}
                    src={selectedItem?.href}
                  />

                  {showResultList && (
                    <ResultList tube={tube} />
                  )}

                  {!!pin && (
                    <Flex sx={{ maxWidth: BASE_WIDTH }} spacing={1}>
                      <Avatar src={pin.artworkUrl100} alt={pin.trackName} />
                      <Stack>
                        <Flex sx={{ maxWidth: BASE_WIDTH - 200 }} spacing={1}>
                          <PlayListMenu
                            playlists={playlists}
                            tube={tube}
                            pinnedItem={pin}
                          />
                          <Sizewrap mobile={small} offset={150}>
                            {pin.trackName}
                          </Sizewrap>
                        </Flex>
                        <Sizewrap mobile={small} offset={120} small muted>
                     
                          {pin.artistName}
                     
                        </Sizewrap>
                        {/* <Sizewrap mobile={small} offset={120} small muted>
                          {pin.collectionName}
                        </Sizewrap> */}
                      </Stack>
                      <Spacer />
                      <Nowrap hover small>
                        ${pin.trackPrice}
                      </Nowrap>
                      <TinyButton icon="Launch" />
                    </Flex>
                  )}
                </Stack>
              )}
            </Layout>
          )}
        </Collapse>
      </Video>
 
      
      <MessageSnackbar
        progress={tube.batch_progress}
        onClose={() => tube.send('CANCEL')}
        message={tube.param}
        caption={`${tube.batch_index} of ${tube.batch?.length} bookmarks found.`}
        open={tube.state.matches('batch_lookup')}
      />
    </>
  );
};

TubeDrawer.defaultProps = {};
export default TubeDrawer;

const Embed = ({ onEnd, onStart, small, src }) => {
  const regex = /v=(.*)/.exec(src);
  if (!regex) {
    return <>Could not parse {src}</>;
  }
  const opts = {
    height: small ? window.innerWidth * 0.5625 : IFRAME_HEIGHT,
    width: small ? window.innerWidth - 32 : IFRAME_WIDTH,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters onReady
      autoplay: 1,
    },
  };
  return <YouTube onPlay={onStart} videoId={regex[1]} opts={opts} onEnd={onEnd} />;
};
 

 