import React from 'react';
import { styled, Stack, Box, LinearProgress } from '@mui/material';
import { Nowrap, Flex, Spacer, IconTextField, TextIcon } from '../../../styled';
 


const Layout = styled(({ ...props }) => (
  <Stack {...props} direction={props.isIdle ? "column" : "row"} />
))(({ theme, isIdle }) => ({ 
  backgroundColor: theme.palette.common.white//isIdle ? theme.palette.common.white : theme.palette.grey[200]
}));


// const Layout = styled(Stack)(({ isIdle, theme }) => ({
//   backgroundColor: isIdle ? theme.palette.common.white : theme.palette.grey[200]
// }));
 
const AppBar = ({ handler }) => {
  const colors = ['error', 'success', 'warning', 'info'];
  const isIdle = handler.state.matches("idle");
  const isBusy = handler.state.matches("search.lookup");
 return (
  <>
  {isBusy && <LinearProgress />}
   <Layout isIdle={isIdle} data-testid="test-for-AppBar">
 

        <Flex spacing={isIdle ? 0.5 : 0} sx={{p:1}}>
            
              <TextIcon  color="success"
              sx={isIdle ? {
                width: 76,
                height: 76
               } : {}} icon="Apple" />
            
           
             { ['B','o','o','m','b','o', 't'].map((ltr, i) => <Nowrap
              key={i}
              color={colors[i % colors.length]}
              variant={isIdle ? "h1" : "h5"}
             >{ltr}</Nowrap>)}
            
          </Flex>

          {!isIdle && <Spacer />}

          <form  onSubmit={(e) => {
              e.preventDefault()
            handler.send('FIND');
          }}>
        <Flex spacing={1} sx={{p:1}}>
            <IconTextField
              placeholder="Type  a song name or artist"
              label="Find any music"
              size="small"
              sx={{ width: isIdle ? 520 : 300 }}
              onChange={handler.setProp}
              value={handler.param}
              name="param"
              startIcon={<TextIcon 
                  icon="MusicNote"
                />}

              endIcon={<TextIcon
                onClick={() => handler.send('CLOSE')}
                  icon={isIdle ? "Search" : "Close"}
                />}

            />
            {/* <Button
              disabled={!handler.param}
              variant="contained"
            
            >search</Button> */}
          </Flex>
      </form>

         {isIdle && <Flex between spacing={1} sx={{p:1}}>
            {Object.keys(entities).map(e => <Box
            onClick={() => {
              handler.setProp({ target: {
                name: 'entity',
                value: e
              }})
            }}
              sx={{
                backgroundColor: t => e === handler.entity ? t.palette.primary.main : t.palette.grey[200],
              
                p: t => t.spacing(0.25, 1),
                borderRadius: 1
              }}
            >
              <Nowrap hover bold={e === handler.entity} 
              sx={{   color: t => e === handler.entity ? t.palette.common.white : t.palette.text.secondary, }}
              muted tiny>{entities[e]}</Nowrap>
            </Box>)}
          </Flex>}

          

   </Layout>
  </>
 );
}
AppBar.defaultProps = {};
export default AppBar;

const entities = {
  movie: "Movie",
  podcast: "Podcast",
  music: "Music",
  musicVideo: "Music Video",
  audiobook: "Audio Book",
  // shortFilm: "Short  Film",
  tvShow: "TV",
  software: "Software",
  ebook: "eBook"
}
