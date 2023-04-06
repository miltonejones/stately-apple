import React from 'react';
import {
  styled,
  Box,
  Button,
  Card,
  Stack, 
  MenuItem,
  TextField,
  Divider,
  Avatar,
  LinearProgress,
  Collapse,
  Popover, 
} from '@mui/material';

import { 
  Nowrap, 
  FlexMenu, 
  ConfirmPop,  
  Btn, 
  Spacer, 
  Flex, 
  Columns, 
  TinyButton ,
  MessageSnackbar
} from '../../../styled';

import { useMenu } from '../../../machines';
import { collatePins } from '../../../util/collatePins';
import Login from '../Login/Login';

import YouTube from 'react-youtube';

const BASE_WIDTH = 500;
const PLAYER_WIDTH = BASE_WIDTH + 32;
const PLAYER_HEIGHT = Math.floor(BASE_WIDTH * 0.7);
const IFRAME_WIDTH = BASE_WIDTH - 40;
const IFRAME_HEIGHT = Math.floor(IFRAME_WIDTH * 0.5625); 


// responsive typography tag to control layout better 
const Sizewrap = ({ children, size, offset = 0, mobile, ...props }) => {
  const baseWidth = mobile ? (window.innerWidth - 32) : IFRAME_WIDTH;
  const wrapWidth = baseWidth - offset;

  return <Nowrap {...props} sx={{  
    ...props.sx,
    width: wrapWidth   
    }}>
    {children}
  </Nowrap>
}



const Layout = styled(Box)(({ theme, small }) => ({
  margin: theme.spacing(small ? 0 : 1),
  // width: BASE_WIDTH,
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100vw',
    height: 500
  },
}));

const Video = styled(Card)(({ theme, folded, calculatedHeight, small, open, offset = 0 }) => ({
  position: 'fixed',
  bottom: open ? 'var(--bottom-bar-offset)' : -1400,
  right: 0,
  transition: 'all 0.2s linear',
  height: folded || small ? 40 : (PLAYER_HEIGHT + offset),
  width: PLAYER_WIDTH,
  backgroundColor: 'white',
  zIndex: 100,
  [theme.breakpoints.down('md')]: {
    width: '100vw',
    height: folded || small ? 40 : `calc(${calculatedHeight}px + ${offset}px + 80px)`
  },
}));


const ResultList = ({ tube, selectedItem }) => {
  const { response = {}, response_index } = tube;
  const { pages = [] } = response;

  const menu = useMenu(
    (index) =>
      index !== undefined &&
      tube.send({
        type: 'CHANGE',
        key: "response_index",
        value: index,
      })
  ); 

  return (
    <>

      <Flex spacing={1}> 

      {/* [{tube.response_index}] */}
      <>
      <TinyButton icon="KeyboardArrowLeft"
        disabled={response_index < 1}
        onClick={() => {
          tube.send({
            type: 'CHANGE',
            key: "response_index",
            value: response_index - 1
          })
        }} /> 
          <TinyButton icon="KeyboardArrowRight" onClick={() => {
          tube.send({
            type: 'CHANGE',
            key: "response_index",
            value: response_index + 1
          })
        }} /> 

      </>

        <Nowrap 
        onClick={menu.handleClick} 
        small muted hover
        >Result {response_index + 1} of {pages.length}</Nowrap>
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
            <Flex>
              <Nowrap
                bold={k === tube.response_index}
                onClick={menu.handleClose(k)}
              >
                {item.page}
              </Nowrap>
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
  const current_index = tube.items?.map(item => item.tubekey).indexOf(selectedItem?.href)


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
          <TinyButton disabled={current_index < 1} icon="SkipPrevious" onClick={menu.handleClose(current_index - 1)} />
          <TinyButton icon="SkipNext" onClick={menu.handleClose(current_index + 1)} />
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
  // const { playlists = {}} = tube;
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
 

  return <>
  <TinyButton onClick={menu.handleClick}
    color={pinnedItem.playlists?.length ? "error" : "inherit"}
    icon={pinnedItem.playlists?.length ? "Favorite" : "FavoriteBorder"} />

      <FlexMenu component={Popover}
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >
        <Flex spacing={1} sx={{p: 2}}>
          <TinyButton icon="YouTube" />
          <Nowrap small muted>Add to Playlist</Nowrap>
          <Spacer />
          <TinyButton icon="Close" onClick={menu.handleClose()} />
        </Flex>

        <Divider />
        <Columns columns="1fr 1fr 1fr 1fr 1fr" sx={{ p: 2, justifyContent: 'center', minWidth: 400}}>
          {listNames.map(name => <Nowrap
            sx={{ border: 1, p: 1, borderColor: 'white',
            '&:hover': {
              borderColor: 'divider'
            } }}
            hover
            onClick={() => handleAdd(name)}
            bold={pinnedItem.playlists?.indexOf(name) > -1}
           small>{name}</Nowrap>)}
        </Columns>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd(menu.listparam)
          }}
        >
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
        <Button disabled={!menu.listparam}  variant="contained" >add</Button>
      
        </Flex>
        </form>


      </FlexMenu>
  </>
}

const TubeDrawer = ({ small, menu, tube }) => {
  const { response, track } = tube;

 
  const busy = tube.state.matches('lookup');
  const no_access = tube.state.matches('no_access');
  const ready = !!response?.pages?.length && !busy;

  const param = !!track.trackName ? `${track.trackName} ${track.artistName}` : ("Sorry!" +  JSON.stringify(tube.state.value));
  const trackPin = {
    ...track,
    param,
  };

  const selectedItem = !response?.pages ? {} : response.pages[tube.response_index];
  const itemIsPinned = !!selectedItem?.pinned;
  const pin = tube.items?.find(f => f.tubekey === selectedItem?.href);
  const { playlists } = collatePins(tube.pins);
  const calculatedHeight = window.innerWidth * 0.5625;


  return (
    <>

    <Video
      folded={tube.folded}
      small={busy}
      calculatedHeight={calculatedHeight}
      offset={!!pin ? 40 : 0}
      open={Boolean(menu.open) || busy || no_access}
      onClose={menu.handleClose()}
    >
      {!!busy && <LinearProgress />}
      <Flex spacing={1} sx={{ p: (theme) => theme.spacing(1, 2) }}>
        <TinyButton color={itemIsPinned && !busy ? 'error' : 'inherit'} icon="YouTube" />

        {!!busy && !!track.trackName && <Nowrap small muted>
            Finding {param}...
          </Nowrap>}
 
        {!busy && !!selectedItem && <Sizewrap mobile={small} offset={124} small bold={itemIsPinned}>
          {selectedItem.page || param}
        </Sizewrap>}

        <Spacer />
        
        {!!ready && (
          <ConfirmPop
            onChange={(ok) => !!ok && tube.send({
              type: 'PIN',
              pin: {
                ...trackPin,
                title: selectedItem?.page,
                tubekey: selectedItem?.href,
              },
            })}

            message={itemIsPinned ?  "Unpin video from your collection?" : "Pin video to your collection?"}
            label="Confirm action"
        >
        
         <TinyButton  
          color={itemIsPinned && !busy ? 'error' : 'inherit'} 
            deg={itemIsPinned ? 270 : 0}
            icon="PushPin" 
          />
        </ConfirmPop>
        
        )}

        <TubeList tube={tube} selectedItem={selectedItem}/>

        <TinyButton onClick={() => {
                tube.send({
                  type: 'CHANGE',
                  key: "folded",
                  value: !tube.folded,
                })
            }}  icon={tube.folded ? "UnfoldMore" : "UnfoldLess"} />
        <TinyButton icon="Close" onClick={menu.handleClose(-1)} />

      </Flex>
      {!!no_access && <Stack sx={{ p: 2 }}>
        
          <Nowrap bold>Sorry.</Nowrap>
          <Nowrap small>You must be logged in to use this function.</Nowrap>
          <Nowrap small muted wrap>You can come back and try again after you log in..</Nowrap>
          <Flex sx={{ mt: 2}} spacing={1}>
            {/* <Btn onClick={() => {
                tube.send({
                  type: 'CHANGE',
                  key: "login",
                  value: true,
                })
            }} variant="contained" color="warning">Sign In</Btn> */}
            <Btn onClick={() => tube.send('OK')}>Cancel</Btn>
            <Login />
          </Flex>

        </Stack>}

      <Collapse in={!tube.folded}>

      {!no_access && <Layout small={small}>
 
        {!!response?.pages?.length && !busy && 
        (<Stack spacing={2}>

          <Embed small={small}
              onEnd={() => {
               tube.send('NEXT');
              }}
              src={selectedItem?.href}
            />

          {!pin && tube.response?.pages?.length > 1 &&  <ResultList tube={tube}/>}  

          {!!pin && (
            <Flex sx={{maxWidth: BASE_WIDTH}} spacing={1}> 
              <Avatar src={pin.artworkUrl100} alt={pin.trackName} />
              <Stack>
              <Flex sx={{ maxWidth: BASE_WIDTH - 200}} spacing={1}>
              <PlayListMenu playlists={playlists} tube={tube} pinnedItem={pin} />
                <Sizewrap mobile={small} offset={150}>{pin.trackName}</Sizewrap>
              
              </Flex>
              <Sizewrap mobile={small} offset={120} small muted>{pin.collectionName}</Sizewrap>
              </Stack>
              <Spacer />
              <Nowrap hover small>
                ${pin.trackPrice}
              </Nowrap>
              <TinyButton icon="Launch" />
            </Flex>
          )}

        </Stack>)}

      </Layout>}
      

      </Collapse>


    </Video>

<MessageSnackbar 
  progress={tube.batch_progress}
  message={tube.param}
  caption={`${tube.batch_index + 1} of ${tube.batch?.length} bookmarks found.`}
  open={tube.state.matches('batch_lookup')}
  />
    </>
  );
};

TubeDrawer.defaultProps = {};
export default TubeDrawer;

const Embed = ({ onEnd, small, src }) => {
  const regex = /v=(.*)/.exec(src); 
  if (!regex) {
    return <>Could not parse {src}</>;
  } 
  const opts = {
    height: small ? (window.innerWidth * 0.5625) : IFRAME_HEIGHT,
    width: small ? (window.innerWidth - 32) : IFRAME_WIDTH,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return <YouTube videoId={regex[1]} opts={opts} onEnd={onEnd} />  
};
