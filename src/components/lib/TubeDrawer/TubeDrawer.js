import React from 'react';
import { styled, Box, Card, Stack, MenuItem, TextField, LinearProgress } from '@mui/material';
import { Nowrap, Spacer, Flex, TinyButton } from '../../../styled';
 
const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
  width: 600,
  display: 'flex', 
  justifyContent: 'center'
 }));
 
 
const Video = styled(Card)(({ theme, small, open}) => ({
  position: 'fixed',
  bottom:  open ? 'var(--bottom-bar-offset)' : -1400,
  left: 0,
  transition: "all 0.2s linear",
  height: small ? 40 : 400,
  width: 632,
  backgroundColor: 'white',
  zIndex: 100
}))
 
const TubeDrawer = ({ menu, tube }) => {
  const { response, track } = tube;

  // const response = menu.data;
  const busy = tube.state.matches("lookup");
  const ready = !!response?.pages?.length && !busy;

  const param = `${track.trackName} ${track.artistName}`;
  const trackPin = {
    ...track,
    param
  }

  const selectedItem = !response?.pages ? {} : response.pages[0];


 return (

  <Video 
  small={busy}
  open={Boolean(menu.open) || busy}
  onClose={menu.handleClose()}
>

{!!busy && <LinearProgress />}
  <Flex spacing={1} sx={{ p: theme => theme.spacing (1, 2) }}>
      <TinyButton icon="YouTube" />
    <Nowrap color={selectedItem.pinned ? "primary" : "inherit"}>
      {param}
    </Nowrap>
      <Spacer />
      {!!ready && <TinyButton
        deg={selectedItem.pinned ? 90 : 0}
        icon="PushPin" onClick={() => tube.send({
        type: 'PIN',
        pin: {
          ...trackPin,
          title: selectedItem.page,
          tubekey: selectedItem.href
        }
      })} />}
      <TinyButton icon="Close" onClick={menu.handleClose(-1)} />
  </Flex>


  <Layout>


    <Stack spacing={2}>

            {!!response?.pages?.length && !busy && <Embed src={selectedItem.href}/>}
    
    </Stack>


  

</Layout>

</Video>
 );
}
TubeDrawer.defaultProps = {};
export default TubeDrawer;




const Embed = ({ src }) => {
  const regex = /v=(.*)/.exec(src);
  if (!regex) {
    return <>Could not parse {src}</>
  }
  

  return (
    <iframe 
      width="560" 
      height="315"
      title={src}
      src={`https://www.youtube.com/embed/${regex[1]}?autoplay=1`}
      frameborder="0" 
      allowfullscreen></iframe>
  )
}