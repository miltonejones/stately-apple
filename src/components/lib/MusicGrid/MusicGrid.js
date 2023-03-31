import React from 'react';
import { styled, Card, Collapse, Stack, Box } from '@mui/material';
import { Nowrap, Columns } from '../../../styled';
 
const Layout = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2,2,24,2)
 }));
 
const Frame = styled(Card)(({ theme }) => ({
  // margin: theme.spacing(4)
  cursor: 'pointer',
  borderRadius: 0
 }));
   
const MusicGrid = ({ handler, audio }) => {
  const { results = [] } = handler.results || {};
  const columns = "1fr 1fr 1fr 1fr 1fr";
  const maxWidth = 240;
  const isIdle = handler.state.matches("idle");
 return (
  <Collapse in={!isIdle}>
   <Layout data-testid="test-for-MusicGrid">
   
   {!!results.length && (
          <Card sx={{ m: 2, maxWidth: '100vw', pb: 26, height: 'calc(100vh - 124px)', overflow: 'auto' }}>
         <Columns sx={{m: 1}} spacing={1} columns={columns}>
          {!!results && results.map(res => (
            <Frame 
                elevation={audio.src === res.previewUrl && audio.state.matches('opened') ? "4" : "1"}
                sx={{ outline: t => audio.src === res.previewUrl && audio.state.matches('opened') ? `solid 2px ${t.palette.primary.main}` : `` }}
                onClick={()  => {
                  audio.handlePlay(res.previewUrl, { 
                    src: res.previewUrl,
                    Title: res.trackName,
                    ...res
                  })
                }}

              >
              <img src={res.artworkUrl100} alt={res.trackName} style={{
                width: '100%',
                aspectRatio: '1 / 1'
              }}/>
             <Stack sx={{ p: 1 }}>
             <Nowrap 
               bold={audio.src === res.previewUrl && audio.state.matches('opened.playing')}
              sx={{maxWidth }}>{res.trackName}</Nowrap>
              <Nowrap sx={{maxWidth }} width="100%" small>{res.collectionName || "unknown"}</Nowrap>
              <Nowrap sx={{maxWidth }} width="100%" small muted>{res.artistName || "unknown"}</Nowrap>
             </Stack>
            </Frame>
          ))}
          </Columns>
        </Card>
        )}
   </Layout></Collapse>
 );
}
MusicGrid.defaultProps = {};
export default MusicGrid;

/**
 * <Columns sx={{m: 1}} spacing={1} columns={columns}>
            <Avatar src={res.artworkUrl100} alt={res.trackName} />
            <Nowrap 
              bold={audio.src === res.previewUrl && audio.state.matches('opened.playing')}
            hover onClick={()  => {
              audio.handlePlay(res.previewUrl, { 
                src: res.previewUrl,
                Title: res.trackName,
                ...res
              })
            }}>{res.trackName}</Nowrap>
            <Nowrap>{res.artistName}</Nowrap>
            <Nowrap>{res.collectionName}</Nowrap>
            <Nowrap>{res.primaryGenreName}</Nowrap>
            <Nowrap>{res.trackPrice}</Nowrap>
          </Columns>
 */