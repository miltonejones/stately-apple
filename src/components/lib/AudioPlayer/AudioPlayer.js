import React from 'react';
import { styled, Card, Avatar, Stack, IconButton, LinearProgress, Box } from '@mui/material';
import { Nowrap, Columns, Flex, Spacer, TextIcon } from '../../../styled';
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1)
 }));

 const Player = styled(Card)(({ open, theme }) => ({
   position: 'fixed',
   bottom:  open ? 'var(--bottom-bar-offset)' : -400,
   transition: "bottom 0.2s linear",
   height: 116,
   width: '100vw',
   backgroundColor: 'white'
 }));
   
 
const AudioPlayer = ({ handler }) => {
  const paused = handler.state.matches('opened.paused');
  const { coords = [] } = handler;
 return (
  <Player anchor="bottom" open={handler.state.matches('opened')}>
    
   <Layout data-testid="test-for-AudioPlayer">
    <Columns spacing={2} columns="100px 300px 48px 1fr 460px">
    <Avatar sx={{ width: 100, height: 100 }} src={handler.artworkUrl100} alt={handler.trackName} />
      <Stack>
        <Nowrap>{handler.trackName}</Nowrap>
        <Nowrap small muted>{handler.collectionName}</Nowrap>
        <Nowrap small muted>{handler.artistName}</Nowrap>
      </Stack>
      <IconButton color="primary" onClick={() => handler.send('PAUSE')}>
        <TextIcon sx={{ width: 40, height: 40 }} icon={paused ? "PlayCircle" : "PauseCircle"} />
      </IconButton>
      <Stack>
        <LinearProgress value={handler.progress} variant={!handler.progress ? "indeterminate" : "determinate"} />
        <Flex>
          <Nowrap small>{handler.current_time_formatted}</Nowrap>
          <Spacer />
          <Nowrap small muteds>{handler.duration_formatted}</Nowrap>
        </Flex>
      </Stack>
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

    const width = 440;
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
  return c.toDataURL("image/png");
}
