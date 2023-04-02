import React from 'react';
import {
  styled,
  Box,
  Button,
  Card,
  Stack,
  Menu,
  MenuItem,
  TextField,
  Divider,
  Avatar,
  LinearProgress,
  Popover
} from '@mui/material';
import { Nowrap, Spacer, Flex, Columns, TinyButton } from '../../../styled';
import { useMenu } from '../../../machines';
import YouTube from 'react-youtube';

const BASE_WIDTH = 500;
const PLAYER_WIDTH = BASE_WIDTH + 32;
const PLAYER_HEIGHT = Math.floor(BASE_WIDTH * 0.7);
const IFRAME_WIDTH = BASE_WIDTH - 40;
const IFRAME_HEIGHT = Math.floor(IFRAME_WIDTH * 0.5625);

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  width: BASE_WIDTH,
  display: 'flex',
  justifyContent: 'center',
}));

const Video = styled(Card)(({ theme, small, open, offset = 0 }) => ({
  position: 'fixed',
  bottom: open ? 'var(--bottom-bar-offset)' : -1400,
  right: 0,
  transition: 'all 0.2s linear',
  height: small ? 40 : (PLAYER_HEIGHT + offset),
  width: PLAYER_WIDTH,
  backgroundColor: 'white',
  zIndex: 100,
}));

const TubeList = ({ tube, selectedItem }) => {
  const menu = useMenu(index => index !== undefined && 
      tube.send({
        type: 'GOTO',
        index
      }));

  if (!tube.items) return <i />

  return <>
  <TinyButton onClick={menu.handleClick} icon="MoreVert" />

  <Menu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >
        <Flex spacing={1} sx={{p: 2}}>
          <TinyButton icon="YouTube" />
          <Nowrap small muted>Video Playlist</Nowrap>
        </Flex>

        <Divider />

        {tube.items?.map((item, k) => <MenuItem  key={item.tubekey}>
          <Flex>
            <Nowrap bold={item.tubekey === selectedItem?.href }
              onClick={menu.handleClose(k)}>{item.title}</Nowrap>
          </Flex>
        </MenuItem>)}

      </Menu>
  </>
}

const PlayList = ({ tube, pinnedItem }) => {
  const { playlists = {}} = tube;
  const listNames = Object.keys(playlists);


  const handleAdd = (param) => {
    
    tube.send({
      type: 'UPDATE',
      pin: {
        ...pinnedItem,
        playlists: (pinnedItem.playlists||[]).concat(param)
      }
    }) 

  }


  const menu = useMenu(listname => !!listname && handleAdd(listname))

  if (!tube.items) return <i />

  return <>
  <TinyButton onClick={menu.handleClick}
    color={pinnedItem.playlists?.length ? "error" : "inherit"}
    icon={pinnedItem.playlists?.length ? "Favorite" : "FavoriteBorder"} />

      <Popover
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >
        <Flex spacing={1} sx={{p: 2}}>
          <TinyButton icon="YouTube" />
          <Nowrap small muted>Add to Playlist</Nowrap>
        </Flex>

        <Divider />
        <Columns columns="1fr 1fr 1fr 1fr 1fr" sx={{ p: 2, minWidth: 400}}>
          {listNames.map(name => <Nowrap
            hover
            onClick={menu.handleClose(name)}
            bold={pinnedItem.playlists?.indexOf(name) > -1}
           small>{name}</Nowrap>)}
        </Columns>
        <Flex spacing={1} sx={{p: 2}}>
        
        <TextField 
          value={menu.listparam}
          name="listparam"
          onChange={e => {
            menu.send({
              type: 'prop',
              key: e.target.name,
              value: e.target.value
            })
          }}
          size="small"
          label="New Playlist"

        />
        <Button 
          variant="contained"
        onClick={menu.handleClose(menu.listparam)}>add</Button>


        </Flex>

      </Popover>
  </>
}

const TubeDrawer = ({ menu, tube }) => {
  const { response, track } = tube;

  // const response = menu.data;
  const busy = tube.state.matches('lookup');
  const ready = !!response?.pages?.length && !busy;

  const param = `${track.trackName} ${track.artistName}`;
  const trackPin = {
    ...track,
    param,
  };

  const selectedItem = !response?.pages ? {} : response.pages[0];
  const pin = tube.items?.find(f => f.tubekey === selectedItem?.href);

  return (
    <Video
      small={busy}
      offset={!!pin ? 40 : 0}
      open={Boolean(menu.open) || busy}
      onClose={menu.handleClose()}
    >
      {!!busy && <LinearProgress />}
      <Flex spacing={1} sx={{ p: (theme) => theme.spacing(1, 2) }}>
        <TinyButton color={selectedItem.pinned && !busy ? 'error' : 'inherit'} icon="YouTube" />

        {!!busy && <Nowrap small muted>
            Finding {param}...
          </Nowrap>}

        {!busy && !!selectedItem && <Nowrap small bold={selectedItem.pinned}>
          {selectedItem.page || param}
        </Nowrap>}

        <Spacer />
        {!!ready && (
          <TinyButton
            deg={selectedItem.pinned ? 90 : 0}
            icon="PushPin"
            onClick={() =>
              tube.send({
                type: 'PIN',
                pin: {
                  ...trackPin,
                  title: selectedItem.page,
                  tubekey: selectedItem.href,
                },
              })
            }
          />
        )}

        <TubeList tube={tube} selectedItem={selectedItem}/>

        <TinyButton icon="Close" onClick={menu.handleClose(-1)} />

      </Flex>

      <Layout>
        {!!response?.pages?.length && !busy && (<Stack spacing={2}>
          <Embed
              onEnd={() => {
                tube.send('NEXT');
              }}
              src={selectedItem.href}
            />
              
          {!!pin && <Flex sx={{maxWidth: BASE_WIDTH}} spacing={1}>

            <Avatar src={pin.artworkUrl100} alt={pin.trackName} />
            <Stack>
             <Flex sx={{ maxWidth: BASE_WIDTH - 200}} spacing={1}>
             <PlayList tube={tube} pinnedItem={pin} />
              <Nowrap>{pin.trackName}</Nowrap>
             
             </Flex>
              <Nowrap small muted>{pin.collectionName}</Nowrap>
            </Stack>
            <Spacer />
            <Nowrap hover small>
              ${pin.trackPrice}
            </Nowrap>
            <TinyButton icon="Launch" />
          </Flex>}

        </Stack>)}
      </Layout>
    </Video>
  );
};
TubeDrawer.defaultProps = {};
export default TubeDrawer;

const Embed = ({ onEnd, src }) => {
  const regex = /v=(.*)/.exec(src);
  // const monitor = useTubeWatch();
  if (!regex) {
    return <>Could not parse {src}</>;
  }

  // const onStateChange = event => {
  //   console.log (event.target?.getCurrentTime())
  //   !!event.target && monitor.send({
  //     type: 'START',
  //     player: event.target
  //   })
  // }
  const opts = {
    height: IFRAME_HEIGHT,
    width: IFRAME_WIDTH,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return <>
  <YouTube videoId={regex[1]} opts={opts} onEnd={onEnd}   />
  {/* ({JSON.stringify(monitor.time)})   */}
  </>;
};
