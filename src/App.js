 
import './App.css';
import { useApple, useAudio } from './machines';
import { Columns, Spacer, Flex, TextIcon, Nowrap } from './styled';  

import {
  TextField, Avatar,
  Button, Box, Stack
} from '@mui/material';

import AudioPlayer from './components/lib/AudioPlayer/AudioPlayer';

function App() {
  const apple = useApple();
  const audio = useAudio();
  const { results = [] } = apple.results || {};
  const columns = "48px 1fr 1fr 1fr 1fr 1fr"
  const colors = ['success', 'warning', 'error', 'info'];

  return (
    <>

{/* {JSON.stringify(apple.state.value)}---
    {JSON.stringify(audio.state.value)} */}
        <div className={apple.state.matches("idle") ? "App centered" : "App"}>


        <Stack direction={apple.state.matches("idle") ? "column" : "row"}>

        <Flex spacing={apple.state.matches("idle") ? 0.5 : 0} sx={{p:1}}>
            
              <TextIcon  color="success"
              sx={apple.state.matches("idle") ? {
                width: 92,
                height: 92
               } : {}} icon="Apple" />
            
           
             { ['B','o','o','m','b','o', 't'].map((ltr, i) => <Nowrap
              key={i}
              color={colors[i % colors.length]}
              variant={apple.state.matches("idle") ? "h1" : "h5"}
             >{ltr}</Nowrap>)}
            
          </Flex>

          {!apple.state.matches("idle") && <Spacer />}

        <Flex spacing={1} sx={{p:1}}>
            <TextField
            placeholder="Type  a song name or artist"
            label="Find music"
            size="small"
            sx={{ width: 440}}
            onChange={apple.setProp}
            value={apple.param}
            name="param"

            />
            <Button
              variant="contained"
              onClick={() => apple.send('FIND')}
            >search</Button>

          </Flex>

          
        </Stack>

        {!!results.length && (
          <Box sx={{ m: 2,  height: 'calc(100vh - 104px)', overflow: 'auto' }}>
          <Columns columns={columns} spacing={1}>
            <Box />
            <Box>track</Box>
            <Box>artist</Box>
            <Box>album</Box>
            <Box>genre</Box>
            <Box>price</Box>
          </Columns>
          {!!results && results.map(res => <Columns sx={{m: 1}} spacing={1} columns={columns}>
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
          </Columns>)}
        </Box>
        )}
<AudioPlayer handler={audio} />
    <pre>
    {JSON.stringify(results[0],0,2)}
    </pre>
    </div>
    <Flex sx={{p: 1}} spacing={1}>
      <Spacer />
      <TextIcon icon="Apple" />
      <Nowrap small muted><b>Boombot</b>. An xstate web application</Nowrap>
    </Flex>
    </>

  );
}

export default App;
