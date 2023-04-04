import React from 'react';
import { styled, Card, Avatar, Drawer, Switch, Stack, IconButton, LinearProgress, Box } from '@mui/material';
import { Nowrap, Columns, TinyButton, Flex, Spacer, TextIcon } from '../../../styled';
import { useMenu } from '../../../machines';
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1)
 }));

 const Player = styled(Card)(({ open, small, theme }) => ({
   position: 'fixed',
   bottom:  open ? 'var(--bottom-bar-offset)' : -400,
   transition: "all 0.2s linear",
   height: small ? 80 : 116,
   width: '100vw',
   left: 0,
   backgroundColor: 'white'
 }));

 const TrackList = ({ handler }) => {
  const index = handler.trackList?.map((f) => f.previewUrl).indexOf(handler.src) 
  
  const handlePlay = (res) => {
    handler.handlePlay(res.previewUrl, {
      src: res.previewUrl,
      Title: res.trackName,
      trackList: handler.trackList,
      ...res,
    });
  }

  
  const menu = useMenu(value => !!value && handlePlay(value));

  return <>


     <IconButton color="primary" onClick={menu.handleClick}>
        <TextIcon icon="QueueMusic" />
      </IconButton>

  
  <Drawer
  anchor="left"
  onClose={menu.handleClose()}
  open={Boolean(menu.anchorEl)}>
    <Flex sx={{ p: theme => theme.spacing(0, 2)}}>
    <Nowrap>Playlist</Nowrap>
    <Spacer />
    <IconButton>
      <TextIcon icon="Close" />
    </IconButton>
    </Flex>
    <Stack sx={{ width: 400, p: 2 }}> 
   
      {handler.trackList?.map((f, i) => <Flex 
      onClick={menu.handleClose(f)}
      spacing={1} key={f.trackId}> 

    <Avatar src={f.artworkUrl100} alt={f.trackName} />

       <Stack>
        <Flex spacing={1}>
          {index === i && <TextIcon icon="VolumeUp" />}
        <Nowrap hover bold={index === i}>
        {f.trackName}
        </Nowrap>
        </Flex>
        <Nowrap small muted>
        {f.artistName}
        </Nowrap>
       </Stack>
      </Flex>)}
    </Stack>
  </Drawer>

  
  </>
 }

 const SmallPlayer = ({ handler }) => {
  const paused = handler.state.matches('opened.paused');
  // const { coords = [] } = handler;
  const maxWidth = 'calc(100vw - 142px)';

  return (
    <Player small elevation={4} anchor="bottom" open={['opened', 'replay'].some(handler.state.matches)}>

    <Layout data-testid="test-for-SmallPlayer">
     <Columns  columns="56px 1fr">
        <Avatar variant="rounded" sx={{ width: 56, height: 56 }} src={handler.artworkUrl100} alt={handler.trackName} />
        <Stack>
          <Columns sx={{ m: theme => theme.spacing(0, 1) }} columns="32px 1fr 32px 24px">
            <Nowrap wrap small>{handler.current_time_formatted}</Nowrap>
          <LinearProgress value={handler.progress} variant={!handler.progress ? "indeterminate" : "determinate"} />
            <Nowrap wrap small muteds>{handler.duration_formatted}</Nowrap>
            <TinyButton icon="Close" onClick={() => handler.send('CLOSE')} />
          </Columns>
          <Flex sx={{ m: theme => theme.spacing(0, 1) }} >
            <Stack>
              <Nowrap sx={{ maxWidth }} small>{handler.trackName}</Nowrap>
              <Nowrap sx={{ maxWidth }} small muted>{handler.collectionName} - {handler.artistName}</Nowrap>
            </Stack>
            <Spacer />
            <IconButton color="primary" onClick={() => handler.send('PAUSE')}>
              <TextIcon sx={{ width: 32, height: 32 }} icon={paused ? "PlayCircle" : "PauseCircle"} />
            </IconButton>

          </Flex>
        </Stack>
     </Columns>
     
        {/* progress bar  */}
    </Layout>
   </Player>
  )
 }
   
 
const AudioPlayer = ({ handler, small }) => {
  const paused = handler.state.matches('opened.paused');
  const { coords = [] } = handler;

  if (small) {
    return <SmallPlayer handler={handler} />
  }

 return (
  <Player elevation={4} anchor="bottom" open={['opened', 'replay'].some(handler.state.matches)}>
    
   <Layout data-testid="test-for-AudioPlayer">
    <Columns spacing={2} columns="100px 180px 220px 1fr 420px">

    {/* track avatar  */}
    <Avatar variant="rounded" sx={{ width: 100, height: 100 }} src={handler.artworkUrl100} alt={handler.trackName} />

       {/* track details */}
      <Stack>
        <Nowrap>{handler.trackName}</Nowrap>
        <Nowrap small muted>{handler.collectionName}</Nowrap>
        <Nowrap small muted>{handler.artistName}</Nowrap>
        <Flex onClick={() => handler.send({
            type: 'TOGGLE',
            key: 'repeat'
          })}>
            <Switch size="small" checked={handler.repeat} />
            {/* <TinyButton icon={handler.repeat ? "ReplayCircleFilled" : "Replay"}/>  */}
          <Nowrap small muted bold={handler.repeat} hover>Continuous Play</Nowrap></Flex>
      </Stack>

      {/* control buttons  */}
      <Flex>


      <IconButton color="primary" onClick={() => handler.send({
        type: 'TOGGLE',
        key: 'shuffle'
      })}>
        <TextIcon icon={handler.shuffle ? "ShuffleOn" : "Shuffle"} />
      </IconButton>



      <IconButton color="primary" onClick={() => handler.send({
        type: 'MOVE',
        index: -1
      })}>
        <TextIcon icon="SkipPrevious" />
      </IconButton>

      <IconButton color="primary" onClick={() => handler.send('PAUSE')}>
        <TextIcon sx={{ width: 40, height: 40 }} icon={paused ? "PlayCircle" : "PauseCircle"} />
      </IconButton>


      <IconButton color="primary" onClick={() => handler.send({
        type: 'MOVE',
        index: 1
      })}>
        <TextIcon icon="SkipNext" />
      </IconButton>

      <TrackList handler={handler} />

      </Flex>


      {/* progress bar  */}
      <Stack>
        <Columns columns="32px 1fr 32px">
          <Nowrap wrap small>{handler.current_time_formatted}</Nowrap>
        <LinearProgress value={handler.progress} variant={!handler.progress ? "indeterminate" : "determinate"} />
          <Nowrap wrap small muteds>{handler.duration_formatted}</Nowrap>
        </Columns>
      </Stack>

      {/* equalizer */}
      <Box >
        <Equalizer coords={coords} />
        {/* {JSON.stringify(handler.state.value)}
      [{coords?.length}] */}
      </Box>


    </Columns>
  
   </Layout>
  </Player>
 );
}
AudioPlayer.defaultProps = {};
export default AudioPlayer;

const Equalizer = ({ coords }) => {
  const red =
    "linear-gradient(0deg, rgba(2,160,5,1) 0%, rgba(226,163,15,1) 18px, rgba(255,0,42,1) 30px)";

    const width = 400;
    const barWidth = Math.floor(width / 32);

  return (
    <>
                <Box>
              <Card sx={{ width, mb: 1 }}>
                <Stack
                  sx={{
                    alignItems: "flex-end",
                    height: 48,
                    width,
                    border: "solid 1px",
                    borderColor: "divider",
                    position: "relative",
                  }}
                  direction="row"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  >
                    <img src={bg(width)} alt="cover" />
                  </Box>

                  {coords.map((f) => (
                    <Box
                      sx={{
                        background: red,
                        ml: "1px",
                        width: barWidth,
                        height: Math.abs(f.bar_height / 4),
                      }}
                    ></Box>
                  ))}
                </Stack>
              </Card>
            </Box>
    </>
  )
}

function bg(width) {
  var c = document.createElement("canvas");
  c.width = width;
  c.height = 48;
  var ctx = c.getContext("2d");
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  for (let y = 0; y < 100; y += 4) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#888';
  ctx.font = 'italic 11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('boombot equalizer', c.width - 10, 12);

  return c.toDataURL("image/png");
}
